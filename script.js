(() => {
  const TG = "vremonte161";
  const MAX_LINK = "https://max.ru/u/f9LHodD0cOLtKrUPwUO1eMRcfm0zwTD3C78xZc-I54h1b5NlXuetri89BNg";
  const WA_LINK  = "https://wa.me/message/BMMLIHWUSQRHC1";

  // Year
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  // Mobile menu
  const burger = document.getElementById("burger");
  const mnav = document.getElementById("mnav");
  function setMenu(open) {
    if (!burger || !mnav) return;
    mnav.hidden = !open;
    burger.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("no-scroll", open);
  }
  if (burger && mnav) {
    burger.addEventListener("click", () => setMenu(mnav.hidden));
    mnav.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.closest && t.closest("a")) setMenu(false);
    });
    window.addEventListener("resize", () => { if (window.innerWidth > 860) setMenu(false); });
  }

  // Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      setMenu(false);
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Reveal on scroll
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => en.isIntersecting && en.target.classList.add("in")),
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));

  // Image modal (если где-то есть data-photo)
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modalImg");
  const modalClose = document.getElementById("modalClose");

  function openImg(src, alt = "Фото") {
    if (!modal || !modalImg) return;
    modalImg.src = src;
    modalImg.alt = alt;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }
  function closeImg() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }
  document.querySelectorAll("[data-photo]").forEach((b) => {
    b.addEventListener("click", () => {
      const src = b.getAttribute("data-photo");
      const img = b.querySelector("img");
      openImg(src, img?.alt || "Фото");
    });
  });
  if (modalClose) modalClose.addEventListener("click", closeImg);
  if (modal) {
    modal.addEventListener("click", (e) => { if (e.target === modal) closeImg(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeImg(); });
  }

  // FAQ accordion
  document.querySelectorAll(".qa").forEach((qa) => {
    const q = qa.querySelector(".qa__q");
    const a = qa.querySelector(".qa__a");
    if (!q || !a) return;
    q.addEventListener("click", () => qa.classList.toggle("open"));
  });

  // Service / quick templates -> Telegram
  const templates = {
    price: "Здравствуйте! Хочу узнать стоимость ремонта. Устройство: ____. Проблема: ____.",
    courier: "Здравствуйте! Нужен курьер. Адрес забора: ____. Устройство: ____. Проблема: ____.",
    tv: "Здравствуйте! Нужен ремонт ТВ. Модель/диагональ: ____. Проблема: ____.",
    coffee: "Здравствуйте! Нужен ремонт кофемашины. Марка/модель: ____. Проблема: ____.",
    print: "Здравствуйте! Нужен ремонт принтера. Марка/модель: ____. Проблема: ____."
  };

  document.querySelectorAll("[data-template]").forEach((b) => {
    b.addEventListener("click", () => {
      const key = b.getAttribute("data-template");
      const msg = templates[key] || "Здравствуйте!";
      window.open(`https://t.me/${TG}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
    });
  });

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
      window.open(`https://t.me/${TG}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
    });
  });

  // Lead forms -> Telegram
  function bindLeadForm(id) {
    const form = document.getElementById(id);
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const device = String(fd.get("device") || "").trim();
      const issue = String(fd.get("issue") || "").trim();
      const urgent = String(fd.get("urgent") || "").trim();
      const contact = String(fd.get("contact") || "").trim();

      const lines = [
        "Здравствуйте! Заявка с сайта «В ремонте».",
        `Устройство: ${device || "—"}`,
        `Проблема: ${issue || "—"}`
      ];
      if (urgent) lines.push(`Срочность: ${urgent}`);
      lines.push(`Контакт: ${contact || "не указали"}`);

      window.open(`https://t.me/${TG}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener,noreferrer");
      form.reset();
    });
  }
  bindLeadForm("leadForm");
  bindLeadForm("leadForm2");

  // Send to MAX / WhatsApp (без модалок)
  document.querySelectorAll("#sendMax").forEach((btn) => {
    btn.addEventListener("click", () => window.open(MAX_LINK, "_blank", "noopener,noreferrer"));
  });
  document.querySelectorAll('[data-send="wa"]').forEach((btn) => {
    btn.addEventListener("click", () => window.open(WA_LINK, "_blank", "noopener,noreferrer"));
  });

  // ToTop button
  const toTop = document.getElementById("toTop");
  if (toTop) {
    const onScroll = () => {
      if (window.scrollY > 600) toTop.classList.add("show");
      else toTop.classList.remove("show");
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // Cookie banner (не перекрывает клики)
  const banner = document.getElementById("cookieBanner");
  const accept = document.getElementById("cookieAccept");
  const close = document.getElementById("cookieClose");
  const KEY = "vr_cookie_ok_v1";

  function hideCookie() {
    if (!banner) return;
    banner.classList.remove("show");
    setTimeout(() => (banner.hidden = true), 150);
  }
  function showCookie() {
    if (!banner) return;
    banner.hidden = false;
    requestAnimationFrame(() => banner.classList.add("show"));
  }

  if (banner) {
    const ok = localStorage.getItem(KEY) === "1";
    if (!ok) showCookie(); else banner.hidden = true;

    accept?.addEventListener("click", () => {
      localStorage.setItem(KEY, "1");
      hideCookie();
    });
    close?.addEventListener("click", hideCookie);
  }

  // Nav popovers
  const navpop = document.getElementById("navpop");
  const navpopContent = document.getElementById("navpopContent");
  const popData = {
    services: {
      title: "Услуги",
      text: "Ремонтируем любую технику: телефоны, ПК и ноутбуки, ТВ, кофемашины, принтеры, Dyson и другое.",
      cta: { label: "Написать в Telegram", href: `https://t.me/${TG}` }
    },
    reviews: {
      title: "Отзывы",
      text: "Посмотрите реальные отзывы клиентов на Яндекс и 2ГИС — там всё по‑честному.",
      cta: { label: "Открыть отзывы", href: "#reviews" }
    },
    contacts: {
      title: "Контакты",
      text: "Адреса: Ткачёва 22 и Заводская 25. Можно написать в Telegram, WhatsApp или MAX.",
      cta: { label: "Написать в Telegram", href: `https://t.me/${TG}` }
    }
  };

  function showNavPop(key, anchorEl) {
    if (!navpop || !navpopContent) return;
    const d = popData[key];
    if (!d) return;

    navpopContent.innerHTML = `
      <div class="navpop__title">${d.title}</div>
      <div class="navpop__text">${d.text}</div>
      <div class="navpop__actions">
        <a class="btn btn--small" href="${d.cta.href}" ${d.cta.href.startsWith("#") ? "" : 'target="_blank" rel="noopener"'}>${d.cta.label}</a>
        <button class="btn btn--soft btn--small" type="button" id="navpopClose">Закрыть</button>
      </div>
    `;

    const rect = anchorEl.getBoundingClientRect();
    navpop.style.left = Math.max(16, Math.min(rect.left, window.innerWidth - 320)) + "px";
    navpop.style.top = rect.bottom + 10 + window.scrollY + "px";
    navpop.hidden = false;

    navpopContent.querySelector("#navpopClose")?.addEventListener("click", () => (navpop.hidden = true));
  }

  document.querySelectorAll("a[data-pop]").forEach((a) => {
    a.addEventListener("click", (e) => {
      const key = a.getAttribute("data-pop");
      if (window.innerWidth > 860) {
        if (!navpop?.hidden) { navpop.hidden = true; return; }
        e.preventDefault();
        showNavPop(key, a);
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!navpop || navpop.hidden) return;
    if (e.target.closest("#navpop")) return;
    if (e.target.closest("a[data-pop]")) return;
    navpop.hidden = true;
  });
})();
