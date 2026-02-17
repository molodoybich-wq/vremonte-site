(() => {
  "use strict";

  const GAS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxqaJfhNC5MbGbUCOPRola4NTWCp784hVHrOYuJyjROqRUmlEhBxHLfgD1qDBKLsYll/exec";
  const TG_SHARE = "https://t.me/share/url";
  const TG_USER = "vremonte761";
  const VK_URL = "https://vk.com/vremonte161";
  const MAX_LINK = "https://max.ru/u/f9LHodD0cOIcyLKszOi0I1wOwGuyOltplh3obPyqkL7_jwUK6DRgug2lKI8";
  const PHONE = "+79255156161";

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const t = (s) => (typeof s === "string" ? s.trim() : "");

  function ymGoal(name){
    try {
      if (typeof window.ym === "function") {
        // id метрики у тебя 106611877
        window.ym(106611877, "reachGoal", name);
      }
    } catch(_){}
  }

  function copyToClipboard(text){
    try {
      navigator.clipboard.writeText(text);
      return true;
    } catch(_) {
      return false;
    }
  }

  function buildLeadMessage(lead){
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

  function collectLead(fromForm){
    const device = t(fromForm?.querySelector('[name="device"]')?.value);
    const problem = t(fromForm?.querySelector('[name="issue"],[name="problem"]')?.value);
    const contact = t(fromForm?.querySelector('[name="contact"]')?.value);
    // у тебя select name="urgent"
    const urgency = t(fromForm?.querySelector('[name="urgent"],[name="urgency"],select')?.value);

    return {
      device, problem, contact, urgency,
      page: location.href,
      ts: Date.now()
    };
  }

  async function sendLeadToGAS(lead, channel){
    try {
      const payload = { ...lead, channel };
      const res = await fetch(GAS_WEBAPP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true
      });
      const data = await res.json().catch(() => ({}));
      return !!(res.ok && data && data.ok === true);
    } catch (e) {
      console.warn("[lead] GAS send failed", e);
      return false;
    }
  }

  function openTelegram(text){
    // делаем share url + text
    const url = TG_SHARE + "?url=" + encodeURIComponent(location.href) + "&text=" + encodeURIComponent(text);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function openVK(text){
    // VK универсально: копируем текст, открываем страницу/чат
    copyToClipboard(text);
    window.open(VK_URL, "_blank", "noopener,noreferrer");
  }

  function openMAX(text){
    const url = MAX_LINK + (MAX_LINK.includes("?") ? "&" : "?") + "text=" + encodeURIComponent(text);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function bindBurger(){
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

    $$("#mobileNav a").forEach(a => {
      a.addEventListener("click", () => {
        burger.setAttribute("aria-expanded", "false");
        mobileNav.classList.remove("is-open");
        mobileNav.setAttribute("aria-hidden", "true");
      });
    });
  }

  function bindToTop(){
    const btn = $("#toTop");
    if (!btn) return;
    const onScroll = () => {
      btn.classList.toggle("is-show", window.scrollY > 700);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function bindCookie(){
    const banner = $("#cookieBanner");
    const accept = $("#cookieAccept");
    const close = $("#cookieClose");
    if (!banner) return;

    const key = "cookie_ok_v1";
    if (localStorage.getItem(key) === "1") {
      banner.style.display = "none";
      return;
    }

    const hide = () => {
      banner.style.display = "none";
      localStorage.setItem(key, "1");
      ymGoal("cookie_accept");
    };

    accept?.addEventListener("click", hide);
    close?.addEventListener("click", () => {
      banner.style.display = "none";
      ymGoal("cookie_close");
    });
  }

  function bindFAQ(){
    $$("#faqList .qa").forEach(qa => {
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

  function bindIssueChips(){
    const chipsWrap = document.querySelector("[data-issue-chips]");
    if (!chipsWrap) return;
    chipsWrap.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-issue]");
      if (!btn) return;
      const issue = t(btn.getAttribute("data-issue"));
      const form = btn.closest("form");
      const problemInput = form?.querySelector('[name="issue"],[name="problem"]');
      if (problemInput) problemInput.value = issue;

      // visual selected
      $$(".chip--mini", chipsWrap).forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  }

  function bindQuickServiceButtons(){
    $$(".quick__btn").forEach(b => {
      b.addEventListener("click", () => {
        const service = b.getAttribute("data-service");
        const map = {
          phone: "Телефон",
          pc: "ПК / ноутбук",
          tv: "Телевизор",
          coffee: "Кофемашина",
          printer: "Принтер",
          dyson: "Dyson",
          ps: "Приставка"
        };
        const form = $("#leadForm") || $("#leadForm2");
        if (form) {
          const device = form.querySelector('[name="device"]');
          if (device) device.value = map[service] || "";
        }
        const leadSection = document.getElementById("lead");
        if (leadSection) leadSection.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  function bindLeadButtons(){
    // две формы: leadForm (в первом экране) и leadForm2 (внизу)
    const forms = [$("#leadForm"), $("#leadForm2")].filter(Boolean);

    function wire(form, tgBtnId, vkBtnId, maxBtnId){
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

      tgBtn?.addEventListener("click", async () => {
        const lead = validate(); if (!lead) return;
        const msg = buildLeadMessage(lead);
        ymGoal("send_tg");
        sendLeadToGAS(lead, "TELEGRAM"); // не ждём
        openTelegram(msg);
      });

      vkBtn?.addEventListener("click", async () => {
        const lead = validate(); if (!lead) return;
        const msg = buildLeadMessage(lead);
        ymGoal("send_vk");
        sendLeadToGAS(lead, "VK");
        openVK(msg);
        alert("Текст заявки скопирован. Вставь его в сообщение VK и отправь ✅");
      });

      mxBtn?.addEventListener("click", async () => {
        const lead = validate(); if (!lead) return;
        const msg = buildLeadMessage(lead);
        ymGoal("send_max");
        sendLeadToGAS(lead, "MAX");
        openMAX(msg);
      });
    }

    // верхняя форма
    wire($("#leadForm"), "sendTg", "sendVk", "sendMax");
    // нижняя форма
    wire($("#leadForm2"), "sendTg2", "sendVk2", "sendMax2");
  }

  function bindGlobalClicks(){
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      const href = t(a.getAttribute("href") || "");
      if (!href) return;
      if (href.startsWith("tel:")) ymGoal("click_tel");
      if (href.includes("t.me/")) ymGoal("click_tg");
      if (href.includes("vk.com/")) ymGoal("click_vk");
      if (href.includes("max.ru/")) ymGoal("click_max");
      if (href.includes("yandex.ru/profile") || href.includes("yandex.ru/maps")) ymGoal("open_map");
      if (href.includes("2gis")) ymGoal("open_reviews_2gis");
    });
  }

  function setYear(){
    const y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());
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
    bindGlobalClicks();
  });
})();
