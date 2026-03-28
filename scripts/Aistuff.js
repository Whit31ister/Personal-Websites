export function initAsciiCube() {
    const el = document.getElementById("ascii-cube");
    if (!el) return;

    const width = 180;
    const height = 60;

    let angle = 0;
    let morph = 0;

    // ========= SHAPES =========

    const rect = [
        [-2,-1,-1], [2,-1,-1], [2,1,-1], [-2,1,-1],
        [-2,-1, 1], [2,-1, 1], [2,1, 1], [-2,1, 1]
    ];

    const rectEdges = [
        [0,1],[1,2],[2,3],[3,0],
        [4,5],[5,6],[6,7],[7,4],
        [0,4],[1,5],[2,6],[3,7]
    ];

    const octa = [
        [0,0,2], [0,0,-2],
        [2,0,0], [-2,0,0],
        [0,1.5,0], [0,-1.5,0]
    ];

    const octaEdges = [
        [0,2],[0,3],[0,4],[0,5],
        [1,2],[1,3],[1,4],[1,5],
        [2,4],[2,5],[3,4],[3,5]
    ];

    // ========= CIRCLES =========

    function circle(radius, axis) {
        const pts = [];
        for (let i = 0; i < 80; i++) {
            const t = i / 80 * Math.PI * 2;

            if (axis === "x") pts.push([0, Math.cos(t)*radius, Math.sin(t)*radius]);
            if (axis === "y") pts.push([Math.cos(t)*radius, 0, Math.sin(t)*radius]);
            if (axis === "z") pts.push([Math.cos(t)*radius, Math.sin(t)*radius, 0]);
            if (axis === "d") pts.push([Math.cos(t)*radius, Math.sin(t)*radius, Math.sin(t)*radius]);
        }
        return pts;
    }

    const circles = [
        circle(1.8, "x"),
        circle(1.8, "y"),
        circle(1.8, "z"),
        circle(1.8, "d")
    ];

    // ========= MATH =========

    function rotate([x,y,z], ax, ay) {
        let dy = y*Math.cos(ax) - z*Math.sin(ax);
        let dz = y*Math.sin(ax) + z*Math.cos(ax);

        let dx = x*Math.cos(ay) + dz*Math.sin(ay);
        let dz2 = -x*Math.sin(ay) + dz*Math.cos(ay);

        return [dx, dy, dz2];
    }

    function project([x,y,z]) {
        const scale = 45;
        const dist = 4;

        const f = scale / (z + dist);

        return [
            Math.floor(x*f + width/2),
            Math.floor(y*f + height/2),
            z
        ];
    }

    // ========= MORPH =========

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function morphPoints(a, b, t) {
        return a.map((p, i) => [
            lerp(p[0], b[i % b.length][0], t),
            lerp(p[1], b[i % b.length][1], t),
            lerp(p[2], b[i % b.length][2], t)
        ]);
    }

    function getMorphShape() {
        const t = (Math.sin(morph) + 1) / 2;
        return morphPoints(rect, octa, t);
    }

    // ========= DEPTH SHADING =========

    function getChar(z) {
        if (z > 1.5) return ".";
        if (z > 0.5) return "*";
        if (z > -0.5) return "•";
        if (z > -1.5) return "#";
        return "@";
    }

    // ========= DRAW =========

    function drawEdges(buffer, pts, edg) {
        const r = pts.map(p => rotate(p, angle, angle));
        const proj = r.map(p => project(p));

        edg.forEach(([a,b]) => {
            const [x1,y1,z1] = proj[a];
            const [x2,y2,z2] = proj[b];

            for (let i=0;i<=12;i++) {
                const t = i/12;

                const x = Math.floor(x1 + (x2-x1)*t);
                const y = Math.floor(y1 + (y2-y1)*t);
                const z = z1 + (z2-z1)*t;

                if (x>=0 && x<width && y>=0 && y<height) {
                    buffer[y][x] = getChar(z);
                }
            }
        });
    }

    function drawCircle(buffer, pts, speedMul, offset) {
        const pulse = 1.8 + Math.sin(morph + offset) * 0.2;

        const r = pts.map(p => rotate(
            [p[0]*pulse, p[1]*pulse, p[2]*pulse],
            angle*speedMul,
            angle*(speedMul+0.2)
        ));

        const proj = r.map(p => project(p));

        proj.forEach(([x,y,z]) => {
            if (x>=0 && x<width && y>=0 && y<height) {
                buffer[y][x] = getChar(z);
            }
        });
    }

    // ========= LOOP =========

    function loop() {
        const buffer = Array(height).fill().map(()=>Array(width).fill(" "));

        const shape = getMorphShape();

        const t = (Math.sin(morph) + 1) / 2;
        const currentEdges = t < 0.5 ? rectEdges : octaEdges;

        drawEdges(buffer, shape, currentEdges);

        drawCircle(buffer, circles[0], 1, 0);
        drawCircle(buffer, circles[1], 1.2, 1);
        drawCircle(buffer, circles[2], 0.8, 2);
        drawCircle(buffer, circles[3], 1.5, 3);

        el.innerText = buffer.map(r=>r.join("")).join("\n");

        angle += 0.02;
        morph += 0.015;

        requestAnimationFrame(loop);
    }

    loop();
}