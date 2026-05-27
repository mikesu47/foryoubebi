/* index.js — Cute particle & sparkle effects */

// ─── FLOATING BG PARTICLES ───────────────────────────────────────────────────
const EMOJIS = ["🤎", "💖", "❤️‍🔥", "💗", "❤️", "🍁", "💮", "🔴", "🎀", "💕"];
const container = document.getElementById("bgParticles");

function spawnParticle() {
  const el = document.createElement("div");
  el.className = "particle";
  el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

  const leftPct = Math.random() * 100;
  const duration = 5 + Math.random() * 7;
  const delay = Math.random() * 4;
  const drift = (Math.random() - 0.5) * 120 + "px";
  const spin = Math.random() * 360 - 180 + "deg";
  const size = 0.6 + Math.random() * 0.9;

  el.style.cssText = `
    left: ${leftPct}%;
    font-size: ${14 + Math.random() * 14}px;
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
    --drift: ${drift};
    --spin: ${spin};
    transform: scale(${size});
  `;

  container.appendChild(el);
  setTimeout(() => el.remove(), (duration + delay) * 1000);
}

// Initial burst then steady trickle
for (let i = 0; i < 12; i++) spawnParticle();
setInterval(spawnParticle, 700);

// ─── SPARKLE CANVAS ───────────────────────────────────────────────────────────
const canvas = document.getElementById("sparkleCanvas");
const ctx = canvas.getContext("2d");
const sparks = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

class Spark {
  constructor(x, y) {
    this.x = x ?? Math.random() * canvas.width;
    this.y = y ?? Math.random() * canvas.height;
    this.r = 1.2 + Math.random() * 2.5;
    this.a = 1;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    this.color = ["#c47d3e", "#d4956a", "#e8d5b7", "#f5e8c8", "#9c4f1a"][
      Math.floor(Math.random() * 5)
    ];
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.a -= 0.018;
    this.r *= 0.98;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.a);
    ctx.beginPath();
    // Draw a 4-pointed star
    const s = this.r;
    ctx.moveTo(this.x, this.y - s * 2);
    ctx.lineTo(this.x + s * 0.5, this.y - s * 0.5);
    ctx.lineTo(this.x + s * 2, this.y);
    ctx.lineTo(this.x + s * 0.5, this.y + s * 0.5);
    ctx.lineTo(this.x, this.y + s * 2);
    ctx.lineTo(this.x - s * 0.5, this.y + s * 0.5);
    ctx.lineTo(this.x - s * 2, this.y);
    ctx.lineTo(this.x - s * 0.5, this.y - s * 0.5);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

// Ambient auto-sparkles
function autoSpawn() {
  if (Math.random() < 0.4) {
    sparks.push(new Spark());
  }
  setTimeout(autoSpawn, 120);
}
autoSpawn();

// Touch / click sparkle burst
function burst(x, y) {
  for (let i = 0; i < 10; i++) {
    const s = new Spark(x, y);
    s.vx = (Math.random() - 0.5) * 5;
    s.vy = (Math.random() - 0.5) * 5;
    sparks.push(s);
  }
}
window.addEventListener("click", (e) => burst(e.clientX, e.clientY));
window.addEventListener(
  "touchstart",
  (e) => {
    const t = e.touches[0];
    burst(t.clientX, t.clientY);
  },
  { passive: true },
);

// Animation loop
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = sparks.length - 1; i >= 0; i--) {
    sparks[i].update();
    sparks[i].draw();
    if (sparks[i].a <= 0) sparks.splice(i, 1);
  }
  requestAnimationFrame(loop);
}
loop();

// ─── BUTTON JIGGLE ON LOAD ────────────────────────────────────────────────────
const btn = document.getElementById("loveBtn");
if (btn) {
  setTimeout(() => {
    btn.style.transition = "transform 0.08s ease";
    const frames = [1.08, 0.95, 1.05, 0.98, 1];
    frames.forEach((scale, i) => {
      setTimeout(() => {
        btn.style.transform = `scale(${scale})`;
      }, i * 80);
    });
  }, 1200);
}
