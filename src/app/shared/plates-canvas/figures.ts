// Pure Canvas 2D drawing functions for the "Engineering Plates" background.
// Each figure draws one animated textbook-style plate. All strokes are ink
// at low alpha; each figure has exactly one moving accent (teal) marker.

export interface FigHelpers {
  ink: (alpha: number) => string;
  accent: (alpha: number) => string;
  caption: (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    text: string,
  ) => void;
}

export function crosshair(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  stroke: string,
): void {
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - r, y);
  ctx.lineTo(x + r, y);
  ctx.moveTo(x, y - r);
  ctx.lineTo(x, y + r);
  ctx.stroke();
}

// FIG. A - EVENT STREAM: a partitioned log; event squares slide left,
// a teal square sweeps the middle lane like a consumer offset.
export function figEventStream(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  halfW: number,
  t: number,
  h: FigHelpers,
): void {
  const lanes = 3;
  const laneGap = 18;
  const cell = 8;

  for (let lane = 0; lane < lanes; lane++) {
    const ly = y + lane * laneGap;
    ctx.strokeStyle = h.ink(0.12);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - halfW, ly);
    ctx.lineTo(x + halfW, ly);
    ctx.stroke();

    const spacing = 30 + lane * 8;
    const offset = (t * (14 + lane * 4)) % spacing;
    ctx.strokeStyle = h.ink(0.28);
    for (let px = x + halfW - offset; px > x - halfW + cell; px -= spacing) {
      ctx.strokeRect(px - cell / 2, ly - cell / 2, cell, cell);
    }
  }

  const sweep = x - halfW + ((t * 26) % (halfW * 2));
  const my = y + laneGap;
  ctx.fillStyle = h.accent(0.55);
  ctx.fillRect(sweep - cell / 2, my - cell / 2, cell, cell);

  h.caption(ctx, x, y + lanes * laneGap + 12, 'FIG. A - EVENT STREAM');
}

// FIG. B - SERVICE GRAPH: six wiggling nodes, eight edges; a teal dot
// travels the edges like a request hopping between services.
const GRAPH_NODES: Array<[number, number]> = [
  [-0.95, -0.35],
  [0.05, -0.95],
  [0.98, -0.3],
  [0.55, 0.75],
  [-0.55, 0.85],
  [-0.1, 0.05],
];
const GRAPH_EDGES: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 0],
  [5, 0],
  [5, 2],
  [5, 3],
];

export function figServiceGraph(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  t: number,
  h: FigHelpers,
): void {
  const s = 56;
  const pts = GRAPH_NODES.map(
    ([nx, ny], i) =>
      [
        x + nx * s + 3 * Math.sin(0.3 * t + 1.7 * i),
        y + ny * s + 3 * Math.cos(0.26 * t + 2.3 * i),
      ] as [number, number],
  );

  ctx.strokeStyle = h.ink(0.16);
  ctx.lineWidth = 1;
  for (const [a, b] of GRAPH_EDGES) {
    ctx.beginPath();
    ctx.moveTo(pts[a][0], pts[a][1]);
    ctx.lineTo(pts[b][0], pts[b][1]);
    ctx.stroke();
  }

  const pos = (0.35 * t) % GRAPH_EDGES.length;
  const ei = Math.floor(pos);
  const ep = pos - ei;
  const [a, b] = GRAPH_EDGES[ei];
  ctx.fillStyle = h.accent(0.6);
  ctx.beginPath();
  ctx.arc(
    pts[a][0] + (pts[b][0] - pts[a][0]) * ep,
    pts[a][1] + (pts[b][1] - pts[a][1]) * ep,
    2.6,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  for (const [px, py] of pts) {
    ctx.fillStyle = h.ink(0.34);
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = h.ink(0.18);
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.stroke();
  }

  h.caption(ctx, x, y + s + 26, 'FIG. B - SERVICE GRAPH');
}

// FIG. C - CONSISTENT HASH RING: a ticked circle with five node points;
// a teal dot (a key) walks the ring clockwise.
export function figHashRing(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  t: number,
  h: FigHelpers,
): void {
  ctx.strokeStyle = h.ink(0.22);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const inner = i % 4 === 0 ? r - 6 : r - 3;
    ctx.strokeStyle = h.ink(i % 4 === 0 ? 0.25 : 0.15);
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * inner, y + Math.sin(a) * inner);
    ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    ctx.stroke();
  }

  const nodes = [0.4, 1.7, 2.9, 4.2, 5.4];
  for (const a of nodes) {
    const nx = x + Math.cos(a) * r;
    const ny = y + Math.sin(a) * r;
    ctx.fillStyle = h.ink(0.35);
    ctx.beginPath();
    ctx.arc(nx, ny, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = h.ink(0.2);
    ctx.beginPath();
    ctx.arc(nx, ny, 6.5, 0, Math.PI * 2);
    ctx.stroke();
  }

  const ka = (t * 0.5) % (Math.PI * 2);
  ctx.fillStyle = h.accent(0.6);
  ctx.beginPath();
  ctx.arc(x + Math.cos(ka) * r, y + Math.sin(ka) * r, 2.6, 0, Math.PI * 2);
  ctx.fill();

  h.caption(ctx, x, y + r + 20, 'FIG. C - CONSISTENT HASH RING');
}

// FIG. D - TREE INDEX: a three-level hierarchy; a teal dot descends from
// root to a leaf, choosing a different leaf each pass.
export function figTree(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  t: number,
  h: FigHelpers,
): void {
  const root: [number, number] = [x, y];
  const kids: Array<[number, number]> = [
    [x - 44, y + 38],
    [x + 44, y + 38],
  ];
  const leaves: Array<[number, number]> = [
    [x - 66, y + 76],
    [x - 22, y + 76],
    [x + 22, y + 76],
    [x + 66, y + 76],
  ];

  ctx.strokeStyle = h.ink(0.18);
  ctx.lineWidth = 1;
  for (let i = 0; i < 2; i++) {
    ctx.beginPath();
    ctx.moveTo(root[0], root[1]);
    ctx.lineTo(kids[i][0], kids[i][1]);
    ctx.stroke();
  }
  for (let i = 0; i < 4; i++) {
    const parent = kids[i < 2 ? 0 : 1];
    ctx.beginPath();
    ctx.moveTo(parent[0], parent[1]);
    ctx.lineTo(leaves[i][0], leaves[i][1]);
    ctx.stroke();
  }

  for (const [px, py] of [root, ...kids, ...leaves]) {
    ctx.fillStyle = h.ink(0.34);
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  const period = 3;
  const leaf = Math.floor(t / period) % 4;
  const p = (t % period) / period;
  const path: Array<[number, number]> = [root, kids[leaf < 2 ? 0 : 1], leaves[leaf]];
  const seg = p < 0.5 ? 0 : 1;
  const sp = (p - seg * 0.5) / 0.5;
  const [a, b] = [path[seg], path[seg + 1]];
  ctx.fillStyle = h.accent(0.6);
  ctx.beginPath();
  ctx.arc(a[0] + (b[0] - a[0]) * sp, a[1] + (b[1] - a[1]) * sp, 2.8, 0, Math.PI * 2);
  ctx.fill();

  h.caption(ctx, x, y + 76 + 22, 'FIG. D - TREE INDEX (LTREE)');
}

// FIG. E - LATENCY TRACE: a drifting waveform under a dashed p99 line.
export function figWaveform(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  halfW: number,
  t: number,
  h: FigHelpers,
): void {
  ctx.strokeStyle = h.ink(0.18);
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i <= 120; i++) {
    const px = x - halfW + (i / 120) * halfW * 2;
    const py = y + 12 * Math.sin(0.22 * i - 0.5 * t);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  ctx.setLineDash([2, 4]);
  ctx.strokeStyle = h.ink(0.12);
  ctx.beginPath();
  ctx.moveTo(x - halfW, y - 18);
  ctx.lineTo(x + halfW, y - 18);
  ctx.stroke();
  ctx.setLineDash([]);

  h.caption(ctx, x, y + 32, 'FIG. E - LATENCY, P99');
}
