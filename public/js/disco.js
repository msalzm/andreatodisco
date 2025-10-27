// ==========================
// Neon cursor trail (as before)
// ==========================
const canvas = document.getElementById("disco-canvas");
const ctx = canvas.getContext("2d");

let dpr = Math.max(1, window.devicePixelRatio || 1);
function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);
resize();

const trail = [];
const MAX_POINTS = 140;
const DECAY = 0.02;
let hueBase = 200;

function addPoint(x, y) {
  trail.push({ x, y, life: 1 });
  if (trail.length > MAX_POINTS) trail.shift();
}

document.addEventListener("mousemove", (e) => addPoint(e.clientX, e.clientY), { passive: true });
document.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  if (t) addPoint(t.clientX, t.clientY);
}, { passive: true });

function animate() {
  // Fade previous strokes smoothly (no black overlay on the page)
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw glowing lines
  ctx.globalCompositeOperation = "lighter";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (let i = 1; i < trail.length; i++) {
    const p = trail[i];
    const prev = trail[i - 1];
    p.life -= DECAY;
    if (p.life <= 0) { trail.splice(i, 1); i--; continue; }

    const alpha = Math.max(0, p.life);
    const lw = 6 * alpha + 1;
    const hue = (hueBase + i * 2) % 360;
    ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${alpha})`;
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }
  hueBase = (hueBase + 0.7) % 360;

  requestAnimationFrame(animate);
}
animate();

// ==========================
// ASCII Dinosaur Progressive Reveal
// ==========================
const dinoEl = document.getElementById("dino");

// Nice compact dino with good silhouette
const DINO_ART = String.raw`
                __
               / _)
        .-^^^-/ /
     __/       /
    <__.|_|-|_|`;

dinoEl.textContent = DINO_ART; // initial layout (we’ll overwrite with masked view below)

// Build an index of revealable character positions (ignore newlines and spaces)
const revealable = [];
for (let i = 0; i < DINO_ART.length; i++) {
  const ch = DINO_ART[i];
  const isRevealable = ch !== "\n" && ch !== " ";
  if (isRevealable) revealable.push(i);
}

// Reveal state
let totalDistance = 0;
let lastX = null, lastY = null;

// How much movement to reveal one character (pixels per char)
const PX_PER_CHAR = 18;

// Replace unrevealed characters with spaces while keeping newlines intact
function renderDino(revealedCount) {
  const revealSet = new Set(revealable.slice(0, revealedCount));
  let out = "";
  for (let i = 0; i < DINO_ART.length; i++) {
    const ch = DINO_ART[i];
    if (ch === "\n") { out += "\n"; continue; }
    if (ch === " ")  { out += " ";  continue; }
    out += revealSet.has(i) ? ch : " ";
  }
  dinoEl.textContent = out;
}

// Distance helper
function dist(aX, aY, bX, bY) {
  const dx = aX - bX, dy = aY - bY;
  return Math.hypot(dx, dy);
}

// Track movement from mouse & touch
function onMove(x, y) {
  if (lastX == null) { lastX = x; lastY = y; return; }
  totalDistance += dist(x, y, lastX, lastY);
  lastX = x; lastY = y;

  const toReveal = Math.min(
    revealable.length,
    Math.floor(totalDistance / PX_PER_CHAR)
  );
  renderDino(toReveal);
}

document.addEventListener("mousemove", (e) => onMove(e.clientX, e.clientY), { passive: true });
document.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  if (t) onMove(t.clientX, t.clientY);
}, { passive: true });

// Start invisible but positioned (0 revealed)
renderDino(0);
