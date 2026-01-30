(() => {
  const TG = "vremonte161";

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
  }

  if (burger && mnav) {
    burger.addEventListener("click", () => setMenu(mnav.hidden));
    mnav.addEventListener("click", (e) => {
      if (e.target.closest(".mnav__link")) setMenu(false);
    });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  }

  // Smooth anchors
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenu(false);
  });

  // Reveal animation
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
  if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  // Telegram templates
  const templates = {
    price: "Здравствуйте! Хочу узнать ориентировочную цену. Модель: ____. Проблема: ____.",
    time: "Здравствуйте! Подскажите по срокам ремонта. Модель: ____. Проблема: ____.",
    pickup: "Здравствуйте! Подскажите по курьеру/доставке. Устройство: ____. Район: ____.",
    water: "Здравствуйте! Нужен ремонт техники (телефоны/ПК/ноутбуки/ТВ/кофемашины/принтеры/Dyson). Устройство: ____. Что сломалось: ____. Удобно связаться: телефон/Telegram/MAX.",
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

  // Service templates
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
        `Устройство: ${device}`,
        `Проблема: ${issue}`,
      ];

      if (urgent) lines.push(`Срочность: ${urgent}`);
      lines.push(`Контакт: ${contact || "не указали"}`);
      lines.push("Адреса: Ткачева 22 / Заводская 25");

      const url = `https://t.me/${TG}?text=${encodeURIComponent(lines.join("\n"))}`;
      window.open(url, "_blank", "noopener,noreferrer");
      form.reset();
    });
  }
  bindLeadForm("leadForm");
  bindLeadForm("leadForm2");

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

  // MAX modal (копирование текста заявки)
  const maxModal = document.getElementById("maxModal");
  const maxText = document.getElementById("maxText");
  const maxClose = document.getElementById("maxClose");
  const maxCopy = document.getElementById("maxCopy");
  const maxOpen = document.getElementById("maxOpen");
  const maxOpenM = document.getElementById("maxOpenM");
  const sendMaxBtns = document.querySelectorAll("#sendMax");

  function openMaxModal(message){
    if (!maxModal || !maxText) return;
    maxText.value = message || "Здравствуйте! Хочу оставить заявку на ремонт. Устройство: ____. Проблема: ____.";
    maxModal.classList.add("open");
    maxModal.setAttribute("aria-hidden","false");
  }
  function closeMaxModal(){
    if (!maxModal) return;
    maxModal.classList.remove("open");
    maxModal.setAttribute("aria-hidden","true");
  }

  function buildLeadMessage(){
    const device = document.getElementById("leadDevice")?.value?.trim() || "";
    const problem = document.getElementById("leadProblem")?.value?.trim() || "";
    const urgency = document.getElementById("leadUrgency")?.value || "";
    const contact = document.getElementById("leadContact")?.value?.trim() || "";
    let msg = "Здравствуйте! Хочу оставить заявку на ремонт.";
    if (device) msg += `\nУстройство: ${device}`;
    if (problem) msg += `\nПроблема: ${problem}`;
    if (urgency) msg += `\nСрочность: ${urgency}`;
    if (contact) msg += `\nКонтакт: ${contact}`;
    msg += "\n\n(Можно ответить сюда в MAX или позвонить.)";
    return msg;
  }

  [maxOpen, maxOpenM].filter(Boolean).forEach((btn)=>{
    btn.addEventListener("click", ()=> openMaxModal(buildLeadMessage()));
  });
  sendMaxBtns.forEach((btn)=>{
    btn.addEventListener("click", ()=> openMaxModal(buildLeadMessage()));
  });

  if (maxClose) maxClose.addEventListener("click", closeMaxModal);
  if (maxModal) {
    maxModal.addEventListener("click", (e)=>{ if (e.target === maxModal) closeMaxModal(); });
    document.addEventListener("keydown", (e)=>{ if(e.key==="Escape") closeMaxModal(); });
  }
  if (maxCopy) {
    maxCopy.addEventListener("click", async ()=>{
      try{
        await navigator.clipboard.writeText(maxText?.value || "");
        maxCopy.textContent = "Скопировано ✅";
        setTimeout(()=> maxCopy.textContent="Скопировать текст", 1200);
      }catch(_){
        maxText?.select();
        document.execCommand("copy");
      }
    });
  }

  // Nav popovers (инфо по пунктам меню)
  const navpop = document.getElementById("navpop");
  const navpopContent = document.getElementById("navpopContent");

  const popData = {
    services: {
      title: "Услуги",
      text: "Ремонтируем любую технику: телефоны, ПК и ноутбуки, ТВ, кофемашины, принтеры, Dyson и другое.",
      cta: { label: "Написать в Telegram", href: "https://t.me/vremonte161" }
    },
    reviews: {
      title: "Отзывы",
      text: "Посмотрите реальные отзывы клиентов на Яндекс и 2ГИС — там всё по-честному.",
      cta: { label: "Открыть отзывы", href: "#reviews" }
    },
    contacts: {
      title: "Контакты",
      text: "Два адреса в Ростове-на-Дону. Главный цех — Заводская 25. Можно написать в Telegram или MAX.",
      cta: { label: "Написать в Telegram", href: "https://t.me/vremonte161" }
    }
  };

  function showNavPop(key, anchorEl){
    if(!navpop || !navpopContent) return;
    const d = popData[key];
    if(!d) return;
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
    navpop.style.top = (rect.bottom + 10 + window.scrollY) + "px";
    navpop.hidden = false;

    navpopContent.querySelector("#navpopClose")?.addEventListener("click", ()=> navpop.hidden = true);
  }

  document.querySelectorAll('a[data-pop]').forEach((a)=>{
    a.addEventListener("click", (e)=>{
      const key = a.getAttribute("data-pop");
      if(window.innerWidth > 860){ // desktop: show popover, allow scroll on second click
        if(!navpop?.hidden){
          navpop.hidden = true;
          return; // next click will navigate
        }
        e.preventDefault();
        showNavPop(key, a);
      }
    });
  });
  document.addEventListener("click",(e)=>{
    if(!navpop || navpop.hidden) return;
    if(e.target.closest("#navpop")) return;
    if(e.target.closest("a[data-pop]")) return;
    navpop.hidden = true;
  });


})();


// Cookie banner
(function(){
  const banner = document.getElementById('cookieBanner');
  if(!banner) return;

  const accept = document.getElementById('cookieAccept');
  const closeBtn = document.getElementById('cookieClose');

  const key = 'vremonte_cookie_accepted';
  const accepted = localStorage.getItem(key);

  if(!accepted){
    banner.classList.add('is-visible');
  }

  function hide(){
    banner.classList.remove('is-visible');
  }

  accept && accept.addEventListener('click', () => {
    localStorage.setItem(key, 'true');
    hide();
  });

  closeBtn && closeBtn.addEventListener('click', hide);

  // MAX modal (копирование текста заявки)
  const maxModal = document.getElementById("maxModal");
  const maxText = document.getElementById("maxText");
  const maxClose = document.getElementById("maxClose");
  const maxCopy = document.getElementById("maxCopy");
  const maxOpen = document.getElementById("maxOpen");
  const maxOpenM = document.getElementById("maxOpenM");
  const sendMaxBtns = document.querySelectorAll("#sendMax");

  function openMaxModal(message){
    if (!maxModal || !maxText) return;
    maxText.value = message || "Здравствуйте! Хочу оставить заявку на ремонт. Устройство: ____. Проблема: ____.";
    maxModal.classList.add("open");
    maxModal.setAttribute("aria-hidden","false");
  }
  function closeMaxModal(){
    if (!maxModal) return;
    maxModal.classList.remove("open");
    maxModal.setAttribute("aria-hidden","true");
  }

  function buildLeadMessage(){
    const device = document.getElementById("leadDevice")?.value?.trim() || "";
    const problem = document.getElementById("leadProblem")?.value?.trim() || "";
    const urgency = document.getElementById("leadUrgency")?.value || "";
    const contact = document.getElementById("leadContact")?.value?.trim() || "";
    let msg = "Здравствуйте! Хочу оставить заявку на ремонт.";
    if (device) msg += `\nУстройство: ${device}`;
    if (problem) msg += `\nПроблема: ${problem}`;
    if (urgency) msg += `\nСрочность: ${urgency}`;
    if (contact) msg += `\nКонтакт: ${contact}`;
    msg += "\n\n(Можно ответить сюда в MAX или позвонить.)";
    return msg;
  }

  [maxOpen, maxOpenM].filter(Boolean).forEach((btn)=>{
    btn.addEventListener("click", ()=> openMaxModal(buildLeadMessage()));
  });
  sendMaxBtns.forEach((btn)=>{
    btn.addEventListener("click", ()=> openMaxModal(buildLeadMessage()));
  });

  if (maxClose) maxClose.addEventListener("click", closeMaxModal);
  if (maxModal) {
    maxModal.addEventListener("click", (e)=>{ if (e.target === maxModal) closeMaxModal(); });
    document.addEventListener("keydown", (e)=>{ if(e.key==="Escape") closeMaxModal(); });
  }
  if (maxCopy) {
    maxCopy.addEventListener("click", async ()=>{
      try{
        await navigator.clipboard.writeText(maxText?.value || "");
        maxCopy.textContent = "Скопировано ✅";
        setTimeout(()=> maxCopy.textContent="Скопировать текст", 1200);
      }catch(_){
        maxText?.select();
        document.execCommand("copy");
      }
    });
  }

  // Nav popovers (инфо по пунктам меню)
  const navpop = document.getElementById("navpop");
  const navpopContent = document.getElementById("navpopContent");

  const popData = {
    services: {
      title: "Услуги",
      text: "Ремонтируем любую технику: телефоны, ПК и ноутбуки, ТВ, кофемашины, принтеры, Dyson и другое.",
      cta: { label: "Написать в Telegram", href: "https://t.me/vremonte161" }
    },
    reviews: {
      title: "Отзывы",
      text: "Посмотрите реальные отзывы клиентов на Яндекс и 2ГИС — там всё по-честному.",
      cta: { label: "Открыть отзывы", href: "#reviews" }
    },
    contacts: {
      title: "Контакты",
      text: "Два адреса в Ростове-на-Дону. Главный цех — Заводская 25. Можно написать в Telegram или MAX.",
      cta: { label: "Написать в Telegram", href: "https://t.me/vremonte161" }
    }
  };

  function showNavPop(key, anchorEl){
    if(!navpop || !navpopContent) return;
    const d = popData[key];
    if(!d) return;
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
    navpop.style.top = (rect.bottom + 10 + window.scrollY) + "px";
    navpop.hidden = false;

    navpopContent.querySelector("#navpopClose")?.addEventListener("click", ()=> navpop.hidden = true);
  }

  document.querySelectorAll('a[data-pop]').forEach((a)=>{
    a.addEventListener("click", (e)=>{
      const key = a.getAttribute("data-pop");
      if(window.innerWidth > 860){ // desktop: show popover, allow scroll on second click
        if(!navpop?.hidden){
          navpop.hidden = true;
          return; // next click will navigate
        }
        e.preventDefault();
        showNavPop(key, a);
      }
    });
  });
  document.addEventListener("click",(e)=>{
    if(!navpop || navpop.hidden) return;
    if(e.target.closest("#navpop")) return;
    if(e.target.closest("a[data-pop]")) return;
    navpop.hidden = true;
  });


})();
