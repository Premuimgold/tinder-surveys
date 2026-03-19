const BOT_TOKEN = '8675114023:AAE9tkINdxrKrAgLe21Ks9tXyCjsm_ZebXw';
const ADMIN_CHAT = '8362680243';

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ ok: false }) };
  }

  try {
    const { action, text, reply_markup, offset, limit, callback_query_id } = JSON.parse(event.body);

    if (action === 'sendMessage') {
      const payload = { chat_id: ADMIN_CHAT, text, parse_mode: 'HTML' };
      if (reply_markup) payload.reply_markup = reply_markup;
      const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return { statusCode: 200, headers, body: JSON.stringify(await r.json()) };

    } else if (action === 'getUpdates') {
      const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${offset||0}&limit=${limit||20}&timeout=0`);
      return { statusCode: 200, headers, body: JSON.stringify(await r.json()) };

    } else if (action === 'answerCallbackQuery') {
      const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id, text: text || '' })
      });
      return { statusCode: 200, headers, body: JSON.stringify(await r.json()) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: 'Unknown action' }) };

  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ ok: false, error: e.message }) };
  }
};
