(() => {
  "use strict";

  // Mark JS enabled (used by CSS for reveal fallback)
  document.documentElement.classList.add("js");

  // ====== CONFIG ======
  const LINKS = {
    phone: "tel:+79255156161",
    tgUser: "vremonte161",
    tg: "https://t.me/vremonte161",
    wa: "https://wa.me/message/BMMLIHWUSQRHC1",
    max: "https://max.ru/u/f9LHodD0cOLtKrUPwUO1eMRcfm0zwTD3C78xZc-I54h1b5NlXuetri89BNg",
  };

  // ====== Helpers ======
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  function escHtml(s){
    return String(s || "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
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
    window.open(url, "_blank", "noopener,noreferrer");
  }
  async function openWhatsAppWithText(text){
    if (text) await copyToClipboard(text);
    window.open(LINKS.wa, "_blank", "noopener,noreferrer");
  }
  async function openMaxWithText(text){
    if (text) await copyToClipboard(text);
    window.open(LINKS.max, "_blank", "noopener,noreferrer");
  }

  // ====== Year in footer ======
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());

  // ====== Mobile menu ======
  const burger = $("#burger");
  const mnav = $("#mnav");
  function setMenu(open){
    if (!burger || !mnav) return;
    mnav.hidden = !open;
    burger.setAttribute("aria-expanded", String(open));
  }
  if (burger && mnav){
    burger.addEventListener("click", () => setMenu(mnav.hidden));
    mnav.addEventListener("click", (e) => { if (e.target.closest(".mnav__link")) setMenu(false); });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  }

  // ====== Smooth anchors ======
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior:"smooth", block:"start" });
    setMenu(false);
  });

  // ====== Reveal animation (safe) ======
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) en.target.classList.add("in"); });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }else{
    revealEls.forEach(el => el.classList.add("in"));
  }

  // ====== FAQ accordion ======
  const faq = $("#faqList");
  if (faq){
    faq.addEventListener("click", (e) => {
      const btn = e.target.closest(".qa__q");
      if (!btn) return;
      const box = btn.closest(".qa");
      if (!box) return;
      box.classList.toggle("open");
    });
  }

  // ====== Photo modal (if exists) ======
  const modal = $("#modal");
  const modalImg = $("#modalImg");
  const modalClose = $("#modalClose");
  function openPhoto(src){
    if (!modal || !modalImg) return;
    modalImg.src = src;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }
  function closePhoto(){
    if (!modal || !modalImg) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    modalImg.src = "";
  }
  $$("[data-photo]").forEach((b) => b.addEventListener("click", () => openPhoto(b.getAttribute("data-photo"))));
  if (modalClose) modalClose.addEventListener("click", closePhoto);
  if (modal) modal.addEventListener("click", (e)=>{ if (e.target === modal) closePhoto(); });
  document.addEventListener("keydown", (e)=>{ if (e.key === "Escape") closePhoto(); });

  // ====== UI Modal (create if missing) ======
  function ensureUiModal(){
    let uiModal = $("#uiModal");
    let uiModalContent = $("#uiModalContent");
    if (uiModal && uiModalContent) return { uiModal, uiModalContent };

    uiModal = document.createElement("div");
    uiModal.id = "uiModal";
    uiModal.className = "uimodal";
    uiModal.setAttribute("aria-hidden","true");
    uiModal.innerHTML = `
      <div class="uimodal__backdrop" data-close="1"></div>
      <div class="uimodal__panel" role="dialog" aria-modal="true">
        <button class="uimodal__close" type="button" data-close="1" aria-label="Закрыть">✕</button>
        <div id="uiModalContent"></div>
      </div>`;
    document.body.appendChild(uiModal);
    uiModalContent = $("#uiModalContent");
    return { uiModal, uiModalContent };
  }

  function openUiModal(html){
    const { uiModal, uiModalContent } = ensureUiModal();
    uiModalContent.innerHTML = html;
    uiModal.classList.add("open");
    uiModal.setAttribute("aria-hidden","false");
    document.body.classList.add("modal-open");
  }
  function closeUiModal(){
    const uiModal = $("#uiModal");
    if (!uiModal) return;
    uiModal.classList.remove("open");
    uiModal.setAttribute("aria-hidden","true");
    document.body.classList.remove("modal-open");
  }

  // close handlers
  document.addEventListener("click", (e)=>{
    const uiModal = $("#uiModal");
    if (!uiModal || !uiModal.classList.contains("open")) return;
    const t = e.target;
    if (t && t.dataset && t.dataset.close === "1") closeUiModal();
  });
  document.addEventListener("keydown", (e)=>{
    const uiModal = $("#uiModal");
    if (e.key === "Escape" && uiModal && uiModal.classList.contains("open")) closeUiModal();
  });

  // ====== Lead message builder ======
  function buildLeadMessage(extra){
    const device = $("#leadDevice")?.value?.trim() || "";
    const problem = $("#leadProblem")?.value?.trim() || "";
    const urgency = $("#leadUrgency")?.value || "";
    const contact = $("#leadContact")?.value?.trim() || "";
    const parts = [];
    parts.push("Здравствуйте! Заявка с сайта «В ремонте».");
    if (device) parts.push(`Устройство: ${device}`);
    if (problem) parts.push(`Проблема: ${problem}`);
    if (urgency) parts.push(`Срочность: ${urgency}`);
    if (contact) parts.push(`Контакт: ${contact}`);
    if (extra) parts.push(extra);
    parts.push("");
    parts.push("Отправлено с сайта vremonte61.online");
    return parts.join("\n");
  }

  // Lead form actions
  const leadForm = $("#leadForm");
  if (leadForm){
    leadForm.addEventListener("submit",(e)=>{
      e.preventDefault();
      openTelegramWithText(buildLeadMessage());
    });
  }
  $("#sendWhatsApp")?.addEventListener("click", ()=> openWhatsAppWithText(buildLeadMessage()));
  $("#sendMax")?.addEventListener("click", ()=> openMaxWithText(buildLeadMessage()));
  $("#maxOpenM")?.addEventListener("click", ()=> window.open(LINKS.max, "_blank", "noopener,noreferrer"));

  // ====== Static template to Telegram (fallback) ======
  function openTemplateToTG(text){
    openTelegramWithText(text || "Здравствуйте!");
  }

  // ====== Modals content ======
  function openTimeModal(){
    openUiModal(`
      <h3>Срок ремонта</h3>
      <p class="muted">Срок зависит от модели, сложности неисправности и наличия запчастей.</p>
      <ul class="ul">
        <li><b>Типовые работы</b> (разъём, чистка, простые замены) — часто в день обращения.</li>
        <li><b>Средняя сложность</b> — обычно 1–3 дня.</li>
        <li><b>Сложный ремонт / плата</b> или редкие запчасти — дольше, согласуем после диагностики.</li>
      </ul>
      <div class="actions">
        <button class="btn btn--primary" type="button" data-send="tg" data-msg="time">Написать в Telegram</button>
        <button class="btn btn--soft" type="button" data-send="wa" data-msg="time">WhatsApp</button>
        <button class="btn btn--soft" type="button" data-send="max" data-msg="time">MAX</button>
      </div>
    `);
  }

  function openCourierModal(){
    openUiModal(`
      <h3>Курьер / доставка</h3>
      <p class="muted">Заполни поля — мы сформируем сообщение и откроем выбранный мессенджер.</p>

      <form class="form" id="courierForm" style="margin-top:10px">
        <label class="field">
          <span>Адрес забора / доставки</span>
          <input name="addr" placeholder="Город, улица, дом, подъезд, этаж" required>
        </label>
        <label class="field">
          <span>Когда удобно</span>
          <input name="when" placeholder="Сегодня после 18:00 / Завтра 12–15" required>
        </label>
        <label class="field">
          <span>Устройство</span>
          <input name="dev" placeholder="Напр.: ТВ Samsung / iPhone 13 / кофемашина Philips" required>
        </label>
        <label class="field">
          <span>Проблема</span>
          <input name="issue" placeholder="Коротко опиши неисправность" required>
        </label>
        <label class="field">
          <span>Комментарий (необязательно)</span>
          <input name="comment" placeholder="Код домофона, ориентир, и т.д.">
        </label>

        <div class="actions">
          <button class="btn btn--primary" type="button" data-courier-send="tg">Отправить в Telegram</button>
          <button class="btn btn--soft" type="button" data-courier-send="wa">WhatsApp</button>
          <button class="btn btn--soft" type="button" data-courier-send="max">MAX</button>
        </div>
      </form>
    `);
  }

  const MODEL_DATA = {
    phone: {
      title: "Телефоны",
      tabs: [
        { key:"apple", name:"Apple (iPhone)", items:["iPhone 7/8/SE","iPhone X/XS/XR","iPhone 11/11 Pro","iPhone 12/12 Pro","iPhone 13/13 Pro","iPhone 14/14 Pro","iPhone 15/15 Pro","iPhone 16/16 Pro","Другая модель iPhone"] },
        { key:"android", name:"Android", items:["Samsung","Xiaomi / Redmi / POCO","Honor","Huawei","Realme","Tecno","Infinix","OnePlus","OPPO","Vivo","Другая модель Android"] },
      ]
    },
    tv: {
      title: "Телевизоры",
      tabs: [
        { key:"tv", name:"Бренды", items:["Samsung","LG","Sony","Philips","TCL","Hisense","Xiaomi","Haier","BBK","DEXP","Другое"] }
      ]
    },
    coffee: {
      title: "Кофемашины",
      tabs: [
        { key:"coffee", name:"Бренды", items:["DeLonghi","Philips","Saeco","Jura","Bosch","Krups","Nivona","Siemens","Melitta","Другое"] }
      ]
    },
    print: {
      title: "Принтеры",
      tabs: [
        { key:"print", name:"Бренды", items:["HP","Canon","Epson","Brother","Samsung","Xerox","Kyocera","Ricoh","Pantum","Другое"] }
      ]
    },
    dyson: {
      title: "Dyson / бытовая",
      tabs: [
        { key:"dyson", name:"Модели", items:["Dyson V6","Dyson V7","Dyson V8","Dyson V10","Dyson V11","Dyson V12","Dyson V15","Supersonic (фен)","Airwrap","Другое"] }
      ]
    },
    pc: {
      title: "ПК / ноутбуки",
      tabs: [
        { key:"laptop", name:"Ноутбуки", items:["ASUS","Acer","Lenovo","HP","MSI","Dell","Apple MacBook","Huawei","Honor","Другое"] },
        { key:"pc", name:"ПК/моноблок", items:["Сборный ПК","Моноблок","Мини‑ПК","Другое"] }
      ]
    },
    ps: {
      title: "Приставки",
      tabs: [
        { key:"console", name:"Платформа", items:["PlayStation 4","PlayStation 5","Xbox One","Xbox Series","Nintendo Switch","Другое"] }
      ]
    },
    water: { // общий список "что ремонтируем"
      title: "Что ремонтируем",
      tabs: [
        { key:"phones", name:"Телефоны", items:["Apple (iPhone)","Android (Samsung/Xiaomi/… )"] },
        { key:"tv", name:"Телевизоры", items:["Samsung","LG","Sony","Philips","TCL/Hisense","Другое"] },
        { key:"coffee", name:"Кофемашины", items:["DeLonghi","Philips/Saeco","Jura","Bosch/Krups","Другое"] },
        { key:"dyson", name:"Dyson/бытовая", items:["V6/V7/V8","V10/V11","V12/V15","Supersonic/Airwrap","Другое"] },
        { key:"print", name:"Принтеры", items:["HP","Canon","Epson","Brother","Другое"] },
        { key:"pc", name:"ПК/ноутбуки", items:["Ноутбуки","ПК/моноблок","Другое"] },
        { key:"tablet", name:"Планшеты", items:["iPad","Samsung Tab","Huawei","Lenovo","Другое"] },
      ]
    }
  };

  function renderModelsModal(categoryKey){
    const data = MODEL_DATA[categoryKey] || MODEL_DATA.water;
    const tabs = data.tabs || [];
    const tabButtons = tabs.map((t,i)=>`
      <button class="chip ${i===0?'chip--alt':''}" type="button" data-tab="${escHtml(t.key)}">${escHtml(t.name)}</button>
    `).join("");

    const firstKey = tabs[0]?.key || "tab";
    const listHtml = (key)=>{
      const tab = tabs.find(t=>t.key===key) || tabs[0];
      const items = tab?.items || [];
      return `<div class="modelgrid">
        ${items.map(it=>`<button type="button" class="modelitem" data-pick="${escHtml(it)}">${escHtml(it)}</button>`).join("")}
      </div>`;
    };

    openUiModal(`
      <h3>${escHtml(data.title)}</h3>
      <p class="muted">Выбери категорию/бренд/модель, опиши проблему — сформируем сообщение.</p>

      <div class="chips" style="margin:10px 0 8px">
        ${tabButtons}
      </div>

      <div id="modelsList">
        ${listHtml(firstKey)}
      </div>

      <div class="card" style="margin-top:12px">
        <label class="field">
          <span>Выбрано</span>
          <input id="mPicked" placeholder="Выбери пункт выше" readonly>
        </label>

        <label class="field" style="margin-top:10px">
          <span>Проблема</span>
          <input id="mIssue" placeholder="Не включается / нет изображения / не заряжается…" required>
        </label>

        <div class="row" style="margin-top:10px">
          <label class="field">
            <span>Срочность</span>
            <select id="mUrgency">
              <option>Не срочно</option>
              <option>Сегодня</option>
              <option>Срочно</option>
            </select>
          </label>
          <label class="field">
            <span>Контакт (по желанию)</span>
            <input id="mContact" placeholder="+7... или @telegram">
          </label>
        </div>

        <div class="actions" style="margin-top:12px">
          <button class="btn btn--primary" type="button" data-model-send="tg" data-cat="${escHtml(categoryKey||'water')}">Отправить в Telegram</button>
          <button class="btn btn--soft" type="button" data-model-send="wa" data-cat="${escHtml(categoryKey||'water')}">WhatsApp</button>
          <button class="btn btn--soft" type="button" data-model-send="max" data-cat="${escHtml(categoryKey||'water')}">MAX</button>
        </div>
      </div>
    `);
  }

  // ====== Modal button actions (event delegation) ======
  document.addEventListener("click", async (e)=>{
    // Time modal send
    const send = e.target.closest("[data-send]");
    if (send){
      const type = send.getAttribute("data-send");
      const msgKey = send.getAttribute("data-msg");
      const msg = (msgKey === "time")
        ? "Здравствуйте! Подскажите, пожалуйста, по срокам ремонта. Устройство: ____. Проблема: ____."
        : "Здравствуйте!";
      if (type === "tg") openTelegramWithText(msg);
      if (type === "wa") await openWhatsAppWithText(msg);
      if (type === "max") await openMaxWithText(msg);
      return;
    }

    // Courier modal send
    const cs = e.target.closest("[data-courier-send]");
    if (cs){
      const form = $("#courierForm");
      if (!form) return;
      const fd = new FormData(form);
      const addr = String(fd.get("addr")||"").trim();
      const when = String(fd.get("when")||"").trim();
      const dev = String(fd.get("dev")||"").trim();
      const issue = String(fd.get("issue")||"").trim();
      const comment = String(fd.get("comment")||"").trim();

      if (!addr || !when || !dev || !issue){
        alert("Заполни обязательные поля.");
        return;
      }

      const msg = [
        "Здравствуйте! Нужен курьер / доставка.",
        `Адрес: ${addr}`,
        `Когда удобно: ${when}`,
        `Устройство: ${dev}`,
        `Проблема: ${issue}`,
        comment ? `Комментарий: ${comment}` : null,
        "",
        "Отправлено с сайта vremonte61.online"
      ].filter(Boolean).join("\n");

      const type = cs.getAttribute("data-courier-send");
      if (type === "tg") openTelegramWithText(msg);
      if (type === "wa") await openWhatsAppWithText(msg);
      if (type === "max") await openMaxWithText(msg);
      return;
    }

    // Models tab switch
    const tabBtn = e.target.closest("[data-tab]");
    if (tabBtn){
      const key = tabBtn.getAttribute("data-tab");
      const title = $("#uiModalContent h3")?.textContent || "";
      // find dataset by title match (simple)
      let data = null;
      for (const k in MODEL_DATA){
        if (MODEL_DATA[k].title === title){ data = MODEL_DATA[k]; break; }
      }
      if (!data) return;
      const tab = data.tabs.find(t=>t.key===key) || data.tabs[0];
      const list = $("#modelsList");
      if (!list) return;
      list.innerHTML = `<div class="modelgrid">
        ${(tab.items||[]).map(it=>`<button type="button" class="modelitem" data-pick="${escHtml(it)}">${escHtml(it)}</button>`).join("")}
      </div>`;
      // UI toggle active-ish
      $$(".chips [data-tab]").forEach(b=>b.classList.remove("chip--alt"));
      tabBtn.classList.add("chip--alt");
      return;
    }

    // Pick model item
    const pick = e.target.closest("[data-pick]");
    if (pick){
      const v = pick.getAttribute("data-pick") || "";
      const inp = $("#mPicked");
      if (inp) inp.value = v;
      return;
    }

    // Send model request
    const ms = e.target.closest("[data-model-send]");
    if (ms){
      const picked = $("#mPicked")?.value?.trim() || "";
      const issue = $("#mIssue")?.value?.trim() || "";
      const urgency = $("#mUrgency")?.value || "";
      const contact = $("#mContact")?.value?.trim() || "";
      if (!picked || !issue){
        alert("Выбери модель/пункт и опиши проблему.");
        return;
      }
      const cat = ms.getAttribute("data-cat") || "water";
      const msg = [
        "Здравствуйте! Хочу узнать стоимость ремонта.",
        `Категория: ${MODEL_DATA[cat]?.title || "Техника"}`,
        `Модель/пункт: ${picked}`,
        `Проблема: ${issue}`,
        urgency ? `Срочность: ${urgency}` : null,
        contact ? `Контакт: ${contact}` : null,
        "",
        "Отправлено с сайта vremonte61.online"
      ].filter(Boolean).join("\n");

      const type = ms.getAttribute("data-model-send");
      if (type === "tg") openTelegramWithText(msg);
      if (type === "wa") await openWhatsAppWithText(msg);
      if (type === "max") await openMaxWithText(msg);
      return;
    }
  });

  // ====== Chips & buttons mapping ======
  function openByKey(key){
    // chips on hero
    if (key === "time") return openTimeModal();
    if (key === "pickup") return openCourierModal();
    if (key === "water") return renderModelsModal("water");
    if (key === "tv") return renderModelsModal("tv");
    if (key === "coffee") return renderModelsModal("coffee");
    if (key === "print") return renderModelsModal("print");

    if (key === "price"){
      return openTemplateToTG("Здравствуйте! Хочу узнать ориентировочную стоимость ремонта.\nКатегория: ____\nМарка/модель: ____\nПроблема: ____\n\nОтправлено с сайта vremonte61.online");
    }
  }

  // delegate click for [data-template]
  document.addEventListener("click", (e)=>{
    const b = e.target.closest("[data-template]");
    if (!b) return;
    const key = b.getAttribute("data-template");
    if (!key) return;
    e.preventDefault();
    openByKey(key);
  });

  // 'Узнать цену' buttons in services (data-service)
  document.addEventListener("click", (e)=>{
    const b = e.target.closest("[data-service]");
    if (!b) return;
    const key = b.getAttribute("data-service");
    // Instead of opening TG immediately, open models modal (as requested)
    // Map service -> category
    const map = { phone:"phone", pc:"pc", tv:"tv", ps:"ps", coffee:"coffee", dyson:"dyson" };
    const cat = map[key] || "water";
    e.preventDefault();
    renderModelsModal(cat);
  });

  // ToTop (if exists)
  const toTop = $("#toTop");
  if (toTop){
    const onScroll = () => { if (window.scrollY > 600) toTop.classList.add("show"); else toTop.classList.remove("show"); };
    window.addEventListener("scroll", onScroll);
    onScroll();
    toTop.addEventListener("click", ()=> window.scrollTo({ top:0, behavior:"smooth" }));
  }

})();