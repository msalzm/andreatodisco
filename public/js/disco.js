const canvas = document.getElementById("disco-canvas");
const ctx = canvas.getContext("2d");

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);
let points = [];

window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

document.addEventListener("mousemove", (e) => {
  points.push({ x: e.clientX, y: e.clientY, alpha: 1 });
});

function animate() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // fade effect
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const color = `hsla(${(i * 10) % 360}, 100%, 70%, ${p.alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    p.alpha -= 0.02; // fade out
    if (p.alpha <= 0) {
      points.splice(i, 1);
      i--;
    }
  }

  requestAnimationFrame(animate);
}

animate();
