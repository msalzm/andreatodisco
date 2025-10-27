// === Branching line growth ===
const canvas = document.getElementById("snake-canvas");
const ctx = canvas.getContext("2d");

let w = (canvas.width = window.innerWidth);
let h = (canvas.height = window.innerHeight);

window.addEventListener("resize", () => {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  reset();
});

// Branch data structure
class Branch {
  constructor(x, y, angle, length, depth) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.length = length;
    this.depth = depth;
    this.progress = 0; // how far the branch has grown
  }
  grow() {
    this.progress += 2; // speed of growth in px/frame
    if (this.progress >= this.length) {
      this.progress = this.length;
      return true; // done growing
    }
    return false;
  }
  endPoint() {
    return {
      x: this.x + Math.cos(this.angle) * this.progress,
      y: this.y + Math.sin(this.angle) * this.progress
    };
  }
}

// Globals
let branches = [];
let nextBranches = [];
const MAX_DEPTH = 6;
const BRANCH_ANGLE = Math.PI / 4;
const COLOR_SPEED = 0.5;

function reset() {
  branches = [new Branch(w / 2, h, -Math.PI / 2, 100, 0)];
  nextBranches = [];
}

reset();

// Draw + update
function animate() {
  // fade previous frame for trail effect
  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
  ctx.fillRect(0, 0, w, h);

  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  branches.forEach((b) => {
    const done = b.grow();
    const { x, y } = b;
    const end = b.endPoint();

    const hue = (b.depth * 40 + Date.now() * COLOR_SPEED * 0.1) % 360;
    ctx.strokeStyle = `hsla(${hue}, 100%, 65%, 0.9)`;
    ctx.lineWidth = Math.max(1, 6 - b.depth);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    // spawn new branches when finished growing
    if (done && b.depth < MAX_DEPTH) {
      if (Math.random() < 0.6) {
        const newLen = b.length * (0.6 + Math.random() * 0.3);
        const offset = (Math.random() - 0.5) * 0.3;
        nextBranches.push(
          new Branch(end.x, end.y, b.angle - BRANCH_ANGLE + offset, newLen, b.depth + 1)
        );
      }
      if (Math.random() < 0.6) {
        const newLen = b.length * (0.6 + Math.random() * 0.3);
        const offset = (Math.random() - 0.5) * 0.3;
        nextBranches.push(
          new Branch(end.x, end.y, b.angle + BRANCH_ANGLE + offset, newLen, b.depth + 1)
        );
      }
    }
  });

  // add new branches when current ones finished
  if (nextBranches.length > 0) {
    branches = nextBranches;
    nextBranches = [];
  }

  requestAnimationFrame(animate);
}

animate();
