document.getElementById('leadForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const problem = document.getElementById('problem').value;

  const text =
    'Заявка с сайта (курьер бесплатно)\n' +
    'Имя: ' + name + '\n' +
    'Телефон: ' + phone + '\n' +
    'Проблема: ' + problem;

  const url = 'https://t.me/share/url?text=' + encodeURIComponent(text);
  window.open(url, '_blank');
});
