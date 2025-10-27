// === Autonomous Disco Snakes ===
const canvas = document.getElementById("snake-canvas");
const ctx = canvas.getContext("2d");

let w = (canvas.width = window.innerWidth);
let h = (canvas.height = window.innerHeight);

window.addEventListener("resize", () => {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
});

const NUM_SNAKES = 6;
const MAX_SEGMENTS = 60;
const snakes = [];

// create snakes in random positions
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

// movement listener (mouse + touch)
function onMove() {
  moved = true;
}
document.addEventListener("mousemove", onMove, { passive: true });
document.addEventListener("touchmove", onMove, { passive: true });
document.addEventListener("touchstart", onMove, { passive: true });

// advance snakes only when there’s movement
function stepSnakes() {
  snakes.forEach((s) => {
    // small random direction changes
    s.angle += (Math.random() - 0.5) * 0.4;

    // move forward slightly
    const speed = 4 + Math.random() * 2;
    s.x += Math.cos(s.angle) * speed;
    s.y += Math.sin(s.angle) * speed;

    // wrap around screen edges
    if (s.x < 0) s.x = w;
    if (s.x > w) s.x = 0;
    if (s.y < 0) s.y = h;
    if (s.y > h) s.y = 0;

    // add to trail
    s.trail.push({ x: s.x, y: s.y });
    if (s.trail.length > MAX_SEGMENTS) s.trail.shift();
  });
}

// draw snakes
function drawSnakes() {
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(0, 0, w, h);

  snakes.forEach((s) => {
    for (let j = 0; j < s.trail.length - 1; j++) {
      const p1 = s.trail[j];
      const p2 = s.trail[j + 1];
      const alpha = j / s.trail.length;
      ctx.strokeStyle = `hsla(${(Math.sin(j * 0.2) * 60 + 180) % 360},100%,60%,${alpha})`;
      ctx.lineWidth = 5 * (1 - alpha);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  });
}

// animation loop
function animate() {
  if (moved) {
    stepSnakes();
    moved = false;
  }
  drawSnakes();
  requestAnimationFrame(animate);
}
animate();
