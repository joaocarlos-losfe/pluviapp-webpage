const themeToggles = document.querySelectorAll(".theme-toggle");
const body = document.body;

themeToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const currentTheme = body.getAttribute("data-theme");
    body.setAttribute(
      "data-theme",
      currentTheme === "light" ? "dark" : "light"
    );
    themeToggles.forEach((t) => {
      t.querySelector(".fa-moon").style.display =
        currentTheme === "light" ? "none" : "inline";
      t.querySelector(".fa-sun").style.display =
        currentTheme === "light" ? "inline" : "none";
    });
  });
});

const fullscreenButtons = document.querySelectorAll(".fullscreen-btn");
fullscreenButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const iframeId = button.getAttribute("data-iframe");
    const iframe = document.querySelector(
      `.metabase-iframe[src*="${
        iframeId === "iframe1" ? "precipitation" : "historical"
      }"]`
    );
    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) {
      iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) {
      iframe.msRequestFullscreen();
    }
  });
});

const hamburger = document.querySelector(".hamburger");
const mobileNav = document.querySelector(".mobile-nav");
const closeMenu = document.querySelector(".close-menu");

const toggleMenu = () => {
  const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
  hamburger.setAttribute("aria-expanded", !isExpanded);
  mobileNav.classList.toggle("active");
  hamburger.querySelector("i").classList.toggle("fa-bars");
  hamburger.querySelector("i").classList.toggle("fa-times");
};

hamburger.addEventListener("click", toggleMenu);
closeMenu.addEventListener("click", toggleMenu);

window.addEventListener("resize", () => {
  if (window.innerWidth >= 768 && mobileNav.classList.contains("active")) {
    mobileNav.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.querySelector("i").classList.remove("fa-times");
    hamburger.querySelector("i").classList.add("fa-bars");
  }
});

const canvas = document.querySelector(".hero-canvas");
const ctx = canvas.getContext("2d");
let width, height;

const resizeCanvas = () => {
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;
  canvas.width = width;
  canvas.height = height;
};

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Node {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.radius = window.innerWidth <= 768 ? 2 : 3;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < this.radius || this.x > width - this.radius) this.vx *= -1;
    if (this.y < this.radius || this.y > height - this.radius) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fill();
    ctx.closePath();
  }
}

const nodeCount = window.innerWidth <= 768 ? 8 : 10;
const nodes = Array.from({ length: nodeCount }, () => new Node());
const maxDistance = window.innerWidth <= 768 ? 120 : 150;

function animate() {
  ctx.clearRect(0, 0, width, height);

  nodes.forEach((node) => {
    node.update();
    node.draw();
  });

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / maxDistance})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
      }
    }
  }

  requestAnimationFrame(animate);
}

animate();
