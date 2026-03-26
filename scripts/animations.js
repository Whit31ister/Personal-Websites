export function initGridAnimation() {
    const cells = document.querySelectorAll('.grid-zone-cell');

    cells.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            console.log('hove detected');
            spawnTile(cell);
        });
    });
}

function spawnTile(cell) {
    const tile = document.createElement('div');
    tile.className = 'grid-tile';

    // random image
    tile.style.backgroundImage = `url('./assets/images/images-${rand(0,4)}.png')`;

    cell.appendChild(tile);

    // ===== RANDOM DIRECTION =====
    const directions = [
        { from: 'translateX(100%)', to: 'translateX(0)' },
        { from: 'translateX(-100%)', to: 'translateX(0)' },
        { from: 'translateY(100%)', to: 'translateY(0)' },
        { from: 'translateY(-100%)', to: 'translateY(0)' }
    ];

    const dir = directions[Math.floor(Math.random() * directions.length)];

    // ===== ANIMATION =====
    tile.animate(
        [
            // ===== ENTER =====
            { transform: dir.from, opacity: 0, offset: 0 },
            { transform: dir.to,   opacity: 1, offset: 0.2 },

            // ===== HOLD =====
            { transform: dir.to,   opacity: 1, offset: 0.8 },

            // ===== EXIT (reverse) =====
            { transform: dir.from, opacity: 0, offset: 1 }
        ],
        {
            duration: 2000,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'forwards'
        }
    );
    // cleanup
    setTimeout(() => tile.remove(), 2000);
}
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}