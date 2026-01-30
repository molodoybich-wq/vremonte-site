(() => {
  // Mark that JS is enabled (prevents content being hidden if JS fails)
  document.documentElement.classList.add('js');

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
  if (!reveal.length) {
    // no-op
  } else if (!("IntersectionObserver" in window)) {
    // Fallback: show everything if observer is not supported
    reveal.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) en.target.classList.add("in");
      });
    }, { threshold: 0.12 });
    reveal.forEach(el => io.observe(el));
  }

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

  
  // =========================
  // Messaging + UI modals
  // =========================
  const LINKS = {
    tgUser: "vremonte161",
    tg: "https://t.me/vremonte161",
    wa: "https://wa.me/message/BMMLIHWUSQRHC1",
    max: "https://max.ru/u/f9LHodD0cOLtKrUPwUO1eMRcfm0zwTD3C78xZc-I54h1b5NlXuetri89BNg",
  };

  const uiModal = document.getElementById("uiModal");
  const uiModalContent = document.getElementById("uiModalContent");

  function openUiModal(html){
    if (!uiModal || !uiModalContent) return;
    uiModalContent.innerHTML = html;
    uiModal.classList.add("open");
    uiModal.setAttribute("aria-hidden","false");
    document.body.classList.add("modal-open");
  }
  function closeUiModal(){
    if (!uiModal) return;
    uiModal.classList.remove("open");
    uiModal.setAttribute("aria-hidden","true");
    document.body.classList.remove("modal-open");
  }
  if (uiModal){
    uiModal.addEventListener("click", (e)=>{
      const t = e.target;
      if (t && (t.dataset.close === "1")) closeUiModal();
    });
    document.addEventListener("keydown", (e)=>{
      if (e.key === "Escape" && uiModal.classList.contains("open")) closeUiModal();
    });
  }

  async function copyToClipboard(text){
    try{
      await navigator.clipboard.writeText(text);
      return true;
    }catch(_){
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try{ document.execCommand("copy"); }catch(_2){}
      ta.remove();
      return true;
    }
  }

  function openTelegramWithText(text){
    const url = `${LINKS.tg}?text=${encodeURIComponent(text || "")}`;
    window.open(url, "_blank", "noopener");
  }
  async function openWhatsAppWithText(text){
    if (text) await copyToClipboard(text);
    window.open(LINKS.wa, "_blank", "noopener");
  }
  async function openMaxWithText(text){
    if (text) await copyToClipboard(text);
    window.open(LINKS.max, "_blank", "noopener");
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
    msg += "\n\nОтправлено с сайта vremonte61.online";
    return msg;
  }

  // Lead form → Telegram
  const leadForm = document.getElementById("leadForm");
  if (leadForm){
    leadForm.addEventListener("submit", (e)=>{
      e.preventDefault();
      const msg = buildLeadMessage();
      openTelegramWithText(msg);
    });
  }

  // WhatsApp / MAX buttons in lead form
  const sendWhatsApp = document.getElementById("sendWhatsApp");
  if (sendWhatsApp){
    sendWhatsApp.addEventListener("click", ()=>{
      const msg = buildLeadMessage();
      openWhatsAppWithText(msg);
    });
  }
  const sendMax = document.getElementById("sendMax");
  if (sendMax){
    sendMax.addEventListener("click", ()=>{
      const msg = buildLeadMessage();
      openMaxWithText(msg);
    });
  }

  // =========================
  // Templates / chips actions
  // =========================
  const templates = {
    price: "Здравствуйте! Хочу узнать ориентировочную стоимость ремонта.\nКатегория: ____\nМарка/модель: ____\nПроблема: ____\n\nОтправлено с сайта vremonte61.online",
    tv: "Здравствуйте! Нужен ремонт ТВ.\nМарка/модель: ____\nДиагональ: ____\nПроблема: ____\n\nОтправлено с сайта vremonte61.online",
    coffee: "Здравствуйте! Нужен ремонт кофемашины.\nМарка/модель: ____\nПроблема/ошибка: ____\n\nОтправлено с сайта vremonte61.online",
    print: "Здравствуйте! Нужен ремонт принтера.\nМарка/модель: ____\nПроблема: ____\n\nОтправлено с сайта vremonte61.online"
  };

  function openTimeInfo(){
    openUiModal(`
      <h3>Срок ремонта</h3>
      <p class="muted">Срок зависит от модели, сложности неисправности и наличия запчастей.</p>
      <ul class="ul">
        <li><b>Типовые работы</b> (разъём, чистка, простые замены) — часто в день обращения.</li>
        <li><b>Средняя сложность</b> — обычно 1–3 дня.</li>
        <li><b>Сложный ремонт / плата</b> или редкие запчасти — дольше, согласуем после диагностики.</li>
      </ul>
      <div class="actions">
        <button class="btn btn--primary" type="button" id="timeToTG">Написать в Telegram</button>
        <button class="btn btn--soft" type="button" id="timeToWA">WhatsApp</button>
        <button class="btn btn--soft" type="button" id="timeToMAX">MAX</button>
      </div>
    `);
    setTimeout(()=>{
      document.getElementById("timeToTG")?.addEventListener("click", ()=> openTelegramWithText("Здравствуйте! Подскажите, пожалуйста, по срокам ремонта. Устройство: ____. Проблема: ____."));
      document.getElementById("timeToWA")?.addEventListener("click", ()=> openWhatsAppWithText("Здравствуйте! Подскажите, пожалуйста, по срокам ремонта. Устройство: ____. Проблема: ____."));
      document.getElementById("timeToMAX")?.addEventListener("click", ()=> openMaxWithText("Здравствуйте! Подскажите, пожалуйста, по срокам ремонта. Устройство: ____. Проблема: ____."));
    }, 0);
  }

  function openCourierForm(){
    openUiModal(`
      <h3>Курьер / доставка</h3>
      <p class="muted">Заполните форму — сформируем сообщение, и вы отправите его удобным мессенджером.</p>
      <div class="grid2">
        <label class="field">
          <span>Адрес (откуда забрать)</span>
          <input id="cAddr" placeholder="Ростов-на-Дону, улица, дом, подъезд">
        </label>
        <label class="field">
          <span>Когда удобно</span>
          <input id="cWhen" placeholder="Сегодня после 18:00 / завтра 12–15">
        </label>
        <label class="field">
          <span>Устройство</span>
          <input id="cDev" placeholder="Телефон / ТВ / ноутбук / кофемашина">
        </label>
        <label class="field">
          <span>Контакт</span>
          <input id="cContact" placeholder="+7... или @telegram">
        </label>
      </div>
      <label class="field" style="margin-top:12px">
        <span>Что случилось</span>
        <textarea id="cIssue" placeholder="Кратко опишите проблему"></textarea>
      </label>
      <div class="actions">
        <button class="btn btn--primary" type="button" id="cSendTG">Отправить в Telegram</button>
        <button class="btn btn--soft" type="button" id="cSendWA">Отправить в WhatsApp</button>
        <button class="btn btn--soft" type="button" id="cSendMAX">Отправить в MAX</button>
      </div>
      <div class="muted" style="margin-top:10px; font-size:13px">Подсказка: для WhatsApp/MAX текст будет скопирован в буфер обмена и откроется чат.</div>
    `);

    const build = ()=>{
      const addr = document.getElementById("cAddr")?.value?.trim() || "";
      const when = document.getElementById("cWhen")?.value?.trim() || "";
      const dev = document.getElementById("cDev")?.value?.trim() || "";
      const contact = document.getElementById("cContact")?.value?.trim() || "";
      const issue = document.getElementById("cIssue")?.value?.trim() || "";
      let msg = "Здравствуйте! Хочу оформить курьер / доставку.\n";
      if (addr) msg += `Адрес: ${addr}\n`;
      if (when) msg += `Когда удобно: ${when}\n`;
      if (dev) msg += `Устройство: ${dev}\n`;
      if (issue) msg += `Проблема: ${issue}\n`;
      if (contact) msg += `Контакт: ${contact}\n`;
      msg += "\nОтправлено с сайта vremonte61.online";
      return msg;
    };

    setTimeout(()=>{
      document.getElementById("cSendTG")?.addEventListener("click", ()=> openTelegramWithText(build()));
      document.getElementById("cSendWA")?.addEventListener("click", ()=> openWhatsAppWithText(build()));
      document.getElementById("cSendMAX")?.addEventListener("click", ()=> openMaxWithText(build()));
    }, 0);
  }

  // Simple "What we repair" selector (brands + model input)
  const REPAIR = {
    phone: { title:"Смартфоны", groups:[
      {name:"Apple (iPhone)", items:["iPhone 8","iPhone X/XS/XR","iPhone 11","iPhone 12","iPhone 13","iPhone 14","iPhone 15","iPhone 16","iPhone 17"]},
      {name:"Android", items:["Samsung","Xiaomi","Redmi","POCO","Honor","Huawei","Realme","OPPO","Vivo","OnePlus","Tecno","Infinix","Google Pixel","Другое Android"]},
    ]},
    pc: { title:"ПК / ноутбуки", groups:[
      {name:"Ноутбуки", items:["Lenovo","HP","ASUS","Acer","Dell","MSI","Apple MacBook","Huawei","Xiaomi","Другое"]},
      {name:"ПК", items:["Сборка/апгрейд","SSD/Windows","BIOS/UEFI","Питание/разъёмы"]},
    ]},
    tv: { title:"Телевизоры", groups:[
      {name:"Бренды", items:["Samsung","LG","Sony","Philips","Xiaomi","TCL","Haier","Hisense","BBK","DEXP","Другое"]},
    ]},
    coffee: { title:"Кофемашины", groups:[
      {name:"Бренды", items:["De'Longhi","Philips","Saeco","Jura","Krups","Bosch","Siemens","Nivona","Melitta","Другое"]},
    ]},
    printer: { title:"Принтеры", groups:[
      {name:"Бренды", items:["HP","Canon","Epson","Brother","Kyocera","Xerox","Samsung","Ricoh","Другое"]},
    ]},
    dyson: { title:"Dyson / бытовая", groups:[
      {name:"Направления", items:["Пылесосы Dyson","Фены/стайлеры Dyson","Очистители воздуха Dyson","Другая бытовая техника"]},
    ]},
    console: { title:"Приставки", groups:[
      {name:"PlayStation", items:["PS4","PS4 Pro","PS5"]},
      {name:"Xbox / Nintendo", items:["Xbox One","Xbox Series","Nintendo Switch"]},
    ]},
    tablet: { title:"Планшеты", groups:[
      {name:"Бренды", items:["iPad","Samsung","Xiaomi","Huawei","Lenovo","Другое"]},
    ]},
  };

  function openRepairSelector(presetKey){
    const keys = ["phone","tv","coffee","printer","pc","dyson","console","tablet"];
    const current = (presetKey && keys.includes(presetKey)) ? presetKey : "phone";

    const tabs = keys.map(k=>`<button class="chip ${k===current?'chip--alt':''}" data-r-tab="${k}">${REPAIR[k].title}</button>`).join("");
    const body = (k)=>{
      const g = REPAIR[k].groups.map(gr=>{
        const items = gr.items.map(it=>`<button class="chip" data-r-item="${it}">${it}</button>`).join("");
        return `<div style="margin-top:10px">
          <div style="font-weight:800; margin-bottom:8px">${gr.name}</div>
          <div class="chips">${items}</div>
        </div>`;
      }).join("");
      return `
        <label class="field" style="margin-top:12px">
          <span>Модель (если знаете)</span>
          <input id="rModel" placeholder="Напр.: iPhone 13 / Samsung A52 / LG 55UJ">
        </label>
        <label class="field" style="margin-top:12px">
          <span>Проблема</span>
          <input id="rIssue" placeholder="Не включается / нет изображения / не заряжается">
        </label>
        <div class="muted" style="margin-top:10px">Выберите бренд/тип выше — мы подскажем стоимость и сроки.</div>
        ${g}
        <div class="actions">
          <button class="btn btn--primary" type="button" id="rSendTG">Отправить в Telegram</button>
          <button class="btn btn--soft" type="button" id="rSendWA">WhatsApp</button>
          <button class="btn btn--soft" type="button" id="rSendMAX">MAX</button>
        </div>`;
    };

    openUiModal(`
      <h3>Что ремонтируем</h3>
      <p class="muted">Выберите категорию и бренд — сформируем заявку.</p>
      <div class="chips" id="rTabs">${tabs}</div>
      <div id="rBody">${body(current)}</div>
      <div class="muted" style="margin-top:10px; font-size:13px">Для WhatsApp/MAX текст будет скопирован в буфер обмена и откроется чат.</div>
    `);

    let selected = { cat: current, item:"" };

    const rebuild = (k)=>{
      selected = { cat:k, item:"" };
      const tabsEl = document.getElementById("rTabs");
      if (tabsEl){
        [...tabsEl.querySelectorAll("button[data-r-tab]")].forEach(b=>{
          b.classList.toggle("chip--alt", b.dataset.rTab===k);
        });
      }
      const bodyEl = document.getElementById("rBody");
      if (bodyEl) bodyEl.innerHTML = body(k);
      bindBody();
    };

    const buildMsg = ()=>{
      const model = document.getElementById("rModel")?.value?.trim() || "";
      const issue = document.getElementById("rIssue")?.value?.trim() || "";
      let msg = "Здравствуйте! Хочу узнать стоимость/сроки ремонта.\n";
      msg += `Категория: ${REPAIR[selected.cat].title}\n`;
      if (selected.item) msg += `Бренд/тип: ${selected.item}\n`;
      if (model) msg += `Модель: ${model}\n`;
      if (issue) msg += `Проблема: ${issue}\n`;
      msg += "\nОтправлено с сайта vremonte61.online";
      return msg;
    };

    const bindBody = ()=>{
      // item buttons
      document.querySelectorAll('[data-r-item]').forEach(btn=>{
        btn.addEventListener("click", ()=>{
          selected.item = btn.dataset.rItem || "";
          // visual
          document.querySelectorAll('[data-r-item]').forEach(b=>b.classList.remove("chip--alt"));
          btn.classList.add("chip--alt");
        });
      });
      document.getElementById("rSendTG")?.addEventListener("click", ()=> openTelegramWithText(buildMsg()));
      document.getElementById("rSendWA")?.addEventListener("click", ()=> openWhatsAppWithText(buildMsg()));
      document.getElementById("rSendMAX")?.addEventListener("click", ()=> openMaxWithText(buildMsg()));
    };

    // tab clicks
    document.querySelectorAll('[data-r-tab]').forEach(btn=>{
      btn.addEventListener("click", ()=> rebuild(btn.dataset.rTab));
    });

    bindBody();
  }

  // Chips handler
  document.querySelectorAll("[data-template]").forEach((btn)=>{
    btn.addEventListener("click", ()=>{
      const t = btn.dataset.template;
      if (t === "time") return openTimeInfo();
      if (t === "pickup") return openCourierForm();
      if (t === "water") return openRepairSelector();
      if (t === "tv") return openRepairSelector("tv");
      if (t === "coffee") return openRepairSelector("coffee");
      if (t === "print") return openRepairSelector("printer");
      // default: open Telegram template
      const msg = templates[t] || "Здравствуйте!";
      openTelegramWithText(msg);
    });
  });

  // Service cards: Узнать цену → selector preset
  document.querySelectorAll("[data-service]").forEach((btn)=>{
    btn.addEventListener("click", ()=>{
      const s = btn.dataset.service;
      const map = { phone:"phone", pc:"pc", tv:"tv", console:"console", coffee:"coffee", dyson:"dyson", printer:"printer", tablet:"tablet" };
      openRepairSelector(map[s] || "phone");
    });
  });


})();
