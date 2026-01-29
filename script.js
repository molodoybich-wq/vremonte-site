// script.js

// 1) Плавная прокрутка по якорям (#find и т.п.)
document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const id = link.getAttribute("href");
  if (!id || id === "#") return;

  const target = document.querySelector(id);
  if (!target) return;

  e.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
});

// 2) Лёгкий "эффект" для верхней панели (чуть меняем фон при прокрутке)
const bar = document.querySelector(".cta-bar");
const onScroll = () => {
  if (!bar) return;
  const scrolled = window.scrollY > 10;
  bar.style.background = scrolled ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.75)";
};
window.addEventListener("scroll", onScroll);
onScroll();
