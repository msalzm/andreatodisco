// === Random Disco Snakes ===
const canvas = document.getElementById("snake-canvas");
const ctx = canvas.getContext("2d");

let w = (canvas.width = window.innerWidth);
let h = (canvas.height = window.innerHeight);
window.addEventListener("resize", () => {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
});

// --- configuration ---
const NUM_SNAKES = 20;
const MAX_SEGMENTS = 100;
const STEP_SIZE = 6;

// --- snake setup ---
const snakes = [];
for (let i = 0; i < NUM_SNAKES; i++) {
  snakes.push({
    x: Math.random() * w,
    y: Math.random() * h,
    angle: Math.random() * Math.PI * 2,
    color: `hsl(${(i * 60) % 360},100%,60%)`,
    trail: [],
  });
}

let moved = false;

// any motion wakes them up
function onMove() { moved = true; }
document.addEventListener("mousemove", onMove, { passive: true });
document.addEventListener("touchmove", onMove, { passive: true });
document.addEventListener("touchstart", onMove, { passive: true });

// --- move snakes one step ---
function stepSnakes() {
  snakes.forEach((s) => {
    // small random turn
    s.angle += (Math.random() - 0.5) * 0.5;

    // save old position
    const oldX = s.x;
    const oldY = s.y;

    // forward motion
    s.x += Math.cos(s.angle) * STEP_SIZE;
    s.y += Math.sin(s.angle) * STEP_SIZE;

    // check if wrapped — if so, break trail
    let wrapped = false;
    if (s.x < 0) { s.x += w; wrapped = true; }
    if (s.x > w) { s.x -= w; wrapped = true; }
    if (s.y < 0) { s.y += h; wrapped = true; }
    if (s.y > h) { s.y -= h; wrapped = true; }

    if (wrapped) {
      // clear trail so no line connects across screen
      s.trail = [];
    }

    s.trail.push({ x: s.x, y: s.y });
    if (s.trail.length > MAX_SEGMENTS) s.trail.shift();
  });
}


// --- draw everything ---
function drawSnakes() {
  // translucent fade background
    ctx.save();
    ctx.translate(0.5, 0.5);
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(-0.5, -0.5, w + 1, h + 1);
    ctx.restore();



  snakes.forEach((s) => {
    if (s.trail.length < 2) return;

    for (let j = 0; j < s.trail.length - 1; j++) {
      const p1 = s.trail[j];
      const p2 = s.trail[j + 1];
      const alpha = j / s.trail.length;
      ctx.strokeStyle = `hsla(${(Math.sin(j * 0.3 + Date.now() * 0.001) * 120 + 180) % 360},100%,60%,${alpha})`;
      ctx.lineWidth = 4 * (1 - alpha);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  });
  ctx.globalCompositeOperation = "source-over";

}

// --- loop ---
function animate() {
  if (moved) {
    stepSnakes();        // advance one frame only when you move
    moved = false;
  }
  drawSnakes();          // always redraw current state
  requestAnimationFrame(animate);
}
animate();

// draw initial snakes once so they are visible immediately
for (let i = 0; i < MAX_SEGMENTS / 2; i++) stepSnakes();
drawSnakes();
