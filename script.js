(() => {
  "use strict";

  // ---------- Links / contacts ----------
  const LINKS = {
    tgUser: "vremonte161",
    tg: "https://t.me/vremonte161",
    wa: "https://wa.me/message/BMMLIHWUSQRHC1",
    max: "https://max.ru/u/f9LHodD0cOIcyLKszOi0I1wOwGuyOltplh3obPyqkL7_jwUK6DRgug2lKI8",
    phone: "tel:+79255156161"
  };

  // ---------- Helpers ----------
  const $ = (sel, root=document) => root.querySelector(sel);

  async function copyToClipboard(text){
    try{
      await navigator.clipboard.writeText(text);
      return true;
    }catch(_){
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position="fixed";
      ta.style.opacity="0";
      document.body.appendChild(ta);
      ta.select();
      try{ document.execCommand("copy"); }catch(_2){}
      ta.remove();
      return true;
    }
  }

  function openTelegramWithText(text){
    window.open(`${LINKS.tg}?text=${encodeURIComponent(text || "")}`, "_blank", "noopener,noreferrer");
  }
  async function openWhatsAppWithText(text){
    if (text) await copyToClipboard(text);
    window.open(LINKS.wa, "_blank", "noopener,noreferrer");
  }
  async function openMaxWithText(text){
    if (text) await copyToClipboard(text);
    window.open(LINKS.max, "_blank", "noopener,noreferrer");
  }

  // ---------- UI Modal ----------
  function ensureModal(){
    // If modal is missing for any reason — create it dynamically (bulletproof)
    let modal = document.getElementById("uiModal");
    if (!modal){
      modal = document.createElement("div");
      modal.className = "uimodal";
      modal.id = "uiModal";
      modal.setAttribute("aria-hidden","true");
      modal.innerHTML = `
        <div class="uimodal__backdrop" data-close="1"></div>
        <div class="uimodal__panel" role="dialog" aria-modal="true" aria-label="Окно">
          <button class="uimodal__close" type="button" aria-label="Закрыть" data-close="1">✕</button>
          <div class="uimodal__content" id="uiModalContent"></div>
        </div>`;
      document.body.appendChild(modal);
    }
    if (!document.getElementById("uiModalContent")){
      const content = document.createElement("div");
      content.className = "uimodal__content";
      content.id="uiModalContent";
      modal.querySelector(".uimodal__panel")?.appendChild(content);
    }
    return modal;
  }

  function openUiModal(html){
    const modal = ensureModal();
    const content = document.getElementById("uiModalContent");
    if (!content) return;
    content.innerHTML = html;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
    document.body.classList.add("modal-open");
  }

  function closeUiModal(){
    const modal = document.getElementById("uiModal");
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
    document.body.classList.remove("modal-open");
    const content = document.getElementById("uiModalContent");
    if (content) content.innerHTML = "";
  }

  function bindModalClose(){
    const modal = ensureModal();
    modal.addEventListener("click", (e)=>{
      const t = e.target;
      if (t && t.getAttribute && t.getAttribute("data-close")==="1") closeUiModal();
      // click outside panel
      if (t === modal.querySelector(".uimodal__backdrop")) closeUiModal();
    });
    document.addEventListener("keydown", (e)=>{
      if (e.key === "Escape") closeUiModal();
    });
  }

  // ---------- Data: models ----------
  const MODEL_DATA = {
    phones: {
      title: "Телефоны • Apple iPhone",
      groups: [
        { name: "Apple iPhone", models: [
          "iPhone 7 / 7 Plus","iPhone 8 / 8 Plus","iPhone X","iPhone XR","iPhone XS / XS Max",
          "iPhone 11","iPhone 11 Pro / Pro Max","iPhone 12 mini","iPhone 12","iPhone 12 Pro / Pro Max",
          "iPhone 13 mini","iPhone 13","iPhone 13 Pro / Pro Max",
          "iPhone 14","iPhone 14 Pro / Pro Max",
          "iPhone 15","iPhone 15 Pro / Pro Max",
          "iPhone 16","iPhone 16 Pro / Pro Max",
          "iPhone 17 (если есть) / уточнить модель"
        ]}
      ]
    },
    android: {
      title: "Телефоны • Android",
      groups: [
        { name: "Samsung", models: ["A-серия","S-серия","Note","Flip/Fold","Другое (укажи модель)"] },
        { name: "Xiaomi / Redmi / POCO", models: ["Redmi","POCO","Mi/Xiaomi","Другое (укажи модель)"] },
        { name: "Honor / Huawei", models: ["Honor","Huawei","Другое (укажи модель)"] },
        { name: "Realme / Tecno / Infinix", models: ["Realme","Tecno","Infinix","Другое (укажи модель)"] },
        { name: "Другое", models: ["OnePlus","OPPO","Vivo","Google Pixel","Другой бренд (впиши)"] }
      ]
    },
    pc: {
      title: "ПК и ноутбуки",
      groups: [
        { name: "Ноутбуки", models: ["Acer","ASUS","Lenovo","HP","Dell","MSI","Apple MacBook","Другой бренд (впиши)"] },
        { name: "ПК / системники", models: ["Сборка (укажи конфиг)","Моноблок","Игровой ПК","Офисный ПК"] },
        { name: "Услуги", models: ["Чистка / термопаста","SSD / апгрейд","Windows / восстановление","Питание / разъёмы","BIOS/UEFI","Другое (впиши)"] }
      ]
    },
    tvs: {
      title: "Телевизоры",
      groups: [
        { name: "Бренд", models: ["Samsung","LG","Sony","Philips","TCL","Hisense","Xiaomi","Haier","Другой бренд (впиши)"] },
        { name: "Тип проблемы", models: ["Нет изображения","Полосы / рябь","Нет подсветки","Не включается","Разъёмы / питание","Другое (впиши)"] }
      ]
    },
    coffee: {
      title: "Кофемашины",
      groups: [
        { name: "Бренд", models: ["DeLonghi","Philips","Saeco","Jura","Bosch","Krups","Nivona","Другой бренд (впиши)"] },
        { name: "Тип проблемы", models: ["Протечка","Не делает кофе","Ошибка / код","Помпа / давление","Чистка / обслуживание","Другое (впиши)"] }
      ]
    },
    printers: {
      title: "Принтеры / МФУ",
      groups: [
        { name: "Бренд", models: ["HP","Canon","Epson","Brother","Samsung","Xerox","Kyocera","Другой бренд (впиши)"] },
        { name: "Тип проблемы", models: ["Не печатает","Полосит","Не захватывает бумагу","Ошибка/код","Прошивка/настройка","Другое (впиши)"] }
      ]
    },
    dyson: {
      title: "Dyson / бытовая",
      groups: [
        { name: "Dyson пылесос", models: ["V6","V7","V8","V10","V11","V12","V15","Другой (впиши)"] },
        { name: "Другое", models: ["Фен Supersonic","Стайлер Airwrap","Очиститель/увлажнитель","Другая техника (впиши)"] },
        { name: "Тип проблемы", models: ["Не включается","Слабая тяга","Ошибка/индикация","Контакты/питание","Профилактика/чистка","Другое (впиши)"] }
      ]
    },
    tablets: {
      title: "Планшеты",
      groups: [
        { name: "iPad", models: ["iPad (укажи поколение)","iPad Air","iPad Pro","iPad mini"] },
        { name: "Android планшеты", models: ["Samsung Tab","Huawei","Lenovo","Xiaomi","Другой (впиши)"] }
      ]
    },
    consoles: {
      title: "Приставки",
      groups: [
        { name: "PlayStation", models: ["PS4","PS4 Pro","PS5","Другое (впиши)"] },
        { name: "Xbox / Nintendo", models: ["Xbox One","Xbox Series S/X","Nintendo Switch","Другое (впиши)"] },
        { name: "Тип проблемы", models: ["Перегрев/шум","Не запускается","Ошибка/обновление","HDMI/разъём","Чистка/профилактика","Другое (впиши)"] }
      ]
    },
    all: {
      title: "Что ремонтируем",
      groups: [
        { name: "Категории", models: ["Телефоны (Apple/Android)","ПК и ноутбуки","Телевизоры","Кофемашины","Принтеры","Dyson/бытовая","Планшеты","Приставки","Другое (впиши)"] }
      ]
    }
  };

  function openModelsSelector(initialKey="all"){
    let key = MODEL_DATA[initialKey] ? initialKey : "all";
    const tabs = [
      ["phones","iPhone"],
      ["android","Android"],
      ["pc","ПК/ноут"],
      ["tvs","ТВ"],
      ["coffee","Кофемашины"],
      ["printers","Принтеры"],
      ["dyson","Dyson"],
      ["tablets","Планшеты"],
      ["consoles","Приставки"],
      ["all","Все"]
    ];

    const render = () => {
      const data = MODEL_DATA[key];
      const tabsHtml = tabs.map(([k,label]) =>
        `<button type="button" class="tab ${k===key?'tab--on':''}" data-tab="${k}">${label}</button>`
      ).join("");

      const groupsHtml = data.groups.map((g,gi)=>{
        const items = g.models.map((m)=> `<button type="button" class="pick" data-pick="${htmlEscape(m)}">${htmlEscape(m)}</button>`).join("");
        return `<div class="pickgroup">
          <div class="pickgroup__title">${htmlEscape(g.name)}</div>
          <div class="pickgroup__grid">${items}</div>
        </div>`;
      }).join("");

      openUiModal(`
        <div class="modalhead">
          <h3 style="margin:0 0 6px">${htmlEscape(data.title)}</h3>
          <p class="muted" style="margin:0 0 12px">Выбери бренд/модель, опиши проблему — подготовим сообщение и откроем мессенджер.</p>
          <div class="tabs">${tabsHtml}</div>
        </div>

        <div class="modalbody">
          ${groupsHtml}
          <div class="card" style="margin-top:12px">
            <div class="row">
              <label class="field">
                <span>Проблема</span>
                <input id="mIssue" placeholder="Не включается / нет изображения / не заряжается..." required>
              </label>
              <label class="field">
                <span>Срочность</span>
                <select id="mUrgency">
                  <option>Не срочно</option>
                  <option>Сегодня</option>
                  <option>Срочно</option>
                </select>
              </label>
            </div>
            <label class="field">
              <span>Контакт (по желанию)</span>
              <input id="mContact" placeholder="+7... или @telegram">
            </label>

            <div class="actions">
              <button class="btn btn--primary" type="button" id="mSendTG">Отправить в Telegram</button>
              <button class="btn btn--soft" type="button" id="mSendWA">WhatsApp</button>
              <button class="btn btn--soft" type="button" id="mSendMAX">MAX</button>
            </div>
            <div class="hint">Выбранная модель: <b id="mChosen">не выбрана</b></div>
          </div>
        </div>
      `);

      // bind
      setTimeout(()=>{
        document.querySelectorAll(".tab").forEach((b)=>{
          b.addEventListener("click", ()=>{
            key = b.getAttribute("data-tab") || "all";
            render();
          });
        });

        let chosen = "";
        document.querySelectorAll(".pick").forEach((b)=>{
          b.addEventListener("click", ()=>{
            chosen = b.getAttribute("data-pick") || "";
            const out = document.getElementById("mChosen");
            if (out) out.textContent = chosen || "не выбрана";
          });
        });

        const build = () => {
          const issue = document.getElementById("mIssue")?.value?.trim() || "";
          const urgency = document.getElementById("mUrgency")?.value || "";
          const contact = document.getElementById("mContact")?.value?.trim() || "";
          const title = MODEL_DATA[key]?.title || "Заявка";
          const lines = [
            "Здравствуйте! Хочу узнать стоимость ремонта (заявка с сайта «В ремонте»).",
            `Категория: ${title}`,
            `Модель/выбор: ${chosen || "не выбрали"}`,
            `Проблема: ${issue || "не указали"}`,
            `Срочность: ${urgency || "не указали"}`
          ];
          if (contact) lines.push(`Контакт: ${contact}`);
          lines.push("", "Отправлено с сайта vremonte61.online");
          return lines.join("\n");
        };

        document.getElementById("mSendTG")?.addEventListener("click", ()=> openTelegramWithText(build()));
        document.getElementById("mSendWA")?.addEventListener("click", ()=> openWhatsAppWithText(build()));
        document.getElementById("mSendMAX")?.addEventListener("click", ()=> openMaxWithText(build()));
      }, 0);
    };

    render();
  }

  function htmlEscape(str){
    return String(str)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  // ---------- Modals: time + courier ----------
  function openTimeInfo(){
    const text = "Здравствуйте! Подскажите, пожалуйста, по срокам ремонта. Устройство: ____. Проблема: ____.";
    openUiModal(`
      <h3>Срок ремонта</h3>
      <p class="muted">Срок зависит от модели, сложности неисправности и наличия запчастей.</p>
      <ul class="ul">
        <li><b>Типовые работы</b> (разъём, чистка, простые замены) — часто <b>в день обращения</b> при наличии деталей.</li>
        <li><b>Средняя сложность</b> — обычно <b>1–3 дня</b> после диагностики и согласования цены.</li>
        <li><b>Сложный ремонт платы</b> или редкие запчасти — срок согласуем индивидуально, заранее предупредим.</li>
      </ul>
      <div class="actions">
        <button class="btn btn--primary" type="button" id="timeTG">Написать в Telegram</button>
        <button class="btn btn--soft" type="button" id="timeWA">WhatsApp</button>
        <button class="btn btn--soft" type="button" id="timeMAX">MAX</button>
      </div>
    `);
    setTimeout(()=>{
      $("#timeTG")?.addEventListener("click", ()=> openTelegramWithText(text));
      $("#timeWA")?.addEventListener("click", ()=> openWhatsAppWithText(text));
      $("#timeMAX")?.addEventListener("click", ()=> openMaxWithText(text));
    },0);
  }

  function openCourierForm(){
    openUiModal(`
      <h3>Курьер / доставка</h3>
      <p class="muted">Заполни пару строк — мы сформируем сообщение и откроем мессенджер.</p>
      <form class="modalform" id="courierForm">
        <div class="row">
          <label class="field">
            <span>Адрес</span>
            <input name="addr" placeholder="Улица, дом, подъезд" required>
          </label>
          <label class="field">
            <span>Когда удобно</span>
            <input name="when" placeholder="Сегодня 18:00–20:00 / Завтра утром" required>
          </label>
        </div>
        <label class="field">
          <span>Устройство</span>
          <input name="device" placeholder="Напр.: iPhone 13 / ТВ Samsung / кофемашина Delonghi" required>
        </label>
        <label class="field">
          <span>Проблема</span>
          <input name="issue" placeholder="Не включается / нет изображения / протекает..." required>
        </label>
        <label class="field">
          <span>Комментарий (необязательно)</span>
          <input name="note" placeholder="Домофон, этаж, ориентир, пожелания">
        </label>
        <div class="actions">
          <button class="btn btn--primary" type="submit">Отправить в Telegram</button>
          <button class="btn btn--soft" type="button" id="courierWA">WhatsApp</button>
          <button class="btn btn--soft" type="button" id="courierMAX">MAX</button>
        </div>
      </form>
    `);

    setTimeout(()=>{
      const form = document.getElementById("courierForm");
      if (!form) return;

      const build = () => {
        const fd = new FormData(form);
        const addr = String(fd.get("addr")||"").trim();
        const when = String(fd.get("when")||"").trim();
        const device = String(fd.get("device")||"").trim();
        const issue = String(fd.get("issue")||"").trim();
        const note = String(fd.get("note")||"").trim();

        const lines = [
          "Здравствуйте! Нужен курьер/доставка (заявка с сайта «В ремонте»).",
          `Адрес: ${addr}`,
          `Когда удобно: ${when}`,
          `Устройство: ${device}`,
          `Проблема: ${issue}`
        ];
        if (note) lines.push(`Комментарий: ${note}`);
        lines.push("", "Отправлено с сайта vremonte61.online");
        return lines.join("\n");
      };

      form.addEventListener("submit", (e)=>{
        e.preventDefault();
        openTelegramWithText(build());
      });

      $("#courierWA")?.addEventListener("click", ()=> openWhatsAppWithText(build()));
      $("#courierMAX")?.addEventListener("click", ()=> openMaxWithText(build()));
    },0);
  }

  // ---------- Main init ----------
  function init(){
    document.documentElement.classList.add("js");

    // Footer year
    const y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());

    bindModalClose();

    // Mobile menu
    const burger = document.getElementById("burger");
    const mnav = document.getElementById("mnav");
    const setMenu = (open) => {
      if (!burger || !mnav) return;
      mnav.hidden = !open;
      burger.setAttribute("aria-expanded", String(open));
    };
    if (burger && mnav){
      burger.addEventListener("click", ()=> setMenu(mnav.hidden));
      mnav.addEventListener("click", (e)=>{
        if (e.target.closest(".mnav__link")) setMenu(false);
      });
      window.addEventListener("keydown", (e)=>{ if (e.key==="Escape") setMenu(false); });
    }

    // Smooth anchors
    document.addEventListener("click", (e)=>{
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({behavior:"smooth", block:"start"});
      setMenu(false);
    });

    // FAQ accordion
    const faq = document.getElementById("faqList");
    if (faq){
      faq.addEventListener("click", (e)=>{
        const btn = e.target.closest(".qa__q");
        if (!btn) return;
        const box = btn.closest(".qa");
        if (!box) return;
        box.classList.toggle("open");
      });
    }

    // Lead form (hero) — Telegram / WA / MAX
    function buildLeadMessage(){
      const device = $("#leadDevice")?.value?.trim() || "";
      const problem = $("#leadProblem")?.value?.trim() || "";
      const urgency = $("#leadUrgency")?.value || "";
      const contact = $("#leadContact")?.value?.trim() || "";
      const lines = [
        "Здравствуйте! Хочу оставить заявку на ремонт (сайт «В ремонте»).",
        `Устройство: ${device || "не указали"}`,
        `Проблема: ${problem || "не указали"}`,
        `Срочность: ${urgency || "не указали"}`
      ];
      if (contact) lines.push(`Контакт: ${contact}`);
      lines.push("", "Отправлено с сайта vremonte61.online");
      return lines.join("\n");
    }

    const leadForm = document.getElementById("leadForm");
    if (leadForm){
      leadForm.addEventListener("submit", (e)=>{
        e.preventDefault();
        openTelegramWithText(buildLeadMessage());
      });
    }
    $("#sendWhatsApp")?.addEventListener("click", ()=> openWhatsAppWithText(buildLeadMessage()));
    $("#sendMax")?.addEventListener("click", ()=> openMaxWithText(buildLeadMessage()));
    $("#maxOpenM")?.addEventListener("click", ()=> window.open(LINKS.max, "_blank", "noopener,noreferrer"));

    // Universal click routing (chips + service cards)
    document.addEventListener("click", (e)=>{
      const t = e.target;

      const chip = t.closest("[data-template]");
      if (chip){
        const key = chip.getAttribute("data-template");
        if (key === "time"){ openTimeInfo(); return; }
        if (key === "pickup"){ openCourierForm(); return; }
        if (key === "water"){ openModelsSelector("all"); return; }
        if (key === "tv"){ openModelsSelector("tvs"); return; }
        if (key === "coffee"){ openModelsSelector("coffee"); return; }
        if (key === "print"){ openModelsSelector("printers"); return; }
        if (key === "price"){ openModelsSelector("all"); return; }
      }

      const svc = t.closest("[data-service]");
      if (svc){
        const k = svc.getAttribute("data-service") || "";
        const map = { phone:"phones", pc:"pc", tv:"tvs", ps:"consoles", coffee:"coffee", dyson:"dyson" };
        if (map[k]){ openModelsSelector(map[k]); return; }
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();