export class ChatRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const body = await request.json();
    const rawMessage = (body.message || "").trim();
    const userMessage = rawMessage.toLowerCase();

    const response = this.buildGuideResponse(userMessage);

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" }
    });
  }

  buildGuideResponse(userMessage) {
    // Entry
    if (userMessage === "food") {
      return {
        message: "What kind of food experience are you looking for?",
        options: [
          { label: "Seafood", action: "prompt", prompt: "food:seafood" },
          { label: "Local favorites", action: "prompt", prompt: "food:local" },
          { label: "Budget-friendly", action: "prompt", prompt: "food:budget" }
        ]
      };
    }

    // Food step 2
    if (userMessage === "food:seafood") {
      return {
        message: "Do you want a lighter day or a fuller day?",
        options: [
          { label: "Lighter day", action: "prompt", prompt: "food:seafood:light" },
          { label: "Fuller day", action: "prompt", prompt: "food:seafood:full" }
        ]
      };
    }

    if (userMessage === "food:local") {
      return {
        message: "Do you want a lighter day or a fuller day?",
        options: [
          { label: "Lighter day", action: "prompt", prompt: "food:local:light" },
          { label: "Fuller day", action: "prompt", prompt: "food:local:full" }
        ]
      };
    }

    if (userMessage === "food:budget") {
      return {
        message: "Do you want a lighter day or a fuller day?",
        options: [
          { label: "Lighter day", action: "prompt", prompt: "food:budget:light" },
          { label: "Fuller day", action: "prompt", prompt: "food:budget:full" }
        ]
      };
    }

    // Food final answers
    if (userMessage === "food:seafood:light") {
      return {
        message:
          "Here’s a lighter seafood-focused Boston day:\n\n" +
          "- Start near the waterfront in the morning.\n" +
          "- Choose one seafood-focused lunch stop.\n" +
          "- Keep the afternoon relaxed with a short walk nearby.\n" +
          "- End with a simple dinner or dessert stop.\n",
        options: [
          { label: "Open Foodies page", action: "link", url: "/sites/boston/html/Foodies.html" },
          { label: "Add aquarium stop", action: "prompt", prompt: "food:seafood:light:aquarium" }
        ]
      };
    }

    if (userMessage === "food:seafood:full") {
      return {
        message:
          "Here’s a fuller seafood-focused Boston day:\n\n" +
          "- Start with a morning harbor-area stop.\n" +
          "- Have a seafood lunch as the main meal of the day.\n" +
          "- Add an afternoon attraction or waterfront walk.\n" +
          "- End with a second food stop or a longer dinner.\n",
        options: [
          { label: "Open Foodies page", action: "link", url: "/sites/boston/html/Foodies.html" },
          { label: "Add aquarium stop", action: "prompt", prompt: "food:seafood:full:aquarium" }
        ]
      };
    }

    if (userMessage === "food:local:light") {
      return {
        message:
          "Here’s a lighter local-favorites Boston day:\n\n" +
          "- Start in a neighborhood known for casual local spots.\n" +
          "- Pick one signature lunch stop.\n" +
          "- Spend the afternoon exploring nearby on foot.\n" +
          "- Keep the evening flexible for coffee, dessert, or a light dinner.\n",
        options: [
          { label: "Open Foodies page", action: "link", url: "/sites/boston/html/Foodies.html" }
        ]
      };
    }

    if (userMessage === "food:local:full") {
      return {
        message:
          "Here’s a fuller local-favorites Boston day:\n\n" +
          "- Start with a neighborhood breakfast or brunch.\n" +
          "- Add a classic lunch stop later in the day.\n" +
          "- Explore another nearby area in the afternoon.\n" +
          "- Finish with dinner in a different local food neighborhood.\n",
        options: [
          { label: "Open Foodies page", action: "link", url: "/sites/boston/html/Foodies.html" }
        ]
      };
    }

    if (userMessage === "food:budget:light") {
      return {
        message:
          "Here’s a lighter budget-friendly Boston food day:\n\n" +
          "- Pick one affordable neighborhood food stop.\n" +
          "- Keep lunch simple and convenient.\n" +
          "- Spend the afternoon on a free or low-cost walk nearby.\n" +
          "- End with a small, budget-friendly dinner or snack.\n",
        options: [
          { label: "Open Foodies page", action: "link", url: "/sites/boston/html/Foodies.html" }
        ]
      };
    }

    if (userMessage === "food:budget:full") {
      return {
        message:
          "Here’s a fuller budget-friendly Boston food day:\n\n" +
          "- Start with a simple breakfast or coffee stop.\n" +
          "- Add an affordable lunch in a casual area.\n" +
          "- Explore the city on foot to keep the day low-cost.\n" +
          "- Finish with a second inexpensive food stop in the evening.\n",
        options: [
          { label: "Open Foodies page", action: "link", url: "/sites/boston/html/Foodies.html" }
        ]
      };
    }

    if (userMessage === "food:seafood:light:aquarium") {
      return {
        message:
          "Here’s a light seafood + aquarium Boston day:\n\n" +
          "- Start with an aquarium visit in the morning.\n" +
          "- Have lunch at a seafood-focused spot nearby.\n" +
          "- Take a short waterfront walk in the afternoon.\n" +
          "- Keep the evening relaxed with a casual dinner or dessert.\n",
        options: [
          { label: "Open Aquarium guide", action: "link", url: "/sites/aquariums/html/index.html" },
          { label: "Open Foodies page", action: "link", url: "/sites/boston/html/Foodies.html" }
        ]
      };
    }

    if (userMessage === "food:seafood:full:aquarium") {
      return {
        message:
          "Here’s a fuller seafood + aquarium Boston day:\n\n" +
          "- Begin with an aquarium stop in the morning.\n" +
          "- Have a seafood lunch near the waterfront.\n" +
          "- Add another attraction or harbor-area walk in the afternoon.\n" +
          "- End with a longer dinner or evening food stop.\n",
        options: [
          { label: "Open Aquarium guide", action: "link", url: "/sites/aquariums/html/index.html" },
          { label: "Open Foodies page", action: "link", url: "/sites/boston/html/Foodies.html" }
        ]
      };
    }

    // Aquarium entry
    if (userMessage === "aquarium") {
      return {
        message: "What kind of aquarium-related experience do you want?",
        options: [
          { label: "Family-friendly", action: "prompt", prompt: "aquarium:family" },
          { label: "Simple attraction day", action: "prompt", prompt: "aquarium:simple" }
        ]
      };
    }

    // 1-day entry
    if (userMessage === "1-day plan" || userMessage === "1 day plan") {
      return {
        message: "What should this day focus on?",
        options: [
          { label: "Food", action: "prompt", prompt: "plan1:food" },
          { label: "Aquarium", action: "prompt", prompt: "plan1:aquarium" },
          { label: "Mixed", action: "prompt", prompt: "plan1:mixed" }
        ]
      };
    }

    // 3-day entry
    if (userMessage === "3-day plan" || userMessage === "3 day plan") {
      return {
        message: "What kind of 3-day trip do you want?",
        options: [
          { label: "Classic Boston", action: "prompt", prompt: "plan3:classic" },
          { label: "Food-focused", action: "prompt", prompt: "plan3:food" },
          { label: "Family-friendly", action: "prompt", prompt: "plan3:family" }
        ]
      };
    }

    if (userMessage === "plan3:classic") {
      return {
        message:
          "Here’s a simple 3-day Boston plan:\n\n" +
          "- Day 1: Explore central Boston and the waterfront.\n" +
          "- Day 2: Focus on arts, culture, and city walking.\n" +
          "- Day 3: Enjoy a more relaxed outdoor or neighborhood-based day.\n",
        options: [
          { label: "Open Boston home", action: "link", url: "/sites/boston/html/index.html" },
          { label: "Add aquarium stop", action: "prompt", prompt: "plan3:classic:aquarium" }
        ]
      };
    }

    return {
      message:
        "Tell me the direction first.\n\n" +
        "- Say food if you want restaurant ideas.\n" +
        "- Say aquarium if you want attraction-style planning.\n" +
        "- Say 1-day plan or 3-day plan if you want an itinerary.",
      options: []
    };
  }
}