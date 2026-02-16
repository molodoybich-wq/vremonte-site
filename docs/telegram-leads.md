# Заявки в Telegram (чтобы вы их точно видели)

На сайте сейчас логика такая: **мы формируем сообщение и открываем мессенджер**. Это нормально для быстрого старта, но часть людей не нажмёт «Отправить» — и вы не увидите заявку.

Я добавил «двойное действие»:

1) сайт **всегда** открывает мессенджер (как раньше)  
2) дополнительно сайт **пытается сохранить лид** в ваш webhook (`LEAD_ENDPOINT` в `script.js`) + кладёт копию в `localStorage` (резерв на этом устройстве)

## Вариант 1 (рекомендую): Cloudflare Worker → Telegram

Плюсы: бесплатно/дёшево, быстро, работает с GitHub Pages, токен бота не светится на сайте.

### 1) Создайте Telegram-бота и получите токен
В Telegram: `@BotFather` → `/newbot` → получите `BOT_TOKEN`

### 2) Узнайте ваш chat_id (куда слать заявки)
Самое простое:
- Напишите что-нибудь вашему боту
- Откройте в браузере (вставьте токен):
`https://api.telegram.org/bot<BOT_TOKEN>/getUpdates`
- В ответе найдите `"chat":{"id": ... }` — это и есть `CHAT_ID`

### 3) Создайте Worker
Cloudflare → Workers → Create Worker → вставьте код ниже:

```js
export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response("", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") return new Response("Only POST", { status: 405 });

    const body = await request.json().catch(() => ({}));
    const text = (body?.message || "").toString().slice(0, 3500);

    const tgUrl = `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`;
    const payload = {
      chat_id: env.CHAT_ID,
      text,
      disable_web_page_preview: true
    };

    const r = await fetch(tgUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const ok = r.ok;

    return new Response(JSON.stringify({ ok }), {
      status: ok ? 200 : 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}
```

### 4) Добавьте переменные окружения
Worker → Settings → Variables:
- `BOT_TOKEN` = ваш токен
- `CHAT_ID` = ваш chat_id

### 5) Включите webhook на сайте
Откройте `script.js` и вставьте URL воркера:

```js
const LEAD_ENDPOINT = "https://<ваш-worker>.workers.dev/";
```

Готово — теперь при нажатии «Отправить в Telegram/VK/MAX» сайт:
- сохранит лид через воркер (вы увидите в Telegram),
- откроет мессенджер с готовым текстом.

## Вариант 2: Google Apps Script → Telegram (+ можно в Google Sheet)

Если хотите, я добавлю в этот же скрипт запись в Google Таблицу.

## Как проверить
1) На сайте нажмите кнопку отправки → должна появиться плашка:
- `✅ Заявка сохранена...` (если endpoint настроен)
2) В Telegram должен прилететь текст заявки.

## Где лежат «резервные» лиды на устройстве
В браузере: DevTools → Application → Local Storage → ключ `vremonte_leads`
