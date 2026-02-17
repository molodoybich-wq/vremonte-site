/*!
 * leads.js — безопасная отправка заявок в Google Apps Script + открытие мессенджера
 * Не ломает модалки/верстку: не делает preventDefault, только "дублирует" отправку.
 */
(() => {
  "use strict";

  const GAS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxqaJfhNC5MbGbUCOPRola4NTWCp784hVHrOYuJyjROqRUmlEhBxHLfgD1qDBKLsYll/exec";
  const MAX_LINK = "https://max.ru/u/f9LHodD0cOIcyLKszOi0I1wOwGuyOltplh3obPyqkL7_jwUK6DRgug2lKI8";

  const t = (s) => (typeof s === "string" ? s.trim() : "");
  const qs = (sel, root=document) => root.querySelector(sel);

  function collectLead() {
    // Под твой экран "Заявка за 15 секунд"
    const device  = t(qs('[name="device"], #leadDevice, #leadDevice2, #device, input[placeholder*="iPhone"], input[placeholder*="Samsung"], input[placeholder*="ноут"], input[placeholder*="TV"], input[placeholder*="ТВ"]')?.value);
    const problem = t(qs('[name="issue"], [name="problem"], #leadProblem, #leadProblem2, #problem, textarea, input[placeholder*="Не включается"], input[placeholder*="не заряжается"], input[placeholder*="нет изображения"], input[placeholder*="перегрев"]')?.value);
    const contact = t(qs('[name="contact"], #leadContact, #leadContact2, #contact, input[placeholder*="+7"], input[placeholder*="@telegram"]')?.value);

    // select "Срочность"
    const urgency = t(qs('select[name="urgency"], #urgency, #urgencySelect, select')?.value);

    // Активные чипсы (если есть selected/active/aria-pressed)
    const chips = Array.from(document.querySelectorAll("button, .chip, .tag"))
      .filter((b) => {
        const text = t(b.textContent || "");
        if (!text) return false;
        if (/отправить/i.test(text)) return false;
        const pressed = b.getAttribute("aria-pressed");
        return pressed === "true" || b.classList.contains("active") || b.classList.contains("selected") || b.classList.contains("is-active");
      })
      .map((b) => t(b.textContent || ""))
      .slice(0, 10);

    return {
      device,
      problem,
      contact,
      urgency,
      tags: chips.join(", "),
      page: location.href,
      ts: Date.now()
    };
  }

  async function sendLead(payload) {
    if (!GAS_WEBAPP_URL) return false;

    // Основной способ: POST JSON
    try {
      const res = await fetch(GAS_WEBAPP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      });
      // GAS обычно возвращает JSON {ok:true}
      const data = await res.json().catch(() => ({}));
      return !!(res.ok && data && data.ok === true);
    } catch (e) {
      // Фолбэк: no-cors (ответ не прочитать, но иногда запрос уходит)
      try {
        await fetch(GAS_WEBAPP_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=UTF-8" },
          body: JSON.stringify(payload),
          keepalive: true,
        });
        return true;
      } catch (_) {
        return false;
      }
    }
  }

  function hookButtons() {
    const buttons = Array.from(document.querySelectorAll("button, a"));

    const tg = buttons.filter((b) => /отправить\s*в\s*telegram/i.test(t(b.textContent || "")));
    const vk = buttons.filter((b) => /отправить\s*в\s*vk/i.test(t(b.textContent || "")));
    const mx = buttons.filter((b) => /отправить\s*в\s*max/i.test(t(b.textContent || "")));

    const add = (btn, channel) => {
      btn.addEventListener("click", () => {
        const lead = collectLead();
        lead.channel = channel;

        // Не блокируем пользователя — отправляем "в фоне"
        sendLead(lead).then((ok) => {
          if (!ok) {
            // только лог, без alert'ов
            console.warn("[leads.js] lead not sent");
          }
        });

        // Подстраховка MAX: если это не <a href>, откроем чат
        if (channel === "MAX") {
          const isLink = btn.tagName.toLowerCase() === "a" && btn.getAttribute("href");
          if (!isLink) window.open(MAX_LINK, "_blank", "noopener,noreferrer");
        }
      }, { passive: true });
    };

    tg.forEach((b) => add(b, "TELEGRAM"));
    vk.forEach((b) => add(b, "VK"));
    mx.forEach((b) => add(b, "MAX"));
  }

  document.addEventListener("DOMContentLoaded", hookButtons);
})();
