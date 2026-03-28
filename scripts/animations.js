export function initGridAnimation() {
    const cells = document.querySelectorAll('.grid-zone-cell');

    cells.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            console.log('hove detected');
            spawnTile(cell);
        });
    });
}

// Gridzone stuff
function spawnTile(cell) {
    const tile = document.createElement('div');
    tile.className = 'grid-tile';

    if (cell.dataset.busy === "true") return;
    cell.dataset.busy = "true";
    cell.innerHTML = ""; // clear old tile

    // random image
    tile.style.backgroundImage = `url('./assets/images/images-${rand(0,4)}.png')`;
    cell.appendChild(tile);

    // ===== ANIMATION =====
    tile.animate(
        [
            // ENTER (left → center)
            { transform: 'translateX(-100%)', opacity: 1, offset: 0 },
            { transform: 'translateX(0)',     opacity: 1, offset: 0.3 },

            // HOLD
            { transform: 'translateX(0)',     opacity: 1, offset: 0.99 },

            // EXIT (center → right)
            { transform: 'translateX(100%)',  opacity: 1, offset: 1 }
        ],
        {
            duration: 2000,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'forwards'
        }
    );
    tile.animate(
        [
            { filter: 'brightness(1)', offset: 0 },
            { filter: 'brightness(1.4)', offset: 0.3 },
            { filter: 'brightness(1.2)', offset: 0.7 },
            { filter: 'brightness(1)', offset: 1 }
        ],
        {
            duration: 2200, // match your main animation
            easing: 'ease-out'
        }
    );
    // cleanup
    setTimeout(() => {
        tile.remove();
        cell.dataset.busy = "false"; // ✅ unlock
    }, 2000);
}
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}