
export const vsSource = `
  attribute vec2 a_position;
  attribute vec2 a_texcoord;
  varying vec2 v_texcoord;

  void main() {
    gl_Position = vec4(a_position, 0, 1);
    v_texcoord = a_texcoord;
  }
`

export const containerFsSource = `
  precision mediump float;
  uniform sampler2D u_image;
  uniform vec2 u_resolution;
  uniform vec2 u_textureSize;
  uniform float u_scrollY;
  uniform float u_pageHeight;
  uniform float u_viewportHeight;
  uniform float u_blurRadius;
  uniform float u_borderRadius;
  uniform vec2 u_containerPosition;
  uniform float u_warp;
  uniform float u_edgeIntensity;
  uniform float u_rimIntensity;
  uniform float u_baseIntensity;
  uniform float u_edgeDistance;
  uniform float u_rimDistance;
  uniform float u_baseDistance;
  uniform float u_cornerBoost;
  uniform float u_rippleEffect;
  uniform float u_tintOpacity;
  uniform int u_shapeType; // 0=rounded, 1=circle, 2=pill
  varying vec2 v_texcoord;

  // Function to calculate distance from rounded rectangle edge
  float roundedRectDistance(vec2 coord, vec2 size, float radius) {
    vec2 center = size * 0.5;
    vec2 pixelCoord = coord * size;
    vec2 toCorner = abs(pixelCoord - center) - (center - radius);
    float outsideCorner = length(max(toCorner, 0.0));
    float insideCorner = min(max(toCorner.x, toCorner.y), 0.0);
    return (outsideCorner + insideCorner - radius);
  }
  
  // Function to calculate distance from circle edge (negative inside, positive outside)
  float circleDistance(vec2 coord, vec2 size, float radius) {
    vec2 center = vec2(0.5, 0.5);
    vec2 pixelCoord = coord * size;
    vec2 centerPixel = center * size;
    float distFromCenter = length(pixelCoord - centerPixel);
    return distFromCenter - radius;
  }
  
  // Function to calculate distance from pill edge (capsule shape)
  float pillDistance(vec2 coord, vec2 size, float radius) {
    vec2 center = size * 0.5;
    vec2 pixelCoord = coord * size;
    
    // For a pill, enforce radius = half height
    float effectiveRadius = size.y * 0.5;
    
    // Proper capsule: line segment with radius
    // The capsule axis runs horizontally from (radius, center.y) to (size.x - radius, center.y)
    vec2 capsuleStart = vec2(effectiveRadius, center.y);
    vec2 capsuleEnd = vec2(size.x - effectiveRadius, center.y);
    
    // Project point onto the capsule axis (line segment)
    vec2 capsuleAxis = capsuleEnd - capsuleStart;
    float capsuleLength = length(capsuleAxis);
    
    if (capsuleLength > 0.0) {
      vec2 toPoint = pixelCoord - capsuleStart;
      float t = clamp(dot(toPoint, capsuleAxis) / dot(capsuleAxis, capsuleAxis), 0.0, 1.0);
      vec2 closestPointOnAxis = capsuleStart + t * capsuleAxis;
      return length(pixelCoord - closestPointOnAxis) - effectiveRadius;
    } else {
      // Degenerate case: just a circle
      return length(pixelCoord - center) - effectiveRadius;
    }
  }
  


  void main() {
    vec2 coord = v_texcoord;
    
    // Calculate which area of the page should be visible through the container
    float scrollY = u_scrollY;
    vec2 containerSize = u_resolution;
    vec2 textureSize = u_textureSize;
    
    // Container position in viewport coordinates
    vec2 containerCenter = u_containerPosition + vec2(0.0, scrollY);
    
    // Convert container coordinates to page coordinates
    vec2 containerOffset = (coord - 0.5) * containerSize;
    vec2 pagePixel = containerCenter + containerOffset;
    
    // Convert to texture coordinate (0 to 1)
    vec2 textureCoord = pagePixel / textureSize;
    
    // Glass refraction effects
    float distFromEdgeShape;
    vec2 shapeNormal; // Normal vector pointing away from shape surface
    
    if (u_shapeType == 2) { // Pill
      float effectiveRadius = u_resolution.y * 0.5;
      distFromEdgeShape = -pillDistance(coord, u_resolution, effectiveRadius);
      
      // Calculate normal for pill shape
      vec2 center = vec2(0.5, 0.5);
      vec2 pixelCoord = coord * u_resolution;
      vec2 capsuleStart = vec2(effectiveRadius, center.y * u_resolution.y);
      vec2 capsuleEnd = vec2(u_resolution.x - effectiveRadius, center.y * u_resolution.y);
      vec2 capsuleAxis = capsuleEnd - capsuleStart;
      float capsuleLength = length(capsuleAxis);
      
      if (capsuleLength > 0.0) {
        vec2 toPoint = pixelCoord - capsuleStart;
        float t = clamp(dot(toPoint, capsuleAxis) / dot(capsuleAxis, capsuleAxis), 0.0, 1.0);
        vec2 closestPointOnAxis = capsuleStart + t * capsuleAxis;
        vec2 normalDir = pixelCoord - closestPointOnAxis;
        
        // Soft normal calculation using sphere geometry
        float dist = length(normalDir);
        // Calculate z-component of the sphere surface
        float z = sqrt(max(0.0, effectiveRadius*effectiveRadius - dist*dist));
        vec3 sphereNormal = normalize(vec3(normalDir, z));
        shapeNormal = sphereNormal.xy;
      } else {
        shapeNormal = normalize(coord - center);
      }
    } else if (u_shapeType == 1) { // Circle
      float radius = min(u_resolution.x, u_resolution.y) * 0.5;
      distFromEdgeShape = -circleDistance(coord, u_resolution, radius);
      vec2 center = vec2(0.5, 0.5);
      // Sphere normal for circle
      vec2 pixelPos = (coord - center) * u_resolution;
      float dist = length(pixelPos);
      float z = sqrt(max(0.0, radius*radius - dist*dist));
      vec3 sphereNormal = normalize(vec3(pixelPos, z));
      shapeNormal = sphereNormal.xy;
    } else {
      distFromEdgeShape = -roundedRectDistance(coord, u_resolution, u_borderRadius);
      vec2 center = vec2(0.5, 0.5);
      // Soft convex lens normal for rounded rect, avoiding center singularity
      // Correct aspect ratio for uniform slope
      vec2 aspect = u_resolution / min(u_resolution.x, u_resolution.y);
      vec2 pos = (coord - center) * aspect;
      // Z-component controls convexity (higher = flatter center)
      vec3 normal3D = normalize(vec3(pos, 0.7)); 
      shapeNormal = normal3D.xy;
    }
    distFromEdgeShape = max(distFromEdgeShape, 0.0);
    
    float distFromLeft = coord.x;
    float distFromRight = 1.0 - coord.x;
    float distFromTop = coord.y;
    float distFromBottom = 1.0 - coord.y;
    float distFromEdge = distFromEdgeShape / min(u_resolution.x, u_resolution.y);
    
    // Smooth glass refraction using shape-aware normal
    float normalizedDistance = distFromEdge * min(u_resolution.x, u_resolution.y);
    float baseIntensity = 1.0 - exp(-normalizedDistance * u_baseDistance);
    float edgeIntensity = exp(-normalizedDistance * u_edgeDistance);
    float rimIntensity = exp(-normalizedDistance * u_rimDistance);
    
    // Apply center warping only if warp is enabled, keep edge and rim effects always
    float baseComponent = u_warp > 0.5 ? baseIntensity * u_baseIntensity : 0.0;
    float totalIntensity = baseComponent + edgeIntensity * u_edgeIntensity + rimIntensity * u_rimIntensity;
    
    vec2 baseRefraction = shapeNormal * totalIntensity;
    
    // Fix for central artifact: damp refraction near the center/axis
    float maxRadius = min(u_resolution.x, u_resolution.y) * 0.5;
    float axisDistance = max(0.0, maxRadius - distFromEdgeShape);
    // Linear damping from center (0) to edge (1)
    float axisDampen = clamp(axisDistance / maxRadius, 0.0, 1.0);
    // Apply damping to smooth out the center singularity
    baseRefraction *= axisDampen;
    
    float cornerProximityX = min(distFromLeft, distFromRight);
    float cornerProximityY = min(distFromTop, distFromBottom);
    float cornerDistance = max(cornerProximityX, cornerProximityY);
    float cornerNormalized = cornerDistance * min(u_resolution.x, u_resolution.y);
    
    float cornerBoost = exp(-cornerNormalized * 0.3) * u_cornerBoost;
    vec2 cornerRefraction = shapeNormal * cornerBoost;
    
    vec2 perpendicular = vec2(-shapeNormal.y, shapeNormal.x);
    float rippleEffect = sin(distFromEdge * 25.0) * u_rippleEffect * rimIntensity;
    vec2 textureRefraction = perpendicular * rippleEffect;
    
    vec2 totalRefraction = baseRefraction + cornerRefraction + textureRefraction;
    textureCoord += totalRefraction;
    
    // Dithered Vogel Spiral Blur to fix boxy artifacts
    vec4 color = vec4(0.0);
    vec2 texelSize = 1.0 / u_textureSize;
    
    // Golden angle
    float goldenAngle = 2.39996323;
    
    // Simple noise for dithering rotation
    vec3 p3 = fract(vec3(coord.xyx) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yzx + 33.33);
    float noise = fract((p3.x + p3.y) * p3.z);
    
    float theta = noise * 6.2831853;
    float c = cos(theta);
    float s = sin(theta);
    mat2 rot = mat2(c, -s, s, c);
    
    float totalWeight = 0.0;
    
    // 32 samples is efficient and high quality with dithering
    // Replaces previous 13x13 (169 taps) grid
    for(float i = 0.0; i < 32.0; i++) {
        // Normalized radius 0..1 for disk distribution
        float r = sqrt(i + 0.5) / sqrt(32.0);
        float angle = i * goldenAngle;
        
        vec2 offset = vec2(cos(angle), sin(angle)) * r;
        
        // Apply random rotation to hide patterns
        offset = rot * offset;
        
        // Scale by blur radius
        vec2 sampleOffset = offset * u_blurRadius * texelSize;
        
        // Gaussian profile weight
        // Falloff based on radius to keep center weighted
        float weight = exp(-r * r * 3.0);
        
        color += texture2D(u_image, textureCoord + sampleOffset) * weight;
        totalWeight += weight;
    }
    
    color /= totalWeight;
    
    // Simple vertical gradient
    float gradientPosition = coord.y;
    vec3 topTint = vec3(1.0, 1.0, 1.0);
    vec3 bottomTint = vec3(0.7, 0.7, 0.7);
    vec3 gradientTint = mix(topTint, bottomTint, gradientPosition);
    vec3 tintedColor = mix(color.rgb, gradientTint, u_tintOpacity);
    color = vec4(tintedColor, color.a);
    
    // Sampled gradient
    vec2 viewportCenter = containerCenter;
    float topY = (viewportCenter.y - containerSize.y * 0.4) / textureSize.y;
    float midY = viewportCenter.y / textureSize.y;
    float bottomY = (viewportCenter.y + containerSize.y * 0.4) / textureSize.y;
    
    vec3 topColor = vec3(0.0);
    vec3 midColor = vec3(0.0);
    vec3 bottomColor = vec3(0.0);
    
    float sampleCount = 0.0;
    for(float x = 0.0; x < 1.0; x += 0.05) {
      for(float yOffset = -5.0; yOffset <= 5.0; yOffset += 1.0) {
        vec2 topSample = vec2(x, topY + yOffset * texelSize.y);
        vec2 midSample = vec2(x, midY + yOffset * texelSize.y);
        vec2 bottomSample = vec2(x, bottomY + yOffset * texelSize.y);
        
        topColor += texture2D(u_image, topSample).rgb;
        midColor += texture2D(u_image, midSample).rgb;
        bottomColor += texture2D(u_image, bottomSample).rgb;
        sampleCount += 1.0;
      }
    }
    
    topColor /= sampleCount;
    midColor /= sampleCount;
    bottomColor /= sampleCount;
    
    vec3 sampledGradient;
    if (gradientPosition < 0.1) {
      sampledGradient = topColor;
    } else if (gradientPosition > 0.9) {
      sampledGradient = bottomColor;
    } else {
      float transitionPos = (gradientPosition - 0.1) / 0.8;
      if (transitionPos < 0.5) {
        float t = transitionPos * 2.0;
        sampledGradient = mix(topColor, midColor, t);
      } else {
        float t = (transitionPos - 0.5) * 2.0;
        sampledGradient = mix(midColor, bottomColor, t);
      }
    }
    
    vec3 finalTinted = mix(color.rgb, sampledGradient, u_tintOpacity * 0.3);
    color = vec4(finalTinted, color.a);
    
    // Shape mask (rounded rectangle, circle, or pill)
    // Shape mask (rounded rectangle, circle, or pill)
    float maskDistance;
    if (u_shapeType == 2) {
      maskDistance = pillDistance(coord, u_resolution, u_resolution.y * 0.5);
    } else if (u_shapeType == 1) {
      maskDistance = circleDistance(coord, u_resolution, min(u_resolution.x, u_resolution.y) * 0.5);
    } else {
      maskDistance = roundedRectDistance(coord, u_resolution, u_borderRadius);
    }
    float mask = 1.0 - smoothstep(-1.0, 1.0, maskDistance);
    
    gl_FragColor = vec4(color.rgb, mask);
  }
`

export const buttonFsSource = `
  precision mediump float;
  uniform sampler2D u_image;
  uniform vec2 u_resolution;
  uniform vec2 u_textureSize;
  uniform float u_blurRadius;
  uniform float u_borderRadius;
  uniform vec2 u_buttonPosition;
  uniform vec2 u_containerPosition;
  uniform vec2 u_containerSize;
  uniform float u_warp;
  uniform float u_edgeIntensity;
  uniform float u_rimIntensity;
  uniform float u_baseIntensity;
  uniform float u_edgeDistance;
  uniform float u_rimDistance;
  uniform float u_baseDistance;
  uniform float u_cornerBoost;
  uniform float u_rippleEffect;
  uniform float u_tintOpacity;
  uniform int u_shapeType;
  varying vec2 v_texcoord;

  // Function to calculate distance from rounded rectangle edge
  float roundedRectDistance(vec2 coord, vec2 size, float radius) {
    vec2 center = size * 0.5;
    vec2 pixelCoord = coord * size;
    vec2 toCorner = abs(pixelCoord - center) - (center - radius);
    float outsideCorner = length(max(toCorner, 0.0));
    float insideCorner = min(max(toCorner.x, toCorner.y), 0.0);
    return (outsideCorner + insideCorner - radius);
  }
  
  // Function to calculate distance from circle edge (negative inside, positive outside)
  float circleDistance(vec2 coord, vec2 size, float radius) {
    vec2 center = vec2(0.5, 0.5);
    vec2 pixelCoord = coord * size;
    vec2 centerPixel = center * size;
    float distFromCenter = length(pixelCoord - centerPixel);
    return distFromCenter - radius;
  }
  
  // Function to calculate distance from pill edge (capsule shape)
  float pillDistance(vec2 coord, vec2 size, float radius) {
    vec2 center = size * 0.5;
    vec2 pixelCoord = coord * size;
    
    // For a pill, enforce radius = half height
    float effectiveRadius = size.y * 0.5;
    
    // Proper capsule: line segment with radius
    // The capsule axis runs horizontally from (radius, center.y) to (size.x - radius, center.y)
    vec2 capsuleStart = vec2(effectiveRadius, center.y);
    vec2 capsuleEnd = vec2(size.x - effectiveRadius, center.y);
    
    // Project point onto the capsule axis (line segment)
    vec2 capsuleAxis = capsuleEnd - capsuleStart;
    float capsuleLength = length(capsuleAxis);
    
    if (capsuleLength > 0.0) {
      vec2 toPoint = pixelCoord - capsuleStart;
      float t = clamp(dot(toPoint, capsuleAxis) / dot(capsuleAxis, capsuleAxis), 0.0, 1.0);
      vec2 closestPointOnAxis = capsuleStart + t * capsuleAxis;
      return length(pixelCoord - closestPointOnAxis) - effectiveRadius;
    } else {
      // Degenerate case: just a circle
      return length(pixelCoord - center) - effectiveRadius;
    }
  }

  void main() {
    vec2 coord = v_texcoord;
    
    // Calculate button position within container space
    vec2 buttonSize = u_resolution;
    vec2 containerSize = u_containerSize;
    
    // Convert screen positions to container-relative coordinates
    // Container position is center, convert to top-left
    vec2 containerTopLeft = u_containerPosition - containerSize * 0.5;
    vec2 buttonTopLeft = u_buttonPosition - buttonSize * 0.5;
    
    // Get button's position relative to container's top-left
    vec2 buttonRelativePos = buttonTopLeft - containerTopLeft;
    
    // Current pixel position within the button (0 to buttonSize)
    vec2 buttonPixel = coord * buttonSize;
    
    // Absolute pixel position in container space
    vec2 containerPixel = buttonRelativePos + buttonPixel;
    
    // Convert to texture coordinates (0 to 1)
    vec2 baseTextureCoord = containerPixel / containerSize;
    
    // BUTTON'S SOPHISTICATED GLASS EFFECTS on top of container's glass
    float distFromEdgeShape;
    vec2 shapeNormal; // Normal vector pointing away from shape surface
    
    if (u_shapeType == 2) { // Pill
      float effectiveRadius = u_resolution.y * 0.5;
      distFromEdgeShape = -pillDistance(coord, u_resolution, effectiveRadius);
      
      // Calculate normal for pill shape
      vec2 center = vec2(0.5, 0.5);
      vec2 pixelCoord = coord * u_resolution;
      vec2 capsuleStart = vec2(effectiveRadius, center.y * u_resolution.y);
      vec2 capsuleEnd = vec2(u_resolution.x - effectiveRadius, center.y * u_resolution.y);
      vec2 capsuleAxis = capsuleEnd - capsuleStart;
      float capsuleLength = length(capsuleAxis);
      
      if (capsuleLength > 0.0) {
        vec2 toPoint = pixelCoord - capsuleStart;
        float t = clamp(dot(toPoint, capsuleAxis) / dot(capsuleAxis, capsuleAxis), 0.0, 1.0);
        vec2 closestPointOnAxis = capsuleStart + t * capsuleAxis;
        vec2 normalDir = pixelCoord - closestPointOnAxis;
        
        // Soft normal calculation using sphere geometry
        float dist = length(normalDir);
        // Calculate z-component of the sphere surface
        float z = sqrt(max(0.0, effectiveRadius*effectiveRadius - dist*dist));
        vec3 sphereNormal = normalize(vec3(normalDir, z));
        shapeNormal = sphereNormal.xy;
      } else {
        shapeNormal = normalize(coord - center);
      }
    } else if (u_shapeType == 1) { // Circle
      float radius = min(u_resolution.x, u_resolution.y) * 0.5;
      distFromEdgeShape = -circleDistance(coord, u_resolution, radius);
      vec2 center = vec2(0.5, 0.5);
      // Sphere normal for circle
      vec2 pixelPos = (coord - center) * u_resolution;
      float dist = length(pixelPos);
      float z = sqrt(max(0.0, radius*radius - dist*dist));
      vec3 sphereNormal = normalize(vec3(pixelPos, z));
      shapeNormal = sphereNormal.xy;
    } else {
      distFromEdgeShape = -roundedRectDistance(coord, u_resolution, u_borderRadius);
      vec2 center = vec2(0.5, 0.5);
      // Soft convex lens normal for rounded rect, avoiding center singularity
      // Correct aspect ratio for uniform slope
      vec2 aspect = u_resolution / min(u_resolution.x, u_resolution.y);
      vec2 pos = (coord - center) * aspect;
      // Z-component controls convexity (higher = flatter center)
      vec3 normal3D = normalize(vec3(pos, 0.7)); 
      shapeNormal = normal3D.xy;
    }
    distFromEdgeShape = max(distFromEdgeShape, 0.0);
    
    float distFromLeft = coord.x;
    float distFromRight = 1.0 - coord.x;
    float distFromTop = coord.y;
    float distFromBottom = 1.0 - coord.y;
    float distFromEdge = distFromEdgeShape / min(u_resolution.x, u_resolution.y);
    
    // MULTI-LAYER BUTTON GLASS REFRACTION using shape-aware normal
    float normalizedDistance = distFromEdge * min(u_resolution.x, u_resolution.y);
    float baseIntensity = 1.0 - exp(-normalizedDistance * u_baseDistance);
    float edgeIntensity = exp(-normalizedDistance * u_edgeDistance);
    float rimIntensity = exp(-normalizedDistance * u_rimDistance);
    
    // Apply center warping only if warp is enabled, keep edge and rim effects always
    float baseComponent = u_warp > 0.5 ? baseIntensity * u_baseIntensity : 0.0;
    float totalIntensity = baseComponent + edgeIntensity * u_edgeIntensity + rimIntensity * u_rimIntensity;
    
    vec2 baseRefraction = shapeNormal * totalIntensity;
    
    // Fix for central artifact: damp refraction near the center/axis
    float maxRadius = min(u_resolution.x, u_resolution.y) * 0.5;
    float axisDistance = max(0.0, maxRadius - distFromEdgeShape);
    // Linear damping from center (0) to edge (1)
    float axisDampen = clamp(axisDistance / maxRadius, 0.0, 1.0);
    // Apply damping to smooth out the center singularity
    baseRefraction *= axisDampen;
    
    // Corner enhancement for buttons
    float cornerProximityX = min(distFromLeft, distFromRight);
    float cornerProximityY = min(distFromTop, distFromBottom);
    float cornerDistance = max(cornerProximityX, cornerProximityY);
    float cornerNormalized = cornerDistance * min(u_resolution.x, u_resolution.y);
    
    float cornerBoost = exp(-cornerNormalized * 0.3) * u_cornerBoost;
    vec2 cornerRefraction = shapeNormal * cornerBoost;
    
    // Button ripple texture
    vec2 perpendicular = vec2(-shapeNormal.y, shapeNormal.x);
    float rippleEffect = sin(distFromEdge * 30.0) * u_rippleEffect * rimIntensity;
    vec2 textureRefraction = perpendicular * rippleEffect;
    
    vec2 totalRefraction = baseRefraction + cornerRefraction + textureRefraction;
    vec2 textureCoord = baseTextureCoord + totalRefraction;
    
    // Dithered Vogel Spiral Blur for buttons
    vec4 color = vec4(0.0);
    vec2 texelSize = 1.0 / containerSize;
    
    // Golden angle
    float goldenAngle = 2.39996323;
    
    // Simple noise for dithering rotation
    vec3 p3 = fract(vec3(coord.xyx) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yzx + 33.33);
    float noise = fract((p3.x + p3.y) * p3.z);
    
    float theta = noise * 6.2831853;
    float c = cos(theta);
    float s = sin(theta);
    mat2 rot = mat2(c, -s, s, c);
    
    float totalWeight = 0.0;
    
    // 32 samples
    for(float i = 0.0; i < 32.0; i++) {
        float r = sqrt(i + 0.5) / sqrt(32.0);
        float angle = i * goldenAngle;
        
        vec2 offset = vec2(cos(angle), sin(angle)) * r;
        
        // Apply random rotation
        offset = rot * offset;
        
        // Scale by blur radius
        vec2 sampleOffset = offset * u_blurRadius * texelSize;
        
        float weight = exp(-r * r * 3.0);
        
        color += texture2D(u_image, textureCoord + sampleOffset) * weight;
        totalWeight += weight;
    }
    
    color /= totalWeight;
    
    // BUTTON'S OWN GRADIENT LAYERS (same sophistication as container)
    float gradientPosition = coord.y;
    
    // Primary button gradient
    vec3 topTint = vec3(1.0, 1.0, 1.0);
    vec3 bottomTint = vec3(0.7, 0.7, 0.7);
    vec3 gradientTint = mix(topTint, bottomTint, gradientPosition);
    vec3 tintedColor = mix(color.rgb, gradientTint, u_tintOpacity * 0.7);
    color = vec4(tintedColor, color.a);
    
    // SECOND BUTTON GRADIENT - sampling from container's texture for variation
    vec2 viewportCenter = u_buttonPosition;
    float topY = max(0.0, (viewportCenter.y - buttonSize.y * 0.4) / containerSize.y);
    float midY = viewportCenter.y / containerSize.y;
    float bottomY = min(1.0, (viewportCenter.y + buttonSize.y * 0.4) / containerSize.y);
    
    vec3 topColor = texture2D(u_image, vec2(0.5, topY)).rgb;
    vec3 midColor = texture2D(u_image, vec2(0.5, midY)).rgb;
    vec3 bottomColor = texture2D(u_image, vec2(0.5, bottomY)).rgb;
    
    vec3 sampledGradient;
    if (gradientPosition < 0.1) {
      sampledGradient = topColor;
    } else if (gradientPosition > 0.9) {
      sampledGradient = bottomColor;
    } else {
      float transitionPos = (gradientPosition - 0.1) / 0.8;
      if (transitionPos < 0.5) {
        float t = transitionPos * 2.0;
        sampledGradient = mix(topColor, midColor, t);
      } else {
        float t = (transitionPos - 0.5) * 2.0;
        sampledGradient = mix(midColor, bottomColor, t);
      }
    }
    
    vec3 secondTinted = mix(color.rgb, sampledGradient, u_tintOpacity * 0.4);
    
    // Button highlighting/shadow system
    vec3 buttonTopTint = vec3(1.08, 1.08, 1.08);    
    vec3 buttonBottomTint = vec3(0.92, 0.92, 0.92); 
    vec3 buttonGradient = mix(buttonTopTint, buttonBottomTint, gradientPosition);
    vec3 finalTinted = secondTinted * buttonGradient;
    
    // Shape mask (rounded rectangle, circle, or pill)
    float maskDistance;
    if (u_shapeType == 2) {
      maskDistance = pillDistance(coord, u_resolution, u_resolution.y * 0.5);
    } else if (u_shapeType == 1) {
      maskDistance = circleDistance(coord, u_resolution, min(u_resolution.x, u_resolution.y) * 0.5);
    } else {
      maskDistance = roundedRectDistance(coord, u_resolution, u_borderRadius);
    }
    float mask = 1.0 - smoothstep(-1.0, 1.0, maskDistance);
    
    gl_FragColor = vec4(finalTinted, mask);
  }
`
