(() => {
  "use strict";

  // Google Apps Script Web App (exec)
  const GAS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxqaJfhNC5MbGbUCOPRola4NTWCp784hVHrOYuJyjROqRUmlEhBxHLfgD1qDBKLsYll/exec";

  const TG_SHARE = "https://t.me/share/url";
  const VK_URL = "https://vk.com/vremonte161";
  const MAX_LINK = "https://max.ru/u/f9LHodD0cOIcyLKszOi0I1wOwGuyOltplh3obPyqkL7_jwUK6DRgug2lKI8";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const t = (s) => (typeof s === "string" ? s.trim() : "");

  function ymGoal(name) {
    try {
      if (typeof window.ym === "function") window.ym(106611877, "reachGoal", name);
    } catch (_) {}
  }

  function copyToClipboard(text) {
    try {
      navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      return false;
    }
  }

  function buildLeadMessage(lead) {
    const lines = [
      "Заявка с сайта vremonte61.online",
      lead.device ? `Устройство: ${lead.device}` : null,
      lead.problem ? `Проблема: ${lead.problem}` : null,
      lead.urgency ? `Срочность: ${lead.urgency}` : null,
      lead.contact ? `Контакт: ${lead.contact}` : null,
      lead.page ? `Страница: ${lead.page}` : null,
    ].filter(Boolean);
    return lines.join("\n");
  }

  function collectLead(fromForm) {
    const device = t(fromForm?.querySelector('[name="device"]')?.value);
    const problem = t(fromForm?.querySelector('[name="issue"],[name="problem"]')?.value);
    const contact = t(fromForm?.querySelector('[name="contact"]')?.value);
    // у тебя select name="urgent"
    const urgency = t(fromForm?.querySelector('[name="urgent"],[name="urgency"],select')?.value);

    return { device, problem, contact, urgency, page: location.href, ts: Date.now() };
  }

  // ⭐ ВАЖНО: Apps Script часто блокируется CORS при application/json.
  // Поэтому отправляем БЕЗ заголовков, в режиме no-cors — запрос уходит без preflight.
  async function sendLeadToGAS(lead, channel) {
    try {
      const payload = { ...lead, channel };
      await fetch(GAS_WEBAPP_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(payload),
        keepalive: true,
      });
      return true;
    } catch (e) {
      console.warn("[lead] GAS send failed", e);
      return false;
    }
  }

  function openTelegram(text) {
    const url = TG_SHARE + "?url=" + encodeURIComponent(location.href) + "&text=" + encodeURIComponent(text);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function openVK(text) {
    copyToClipboard(text);
    window.open(VK_URL, "_blank", "noopener,noreferrer");
  }

  function openMAX(text) {
    // если MAX не поддерживает параметр text — ничего страшного, просто откроется чат
    const url = MAX_LINK + (MAX_LINK.includes("?") ? "&" : "?") + "text=" + encodeURIComponent(text);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function bindBurger() {
    const burger = $("#burger");
    const mobileNav = $("#mobileNav");
    if (!burger || !mobileNav) return;

    burger.addEventListener("click", () => {
      const open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      mobileNav.classList.toggle("is-open", !open);
      mobileNav.setAttribute("aria-hidden", String(open));
      ymGoal("burger_toggle");
    });

    $$("#mobileNav a").forEach((a) => {
      a.addEventListener("click", () => {
        burger.setAttribute("aria-expanded", "false");
        mobileNav.classList.remove("is-open");
        mobileNav.setAttribute("aria-hidden", "true");
      });
    });
  }

  function bindToTop() {
    const btn = $("#toTop");
    if (!btn) return;
    const onScroll = () => btn.classList.toggle("is-show", window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  function bindCookie() {
    const banner = $("#cookieBanner");
    const accept = $("#cookieAccept");
    const close = $("#cookieClose");
    if (!banner) return;

    const key = "cookie_ok_v1";
    if (localStorage.getItem(key) === "1") {
      banner.style.display = "none";
      return;
    }

    const acceptFn = () => {
      banner.style.display = "none";
      localStorage.setItem(key, "1");
      ymGoal("cookie_accept");
    };

    accept?.addEventListener("click", acceptFn);
    close?.addEventListener("click", () => {
      banner.style.display = "none";
      ymGoal("cookie_close");
    });
  }

  function bindFAQ() {
    $$("#faqList .qa").forEach((qa) => {
      const q = $(".qa__q", qa);
      const a = $(".qa__a", qa);
      if (!q || !a) return;
      a.style.display = "none";
      q.addEventListener("click", () => {
        const open = a.style.display !== "none";
        a.style.display = open ? "none" : "block";
        qa.classList.toggle("is-open", !open);
      });
    });
  }

  function bindIssueChips() {
    const chipsWrap = document.querySelector("[data-issue-chips]");
    if (!chipsWrap) return;
    chipsWrap.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-issue]");
      if (!btn) return;
      const issue = t(btn.getAttribute("data-issue"));
      const form = btn.closest("form");
      const problemInput = form?.querySelector('[name="issue"],[name="problem"]');
      if (problemInput) problemInput.value = issue;

      $$(".chip--mini", chipsWrap).forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  }

  function bindQuickServiceButtons() {
    $$(".quick__btn").forEach((b) => {
      b.addEventListener("click", () => {
        const service = b.getAttribute("data-service");
        const map = {
          phone: "Телефон",
          pc: "ПК / ноутбук",
          tv: "Телевизор",
          coffee: "Кофемашина",
          printer: "Принтер",
          dyson: "Dyson",
          ps: "Приставка",
        };
        const form = $("#leadForm") || $("#leadForm2");
        if (form) {
          const device = form.querySelector('[name="device"]');
          if (device) device.value = map[service] || "";
        }
        document.getElementById("lead")?.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  function bindLeadButtons() {
    const wire = (formId, tgBtnId, vkBtnId, maxBtnId) => {
      const form = document.getElementById(formId);
      if (!form) return;

      const tgBtn = document.getElementById(tgBtnId);
      const vkBtn = document.getElementById(vkBtnId);
      const mxBtn = document.getElementById(maxBtnId);

      const validate = () => {
        const lead = collectLead(form);
        if (!lead.device || !lead.problem) {
          alert("Заполни, пожалуйста: Устройство и Проблема.");
          return null;
        }
        return lead;
      };

      tgBtn?.addEventListener("click", () => {
        const lead = validate();
        if (!lead) return;
        const msg = buildLeadMessage(lead);
        ymGoal("send_tg");
        sendLeadToGAS(lead, "TELEGRAM"); // не ждём
        openTelegram(msg);
      });

      vkBtn?.addEventListener("click", () => {
        const lead = validate();
        if (!lead) return;
        const msg = buildLeadMessage(lead);
        ymGoal("send_vk");
        sendLeadToGAS(lead, "VK");
        openVK(msg);
        alert("Текст заявки скопирован. Вставь его в сообщение VK и отправь ✅");
      });

      mxBtn?.addEventListener("click", () => {
        const lead = validate();
        if (!lead) return;
        const msg = buildLeadMessage(lead);
        ymGoal("send_max");
        sendLeadToGAS(lead, "MAX");
        openMAX(msg);
      });
    };

    wire("leadForm", "sendTg", "sendVk", "sendMax");
    wire("leadForm2", "sendTg2", "sendVk2", "sendMax2");
  }

  function setYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  
  // Quick Price (Оценка стоимости за 30 секунд)
  function bindQuickPrice() {
    const deviceEl = document.getElementById("qpDevice");
    const problemEl = document.getElementById("qpProblem");
    const priceEl = document.getElementById("qpPrice");
    const descEl = document.getElementById("qpDesc");

    if (!deviceEl || !problemEl || !priceEl || !descEl) return;

    const DATA = {
      phone: [
        { id:"charge", label:"Не заряжается / разъём", price:"от 1800 ₽", desc:"Чистка/замена разъёма, диагностика цепей питания." },
        { id:"screen", label:"Разбит экран / нет изображения", price:"от 2500 ₽", desc:"Замена дисплея (подбор качества под бюджет)." },
        { id:"battery", label:"Быстро садится / батарея", price:"от 1900 ₽", desc:"Замена АКБ + проверка контроллера/тока утечки." },
        { id:"no_power", label:"Не включается", price:"от 1500 ₽", desc:"Диагностика питания, восстановление после падений/влаги." },
        { id:"sound", label:"Динамик/микрофон", price:"от 1200 ₽", desc:"Чистка/замена модуля, восстановление контактов." },
        { id:"camera", label:"Камера/FaceID", price:"от 1500 ₽", desc:"Диагностика шлейфов/модулей, восстановление после ударов." }
      ],
      pc: [
        { id:"charge", label:"Не заряжается / разъём питания", price:"от 2000 ₽", desc:"Разъём, цепи питания, контроллер зарядки." },
        { id:"no_boot", label:"Не включается / не грузится", price:"от 1500 ₽", desc:"Диагностика платы, RAM/SSD, прошивка BIOS." },
        { id:"overheat", label:"Перегрев / шумит", price:"от 1500 ₽", desc:"Чистка, термопаста, профилактика системы охлаждения." },
        { id:"screen", label:"Нет изображения / полосы", price:"от 1800 ₽", desc:"Шлейф/матрица, видеочип, подсветка." },
        { id:"wifi", label:"Wi‑Fi/сеть", price:"от 1200 ₽", desc:"Драйверы, модуль Wi‑Fi, диагностика антенн." }
      ],
      tv: [
        { id:"backlight", label:"Нет подсветки / темный экран", price:"от 3000 ₽", desc:"Замена подсветки + проверка драйвера/питания." },
        { id:"no_image", label:"Нет изображения, есть звук", price:"от 2500 ₽", desc:"Диагностика подсветки/матрицы/платы T‑CON." },
        { id:"no_power", label:"Не включается", price:"от 2000 ₽", desc:"Блок питания, плата управления, разъёмы." },
        { id:"hdmi", label:"HDMI/входы", price:"от 2000 ₽", desc:"Ремонт портов, пайка, восстановление дорожек." }
      ],
      coffee: [
        { id:"leak", label:"Протекает", price:"от 1800 ₽", desc:"Уплотнения, патрубки, профилактика." },
        { id:"heat", label:"Не греет / ошибка нагрева", price:"от 2000 ₽", desc:"ТЭН/термодатчики, электроника, диагностика." },
        { id:"no_water", label:"Не подает воду", price:"от 1800 ₽", desc:"Помпа, засоры, клапаны, декальцинация." },
        { id:"error", label:"Ошибка / не делает кофе", price:"от 1500 ₽", desc:"Диагностика узлов, чистка, настройка." }
      ],
      printer: [
        { id:"no_print", label:"Не печатает / полосит", price:"от 1500 ₽", desc:"Чистка, подача, диагностика картриджа/печки." },
        { id:"paper", label:"Не захватывает бумагу", price:"от 1500 ₽", desc:"Ролики, подача, узлы захвата." },
        { id:"jam", label:"Зажевывает / ошибки", price:"от 1500 ₽", desc:"Профилактика тракта, датчики, калибровка." }
      ],
      dyson: [
        { id:"no_power", label:"Не включается", price:"от 1500 ₽", desc:"Диагностика питания, платы, кнопки/контакты." },
        { id:"power_loss", label:"Теряет мощность", price:"от 1200 ₽", desc:"Чистка, фильтры, турбина, герметичность." },
        { id:"off", label:"Выключается", price:"от 1500 ₽", desc:"АКБ/контакты, перегрев, плата управления." }
      ]
    };

    function fillProblems() {
      const key = deviceEl.value;
      const list = DATA[key] || [];
      problemEl.innerHTML = "";
      if (!list.length) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "Опишите проблему текстом";
        problemEl.appendChild(opt);
        priceEl.textContent = "по запросу";
        descEl.textContent = "Напишите — подскажем цену и сроки.";
        return;
      }
      list.forEach((p) => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = p.label;
        problemEl.appendChild(opt);
      });
      // set first
      setPrice();
    }

    function setPrice() {
      const key = deviceEl.value;
      const list = DATA[key] || [];
      const found = list.find((p) => p.id === problemEl.value) || list[0];
      if (!found) return;
      priceEl.textContent = found.price;
      descEl.textContent = found.desc;
    }

    deviceEl.addEventListener("change", fillProblems);
    problemEl.addEventListener("change", setPrice);

    // init
    fillProblems();
  }

document.addEventListener("DOMContentLoaded", () => {
    setYear();
    bindBurger();
    bindToTop();
    bindCookie();
    bindFAQ();
    bindIssueChips();
    bindQuickServiceButtons();
    bindLeadButtons();
    bindQuickPrice();
  });
})();