(function () {
  const tgUser = "vremonte761";
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Mobile menu
  const burger = document.getElementById("burger");
  const mobile = document.getElementById("mobile");

  function closeMobile() {
    if (!mobile || !burger) return;
    mobile.hidden = true;
    burger.setAttribute("aria-expanded", "false");
  }

  function toggleMobile() {
    if (!mobile || !burger) return;
    const isOpen = !mobile.hidden;
    mobile.hidden = isOpen;
    burger.setAttribute("aria-expanded", String(!isOpen));
  }

  if (burger && mobile) {
    burger.addEventListener("click", toggleMobile);
    mobile.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.classList && t.classList.contains("mobile__link")) closeMobile();
    });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMobile(); });
  }

  // Telegram message builder
  function openTelegram(device, issue, urgent) {
    const lines = [
      "Здравствуйте! Хочу записаться в ремонт.",
      device ? `Устройство: ${device}` : null,
      issue ? `Проблема: ${issue}` : null,
      urgent ? `Срочность: ${urgent}` : null,
      "Город: Ростов-на-Дону",
      "Адрес: Ткачева 22",
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join("\n"));
    const url = `https://t.me/${tgUser}?text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const sendTg = document.getElementById("sendTg");
  if (sendTg) {
    sendTg.addEventListener("click", () => {
      const device = (document.getElementById("device")?.value || "").trim();
      const issue = (document.getElementById("issue")?.value || "").trim();
      openTelegram(device, issue, "");
    });
  }

  const sendTg2 = document.getElementById("sendTg2");
  if (sendTg2) {
    sendTg2.addEventListener("click", () => {
      const device = (document.getElementById("device2")?.value || "").trim();
      const issue = (document.getElementById("issue2")?.value || "").trim();
      const urgent = (document.getElementById("urgent2")?.value || "").trim();
      openTelegram(device, issue, urgent);
    });
  }
})();
