export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const { url, name } = req.body;

    await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: `💌 صفحة جديدة اتعملت!\n\n👤 الاسم: ${name}\n🔗 ${url}`,
            }),
        }
    );

    res.status(200).json({ ok: true });
}
