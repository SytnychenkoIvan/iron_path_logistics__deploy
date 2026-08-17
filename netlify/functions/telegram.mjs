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