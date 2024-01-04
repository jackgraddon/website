 // Register Plugins
 gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, MotionPathPlugin, TextPlugin);
 //gsap.set(".panel", { opacity: 0, y: 50 });

 // Animate body when dom loads
 gsap.to("body",
 {
    duration: 1,
    opacity: 1,
    ease: "power1.inOut",
 });


 // Splash scroll animation
let splash = gsap.timeline({
    scrollTrigger: {
        trigger: ".splash",
        start: "top top",
        end: "bottom top",
        scrub: true,
        // markers: true,
    },
    onComplete: function () {
        document.querySelector(".splash-title#first-load").id = "second-load";
    }
 });
 splash.to(".splash-title", {
    scale: 0.9,
    filter: 'blur(10px)',
    y: -180,
    autoAlpha: 0,
    ease: "power1.in",
 })
 .to(".splash-transition #cloud", {
    scale: 1.2,
    filter: 'blur(2px)',
    ease: "power1.inOut",
 }, "<");

// Animate main content after splash animation
ScrollTrigger.batch(".main-section", {
   onEnter: (batch) =>
      gsap.fromTo(batch, {
         autoAlpha: 0,
         y: 50,
         scale: 0.85,
         filter: 'blur(10px)',
      }, {
         filter: 'blur(0px)',
         scale: 1,
         autoAlpha: 1,
         y: 0,
         stagger: 0.2,
         overwrite: true,
         ease: "power1.out",
         scrollTrigger: {
         trigger: batch,
         start: "+100px bottom",
         end: "+200px bottom",
         scrub: true,
         //   markers: true,
      },
   }),
});