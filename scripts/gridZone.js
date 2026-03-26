export function initGridZone() {
    const zone = document.getElementById('grid-zone');

    if (!zone) return;

    const SIZE = 80;
    const RIGHT_OFFSET = window.innerWidth * -0.6;

    // Define irregular pattern (like Render)
    const pattern = [];

    const COLS = 18;   // width of rectangle
    const ROWS = 9;   // height of rectangle

    const START_X = 8; // position (right side anchor)
    const START_Y = 2;

// controls how much edges break
    const EDGE_NOISE = 0.5;

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {

            // distance from center (normalized)
            const distX = Math.abs(col - COLS / 2) / (COLS / 2);
            const distY = Math.abs(row - ROWS / 2) / (ROWS / 2);

            const edgeFactor = Math.max(distX, distY);

            // probability of keeping the cell
            const keep = Math.random() > edgeFactor * EDGE_NOISE;

            if (keep) {
                pattern.push([START_X + col, START_Y + row]);
            }
        }
    }

    pattern.forEach(([col, row]) => {
        const cell = document.createElement('div');
        cell.className = 'grid-zone-cell';

        const OFFSET_X = window.innerWidth; // adjust this

        cell.style.left = `calc(100vw - ${RIGHT_OFFSET}px - ${col * SIZE}px)`;

        cell.style.top = row * SIZE + 'px';

        zone.appendChild(cell);
    });
}