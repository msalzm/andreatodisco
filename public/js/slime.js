// === Physarum-style organic trails ===
const canvas = document.getElementById("snake-canvas");
const ctx = canvas.getContext("2d");

let w = (canvas.width = window.innerWidth);
let h = (canvas.height = window.innerHeight);
window.addEventListener("resize", () => {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
});

// --- parameters ---
const AGENT_COUNT = 400;     // number of moving points
const MOVE_SPEED = 1.5;       // step size
const SENSOR_ANGLE = 0.5;     // radians between sensors
const SENSOR_DIST = 9;        // how far each agent samples
const TURN_SPEED = 0.25;      // radians per update
const DECAY = 0.05;           // trail fade per frame

// --- agent definition ---
class Agent {
  constructor(x, y, a, c) {
    this.x = x;
    this.y = y;
    this.a = a;
    this.c = c; // hue offset
  }
  step() {
    // sense left, center, right
    const sCenter = sample(this.a);
    const sLeft = sample(this.a - SENSOR_ANGLE);
    const sRight = sample(this.a + SENSOR_ANGLE);

    // turn toward highest sensed trail
    if (sCenter > sLeft && sCenter > sRight) {
      // keep direction
    } else if (sLeft > sRight) {
      this.a -= TURN_SPEED;
    } else if (sRight > sLeft) {
      this.a += TURN_SPEED;
    } else {
      this.a += (Math.random() - 0.5) * TURN_SPEED;
    }

    // move forward
    this.x += Math.cos(this.a) * MOVE_SPEED;
    this.y += Math.sin(this.a) * MOVE_SPEED;

    // wrap edges
    if (this.x < 0) this.x += w;
    if (this.x > w) this.x -= w;
    if (this.y < 0) this.y += h;
    if (this.y > h) this.y -= h;

    // draw trail point
    const hue = (this.c + Date.now() * 0.005) % 360;
    ctx.fillStyle = `hsla(${hue},100%,60%,0.5)`;
    ctx.fillRect(this.x, this.y, 1, 1);
  }
}

// --- global field ---
const field = ctx.createImageData(w, h);
const agents = [];

for (let i = 0; i < AGENT_COUNT; i++) {
  const x = Math.random() * w;
  const y = Math.random() * h;
  const a = Math.random() * Math.PI * 2;
  const c = Math.random() * 360;
  agents.push(new Agent(x, y, a, c));
}

// --- sample function (average brightness around angle) ---
function sample(angle) {
  const dx = Math.cos(angle) * SENSOR_DIST;
  const dy = Math.sin(angle) * SENSOR_DIST;
  const x = Math.floor((currentAgent.x + dx + w) % w);
  const y = Math.floor((currentAgent.y + dy + h) % h);
  const i = (y * w + x) * 4;
  return field.data[i]; // red channel as trail intensity
}

// --- animation loop ---
function animate() {
  // fade old trails
  const img = ctx.getImageData(0, 0, w, h);
  const data = img.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i]   *= 1 - DECAY; // r
    data[i+1] *= 1 - DECAY; // g
    data[i+2] *= 1 - DECAY; // b
  }
  ctx.putImageData(img, 0, 0);

  // move agents
  agents.forEach(a => {
    currentAgent = a;
    a.step();
  });

  requestAnimationFrame(animate);
}
let currentAgent = null;
animate();
