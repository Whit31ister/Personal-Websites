/* global gsap, ScrollTrigger */
export function initReveal() {
    if (typeof gsap === "undefined") {
        console.error("GSAP not loaded");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // ===== ELEMENT REVEAL =====
    gsap.utils.toArray('.reveal').forEach((el, i) => {
        gsap.fromTo(el,
            {
                opacity: 0,
                y: 40
            },
            {
                opacity: 1,
                y: 0,
                delay: i * 0.02,
                duration: 0.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 92%",
                }
            }
        );
    });

    // ===== SKILL BARS =====
    gsap.utils.toArray('.skill-bar-fill').forEach(bar => {
        gsap.fromTo(bar,
            { width: 0 },
            {
                width: bar.dataset.width + '%',
                duration: 0.6,
                ease: "power1.out",
                scrollTrigger: {
                    trigger: bar,
                    start: "top 90%"
                }
            }
        );
    });
}