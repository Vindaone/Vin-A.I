// api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, mode } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, // API key from Vercel environment
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // or gpt-3.5-turbo if you prefer
        messages: [
          { role: "system", content: mode === "bro" ? "Reply casually like a bro." : "Reply professionally like a human." },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "API request failed" });
    }

    return res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
