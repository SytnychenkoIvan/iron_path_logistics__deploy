export default async (req) => {
	if (req.method !== 'POST') {
		return new Response(
			JSON.stringify({
				success: false,
				message: 'Method not allowed'
			}),
			{
				status: 405,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}

	try {
		const { name, phone, message } = await req.json();

		if (!name || !phone) {
			return new Response(
				JSON.stringify({
					success: false,
					message: 'Заповніть обовʼязкові поля'
				}),
				{
					status: 400,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
		}

		const token = process.env.TELEGRAM_BOT_TOKEN;
		const chatId = process.env.TELEGRAM_CHAT_ID;

		if (!token || !chatId) {
			console.error('Telegram environment variables are missing');

			return new Response(
				JSON.stringify({
					success: false,
					message: 'Server configuration error'
				}),
				{
					status: 500,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
		}

		const telegramMessage = `
🔔 НОВА ЗАЯВКА З САЙТУ

👤 Ім'я / Компанія:
${name}

📞 Телефон:
${phone}

📦 Деталі вантажу:
${message || 'Не вказано'}
		`;

		const telegramResponse = await fetch(
			`https://api.telegram.org/bot${token}/sendMessage`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					chat_id: chatId,
					text: telegramMessage
				})
			}
		);

		const telegramResult = await telegramResponse.json();

		if (!telegramResponse.ok || !telegramResult.ok) {
			console.error('Telegram error:', telegramResult);

			return new Response(
				JSON.stringify({
					success: false,
					message: 'Не вдалося відправити заявку'
				}),
				{
					status: 500,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
		}

		return new Response(
			JSON.stringify({
				success: true,
				message: 'Заявку успішно відправлено'
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);

	} catch (error) {
		console.error('Server error:', error);

		return new Response(
			JSON.stringify({
				success: false,
				message: 'Помилка сервера'
			}),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}
};
//========================================================================================================================================================

// export default async (req) => {
// 	try {
// 		if (req.method !== 'POST') {
// 			return new Response(
// 				JSON.stringify({ error: 'Method not allowed' }),
// 				{
// 					status: 405,
// 					headers: { 'Content-Type': 'application/json' }
// 				}
// 			);
// 		}

// 		const { name, phone, message } = await req.json();

// 		const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// 		const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// 		if (!TOKEN || !CHAT_ID) {
// 			throw new Error('Telegram environment variables are missing');
// 		}

// 		const text = `
// <b>Новая заявка с сайта</b>

// <b>Имя / Компания:</b> ${name}
// <b>Телефон:</b> ${phone}
// <b>Детали груза:</b> ${message || 'Не указаны'}
// 		`;

// 		const telegramResponse = await fetch(
// 			`https://api.telegram.org/bot${TOKEN}/sendMessage`,
// 			{
// 				method: 'POST',
// 				headers: {
// 					'Content-Type': 'application/json'
// 				},
// 				body: JSON.stringify({
// 					chat_id: CHAT_ID,
// 					text: text,
// 					parse_mode: 'HTML'
// 				})
// 			}
// 		);

// 		const telegramResult = await telegramResponse.json();

// 		if (!telegramResponse.ok || !telegramResult.ok) {
// 			console.error('Telegram error:', telegramResult);

// 			return new Response(
// 				JSON.stringify({
// 					success: false,
// 					error: 'Telegram API error'
// 				}),
// 				{
// 					status: 500,
// 					headers: { 'Content-Type': 'application/json' }
// 				}
// 			);
// 		}

// 		return new Response(
// 			JSON.stringify({
// 				success: true
// 			}),
// 			{
// 				status: 200,
// 				headers: { 'Content-Type': 'application/json' }
// 			}
// 		);

// 	} catch (error) {
// 		console.error('Function error:', error);

// 		return new Response(
// 			JSON.stringify({
// 				success: false,
// 				error: error.message
// 			}),
// 			{
// 				status: 500,
// 				headers: { 'Content-Type': 'application/json' }
// 			}
// 		);
// 	}
// };