document.getElementById('leadForm').addEventListener('submit', e => {
  e.preventDefault();

  const name = name.value;
  const phone = phone.value;
  const problem = document.getElementById('problem').value;

  const text =
    `Заявка с сайта (курьер бесплатно)\n` +
    `Имя: ${name}\n` +
    `Телефон: ${phone}\n` +
    `Проблема: ${problem}`;

  window.open(
    'https://t.me/share/url?text=' + encodeURIComponent(text),
    '_blank'
  );
});
