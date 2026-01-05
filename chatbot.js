const bubble = document.getElementById("chatbotBubble");
const chatWindow = document.getElementById("chatWindow");
const closeBtn = document.getElementById("closeBtn");
const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("userInput");
const messages = document.getElementById("chatMessages");

// 🔑 Gemini API Key (direct, frontend only)
const GEMINI_API_KEY = "AIzaSyDtWu4eTtr626UzSaDmem7Po0VW_RfSXG0";
const GEMINI_MODEL = "gemini-2.5-flash";

/* ---------------- UI CONTROLS ---------------- */
bubble.addEventListener("click", () => {
  chatWindow.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  chatWindow.style.display = "none";
});

function addMessage(text, className) {
    const wrapper = document.createElement("div");
    wrapper.className = `message-wrapper ${className}`;
    wrapper.innerHTML = `<div class="bubble">${text}</div>`;
    messages.appendChild(wrapper);
    messages.scrollTop = messages.scrollHeight;
}

/* ---------------- GEMINI CALL ---------------- */
async function askGemini(question) {
  try {
    // 1. Use v1beta for better System Instruction support
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // 2. This sets the bot's "Personality" and "Rules" permanently
        system_instruction: {
          parts: [{
            text: `You are a specialized Placement Assistant Bot. 
                  - ONLY answer questions related to placements, interviews, resumes, or companies. 
                  - If the user asks about anything else, say: "I'm sorry, I can only assist with placement-related queries."
                  - Be professional and concise.`
          }]
        },
        contents: [{
          role: "user",
          parts: [{ text: question }]
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("Gemini Error:", data.error.message);
      return "Error: " + data.error.message;
    }

    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply from Gemini.";

  } catch (error) {
    console.error("Network error:", error);
    return "Network error. Please try again.";
  }
}

/* ---------------- SEND MESSAGE (Simplified) ---------------- */
async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  // Show user message
  addMessage(text, "userMsg");
  input.value = "";

  // Show typing indicator
  addMessage("Typing...", "botMsg");

  // Call Gemini (The System Instruction handles the filtering now!)
  const reply = await askGemini(text);

  // Remove "Typing..."
  if (messages.lastChild) {
    messages.lastChild.remove();
  }

  // Show bot reply
  addMessage(reply, "botMsg");
}

/* ---------------- EVENTS ---------------- */
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
