// chat.js
const chatContainer = document.getElementById("chat-container");
const inputField = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");
const clearButton = document.getElementById("clear-btn");
const settingsBtn = document.getElementById("settings-btn");
const settingsPanel = document.getElementById("settings-panel");
const modeHuman = document.getElementById("mode-human");
const modeBro = document.getElementById("mode-bro");

let messageHistory = [];
let currentMode = "human"; // default mode

// Toggle settings
settingsBtn.addEventListener("click", () => {
  settingsPanel.classList.toggle("open");
});

// Mode switching
modeHuman.addEventListener("click", () => {
  currentMode = "human";
  modeHuman.classList.add("active");
  modeBro.classList.remove("active");
});
modeBro.addEventListener("click", () => {
  currentMode = "bro";
  modeBro.classList.add("active");
  modeHuman.classList.remove("active");
});

// Clear messages
clearButton.addEventListener("click", () => {
  chatContainer.classList.add("fade-out");
  setTimeout(() => {
    chatContainer.innerHTML = "";
    messageHistory = [];
    chatContainer.classList.remove("fade-out");
  }, 300);
});

// Send message
sendButton.addEventListener("click", sendMessage);
inputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const userMessage = inputField.value.trim();
  if (!userMessage) return;

  addMessage("user", userMessage);
  inputField.value = "";

  messageHistory.push({ role: "user", content: userMessage });

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: messageHistory,
        mode: currentMode
      }),
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();
    const aiMessage = data.reply;

    addMessage("ai", aiMessage);
    messageHistory.push({ role: "assistant", content: aiMessage });

  } catch (err) {
    addMessage("ai", `⚠️ Error: ${err.message}`);
  }
}

// Render messages
function addMessage(sender, text) {
  const message = document.createElement("div");
  message.classList.add("message", sender, "fade-in");

  if (text.includes("```")) {
    const parts = text.split("```");
    parts.forEach((part, i) => {
      if (i % 2 === 0) {
        if (part.trim()) {
          const p = document.createElement("p");
          p.textContent = part;
          message.appendChild(p);
        }
      } else {
        const codeBox = document.createElement("div");
        codeBox.classList.add("code-box");

        const pre = document.createElement("pre");
        pre.textContent = part.trim();
        codeBox.appendChild(pre);

        const copyBtn = document.createElement("button");
        copyBtn.textContent = "Copy";
        copyBtn.classList.add("copy-btn");
        copyBtn.onclick = () => {
          navigator.clipboard.writeText(pre.textContent);
          copyBtn.textContent = "Copied!";
          setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
        };
        codeBox.appendChild(copyBtn);

        message.appendChild(codeBox);
      }
    });
  } else {
    message.textContent = text;
  }

  chatContainer.appendChild(message);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}
