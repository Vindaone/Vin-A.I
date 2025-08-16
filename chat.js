const chatBox = document.getElementById("chat-box");
const input = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const clearBtn = document.getElementById("clear-btn");
const modeHuman = document.getElementById("mode-human");
const modeBro = document.getElementById("mode-bro");

let history = [];
let mode = "human";

// toggle mode
modeHuman.addEventListener("click", () => {
  mode = "human";
  modeHuman.classList.add("active");
  modeBro.classList.remove("active");
});

modeBro.addEventListener("click", () => {
  mode = "bro";
  modeBro.classList.add("active");
  modeHuman.classList.remove("active");
});

// clear chat
clearBtn.addEventListener("click", () => {
  chatBox.innerHTML = "";
  history = [];
});

// send message
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage("user", text);
  input.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, mode, history })
    });

    const data = await res.json();

    if (data.error) {
      addMessage("ai", "⚠️ " + data.error);
      return;
    }

    addMessage("ai", data.reply);

    history.push({ role: "user", content: text });
    history.push({ role: "assistant", content: data.reply });

  } catch (err) {
    addMessage("ai", "⚠️ " + err.message);
  }
}

function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = sender === "user" ? "msg user" : "msg ai";
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
