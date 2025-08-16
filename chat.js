async function sendMessage(message, mode) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, mode }),
  });

  let data;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error("Server returned invalid JSON");
  }

  if (!res.ok) {
    throw new Error(data.error || "Unknown error");
  }

  return data.reply;
}
