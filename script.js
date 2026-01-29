(() => {
  const TG = "vremonte161";

  // Year
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  // Mobile menu
  const burger = document.getElementById("burger");
  const mnav = document.getElementById("mnav");
  const nav = document.getElementById("nav");

  function closeM() {
    if (!mnav || !burger) return;
    mnav.hidden = true;
    burger.setAttribute("aria-expanded", "false");
  }
  function toggleM() {
    if (!mnav || !burger) return;
    const open = !mnav.hidden;
    mnav.hidden = open;
    burger.setAttribute("aria-expanded", String(!open));
  }

  if (burger && mnav) {
    burger.addEventListener("click", toggleM);
    mnav.addEventListener("click", (e) => {
      const a = e.target.closest(".mnav__link");
      if (a) closeM();
    });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeM(); });
  }

  // Smooth scroll
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    closeM();
  });

  // Reveal
  const reveal = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) en.target.classList.add("in");
    });
  }, { threshold: 0.12 });
  reveal.forEach(el => io.observe(el));

  // FAQ accordion
  const faq = document.getElementById("faqList");
  if (faq) {
    faq.addEventListener("click", (e) => {
      const btn = e.target.closest(".qa__q");
      if (!btn) return;
      const box = btn.closest(".qa");
      if (!box) return;
      box.classList.toggle("open");
    });
  }

  // Photo modal
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modalImg");
  const modalClose = document.getElementById("modalClose");

  function openModal(src) {
    if (!modal || !modalImg) return;
    modalImg.src = src;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }
  function closeModal() {
    if (!modal || !modalImg) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    modalImg.src = "";
  }

  document.querySelectorAll("[data-photo]").forEach((b) => {
    b.addEventListener("click", () => openModal(b.getAttribute("data-photo")));
  });
  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  // Lead form -> Telegram share
  const form = document.getElementById("leadForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const device = String(fd.get("device") || "").trim();
      const issue = String(fd.get("issue") || "").trim();
      const urgent = String(fd.get("urgent") || "").trim();
      const contact = String(fd.get("contact") || "").trim();

      const lines = [
        "Здравствуйте! Заявка с сайта «В ремонте».",
        `Устройство: ${device}`,
        `Проблема: ${issue}`,
        `Срочность: ${urgent}`,
        `Контакт: ${contact || "не указали"}`,
        "Адрес: Ростов-на-Дону, ул. Ткачева, 22"
      ];
      const text = encodeURIComponent(lines.join("\n"));
      const url = `https://t.me/${TG}?text=${text}`;
      window.open(url, "_blank", "noopener,noreferrer");
      form.reset();
    });
  }

  // Quick templates -> Telegram
  const templates = {
    price: "Здравствуйте! Хочу узнать ориентировочную цену. Модель: ____. Проблема: ____.",
    time: "Здравствуйте! Подскажите по срокам ремонта. Модель: ____. Проблема: ____.",
    pickup: "Здравствуйте! Есть ли вариант забора/доставки? Устройство: ____. Адрес: ____.",
    water: "Здравствуйте! Техника была после воды. Устройство: ____. Что произошло: ____. Сколько прошло времени: ____."
  };

  document.querySelectorAll("[data-template]").forEach((b) => {
    b.addEventListener("click", () => {
      const key = b.getAttribute("data-template");
      const msg = templates[key] || "Здравствуйте!";
      const text = encodeURIComponent(msg);
      window.open(`https://t.me/${TG}?text=${text}`, "_blank", "noopener,noreferrer");
    });
  });

  // Service buttons -> Telegram with context
  const svcMap = {
    phone: "Здравствуйте! Нужен ремонт телефона. Модель: ____. Проблема: ____.",
    pc: "Здравствуйте! Нужен ремонт/обслуживание ПК или ноутбука. Модель: ____. Проблема: ____.",
    tv: "Здравствуйте! Нужен ремонт телевизора. Модель: ____. Проблема: ____.",
    ps: "Здравствуйте! Нужен ремонт приставки. Модель: ____. Проблема: ____.",
    coffee: "Здравствуйте! Нужен ремонт кофемашины. Модель: ____. Проблема: ____.",
    dyson: "Здравствуйте! Нужен ремонт Dyson/пылесоса. Модель: ____. Проблема: ____."
  };

  document.querySelectorAll("[data-service]").forEach((b) => {
    b.addEventListener("click", () => {
      const key = b.getAttribute("data-service");
      const msg = svcMap[key] || "Здравствуйте! Хочу узнать стоимость ремонта.";
      const text = encodeURIComponent(msg);
      window.open(`https://t.me/${TG}?text=${text}`, "_blank", "noopener,noreferrer");
    });
  });
})();
