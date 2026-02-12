
import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue'
import { vsSource, containerFsSource, buttonFsSource } from '../utils/shaders'
import { usePageSnapshot } from './usePageSnapshot'
import { useGlassControls } from './useGlassControls'

export interface GlassOptions {
    type: Ref<string>
    borderRadius: Ref<number>
    tintOpacity: Ref<number>
    blurRadius?: Ref<number>
    warp?: Ref<boolean>
    // Advanced controls (optional, could be reactive or static)
    edgeIntensity?: Ref<number>
    rimIntensity?: Ref<number>
    baseIntensity?: Ref<number>
    edgeDistance?: Ref<number>
    rimDistance?: Ref<number>
    baseDistance?: Ref<number>
    cornerBoost?: Ref<number>
    rippleEffect?: Ref<number>
    // For nested glass
    parentCanvas?: Ref<HTMLCanvasElement | null>
    isNested?: boolean
}

export function useGlassGl(canvasRef: Ref<HTMLCanvasElement | null>, containerRef: Ref<HTMLElement | null>, options: GlassOptions) {
    let gl: WebGLRenderingContext | null = null
    let program: WebGLProgram | null = null
    let texture: WebGLTexture | null = null
    let animationFrameId: number | null = null

    // Shader locations
    const locations: Record<string, any> = {}

    // State
    const isInitialized = ref(false)
    const { pageSnapshot, ensureSnapshot } = usePageSnapshot()

    const initWebGL = async () => {
        if (!canvasRef.value || !containerRef.value) return

        // Ensure snapshot if not nested
        if (!options.isNested) {
            await ensureSnapshot()
            if (!pageSnapshot.value) return
        }

        const canvas = canvasRef.value
        gl = canvas.getContext('webgl', { preserveDrawingBuffer: true })
        if (!gl) {
            console.error('WebGL not supported')
            return
        }

        // Select shader based on type
        const fsSource = options.isNested ? buttonFsSource : containerFsSource

        if (!createProgram(vsSource, fsSource)) return

        setupGeometry()
        setupTexture()

        isInitialized.value = true
        const renderFn = startRenderLoop()
        return renderFn
    }

    const createProgram = (vsSource: string, fsSource: string) => {
        if (!gl) return false

        const compileShader = (type: number, source: string) => {
            const shader = gl!.createShader(type)
            if (!shader) return null
            gl!.shaderSource(shader, source)
            gl!.compileShader(shader)
            if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
                console.error('Shader compile error:', gl!.getShaderInfoLog(shader))
                return null
            }
            return shader
        }

        const vs = compileShader(gl.VERTEX_SHADER, vsSource)
        const fs = compileShader(gl.FRAGMENT_SHADER, fsSource)
        if (!vs || !fs) return false

        program = gl.createProgram()
        if (!program) return false

        gl.attachShader(program, vs)
        gl.attachShader(program, fs)
        gl.linkProgram(program)

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program))
            return false
        }

        gl.useProgram(program)

        // Cache locations
        const attributes = ['a_position', 'a_texcoord']
        const uniforms = [
            'u_image', 'u_resolution', 'u_textureSize', 'u_scrollY',
            'u_pageHeight', 'u_viewportHeight', 'u_blurRadius',
            'u_borderRadius', 'u_containerPosition', 'u_warp',
            'u_edgeIntensity', 'u_rimIntensity', 'u_baseIntensity',
            'u_edgeDistance', 'u_rimDistance', 'u_baseDistance',
            'u_cornerBoost', 'u_rippleEffect', 'u_tintOpacity', 'u_shapeType',
            // Button specific
            'u_buttonPosition', 'u_containerSize'
        ]

        attributes.forEach(attr => {
            locations[attr] = gl!.getAttribLocation(program!, attr)
        })

        uniforms.forEach(uni => {
            locations[uni] = gl!.getUniformLocation(program!, uni)
        })

        return true
    }

    const setupGeometry = () => {
        if (!gl || !program) return

        const positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)

        const texcoordBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]), gl.STATIC_DRAW)

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        gl.enableVertexAttribArray(locations.a_position)
        gl.vertexAttribPointer(locations.a_position, 2, gl.FLOAT, false, 0, 0)

        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
        gl.enableVertexAttribArray(locations.a_texcoord)
        gl.vertexAttribPointer(locations.a_texcoord, 2, gl.FLOAT, false, 0, 0)
    }

    const setupTexture = () => {
        if (!gl) return

        texture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, texture)

        if (options.isNested && options.parentCanvas?.value) {
            // Initial bind
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, options.parentCanvas.value)
        } else if (pageSnapshot.value) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pageSnapshot.value)
        }

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    }

    // We need a way to pass the parent canvas for nested components
    const updateTextureFromParent = (parentCanvas: HTMLCanvasElement) => {
        if (!gl || !texture) return
        gl.bindTexture(gl.TEXTURE_2D, texture)
        // We initialize the texture once with correct size options if needed, but here we just upload the canvas
        // Warning: continuously uploading canvas is heavy, but that's how the library works.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, parentCanvas)
    }

    const startRenderLoop = () => {
        const render = () => {
            if (!gl || !program || !canvasRef.value || !containerRef.value) return

            // Resize canvas if needed
            const dpr = window.devicePixelRatio || 1
            const displayWidth = containerRef.value.clientWidth
            const displayHeight = containerRef.value.clientHeight

            // Set actual canvas size to physical pixels
            const physicalWidth = Math.round(displayWidth * dpr)
            const physicalHeight = Math.round(displayHeight * dpr)

            if (canvasRef.value.width !== physicalWidth || canvasRef.value.height !== physicalHeight) {
                canvasRef.value.width = physicalWidth
                canvasRef.value.height = physicalHeight
                gl.viewport(0, 0, physicalWidth, physicalHeight)
            }

            gl.clearColor(0, 0, 0, 0)
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.useProgram(program)

            // Update Uniforms (scaled by DPR)
            gl.uniform2f(locations.u_resolution, physicalWidth, physicalHeight)
            gl.uniform1f(locations.u_borderRadius, options.borderRadius.value * dpr)
            gl.uniform1f(locations.u_tintOpacity, options.tintOpacity.value)
            gl.uniform1f(locations.u_warp, options.warp?.value ? 1.0 : 0.0)

            // Advanced props (use options if provided, otherwise fallback to global controls)
            const globalControls = useGlassControls()

            gl.uniform1f(locations.u_blurRadius, globalControls.blurRadius.value * dpr)
            gl.uniform1f(locations.u_edgeIntensity, globalControls.edgeIntensity.value)
            gl.uniform1f(locations.u_rimIntensity, globalControls.rimIntensity.value)
            gl.uniform1f(locations.u_baseIntensity, globalControls.baseIntensity.value)
            // Distance coefficients need to be divided by DPR because pixels are smaller
            // exp(-distance * coefficient). If distance (in pixels) doubles, coefficient must halve.
            gl.uniform1f(locations.u_edgeDistance, globalControls.edgeDistance.value / dpr)
            gl.uniform1f(locations.u_rimDistance, globalControls.rimDistance.value / dpr)
            gl.uniform1f(locations.u_baseDistance, globalControls.baseDistance.value / dpr)
            gl.uniform1f(locations.u_cornerBoost, globalControls.cornerBoost.value)
            gl.uniform1f(locations.u_rippleEffect, globalControls.rippleEffect.value)

            // Shape type uniform
            let shapeType = 0; // rounded
            const currentType = options.type.value;
            if (currentType === 'pill') shapeType = 2;
            else if (currentType === 'circle') shapeType = 1;

            gl.uniform1i(locations.u_shapeType, shapeType);

            // Texture handling
            if (options.isNested && options.parentCanvas?.value) {
                // Update texture from parent canvas
                gl.bindTexture(gl.TEXTURE_2D, texture)
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, options.parentCanvas.value)

                // Update uniforms dependent on parent
                const parentRect = options.parentCanvas.value.getBoundingClientRect() // This gives CSS pixels
                // We need physical size of parent texture. 
                // Assuming parent is also using useGlassGl, its .width/.height are physical.
                // But getBoundingClientRect is CSS.
                // Best to rely on actual texture dimensions if possible, or assume parent follows same DPR.

                // Texture size is the parent canvas physical size
                gl.uniform2f(locations.u_textureSize, options.parentCanvas.value.width, options.parentCanvas.value.height)
                gl.uniform2f(locations.u_containerSize, options.parentCanvas.value.width, options.parentCanvas.value.height)

                const buttonRect = containerRef.value.getBoundingClientRect()
                // Centers in CSS pixels
                const buttonX_CSS = buttonRect.left + buttonRect.width / 2
                const buttonY_CSS = buttonRect.top + buttonRect.height / 2

                const containerX_CSS = parentRect.left + parentRect.width / 2
                const containerY_CSS = parentRect.top + parentRect.height / 2

                // Convert to Physical pixels relative to texture
                // Texture 0,0 is at parentRect.left, parentRect.top? No. 
                // Texture corresponds to the parent's canvas content.
                // u_containerPosition in shader is the CENTER of the container in PAGE coords? 
                // In nested mode:
                // u_buttonPosition -> Center of button in Page (Physical)? 
                // u_containerPosition -> Center of container in Page (Physical)?
                // Shader: vec2 containerTopLeft = u_containerPosition - containerSize * 0.5;
                // vec2 buttonRelativePos = buttonTopLeft - containerTopLeft;
                // This logic relies on absolute page positions.

                // Let's just scale CSS positions by DPR.
                // This assumes 0,0 of the texture aligns with 0,0 of the page (or container space).

                const buttonX = buttonX_CSS * dpr
                const buttonY = buttonY_CSS * dpr
                const containerX = containerX_CSS * dpr
                const containerY = containerY_CSS * dpr

                gl.uniform2f(locations.u_buttonPosition, buttonX, buttonY)
                gl.uniform2f(locations.u_containerPosition, containerX, containerY)

            } else if (pageSnapshot.value) {
                gl.uniform2f(locations.u_textureSize, pageSnapshot.value.width, pageSnapshot.value.height)

                const scrollY = window.pageYOffset || document.documentElement.scrollTop
                gl.uniform1f(locations.u_scrollY, scrollY * dpr)

                const rect = containerRef.value.getBoundingClientRect()
                const x = (rect.left + rect.width / 2) * dpr
                const y = (rect.top + rect.height / 2) * dpr
                gl.uniform2f(locations.u_containerPosition, x, y)

                const pageHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
                gl.uniform1f(locations.u_pageHeight, pageHeight * dpr)
                gl.uniform1f(locations.u_viewportHeight, window.innerHeight * dpr)
            }

            gl.drawArrays(gl.TRIANGLES, 0, 6)

            // animationFrameId = requestAnimationFrame(render) // Only loop if needed (nested glass or scroll updates)
            // Ideally we only render on scroll for containers.
        }

        // Loop strategy
        if (options.isNested) {
            // Nested glass needs to update every frame to catch parent changes?
            // Actually only if parent is animating. But to be safe, we loop.
            const loop = () => {
                render()
                animationFrameId = requestAnimationFrame(loop)
            }
            loop()
        } else {
            // Container only needs update on scroll or resize
            render()
            window.addEventListener('scroll', render, { passive: true })
            window.addEventListener('resize', render, { passive: true })
                // Store cleanup
                ; (gl as any)._cleanup = () => {
                    window.removeEventListener('scroll', render)
                    window.removeEventListener('resize', render)
                }
        }

        // Expose render for external use if needed
        return render
    }

    onMounted(async () => {
        if (process.client) {
            const renderFn = await initWebGL()

            // Watch global controls and re-render
            const globalControls = useGlassControls()
            watch(
                [
                    globalControls.blurRadius,
                    globalControls.edgeIntensity,
                    globalControls.rimIntensity,
                    globalControls.baseIntensity,
                    globalControls.edgeDistance,
                    globalControls.rimDistance,
                    globalControls.baseDistance,
                    globalControls.cornerBoost,
                    globalControls.rippleEffect,
                    globalControls.warp,
                    options.type
                ],
                () => {
                    if (renderFn) (renderFn as Function)()
                }
            )
        }
    })

    onUnmounted(() => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId)
        if (gl && (gl as any)._cleanup) (gl as any)._cleanup()
    })

    return {
        updateTextureFromParent
    }
}
