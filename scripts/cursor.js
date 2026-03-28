export function initCursor() {
    const cursor = document.getElementById('cursor');

    if (!cursor) return;


    // ===== INSTANT FOLLOW (NO LAG) =====
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
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