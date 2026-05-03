export function initAsciiCube() {
    const mounted = [
        mountCube({
            elementId: "ascii-cube-os",
            initialAngle: 0.25,
            initialMorph: 0.8,
            angleStep: 0.036,
            morphStep: 0.026
        }),
        mountCube({
            elementId: "ascii-cube-cyphrus",
            initialAngle: 0,
            initialMorph: 0,
            angleStep: 0.028,
            morphStep: 0.02
        })
    ].some(Boolean);

    // Backward compatibility for older markup.
    if (!mounted) {
        mountCube({
            elementId: "ascii-cube",
            initialAngle: 0,
            initialMorph: 0,
            angleStep: 0.03,
            morphStep: 0.02
        });
    }
}

function mountCube(config) {
    const {
        elementId,
        initialAngle,
        initialMorph,
        angleStep,
        morphStep
    } = config;
    const el = document.getElementById(elementId);
    if (!el) return false;

    const width = 90;
    const height = 34;
    let angle = initialAngle;
    let morph = initialMorph;
    let lastFrame = 0;
    let visible = true;
    const frameInterval = 1000 / 30;

    const rect = [
        [-2, -1, -1], [2, -1, -1], [2, 1, -1], [-2, 1, -1],
        [-2, -1, 1], [2, -1, 1], [2, 1, 1], [-2, 1, 1]
    ];

    const rectEdges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
    ];

    const octa = [
        [0, 0, 2], [0, 0, -2],
        [2, 0, 0], [-2, 0, 0],
        [0, 1.5, 0], [0, -1.5, 0]
    ];

    const octaEdges = [
        [0, 2], [0, 3], [0, 4], [0, 5],
        [1, 2], [1, 3], [1, 4], [1, 5],
        [2, 4], [2, 5], [3, 4], [3, 5]
    ];

    function circle(radius, axis) {
        const points = [];
        for (let i = 0; i < 80; i++) {
            const theta = i / 80 * Math.PI * 2;
            if (axis === "x") points.push([0, Math.cos(theta) * radius, Math.sin(theta) * radius]);
            if (axis === "y") points.push([Math.cos(theta) * radius, 0, Math.sin(theta) * radius]);
            if (axis === "z") points.push([Math.cos(theta) * radius, Math.sin(theta) * radius, 0]);
            if (axis === "d") points.push([Math.cos(theta) * radius, Math.sin(theta) * radius, Math.sin(theta) * radius]);
        }
        return points;
    }

    const circles = [
        circle(1.8, "x"),
        circle(1.8, "y"),
        circle(1.8, "z"),
        circle(1.8, "d")
    ];

    function rotate([x, y, z], ax, ay) {
        const dy = y * Math.cos(ax) - z * Math.sin(ax);
        const dz = y * Math.sin(ax) + z * Math.cos(ax);
        const dx = x * Math.cos(ay) + dz * Math.sin(ay);
        const dz2 = -x * Math.sin(ay) + dz * Math.cos(ay);
        return [dx, dy, dz2];
    }

    function project([x, y, z]) {
        const scale = 26;
        const distance = 4;
        const factor = scale / (z + distance);
        return [
            Math.floor(x * factor + width / 2),
            Math.floor(y * factor + height / 2),
            z
        ];
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function morphPoints(a, b, t) {
        return a.map((point, i) => [
            lerp(point[0], b[i % b.length][0], t),
            lerp(point[1], b[i % b.length][1], t),
            lerp(point[2], b[i % b.length][2], t)
        ]);
    }

    function getChar(z) {
        if (z > 1.5) return ".";
        if (z > 0.5) return "*";
        if (z > -0.5) return "+";
        if (z > -1.5) return "#";
        return "@";
    }

    function drawEdges(buffer, points, edges) {
        const rotated = points.map((point) => rotate(point, angle, angle));
        const projected = rotated.map((point) => project(point));

        edges.forEach(([a, b]) => {
            const [x1, y1, z1] = projected[a];
            const [x2, y2, z2] = projected[b];

            for (let i = 0; i <= 10; i++) {
                const t = i / 10;
                const x = Math.floor(x1 + (x2 - x1) * t);
                const y = Math.floor(y1 + (y2 - y1) * t);
                const z = z1 + (z2 - z1) * t;
                if (x >= 0 && x < width && y >= 0 && y < height) {
                    buffer[y][x] = getChar(z);
                }
            }
        });
    }

    function drawCircle(buffer, points, speedFactor, offset) {
        const pulse = 1.8 + Math.sin(morph + offset) * 0.2;
        const rotated = points.map((point) => rotate(
            [point[0] * pulse, point[1] * pulse, point[2] * pulse],
            angle * speedFactor,
            angle * (speedFactor + 0.2)
        ));
        const projected = rotated.map((point) => project(point));

        projected.forEach(([x, y, z]) => {
            if (x >= 0 && x < width && y >= 0 && y < height) {
                buffer[y][x] = getChar(z);
            }
        });
    }

    const visibilityObserver = new IntersectionObserver((entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
    }, { threshold: 0.01 });

    visibilityObserver.observe(el);

    function animate(timestamp) {
        if (!visible || document.hidden) {
            requestAnimationFrame(animate);
            return;
        }

        if (timestamp - lastFrame < frameInterval) {
            requestAnimationFrame(animate);
            return;
        }

        lastFrame = timestamp;
        const buffer = Array(height).fill(null).map(() => Array(width).fill(" "));
        const blend = (Math.sin(morph) + 1) / 2;
        const shape = morphPoints(rect, octa, blend);
        const edges = blend < 0.5 ? rectEdges : octaEdges;

        drawEdges(buffer, shape, edges);
        drawCircle(buffer, circles[0], 1, 0);
        drawCircle(buffer, circles[1], 1.2, 1);
        drawCircle(buffer, circles[2], 0.8, 2);
        drawCircle(buffer, circles[3], 1.5, 3);

        el.innerText = buffer.map((row) => row.join("")).join("\n");
        angle += angleStep;
        morph += morphStep;
        requestAnimationFrame(animate);
    }

    animate();
    return true;
}
