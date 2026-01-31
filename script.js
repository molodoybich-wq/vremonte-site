(() => {
  "use strict";
  document.documentElement.classList.add("js");

  const LINKS = {
    tgUser: "vremonte161",
    tg: "https://t.me/vremonte161",
    wa: "https://wa.me/message/BMMLIHWUSQRHC1",
    max: "https://max.ru/u/f9LHodD0cOIcyLKszOi0I1wOwGuyOltplh3obPyqkL7_jwUK6DRgug2lKI8",
    phone: "tel:+79255156161",
  };

  // =========
  // Helpers
  // =========
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, (m) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[m]));
  }

  async function copyToClipboard(text) {
    const t = String(text || "");
    if (!t) return true;
    try {
      await navigator.clipboard.writeText(t);
      return true;
    } catch (_) {
      const ta = document.createElement("textarea");
      ta.value = t;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (_2) {}
      ta.remove();
      return true;
    }
  }

  function openTelegramWithText(text) {
    const url = `${LINKS.tg}?text=${encodeURIComponent(String(text || ""))}`;
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

  // =========
  // Year
  // =========
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());

  // =========
  // Mobile menu
  // =========
  const burger = $("#burger");
  const mnav = $("#mnav");

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

  // =========
  // Smooth anchors
  // =========
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

  // =========
  // Reveal
  // =========
  const reveal = $$(".reveal");
  if (reveal.length) {
    if (!("IntersectionObserver" in window)) {
      reveal.forEach((el) => el.classList.add("in"));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) en.target.classList.add("in"); });
      }, { threshold: 0.12 });
      reveal.forEach((el) => io.observe(el));
    }
  }

  // =========
  // FAQ accordion
  // =========
  const faq = $("#faqList");
  if (faq) {
    faq.addEventListener("click", (e) => {
      const btn = e.target.closest(".qa__q");
      if (!btn) return;
      const box = btn.closest(".qa");
      if (!box) return;
      box.classList.toggle("open");
    });
  }

  // =========
  // Photo modal (before/after)
  // =========
  const modal = $("#modal");
  const modalImg = $("#modalImg");
  const modalClose = $("#modalClose");

  function openPhoto(src) {
    if (!modal || !modalImg) return;
    modalImg.src = src;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closePhoto() {
    if (!modal || !modalImg) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    modalImg.src = "";
  }

  $$("[data-photo]").forEach((b) => b.addEventListener("click", () => openPhoto(b.getAttribute("data-photo"))));
  if (modalClose) modalClose.addEventListener("click", closePhoto);
  if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) closePhoto(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePhoto(); });

// =========
// UI Modal (generic)
// =========
function getUiModal() {
  return {
    modal: document.getElementById("uiModal"),
    content: document.getElementById("uiModalContent"),
  };
}

function openUiModal(html) {
  const { modal, content } = getUiModal();
  if (!modal || !content) return;
  content.innerHTML = html;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeUiModal() {
  const { modal, content } = getUiModal();
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  if (content) content.innerHTML = "";
  document.body.classList.remove("modal-open");
}

// Close buttons/backdrop inside the modal
document.addEventListener("click", (e) => {
  const el = e.target;
  if (!el) return;
  if (el.dataset && el.dataset.close === "1") closeUiModal();
});

// Esc closes UI modal
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const { modal } = getUiModal();
  if (modal && modal.classList.contains("open")) closeUiModal();
});

  }

  // =========
  // Lead form message builder
  // =========
  function buildLeadMessage(extra = {}) {
    const device = ($("#leadDevice")?.value || "").trim();
    const problem = ($("#leadProblem")?.value || "").trim();
    const urgency = ($("#leadUrgency")?.value || "").trim();
    const contact = ($("#leadContact")?.value || "").trim();

    const lines = ["Здравствуйте! Хочу оставить заявку на ремонт."];
    if (extra.category) lines.push(`Категория: ${extra.category}`);
    if (extra.brand) lines.push(`Бренд: ${extra.brand}`);
    if (extra.model) lines.push(`Модель: ${extra.model}`);
    if (device) lines.push(`Устройство: ${device}`);
    if (problem) lines.push(`Проблема: ${problem}`);
    if (urgency) lines.push(`Срочность: ${urgency}`);
    if (contact) lines.push(`Контакт: ${contact}`);
    if (extra.address) lines.push(`Адрес (для курьера): ${extra.address}`);
    if (extra.when) lines.push(`Когда удобно: ${extra.when}`);
    if (extra.comment) lines.push(`Комментарий: ${extra.comment}`);
    lines.push("");
    lines.push("Отправлено с сайта vremonte61.online");
    return lines.join("\n");
  }

  // Bind lead form: Telegram by submit
  const leadForm = $("#leadForm");
  if (leadForm) {
    leadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      openTelegramWithText(buildLeadMessage());
    });
  }

  const sendWhatsApp = $("#sendWhatsApp");
  if (sendWhatsApp) sendWhatsApp.addEventListener("click", () => openWhatsApp(buildLeadMessage()));
  const sendMax = $("#sendMax");
  if (sendMax) sendMax.addEventListener("click", () => openMax(buildLeadMessage()));

  // =========
  // Chips / quick actions
  // =========
  function openTimeInfo() {
    const text = "Здравствуйте! Подскажите, пожалуйста, по срокам ремонта. Устройство: ____. Проблема: ____.";
    openUiModal(`
      <h3>Срок ремонта</h3>
      <p class="muted">Срок зависит от модели, сложности неисправности и наличия запчастей.</p>
      <ul class="ul">
        <li><b>Типовые работы</b> (разъём, чистка, простые замены) — часто <b>в день обращения</b> при наличии деталей.</li>
        <li><b>Средняя сложность</b> — обычно <b>1–3 дня</b>.</li>
        <li><b>Сложный ремонт платы</b> или редкие запчасти — срок согласуем после диагностики.</li>
      </ul>
      <div class="actions">
        <button class="btn btn--primary" type="button" data-send="tg">Написать в Telegram</button>
        <button class="btn btn--soft" type="button" data-send="wa">WhatsApp</button>
        <button class="btn btn--soft" type="button" data-send="max">MAX</button>
      </div>
    `);
    setTimeout(() => {
      $$("[data-send]").forEach((b) => {
        b.addEventListener("click", async () => {
          const k = b.getAttribute("data-send");
          if (k === "tg") openTelegramWithText(text);
          if (k === "wa") await openWhatsApp(text);
          if (k === "max") await openMax(text);
          closeUiModal();
        });
      });
    }, 0);
  }

  function openPickupForm() {
    openUiModal(`
      <h3>Курьер / доставка</h3>
      <p class="muted">Заполни короткую форму — мы уточним детали и подскажем по времени.</p>

      <form class="form" id="pickupForm">
        <label class="field">
          <span>Адрес</span>
          <input name="address" placeholder="Город, улица, дом, подъезд (если нужно)" required>
        </label>
        <div class="row">
          <label class="field">
            <span>Когда удобно</span>
            <input name="when" placeholder="Сегодня после 18:00 / завтра 12–15" required>
          </label>
          <label class="field">
            <span>Устройство</span>
            <input name="device" placeholder="Напр.: iPhone 13 / ТВ Samsung / кофемашина" required>
          </label>
        </div>
        <label class="field">
          <span>Что случилось</span>
          <input name="problem" placeholder="Не включается / нет изображения / ошибка / протечка" required>
        </label>
        <label class="field">
          <span>Комментарий (необязательно)</span>
          <input name="comment" placeholder="Домофон, ориентир, важные нюансы">
        </label>

        <div class="actions">
          <button class="btn btn--primary" type="submit">Отправить в Telegram</button>
          <button class="btn btn--soft" type="button" id="pickupWA">WhatsApp</button>
          <button class="btn btn--soft" type="button" id="pickupMAX">MAX</button>
        </div>
      </form>
    `);

    setTimeout(() => {
      const form = $("#pickupForm");
      if (!form) return;

      function makeMsg() {
        const fd = new FormData(form);
        const address = String(fd.get("address") || "").trim();
        const when = String(fd.get("when") || "").trim();
        const device = String(fd.get("device") || "").trim();
        const problem = String(fd.get("problem") || "").trim();
        const comment = String(fd.get("comment") || "").trim();

        return buildLeadMessage({
          category: "Курьер / доставка",
          address,
          when,
          model: device,
          comment: problem + (comment ? `; ${comment}` : "")
        });
      }

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        openTelegramWithText(makeMsg());
        closeUiModal();
      });

      $("#pickupWA")?.addEventListener("click", async () => {
        await openWhatsApp(makeMsg());
        closeUiModal();
      });

      $("#pickupMAX")?.addEventListener("click", async () => {
        await openMax(makeMsg());
        closeUiModal();
      });
    }, 0);
  }

  // =========
  // Models selector (price inquiry)
  // =========
  const MODEL_DATA = {
    phones: {
      title: "Телефоны",
      groups: [
        { name: "Apple iPhone", models: [
          "iPhone 7 / 7 Plus","iPhone 8 / 8 Plus","iPhone X","iPhone XR","iPhone XS / XS Max",
          "iPhone 11","iPhone 11 Pro / Pro Max","iPhone 12 mini","iPhone 12","iPhone 12 Pro / Pro Max",
          "iPhone 13 mini","iPhone 13","iPhone 13 Pro / Pro Max",
          "iPhone 14","iPhone 14 Plus","iPhone 14 Pro / Pro Max",
          "iPhone 15","iPhone 15 Plus","iPhone 15 Pro / Pro Max",
          "iPhone 16","iPhone 16 Plus","iPhone 16 Pro / Pro Max",
          "iPhone 17 (если есть)","Другой iPhone (впиши модель)"
        ]},
        { name: "Android (бренд)", models: [
          "Samsung Galaxy (A / S / Note / Z)","Xiaomi / Redmi / POCO","Huawei / Honor",
          "Realme","OPPO / OnePlus","Tecno / Infinix","Google Pixel","Vivo",
          "Другой Android (впиши модель)"
        ]}
      ]
    },
    laptops: {
      title: "ПК / ноутбуки",
      groups: [
        { name: "Ноутбуки", models: ["Asus","Acer","Lenovo","HP","Dell","MSI","Huawei","Xiaomi","Apple MacBook","Другой (впиши)"] },
        { name: "ПК / моноблоки", models: ["Системный блок","Моноблок","Игровой ПК","Другое (впиши)"] }
      ]
    },
    tvs: {
      title: "Телевизоры",
      groups: [
        { name: "Бренд", models: ["Samsung","LG","Sony","Philips","TCL","Hisense","Xiaomi","Haier","BBK","Другой (впиши)"] }
      ]
    },
    coffee: {
      title: "Кофемашины",
      groups: [
        { name: "Бренд", models: ["De'Longhi","Philips","Saeco","Jura","Bosch","Krups","Nivona","Siemens","Gaggia","Другой (впиши)"] }
      ]
    },
    dyson: {
      title: "Dyson / бытовая",
      groups: [
        { name: "Dyson", models: ["V6","V7","V8","V10","V11","V12","V15","Supersonic (фен)","Airwrap","Другое (впиши)"] },
        { name: "Другая бытовая", models: ["Пылесос","Робот-пылесос","Блендер/кухонная","Другое (впиши)"] }
      ]
    },
    printers: {
      title: "Принтеры",
      groups: [
        { name: "Бренд", models: ["HP","Canon","Epson","Brother","Samsung","Xerox","Kyocera","Ricoh","Pantum","Другой (впиши)"] }
      ]
    },
    tablets: {
      title: "Планшеты",
      groups: [
        { name: "Бренд", models: ["Apple iPad","Samsung Tab","Huawei","Lenovo","Xiaomi","Другой (впиши)"] }
      ]
    },
    consoles: {
      title: "Приставки",
      groups: [
        { name: "Платформа", models: ["PlayStation 4","PlayStation 5","Xbox One","Xbox Series S/X","Nintendo Switch","Другая (впиши)"] }
      ]
    },
    all: {
      title: "Что ремонтируем",
      groups: [
        { name: "Категория", models: [
          "Телефоны (Apple/Android)","ПК и ноутбуки","Телевизоры","Кофемашины","Принтеры","Dyson/бытовая","Планшеты","Приставки","Другое (впиши)"
        ]}
      ]
    }
  };

  function openModelsSelector(initialKey = "all") {
    let currentKey = MODEL_DATA[initialKey] ? initialKey : "all";
    let currentBrand = "";
    let currentModel = "";

    const tabs = [
      ["phones","Телефоны"],
      ["laptops","ПК/ноут"],
      ["tvs","ТВ"],
      ["coffee","Кофемашины"],
      ["printers","Принтеры"],
      ["dyson","Dyson"],
      ["tablets","Планшеты"],
      ["consoles","Приставки"],
      ["all","Другое"]
    ];

    function render() {
      const d = MODEL_DATA[currentKey];
      const tabHtml = tabs.map(([k, label]) => `
        <button class="chip ${k===currentKey?'chip--alt':''}" type="button" data-tab="${k}">${label}</button>
      `).join("");

      const groupsHtml = d.groups.map((g, gi) => {
        const items = g.models.map((m) => `
          <button type="button" class="modelbtn" data-brand="${esc(g.name)}" data-model="${esc(m)}">${esc(m)}</button>
        `).join("");
        return `
          <div class="card" style="padding:14px; margin-top:10px">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:10px">
              <b>${esc(g.name)}</b>
              <span class="muted" style="font-size:12px">выбери вариант или впиши</span>
            </div>
            <div class="modelsgrid">${items}</div>
          </div>
        `;
      }).join("");

      openUiModal(`
        <h3>Узнать цену</h3>
        <p class="muted">Выбери категорию и модель — мы сформируем готовый текст заявки.</p>
        <div class="chips" style="margin:10px 0 6px">${tabHtml}</div>

        ${groupsHtml}

        <div class="card" style="margin-top:10px; padding:14px">
          <div class="row">
            <label class="field">
              <span>Модель (если нужно уточнить)</span>
              <input id="mModel" placeholder="Напр.: Samsung A54 / LG 55NANO / DeLonghi ECAM" value="${esc(currentModel)}">
            </label>
            <label class="field">
              <span>Проблема</span>
              <input id="mProblem" placeholder="Не включается / нет изображения / ошибка / протечка" >
            </label>
          </div>
          <div class="row">
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

          <div class="actions">
            <button class="btn btn--primary" type="button" data-send="tg">Отправить в Telegram</button>
            <button class="btn btn--soft" type="button" data-send="wa">WhatsApp</button>
            <button class="btn btn--soft" type="button" data-send="max">MAX</button>
          </div>
        </div>
      `);

      // wire up
      setTimeout(() => {
        $$("[data-tab]").forEach((b) => b.addEventListener("click", () => {
          currentKey = b.getAttribute("data-tab");
          render();
        }));

        $$(".modelbtn").forEach((b) => b.addEventListener("click", () => {
          currentBrand = b.getAttribute("data-brand") || "";
          currentModel = b.getAttribute("data-model") || "";
          const mModel = $("#mModel");
          if (mModel) mModel.value = currentModel.includes("впиши") ? "" : currentModel;
          const mProblem = $("#mProblem");
          if (mProblem) mProblem.focus();
        }));

        $$("[data-send]").forEach((b) => b.addEventListener("click", async () => {
          const d = MODEL_DATA[currentKey];
          const modelText = ($("#mModel")?.value || "").trim() || currentModel;
          const problem = ($("#mProblem")?.value || "").trim();
          const urgency = ($("#mUrgency")?.value || "").trim();
          const contact = ($("#mContact")?.value || "").trim();

          const msgLines = [
            "Здравствуйте! Хочу узнать ориентировочную стоимость ремонта.",
            `Категория: ${d.title}`,
          ];
          if (currentBrand) msgLines.push(`Бренд/группа: ${currentBrand}`);
          if (modelText) msgLines.push(`Модель: ${modelText}`);
          if (problem) msgLines.push(`Проблема: ${problem}`);
          if (urgency) msgLines.push(`Срочность: ${urgency}`);
          if (contact) msgLines.push(`Контакт: ${contact}`);
          msgLines.push("");
          msgLines.push("Отправлено с сайта vremonte61.online");

          const msg = msgLines.join("\n");
          const k = b.getAttribute("data-send");
          if (k === "tg") openTelegramWithText(msg);
          if (k === "wa") await openWhatsApp(msg);
          if (k === "max") await openMax(msg);
          closeUiModal();
        }));
      }, 0);
    }

    render();
  }

  // =========
  // Click routing
  // =========
  document.addEventListener("click", (e) => {
    const t = e.target;

    // Chips: data-template
    const chip = t.closest("[data-template]");
    if (chip) {
      const key = chip.getAttribute("data-template");
      if (key === "time") { openTimeInfo(); return; }
      if (key === "pickup") { openPickupForm(); return; }
      if (key === "water") { openModelsSelector("all"); return; }
      if (key === "tv") { openModelsSelector("tvs"); return; }
      if (key === "coffee") { openModelsSelector("coffee"); return; }
      if (key === "print") { openModelsSelector("printers"); return; }
      // default: price template -> open model selector
      if (key === "price") { openModelsSelector("all"); return; }
    }

    // Service cards: data-open="models"
    const openBtn = t.closest('[data-open="models"]');
    if (openBtn) {
      const cat = openBtn.getAttribute("data-category") || "all";
      openModelsSelector(cat);
      return;
    }
  });

})();