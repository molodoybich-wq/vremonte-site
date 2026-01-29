// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu
const burger = document.getElementById('burger');
const mobile = document.getElementById('mobile');

function setMobile(open) {
  if (!burger || !mobile) return;
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  mobile.style.display = open ? 'block' : 'none';
  mobile.setAttribute('aria-hidden', open ? 'false' : 'true');
}

if (burger) {
  setMobile(false);

  burger.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    setMobile(!isOpen);
  });

  // close on link click
  mobile?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => setMobile(false));
  });

  // close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMobile(false);
  });
}

// Lead form -> Telegram + WhatsApp
const form = document.getElementById('leadForm');
const sendWA = document.getElementById('sendWA');

function buildMessage() {
  const name = (document.getElementById('fName')?.value || '').trim();
  const phone = (document.getElementById('fPhone')?.value || '').trim();
  const device = (document.getElementById('fDevice')?.value || '').trim();
  const problem = (document.getElementById('fProblem')?.value || '').trim();

  const lines = [
    'Заявка с сайта (акция: курьер бесплатно)',
    `Имя: ${name}`,
    `Телефон: ${phone}`,
  ];

  if (device) lines.push(`Устройство: ${device}`);
  if (problem) lines.push(`Проблема: ${problem}`);

  lines.push('Адреса: Ткачева 22 / Заводская 25');

  return lines.join('\n');
}

function openTelegram(message) {
  const url = `https://t.me/share/url?url=&text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

function openWhatsApp(message) {
  const url = `https://wa.me/79255156161?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = buildMessage();
    openTelegram(msg);
  });
}

if (sendWA) {
  sendWA.addEventListener('click', () => {
    const msg = buildMessage();
    openWhatsApp(msg);
  });
}
