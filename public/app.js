const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");

let chatContext = {
  step: "start"
};

function scrollMessagesToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendMessageText(container, text) {
  const lines = String(text || "").split("\n");
  let listEl = null;

  lines.forEach((rawLine) => {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      listEl = null;
      return;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      if (!listEl) {
        listEl = document.createElement("ul");
        listEl.className = "message-list";
        container.appendChild(listEl);
      }
      const li = document.createElement("li");
      li.textContent = trimmed.slice(2).trim();
      listEl.appendChild(li);
      return;
    }

    listEl = null;
    const p = document.createElement("p");
    p.textContent = trimmed;
    container.appendChild(p);
  });
}

function createMessageElement(role, text, options = []) {
  const messageEl = document.createElement("div");
  messageEl.className = `message ${role}`;

  const meta = document.createElement("div");
  meta.className = "message-meta";
  meta.textContent = role === "ai" ? "AI Guide" : "You";
  messageEl.appendChild(meta);

  const bubbleEl = document.createElement("div");
  bubbleEl.className = "message-bubble";
  appendMessageText(bubbleEl, text);

  if (Array.isArray(options) && options.length > 0) {
    const optionsWrap = document.createElement("div");
    optionsWrap.className = "message-options";

    options.forEach((option) => {
      const btn = document.createElement("button");
      btn.className = "option-chip";
      btn.type = "button";
      btn.textContent = option.label;
      btn.dataset.action = option.action || "prompt";

      if (option.prompt) btn.dataset.prompt = option.prompt;
      if (option.url) btn.dataset.url = option.url;

      optionsWrap.appendChild(btn);
    });

    bubbleEl.appendChild(optionsWrap);
  }

  messageEl.appendChild(bubbleEl);
  return messageEl;
}

function addMessage(role, text, options = []) {
  const el = createMessageElement(role, text, options);
  chatMessages.appendChild(el);
  requestAnimationFrame(scrollMessagesToBottom);
  return el;
}

function addThinkingMessage() {
  const messageEl = document.createElement("div");
  messageEl.className = "message ai thinking-message";

  const meta = document.createElement("div");
  meta.className = "message-meta";
  meta.textContent = "AI Guide";
  messageEl.appendChild(meta);

  const bubbleEl = document.createElement("div");
  bubbleEl.className = "message-bubble";

  const wrapper = document.createElement("div");
  wrapper.className = "thinking-bubble";

  for (let i = 0; i < 3; i += 1) {
    const dot = document.createElement("span");
    dot.className = "thinking-dot";
    wrapper.appendChild(dot);
  }

  bubbleEl.appendChild(wrapper);
  messageEl.appendChild(bubbleEl);
  chatMessages.appendChild(messageEl);
  requestAnimationFrame(scrollMessagesToBottom);
  return messageEl;
}

function fallbackGuideResponse(input) {
  const text = (input || "").toLowerCase();

  if (text.includes("3-day") || text.includes("3 day") || text.includes("three day")) {
    return {
      message:
        "Here’s a simple 3-day Boston plan:\n\n" +
        "Day 1: Classic Boston + Waterfront\n" +
        "- Start with central Boston landmarks and head toward the waterfront.\n" +
        "- Visit the aquarium area before lunch.\n" +
        "- Have seafood or another casual nearby meal.\n" +
        "- Spend the afternoon on harbor-side attractions or an easy walk.\n\n" +
        "Day 2: Arts, Culture, and City Exploring\n" +
        "- Begin with a museum or cultural stop.\n" +
        "- Add lunch in a nearby neighborhood café or casual restaurant.\n" +
        "- Continue with more indoor cultural spots in the afternoon.\n\n" +
        "Day 3: Outdoors + Relaxed Local Experience\n" +
        "- Start with a park, garden, or outdoor walking area.\n" +
        "- Stop for brunch or a casual lunch.\n" +
        "- Keep the afternoon flexible for shopping or one more attraction.",
      options: [
        { label: "Make it budget-friendly", action: "prompt", prompt: "Make this 3-day Boston plan budget-friendly" },
        { label: "Make it family-friendly", action: "prompt", prompt: "Make this 3-day Boston plan family-friendly" }
      ],
      context: { step: "plan_ready", planType: "3day" }
    };
  }

  if (text.includes("1-day") || text.includes("1 day") || text.includes("one day") || text.includes("itinerary") || text.includes("plan")) {
    return {
      message: "What kind of day would you like first?",
      options: [
        { label: "Food-focused", action: "prompt", prompt: "plan:one:food" },
        { label: "Attraction-focused", action: "prompt", prompt: "plan:one:attraction" },
        { label: "Relaxed mix", action: "prompt", prompt: "plan:one:mixed" }
      ],
      context: { step: "plan_one_focus" }
    };
  }

  return {
    message: "Tell me the direction first, and I’ll guide you step by step.",
    options: [],
    context: { step: "start" }
  };
}

async function requestGuideResponse(userText) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: userText,
        context: chatContext
      })
    });

    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return fallbackGuideResponse(userText);
  }
}

async function sendMessage(message, skipUserBubble = false) {
  const text = (message || "").trim();
  if (!text) return;

  if (!skipUserBubble) {
    addMessage("user", text);
  }

  const thinkingEl = addThinkingMessage();
  const result = await requestGuideResponse(text);
  thinkingEl.remove();

  chatContext = result.context || { step: "guided" };
  addMessage("ai", result.message || "I found a few options for you.", result.options || []);
}

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const userText = chatInput.value.trim();
  if (!userText) return;

  chatInput.value = "";
  await sendMessage(userText);
});

chatMessages.addEventListener("click", async (e) => {
  const button = e.target.closest(".option-chip");
  if (!button) return;

  const action = button.dataset.action;
  const label = button.textContent;

  addMessage("user", label);

  if (action === "link" && button.dataset.url) {
    window.open(button.dataset.url, "_blank");
    return;
  }

  if (action === "prompt" && button.dataset.prompt) {
    await sendMessage(button.dataset.prompt, true);
  }
});

if (option.action) btn.dataset.action = option.action;
if (option.url) btn.dataset.url = option.url;
if (option.prompt) btn.dataset.prompt = option.prompt;
