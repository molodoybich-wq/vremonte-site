(() => {
  "use strict";

  // ----------------------------
  // CONFIG
  // ----------------------------
  const LINKS = {
    tgUser: "vremonte161",
    tg: "https://t.me/vremonte161",
    wa: "https://wa.me/message/BMMLIHWUSQRHC1",
    // ВАЖНО: ссылка MAX из вашей задачи (без белого фона на иконке — это отдельный файл assets/max.webp)
    max: "https://max.ru/u/f9LHodD0cOIcyLKszOi0I1wOwGuyOltplh3obPyqkL7_jwUK6DRgug2lKI8"
  };

  const ADDRESSES = "Ткачева 22 / Заводская 25";

  // ----------------------------
  // HELPERS
  // ----------------------------
  function qs(sel, root = document) { return root.querySelector(sel); }
  function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  function safeScrollTo(id) {
    const el = qs(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (_2) {}
      ta.remove();
      return true;
    }
  }

  function openTelegram(text) {
    const url = `${LINKS.tg}?text=${encodeURIComponent(text || "")}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function openWhatsApp(text) {
    if (text) await copyToClipboard(text);
    window.open(LINKS.wa, "_blank", "noopener,noreferrer");
  }

  async function openMax(text) {
    if (text) await copyToClipboard(text);
    window.open(LINKS.max, "_blank", "noopener,noreferrer");
  }

  function escHtml(s) {
    return String(s || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // ----------------------------
  // MODAL (создаётся автоматически, если её нет)
  // ----------------------------
  function ensureUiModal() {
    let modal = qs("#uiModal");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "uiModal";
    modal.className = "uiModal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="uiModal__backdrop" data-close="1"></div>
      <div class="uiModal__panel" role="dialog" aria-modal="true" aria-label="Окно">
        <button class="uiModal__close" type="button" data-close="1" aria-label="Закрыть">✕</button>
        <div class="uiModal__content" id="uiModalContent"></div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.dataset && t.dataset.close === "1") closeUiModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) closeUiModal();
    });

    return modal;
  }

  function openUiModal(html) {
    const modal = ensureUiModal();
    const content = qs("#uiModalContent", modal);
    if (content) content.innerHTML = html;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeUiModal() {
    const modal = qs("#uiModal");
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    const content = qs("#uiModalContent", modal);
    if (content) content.innerHTML = "";
  }

  // ----------------------------
  // DATA: категории/бренды/подсказки
  // ----------------------------
  const MODEL_DATA = {
    phone: {
      title: "Телефоны",
      groups: [
        { name: "Apple (iPhone)", suggestions: ["iPhone 8", "iPhone X/XS/XR", "iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15", "iPhone 16", "iPhone 17"] },
        { name: "Android", suggestions: ["Samsung Galaxy", "Xiaomi Redmi", "Poco", "Realme", "Honor", "Huawei", "Tecno", "Infinix", "OnePlus", "Google Pixel"] }
      ]
    },
    pc: {
      title: "ПК / ноутбуки",
      groups: [
        { name: "Ноутбук", suggestions: ["Lenovo IdeaPad", "ASUS VivoBook", "Acer Aspire", "HP Pavilion", "MSI", "MacBook"] },
        { name: "ПК / моноблок", suggestions: ["Сборка ПК", "Моноблок Lenovo", "Моноблок HP", "iMac"] }
      ]
    },
    tv: {
      title: "Телевизоры",
      groups: [
        { name: "Бренд ТВ", suggestions: ["Samsung", "LG", "Sony", "Philips", "TCL", "Hisense", "Xiaomi", "Haier"] }
      ]
    },
    coffee: {
      title: "Кофемашины",
      groups: [
        { name: "Бренд кофемашины", suggestions: ["De'Longhi", "Philips", "Saeco", "Jura", "Bosch", "Krups", "Nivona", "Melitta"] }
      ]
    },
    print: {
      title: "Принтеры / МФУ",
      groups: [
        { name: "Бренд принтера", suggestions: ["HP", "Canon", "Epson", "Brother", "Xerox", "Samsung", "Kyocera"] }
      ]
    },
    dyson: {
      title: "Dyson / пылесосы",
      groups: [
        { name: "Dyson", suggestions: ["V6", "V7", "V8", "V10", "V11", "V12", "V15", "Supersonic (фен)", "Airwrap"] },
        { name: "Другие пылесосы", suggestions: ["Xiaomi", "Tefal", "Bosch", "Samsung"] }
      ]
    },
    tablet: {
      title: "Планшеты",
      groups: [
        { name: "Apple", suggestions: ["iPad 6/7/8/9", "iPad Air", "iPad Pro", "iPad mini"] },
        { name: "Android", suggestions: ["Samsung Tab", "Huawei MatePad", "Lenovo Tab", "Xiaomi Pad"] }
      ]
    }
  };

  // ----------------------------
  // BUILD MESSAGES
  // ----------------------------
  function buildLeadMessage(payload) {
    const p = payload || {};
    const lines = [
      "Здравствуйте! Заявка с сайта «В ремонте».",
      p.category ? `Категория: ${p.category}` : null,
      p.brand ? `Бренд: ${p.brand}` : null,
      p.model ? `Модель: ${p.model}` : null,
      p.issue ? `Проблема: ${p.issue}` : null,
      p.urgent ? `Срочность: ${p.urgent}` : null,
      p.contact ? `Контакт: ${p.contact}` : "Контакт: не указали",
      p.address ? `Адрес/район: ${p.address}` : null,
      p.when ? `Когда удобно: ${p.when}` : null,
      p.comment ? `Комментарий: ${p.comment}` : null,
      "",
      `Адреса: ${ADDRESSES}`,
      "Отправлено с сайта vremonte61.online"
    ].filter(Boolean);

    return lines.join("\n");
  }

  // ----------------------------
  // MODALS CONTENT
  // ----------------------------
  function modalTime() {
    const html = `
      <h3>Срок ремонта</h3>
      <p class="muted">
        Срок зависит от модели, сложности неисправности и наличия запчастей.
        Точные сроки называем после диагностики — без сюрпризов.
      </p>
      <ul class="ul">
        <li><b>Типовые работы</b> (разъём, чистка, простые замены) — часто <b>в день обращения</b> при наличии деталей.</li>
        <li><b>Средняя сложность</b> — обычно <b>1–3 дня</b>.</li>
        <li><b>Сложный ремонт платы</b> или редкие запчасти — согласуем индивидуально после диагностики.</li>
      </ul>
      <div class="uiActions">
        <button class="btn btn--primary" type="button" data-act="tg">Написать в Telegram</button>
        <button class="btn btn--soft" type="button" data-act="wa">WhatsApp</button>
        <button class="btn btn--soft" type="button" data-act="max">MAX</button>
      </div>
    `;
    openUiModal(html);
    bindModalActions({ category: "Срок ремонта", issue: "Подскажите, пожалуйста, по срокам ремонта. Устройство: ____. Проблема: ____." });
  }

  function modalCourier() {
    const html = `
      <h3>Курьер / доставка</h3>
      <p class="muted">Заполни коротко — мы уточним детали и договоримся по времени.</p>

      <form id="courierForm" class="uiForm">
        <label class="field">
          <span>Адрес (куда/откуда)</span>
          <input name="address" placeholder="Напр.: Ростов, Ворошиловский, ..." required>
        </label>

        <div class="row">
          <label class="field">
            <span>Когда удобно</span>
            <input name="when" placeholder="Сегодня 18:00 / завтра утром" required>
          </label>
          <label class="field">
            <span>Контакт (по желанию)</span>
            <input name="contact" placeholder="+7... или @telegram">
          </label>
        </div>

        <label class="field">
          <span>Устройство</span>
          <input name="device" placeholder="Напр.: iPhone 13 / ТВ Samsung / кофемашина Philips" required>
        </label>

        <label class="field">
          <span>Что случилось</span>
          <input name="issue" placeholder="Не включается / нет изображения / протекает / ошибка..." required>
        </label>

        <label class="field">
          <span>Комментарий (необязательно)</span>
          <input name="comment" placeholder="Домофон/подъезд/время, удобный район и т.д.">
        </label>

        <div class="uiActions">
          <button class="btn btn--primary" type="submit">Отправить в Telegram</button>
          <button class="btn btn--soft" type="button" data-send="wa">WhatsApp</button>
          <button class="btn btn--soft" type="button" data-send="max">MAX</button>
        </div>
      </form>
    `;
    openUiModal(html);

    const form = qs("#courierForm");
    if (!form) return;

    async function send(kind) {
      const fd = new FormData(form);
      const msg = buildLeadMessage({
        category: "Курьер/доставка",
        address: String(fd.get("address") || "").trim(),
        when: String(fd.get("when") || "").trim(),
        model: String(fd.get("device") || "").trim(),
        issue: String(fd.get("issue") || "").trim(),
        contact: String(fd.get("contact") || "").trim(),
        comment: String(fd.get("comment") || "").trim()
      });

      if (kind === "tg") openTelegram(msg);
      if (kind === "wa") await openWhatsApp(msg);
      if (kind === "max") await openMax(msg);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      send("tg");
    });

    qsa('[data-send="wa"]').forEach(b => b.addEventListener("click", () => send("wa")));
    qsa('[data-send="max"]').forEach(b => b.addEventListener("click", () => send("max")));
  }

  function modalModels(defaultKey) {
    const key = defaultKey && MODEL_DATA[defaultKey] ? defaultKey : "phone";
    const tabs = Object.entries(MODEL_DATA).map(([k, v]) => {
      const active = k === key ? " is-active" : "";
      return `<button type="button" class="uiTab${active}" data-tab="${escHtml(k)}">${escHtml(v.title)}</button>`;
    }).join("");

    const html = `
      <h3>Узнать стоимость</h3>
      <p class="muted">Выбери категорию, бренд и модель. Можно писать модель вручную — мы всё равно поможем.</p>

      <div class="uiTabs">${tabs}</div>

      <div class="uiGrid">
        <div>
          <div class="muted" style="font-weight:900;margin-bottom:6px">Бренд</div>
          <select id="brandSelect"></select>
          <div class="muted" style="font-weight:900;margin:12px 0 6px">Модель</div>
          <input id="modelInput" placeholder="Напр.: iPhone 13 Pro / Samsung A54 / LG 55UJ..." />
          <datalist id="modelHints"></datalist>

          <div class="muted" style="font-weight:900;margin:12px 0 6px">Проблема</div>
          <input id="issueInput" placeholder="Не включается / нет изображения / протекает / ошибка..." />

          <div class="row" style="margin-top:10px">
            <label class="field">
              <span>Срочность</span>
              <select id="urgentSelect">
                <option>Не срочно</option>
                <option>Сегодня</option>
                <option>Срочно</option>
              </select>
            </label>
            <label class="field">
              <span>Контакт (по желанию)</span>
              <input id="contactInput" placeholder="+7... или @telegram">
            </label>
          </div>

          <div class="uiActions" style="margin-top:12px">
            <button class="btn btn--primary" type="button" data-send="tg">Отправить в Telegram</button>
            <button class="btn btn--soft" type="button" data-send="wa">WhatsApp</button>
            <button class="btn btn--soft" type="button" data-send="max">MAX</button>
          </div>
        </div>

        <div class="uiSide">
          <div class="uiSide__title">Подсказки по брендам/моделям</div>
          <div class="uiSide__list" id="hintList"></div>
          <div class="uiSide__note muted">
            Нет вашей модели в подсказках? Просто впишите её вручную — мы всё равно подскажем цену и сроки.
          </div>
        </div>
      </div>
    `;

    openUiModal(html);

    // state
    let currentKey = key;
    const brandSelect = qs("#brandSelect");
    const modelInput = qs("#modelInput");
    const issueInput = qs("#issueInput");
    const urgentSelect = qs("#urgentSelect");
    const contactInput = qs("#contactInput");
    const hintList = qs("#hintList");

    function fillFor(k) {
      currentKey = k;
      const data = MODEL_DATA[k];

      // brands
      const brands = data.groups.map(g => g.name);
      brandSelect.innerHTML = brands.map((b, i) => `<option value="${escHtml(b)}"${i===0?" selected":""}>${escHtml(b)}</option>`).join("");

      // hints list + datalist
      const hints = data.groups.flatMap(g => g.suggestions || []);
      const dl = qs("#modelHints");
      if (dl) dl.innerHTML = hints.map(x => `<option value="${escHtml(x)}"></option>`).join("");
      if (modelInput) modelInput.setAttribute("list", "modelHints");

      if (hintList) {
        hintList.innerHTML = data.groups.map(g => `
          <div class="uiHintGroup">
            <div class="uiHintGroup__name">${escHtml(g.name)}</div>
            <div class="uiHintGroup__chips">
              ${(g.suggestions || []).map(s => `<button type="button" class="uiChip" data-sugg="${escHtml(s)}">${escHtml(s)}</button>`).join("")}
            </div>
          </div>
        `).join("");
      }

      qsa(".uiTab").forEach(t => t.classList.toggle("is-active", t.dataset.tab === k));
    }

    fillFor(currentKey);

    // clicking suggestion chips
    document.addEventListener("click", (e) => {
      const b = e.target.closest(".uiChip");
      if (!b || !b.dataset.sugg) return;
      if (!qs("#uiModal")?.classList.contains("open")) return;
      modelInput.value = b.dataset.sugg;
      modelInput.focus();
    }, { passive: true });

    // tabs
    qsa(".uiTab").forEach(btn => {
      btn.addEventListener("click", () => fillFor(btn.dataset.tab));
    });

    async function send(kind) {
      const msg = buildLeadMessage({
        category: MODEL_DATA[currentKey].title,
        brand: String(brandSelect.value || "").trim(),
        model: String(modelInput.value || "").trim(),
        issue: String(issueInput.value || "").trim(),
        urgent: String(urgentSelect.value || "").trim(),
        contact: String(contactInput.value || "").trim()
      });

      if (kind === "tg") openTelegram(msg);
      if (kind === "wa") await openWhatsApp(msg);
      if (kind === "max") await openMax(msg);
    }

    qsa('[data-send="tg"]').forEach(b => b.addEventListener("click", () => send("tg")));
    qsa('[data-send="wa"]').forEach(b => b.addEventListener("click", () => send("wa")));
    qsa('[data-send="max"]').forEach(b => b.addEventListener("click", () => send("max")));
  }

  function bindModalActions(payloadForMsg) {
    const modal = qs("#uiModal");
    if (!modal) return;

    const mk = (kind) => {
      const msg = buildLeadMessage({
        category: payloadForMsg.category,
        issue: payloadForMsg.issue,
        contact: ""
      });
      if (kind === "tg") openTelegram(msg);
      if (kind === "wa") openWhatsApp(msg);
      if (kind === "max") openMax(msg);
    };

    qsa('[data-act="tg"]', modal).forEach(b => b.addEventListener("click", () => mk("tg")));
    qsa('[data-act="wa"]', modal).forEach(b => b.addEventListener("click", () => mk("wa")));
    qsa('[data-act="max"]', modal).forEach(b => b.addEventListener("click", () => mk("max")));
  }

  // ----------------------------
  // INIT AFTER DOM READY
  // ----------------------------
  function init() {
    document.documentElement.classList.add("js");

    // year
    const y = qs("#year");
    if (y) y.textContent = String(new Date().getFullYear());

    // mobile menu
    const burger = qs("#burger");
    const mnav = qs("#mnav");
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

    // smooth anchors
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = qs(id);
      if (!el) return;
      e.preventDefault();
      safeScrollTo(id);
      setMenu(false);
    });

    // FAQ accordion (если разметка .qa/.qa__q есть — откроется; если нет — не мешаем)
    const faq = qs("#faqList");
    if (faq) {
      faq.addEventListener("click", (e) => {
        const btn = e.target.closest(".qa__q");
        if (!btn) return;
        const box = btn.closest(".qa");
        if (!box) return;
        box.classList.toggle("open");
      });
    }

    // =============
    // ВАЖНО: перехват кликов по CHIP-кнопкам (data-template)
    // =============
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-template]");
      if (!b) return;

      const key = b.getAttribute("data-template");
      if (!key) return;

      // Наши новые сценарии
      if (key === "time") { e.preventDefault(); modalTime(); return; }
      if (key === "pickup") { e.preventDefault(); modalCourier(); return; }
      if (key === "water") { e.preventDefault(); modalModels("phone"); return; }
      if (key === "tv") { e.preventDefault(); modalModels("tv"); return; }
      if (key === "coffee") { e.preventDefault(); modalModels("coffee"); return; }
      if (key === "print") { e.preventDefault(); modalModels("print"); return; }
      if (key === "price") { e.preventDefault(); modalModels("phone"); return; }

      // fallback: открыть Telegram с шаблоном
      const msg = "Здравствуйте! Подскажите, пожалуйста. Устройство: ____. Проблема: ____.";
      openTelegram(msg);
    });

    // Перехват "Узнать цену" на карточках услуг (data-service)
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-service]");
      if (!b) return;
      const k = b.getAttribute("data-service");
      if (!k) return;

      // вместо редиректа в TG — открываем окно моделей
      e.preventDefault();
      if (k === "phone") modalModels("phone");
      else if (k === "pc") modalModels("pc");
      else if (k === "tv") modalModels("tv");
      else if (k === "coffee") modalModels("coffee");
      else if (k === "dyson") modalModels("dyson");
      else modalModels("phone");
    });

    // Lead form (герой) — оставляем вашу текущую логику, но делаем безопасно:
    const leadForm = qs("#leadForm");
    if (leadForm) {
      leadForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const device = (qs("#leadDevice")?.value || "").trim();
        const problem = (qs("#leadProblem")?.value || "").trim();
        const urgency = (qs("#leadUrgency")?.value || "").trim();
        const contact = (qs("#leadContact")?.value || "").trim();

        const msg = buildLeadMessage({
          category: "Заявка",
          model: device,
          issue: problem,
          urgent: urgency,
          contact
        });
        openTelegram(msg);
      });
    }

    const sendWhatsApp = qs("#sendWhatsApp");
    if (sendWhatsApp) {
      sendWhatsApp.addEventListener("click", async () => {
        const device = (qs("#leadDevice")?.value || "").trim();
        const problem = (qs("#leadProblem")?.value || "").trim();
        const urgency = (qs("#leadUrgency")?.value || "").trim();
        const contact = (qs("#leadContact")?.value || "").trim();
        const msg = buildLeadMessage({ category: "Заявка", model: device, issue: problem, urgent: urgency, contact });
        await openWhatsApp(msg);
      });
    }

    const sendMaxBtn = qs("#sendMax");
    if (sendMaxBtn) {
      sendMaxBtn.addEventListener("click", async () => {
        const device = (qs("#leadDevice")?.value || "").trim();
        const problem = (qs("#leadProblem")?.value || "").trim();
        const urgency = (qs("#leadUrgency")?.value || "").trim();
        const contact = (qs("#leadContact")?.value || "").trim();
        const msg = buildLeadMessage({ category: "Заявка", model: device, issue: problem, urgent: urgency, contact });
        await openMax(msg);
      });
    }

    // Mobile MAX open button (если есть)
    const maxOpenM = qs("#maxOpenM");
    if (maxOpenM) {
      maxOpenM.addEventListener("click", () => window.open(LINKS.max, "_blank", "noopener,noreferrer"));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();