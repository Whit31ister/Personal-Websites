export function initCursor() {
    const cursor = document.getElementById('cursor');

    if (!cursor) return;

    let pointerX = 0;
    let pointerY = 0;
    let rafPending = false;

    function paintCursor() {
        cursor.style.left = pointerX + 'px';
        cursor.style.top = pointerY + 'px';
        rafPending = false;
    }

    // ===== RAF-THROTTLED FOLLOW =====
    document.addEventListener('mousemove', (e) => {
        pointerX = e.clientX;
        pointerY = e.clientY;
        if (!rafPending) {
            rafPending = true;
            requestAnimationFrame(paintCursor);
        }
    });

    // ===== CLICK FEEDBACK =====
    document.addEventListener('mousedown', () => {
        cursor.classList.add('cursor-click');
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('cursor-click');
    });

    // ===== HOVER STATES =====
    document.querySelectorAll('a, .project-item, .skill-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');


        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            cursor.textContent = '';
        });
    });
}
