// === Progressive ASCII Dinosaur Reveal (Mobile + Desktop Friendly) ===

// Three stages of the dino
const DINOS = [
String.raw`
                __
               / _)
        .-^^^-/ /
     __/       /
    <__.|_|-|_|`,

String.raw`
                   __
                  / _)
         _.----._/ /
       /          /
   __/ (  |   ( |
  / __.-'|_|--|_|`,

String.raw`
                          __
                         / _)
                _.----._/ /
              /          /
          __/ (  |   ( |
         / __.-'|_|--|_|
    _.-^^^             /-.
 __/                     /
<__.|_|-|_|-|_|-|_|-|_|-|_|
`
];

const dinoEl = document.getElementById("dino");

let totalDistance = 0;
let lastX = null, lastY = null;
let stage = 0;
let revealed = 0;

const PX_PER_CHAR = 18; // movement needed to reveal one character
let currentArt = DINOS[stage];

function getRevealableIndices(art) {
  const idxs = [];
  for (let i = 0; i < art.length; i++) {
    if (art[i] !== "\n" && art[i] !== " ") idxs.push(i);
  }
  return idxs;
}
let revealable = getRevealableIndices(currentArt);

function render(revealedCount) {
  const revealSet = new Set(revealable.slice(0, revealedCount));
  let out = "";
  for (let i = 0; i < currentArt.length; i++) {
    const ch = currentArt[i];
    if (ch === "\n" || ch === " ") out += ch;
    else out += revealSet.has(i) ? ch : " ";
  }
  dinoEl.textContent = out;
}

function handleMovement(x, y) {
  if (lastX == null) { lastX = x; lastY = y; return; }
  const dx = x - lastX;
  const dy = y - lastY;
  const dist = Math.hypot(dx, dy);
  totalDistance += dist;
  lastX = x;
  lastY = y;

  const toReveal = Math.floor(totalDistance / PX_PER_CHAR);

  if (toReveal > revealable.length && stage < DINOS.length - 1) {
    stage++;
    currentArt = DINOS[stage];
    revealable = getRevealableIndices(currentArt);
    totalDistance = 0;
    revealed = 0;
    render(0);
  } else {
    revealed = Math.min(revealable.length, toReveal);
    render(revealed);
  }
}

// Mouse support
document.addEventListener("mousemove", (e) => handleMovement(e.clientX, e.clientY), { passive: true });

// Touch support (tracks finger movement even without scroll)
let lastTouch = null;
document.addEventListener("touchstart", (e) => {
  const t = e.touches[0];
  if (t) {
    lastTouch = { x: t.clientX, y: t.clientY };
    handleMovement(t.clientX, t.clientY);
  }
}, { passive: true });

document.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  if (t) handleMovement(t.clientX, t.clientY);
}, { passive: true });

document.addEventListener("touchend", () => {
  lastTouch = null;
}, { passive: true });

// Initialize display
render(0);
