/*
export function initScrollZoom() {
    const section = document.querySelector(".ai-scroll-section");
    const content = document.querySelector(".ai-section");
    const cube = document.querySelector(".cube-anchor");

    if (!section || !content || !cube) return;

    let smooth = 0;
    let ticking = false;

    function update() {
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;

        let progress = (vh - rect.top) / rect.height;
        progress = Math.max(0, Math.min(1, progress));

        smooth += (progress - smooth) * 0.08;
        if (progress > 0.999) smooth = 1;

        const ease = 1 - Math.pow(1 - smooth, 3);

        // 🔥 TRUE CUBE CENTER
        const cubeRect = cube.getBoundingClientRect();
        const cubeX = cubeRect.left + cubeRect.width / 2;
        const cubeY = cubeRect.top + cubeRect.height / 2;

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const dx = centerX - cubeX;
        const dy = centerY - cubeY;

        const scale = 3.2 - (2.2 * ease);

        const x = dx * (1 - ease);
        const y = dy * (1 - ease);

        content.style.transform =
            `translate3d(${x}px, ${y}px, 0) scale(${scale})`;

        content.style.opacity = 0.5 + (0.5 * ease);
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                update();
                ticking = false;
            });
            ticking = true;
        }
    }

    update();
    window.addEventListener("scroll", onScroll);
}
*/
