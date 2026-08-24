"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

/* ════════════════════════════════════════════════════════════════════
   ASCII HANDS — the Creation of Adam pose

   Two hands, not one mirrored twice, because the fresco's two hands are not
   the same gesture: Adam's is limp, the wrist dropped and the fingers
   trailing, while God's is active, the index driven forward and the rest
   curled back. Each is modelled the way a hand is built — a back-of-hand
   mass off the wrist, four fingers of three phalanges apiece with a knuckle
   at every joint, and a thumb of a metacarpal plus two phalanges — and each
   finger curls a little more than the one before it, which is what gives the
   pose its cascade.

   The parts are one signed distance field. Distance is a plain minimum:
   chaining a smooth union across forty-odd parts compounds its bias and
   inflates a halo around the whole arm. Only the *normal* is blended, over
   the parts within one blend width of the nearest, and that is what rounds
   the joins — a hard normal creases at every joint, which is what makes a
   jointed model read as a bundle of sticks.

   Only + - * / and sqrt are used in the per-sample maths, all exactly
   specified by IEEE-754, so the server and the browser build identical
   strings and hydration stays quiet. `Math.hypot` and `**` are NOT exact
   across engines and are deliberately avoided; `Math.sin`/`Math.cos` appear
   only while folding the constants below, from literals both sides share.
   ════════════════════════════════════════════════════════════════════ */

const FIELD_W = 560;
const FIELD_H = 300;
/* Cell aspect ~0.6 matches a monospace glyph's advance, so the sampled grid
   and the drawn characters stay square to each other. */
const COLS = 190;
const ROWS = 61;
const CELL_W = FIELD_W / COLS;
const CELL_H = FIELD_H / ROWS;

/** Light-to-dark ink ramp. Index 0 is the faintest mark on the page. */
const RAMP = ".:-=+*#%@";

const len = (x: number, y: number) => Math.sqrt(x * x + y * y);
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const RAD = Math.PI / 180;

/** How widely the joins between parts blend their normals. */
const BLEND = 7;

type Part = {
  /** 0 = tapered capsule, 1 = ball. */
  kind: 0 | 1;
  ax: number;
  ay: number;
  bx: number;
  by: number;
  ra: number;
  rb: number;
  /** Whether the auto-fit frames this piece, or lets it run off the edge. */
  framed: boolean;
  /** Bounding circle, for the cheap rejection test. */
  cx: number;
  cy: number;
  cr: number;
};

type Builder = {
  /** A tapered capsule between two points. */
  bone: (
    ax: number,
    ay: number,
    bx: number,
    by: number,
    ra: number,
    rb: number,
    framed?: boolean,
  ) => void;
  /** A ball, for knuckles and fingertips. */
  ball: (x: number, y: number, r: number) => void;
  /**
   * A finger as a chain of joint positions: the first point is the knuckle,
   * the last the fingertip, with a ball dropped at every joint between. How
   * sharply the points turn is how tightly the finger curls.
   */
  chain: (pts: [number, number][], radii: number[]) => void;
};

function buildHand(build: (b: Builder) => void): Part[] {
  const parts: Part[] = [];

  const push = (
    kind: 0 | 1,
    ax: number,
    ay: number,
    bx: number,
    by: number,
    ra: number,
    rb: number,
    framed: boolean,
  ) =>
    parts.push({
      kind,
      ax,
      ay,
      bx,
      by,
      ra,
      rb,
      framed,
      cx: (ax + bx) / 2,
      cy: (ay + by) / 2,
      cr: len(bx - ax, by - ay) / 2 + Math.max(ra, rb),
    });

  const bone: Builder["bone"] = (ax, ay, bx, by, ra, rb, framed = true) =>
    push(0, ax, ay, bx, by, ra, rb, framed);
  const ball: Builder["ball"] = (x, y, r) => push(1, x, y, x, y, r, r, true);
  const chain: Builder["chain"] = (pts, radii) => {
    ball(pts[0][0], pts[0][1], radii[0] * 1.04); // knuckle
    for (let i = 0; i < pts.length - 1; i++) {
      bone(
        pts[i][0],
        pts[i][1],
        pts[i + 1][0],
        pts[i + 1][1],
        radii[i],
        radii[i + 1],
      );
      if (i < pts.length - 2) {
        ball(pts[i + 1][0], pts[i + 1][1], radii[i + 1] * 1.06);
      }
    }
    const tip = pts[pts.length - 1];
    ball(tip[0], tip[1], radii[radii.length - 1] * 0.92); // fingertip
  };

  build({ bone, ball, chain });
  return parts;
}

/* Canonical space for both hands: fingers point right (+x), y runs down, the
   wrist sits near the origin and the arm enters from the left. */

/** Adam — the wrist dropped, the hand limp, the fingers trailing away. */
const ADAM = buildHand(({ bone, ball, chain }) => {
  bone(-128, 62, -66, 8, 36, 30, false); // forearm, rising from off-frame
  bone(-66, 8, -22, 16, 33, 29); // wrist
  bone(-22, 16, 50, 30, 29, 24); // back of the hand
  chain(
    [
      [56, 20],
      [112, 28],
      [154, 34],
      [184, 40],
    ],
    [11.5, 10.5, 9, 6.8],
  ); // index, extended
  chain(
    [
      [54, 33],
      [108, 45],
      [144, 57],
      [164, 70],
    ],
    [11.5, 10.5, 9, 7],
  ); // middle
  chain(
    [
      [48, 45],
      [96, 60],
      [124, 75],
      [138, 88],
    ],
    [10.5, 9.5, 8, 6.5],
  ); // ring
  chain(
    [
      [40, 55],
      [78, 70],
      [100, 83],
      [110, 94],
    ],
    [9, 8, 7, 5.5],
  ); // little
  ball(-8, -4, 17);
  chain(
    [
      [-8, -4],
      [32, -16],
      [66, -20],
      [88, -16],
    ],
    [17, 13.5, 11, 8.5],
  ); // thumb
});

/** God — driving forward, the index out, the rest curled back to the palm. */
const GOD = buildHand(({ bone, ball, chain }) => {
  bone(-128, 44, -64, 2, 37, 31, false);
  bone(-64, 2, -20, 3, 34, 30);
  bone(-20, 3, 48, 10, 30, 25);
  chain(
    [
      [54, 2],
      [110, -2],
      [152, 3],
      [182, 10],
    ],
    [11.5, 10.5, 9, 6.5],
  ); // index, pointing
  chain(
    [
      [52, 17],
      [102, 27],
      [130, 46],
      [134, 64],
    ],
    [11.5, 10, 8.5, 7],
  ); // middle, curling
  chain(
    [
      [46, 29],
      [90, 43],
      [108, 62],
      [101, 76],
    ],
    [10.5, 9, 8, 6.5],
  ); // ring, tighter
  chain(
    [
      [38, 39],
      [74, 53],
      [86, 70],
      [75, 80],
    ],
    [9, 8, 7, 5.5],
  ); // little, tightest
  ball(-6, -14, 17);
  chain(
    [
      [-6, -14],
      [34, -32],
      [70, -40],
      [94, -38],
    ],
    [17, 13.5, 11, 8.5],
  ); // thumb, spread
});

/* ─── Rendering one pose ───────────────────────────────────────────── */

/**
 * Frames a pose in the field and walks the grid, returning one string of
 * characters per row. The framing is derived from the parts rather than
 * hand-tuned, so it follows the anatomy whenever a bone moves.
 */
function renderPose(parts: Part[], tiltDeg: number) {
  const rot = tiltDeg * RAD;
  const cosR = Math.cos(rot);
  const sinR = Math.sin(rot);

  /* Fit the hand — not the forearm, which is meant to leave the frame. */
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const p of parts) {
    if (!p.framed) continue;
    const ends: [number, number, number][] =
      p.kind === 1
        ? [[p.ax, p.ay, p.ra]]
        : [
            [p.ax, p.ay, p.ra],
            [p.bx, p.by, p.rb],
          ];
    for (const [ex, ey, r] of ends) {
      const rx = ex * cosR - ey * sinR;
      const ry = ex * sinR + ey * cosR;
      if (rx - r < x0) x0 = rx - r;
      if (rx + r > x1) x1 = rx + r;
      if (ry - r < y0) y0 = ry - r;
      if (ry + r > y1) y1 = ry + r;
    }
  }
  const tx0 = FIELD_W * 0.24;
  const tx1 = FIELD_W * 0.99;
  const ty0 = FIELD_H * 0.06;
  const ty1 = FIELD_H * 0.94;
  const s = Math.min((tx1 - tx0) / (x1 - x0), (ty1 - ty0) / (y1 - y0));
  const tx = (tx0 + tx1) / 2 - ((x0 + x1) / 2) * s;
  const ty = (ty0 + ty1) / 2 - ((y0 + y1) / 2) * s;

  /* Light from the upper left, tilted toward the viewer, carried into the
     canonical frame so the sample points never have to leave it. */
  const lightX = -0.5 * cosR + -0.76 * sinR;
  const lightY = 0.5 * sinR + -0.76 * cosR;
  const lightZ = 0.41;

  const sd = new Float64Array(parts.length);
  const sx = new Float64Array(parts.length);
  const sy = new Float64Array(parts.length);

  const ink = (worldX: number, worldY: number) => {
    const ddx = (worldX - tx) / s;
    const ddy = (worldY - ty) / s;
    const x = ddx * cosR + ddy * sinR;
    const y = -ddx * sinR + ddy * cosR;

    let d = Infinity;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      /* A part whose bounding circle sits further away than the running best
         plus the blend width changes neither the distance nor the normal. */
      const gx = x - p.cx;
      const gy = y - p.cy;
      const reach = d + BLEND + p.cr;
      if (reach > 0 && gx * gx + gy * gy > reach * reach) {
        sd[i] = Infinity;
        continue;
      }
      if (p.kind === 1) {
        const ox = x - p.ax;
        const oy = y - p.ay;
        sd[i] = len(ox, oy) - p.ra;
        sx[i] = ox / p.ra;
        sy[i] = oy / p.ra;
      } else {
        const bax = p.bx - p.ax;
        const bay = p.by - p.ay;
        const pax = x - p.ax;
        const pay = y - p.ay;
        const t = clamp01((pax * bax + pay * bay) / (bax * bax + bay * bay));
        const ox = pax - bax * t;
        const oy = pay - bay * t;
        const r = p.ra + (p.rb - p.ra) * t;
        sd[i] = len(ox, oy) - r;
        sx[i] = ox / r;
        sy[i] = oy / r;
      }
      if (sd[i] < d) d = sd[i];
    }

    /* Blend the normals of everything within a blend width of the nearest. */
    let nx = 0;
    let ny = 0;
    let wsum = 0;
    for (let i = 0; i < parts.length; i++) {
      const w = 1 - (sd[i] - d) / BLEND;
      if (w <= 0) continue;
      const ww = w * w;
      nx += sx[i] * ww;
      ny += sy[i] * ww;
      wsum += ww;
    }
    if (wsum > 0) {
      nx /= wsum;
      ny /= wsum;
    }

    /* Fake the surface normal: (nx, ny) across the limb, the rest bulging
       toward the viewer. */
    const flat = nx * nx + ny * ny;
    const z = Math.sqrt(flat < 1 ? 1 - flat : 0);
    const lambert = nx * lightX + ny * lightY + z * lightZ;
    const lit = lambert > 0 ? lambert : 0;

    /* The lit side keeps a floor of ink rather than dropping to blank paper.
       Without it the highlight erases the whole upper-left of every limb and
       all that survives is the shadow edge — streaks, not a hand. */
    let tone = clamp01(0.94 - lit * 0.72);
    tone = tone * (0.72 + 0.28 * Math.sqrt(tone)); // gentle gamma

    const depth = -d * s; // how far below the surface, in field units
    /* Contour: the silhouette darkens the way an edge does under raking
       light, which is what separates one finger from the next. */
    tone = clamp01(tone + (1 - clamp01(depth / 9)) * 0.3);
    /* Half a cell of dissolve either side of the outline. */
    const cover = clamp01(depth / 7 + 0.5);
    /* The arm dissolves into the edge it enters from — the way the torn
       paper crops it in the reference — instead of ending on a cut. */
    const u = clamp01((worldX - 45) / 155);
    const enter = u * u * (3 - 2 * u);

    return cover * tone * enter;
  };

  /* Deterministic value noise — breaks the ramp's banding into a stipple.
     Integer maths only, so it too is identical on both sides. */
  const hash = (cx: number, cy: number) => {
    let h = (cx * 374761393 + cy * 668265263) | 0;
    h = (h ^ (h >> 13)) | 0;
    h = Math.imul(h, 1274126177) | 0;
    return ((h ^ (h >> 16)) >>> 0) / 4294967296;
  };

  const rows: { line: string; i: number }[] = [];
  for (let r = 0; r < ROWS; r++) {
    const y = (r + 0.5) * CELL_H;
    let line = "";
    for (let c = 0; c < COLS; c++) {
      const v = ink((c + 0.5) * CELL_W, y);
      /* Dither: a cell inks up when its tone beats its own noise threshold,
         which turns flat tone into the scattered grain of a halftone. */
      if (v < 0.06 || v < hash(c, r) * 0.3) {
        line += " ";
        continue;
      }
      const step = Math.floor(v * RAMP.length);
      line += RAMP[step < RAMP.length ? step : RAMP.length - 1];
    }
    /* Rows that came out blank carry no marks and are never rendered. */
    if (line.trim().length > 0) rows.push({ line, i: r });
  }
  return rows;
}

const POSES = {
  adam: renderPose(ADAM, 6),
  god: renderPose(GOD, -4),
};

export type HandPose = keyof typeof POSES;

export function AsciiHand({
  pose,
  flip = false,
  className = "",
  delay = 0,
}: {
  /** Which of the fresco's two hands to draw. */
  pose: HandPose;
  /** Mirror it, for the hand on the right of the frame. */
  flip?: boolean;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.svg
      viewBox={`0 0 ${FIELD_W} ${FIELD_H}`}
      className={className}
      preserveAspectRatio={flip ? "xMaxYMid meet" : "xMinYMid meet"}
      aria-hidden="true"
      focusable="false"
      /* `initial` is the only one of these three props that reaches the
         server-rendered markup, so branching it on the reduced-motion query —
         which the client knows on its first render and the server never does —
         would be a hydration mismatch. Reduced motion is honoured through the
         transition instead, which SSR never sees. */
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={
        reduce ? { duration: 0 } : { duration: 1.6, delay, ease: "easeOut" }
      }
    >
      <g
        transform={flip ? `translate(${FIELD_W} 0) scale(-1 1)` : undefined}
        fill="currentColor"
      >
        {POSES[pose].map(({ line, i }) => (
          <text
            key={i}
            x={0}
            y={(i + 0.78) * CELL_H}
            textLength={FIELD_W}
            lengthAdjust="spacing"
            fontSize={CELL_H * 1.05}
            fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
            xmlSpace="preserve"
          >
            {line}
          </text>
        ))}
      </g>
    </motion.svg>
  );
}

export default AsciiHand;
