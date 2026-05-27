// ─── FLOATING BG PARTICLES ────────────────────────────────────────────────────
const EMOJIS = ["🤎", "💖", "❤️‍🔥", "💗", "❤️", "🍁", "💮", "🔴", "🎀", "💕"];
const bgLayer = document.getElementById("bgParticles");

function spawnParticle() {
  const el = document.createElement("div");
  el.className = "particle";
  el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

  const duration = 5 + Math.random() * 7;
  const delay = Math.random() * 4;
  el.style.cssText = `
    left: ${Math.random() * 100}%;
    font-size: ${14 + Math.random() * 14}px;
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
    --drift: ${(Math.random() - 0.5) * 130}px;
    --spin:  ${Math.random() * 360 - 180}deg;
  `;
  bgLayer.appendChild(el);
  setTimeout(() => el.remove(), (duration + delay) * 1000);
}
for (let i = 0; i < 14; i++) spawnParticle();
setInterval(spawnParticle, 650);

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
  constructor(x, y, big = false) {
    this.x = x ?? Math.random() * canvas.width;
    this.y = y ?? Math.random() * canvas.height;
    this.r = (big ? 2.5 : 1.2) + Math.random() * (big ? 3 : 2);
    this.a = 1;
    this.vx = (Math.random() - 0.5) * (big ? 4 : 1.5);
    this.vy = (Math.random() - 0.5) * (big ? 4 : 1.5);
    this.color = [
      "#c47d3e",
      "#d4956a",
      "#e8d5b7",
      "#f5e8c8",
      "#9c4f1a",
      "#fdf0d5",
    ][Math.floor(Math.random() * 6)];
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.a -= 0.016;
    this.r *= 0.98;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.a);
    const s = this.r;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - s * 2.2);
    ctx.lineTo(this.x + s * 0.5, this.y - s * 0.5);
    ctx.lineTo(this.x + s * 2.2, this.y);
    ctx.lineTo(this.x + s * 0.5, this.y + s * 0.5);
    ctx.lineTo(this.x, this.y + s * 2.2);
    ctx.lineTo(this.x - s * 0.5, this.y + s * 0.5);
    ctx.lineTo(this.x - s * 2.2, this.y);
    ctx.lineTo(this.x - s * 0.5, this.y - s * 0.5);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

function burst(x, y, count = 12, big = false) {
  for (let i = 0; i < count; i++) sparks.push(new Spark(x, y, big));
}

// Ambient auto-sparkles
(function autoSpawn() {
  if (Math.random() < 0.5) sparks.push(new Spark());
  setTimeout(autoSpawn, 100);
})();

window.addEventListener("click", (e) => burst(e.clientX, e.clientY, 14, true));
window.addEventListener(
  "touchstart",
  (e) => {
    const t = e.touches[0];
    burst(t.clientX, t.clientY, 14, true);
  },
  { passive: true },
);

(function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = sparks.length - 1; i >= 0; i--) {
    sparks[i].update();
    sparks[i].draw();
    if (sparks[i].a <= 0) sparks.splice(i, 1);
  }
  requestAnimationFrame(loop);
})();

// ─── CONFETTI BURST ON LOAD ───────────────────────────────────────────────────
const confettiLayer = document.getElementById("confettiLayer");
const CONFETTI_ICONS = [
  "🤎",
  "💖",
  "❤️‍🔥",
  "💗",
  "❤️",
  "🍁",
  "💮",
  "🔴",
  "🎀",
  "💕",
];

function spawnConfetti() {
  const total = 60;
  for (let i = 0; i < total; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.className = "confetti-piece";
      el.textContent =
        CONFETTI_ICONS[Math.floor(Math.random() * CONFETTI_ICONS.length)];

      const duration = 2 + Math.random() * 2.5;
      const spin = Math.random() * 720 - 360;
      el.style.cssText = `
        left: ${Math.random() * 100}vw;
        font-size: ${16 + Math.random() * 18}px;
        animation-duration: ${duration}s;
        animation-delay: 0s;
        --spin: ${spin}deg;
      `;
      confettiLayer.appendChild(el);
      setTimeout(() => el.remove(), (duration + 0.5) * 1000);
    }, i * 55);
  }
}

// Fire confetti right away
spawnConfetti();

// Second wave after 2s for extra drama
setTimeout(spawnConfetti, 2000);

// Big sparkle burst from bouquet center on load
window.addEventListener("load", () => {
  const img = document.getElementById("bouquetImg");
  if (img) {
    const rect = img.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setTimeout(() => burst(cx, cy, 30, true), 400);
    setTimeout(() => burst(cx, cy, 20, true), 900);
  }

  // Switch bouquet from entrance to float
  const wrapper = document.querySelector(".bouquet-wrapper");
  setTimeout(() => {
    wrapper.classList.add("float-active");
  }, 1200);
});

// ─── MOBILE BACK BUTTON INTERCEPTION & RESET LOGIC ───────────────────────────
history.pushState(null, document.title, location.href);

window.addEventListener("popstate", function (event) {
  localStorage.setItem("forceResetIndex", "true");

  history.pushState(null, document.title, location.href);

  window.location.replace("about:blank");
});
if (!sessionStorage.getItem("allowedOnFinalPage")) {
  window.location.replace("index.html");
}
