export function initGridAnimation() {
    const cells = document.querySelectorAll('.grid-cell');

    cells.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            spawnTile(cell);
        });
    });
}

function spawnTile(cell) {
    const tile = document.createElement('div');
    tile.className = 'grid-tile';

    // random texture
    tile.style.backgroundImage = `url(/assets/images/tile-${rand(1,5)}.png)`;

    cell.appendChild(tile);

    // animation
    tile.animate(
        [
            { transform: 'translateX(100%)', opacity: 0 },
            { transform: 'translateX(0%)', opacity: 1 },
            { transform: 'translateX(0%)', opacity: 0 }
        ],
        {
            duration: 900,
            easing: 'ease-out'
        }
    );

    // cleanup
    setTimeout(() => tile.remove(), 900);
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}