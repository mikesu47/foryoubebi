// ─── FLOATING BG PARTICLES ───────────────────────────────────────────────────
const EMOJIS = ["🤎", "💖", "❤️‍🔥", "💗", "❤️", "🍁", "💮", "🔴", "🎀", "💕"];
const container = document.getElementById("bgParticles");

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
    --drift: ${(Math.random() - 0.5) * 120}px;
    --spin:  ${Math.random() * 360 - 180}deg;
    transform: scale(${0.6 + Math.random() * 0.9});
  `;

  container.appendChild(el);
  setTimeout(() => el.remove(), (duration + delay) * 1000);
}

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

function autoSpawn() {
  if (Math.random() < 0.4) sparks.push(new Spark());
  setTimeout(autoSpawn, 120);
}
autoSpawn();

function burst(x, y, count = 10) {
  for (let i = 0; i < count; i++) {
    const s = new Spark(x, y);
    s.vx = (Math.random() - 0.5) * 6;
    s.vy = (Math.random() - 0.5) * 6;
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

(function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = sparks.length - 1; i >= 0; i--) {
    sparks[i].update();
    sparks[i].draw();
    if (sparks[i].a <= 0) sparks.splice(i, 1);
  }
  requestAnimationFrame(loop);
})();

// ─── CLICK STATES ─────────────────────────────────────────────────────────────
const sureBtn = document.getElementById("sureBtn");
const btnText = document.getElementById("btnText");
const btnSub = document.getElementById("btnSub");
const caption = document.getElementById("imgCaption");
const polaroid = document.querySelector(".polaroid-wrapper");

const states = [
  { text: "SURE KA NA", sub: "BA??", caption: "sure ka na ba? 🤨" },
  { text: "TALAGA BA??", sub: "WEH?", caption: "pakisabi ulit... 👀" },
  { text: "YES? YES?", sub: "YESSSSSS?", caption: "sige na please 🤎" },
];

let clickCount = 0;

sureBtn.addEventListener("click", (e) => {
  e.preventDefault();
  clickCount++;

  // Big sparkle burst on every click
  const rect = sureBtn.getBoundingClientRect();
  burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);

  // Shake the photo
  polaroid.classList.remove("shake");
  void polaroid.offsetWidth; // reflow to restart animation
  polaroid.classList.add("shake");

  if (clickCount < states.length) {
    const s = states[clickCount];
    btnText.textContent = s.text;
    btnSub.textContent = s.sub;
    caption.textContent = s.caption;
    sureBtn.className = `click-me-btn state-${clickCount + 1}`;
  } else {
    window.location.href = "final.html";
  }
});
