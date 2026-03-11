import { ChatRoom } from "./chatroom.js";

export { ChatRoom };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat") {
      const id = env.CHATROOM.idFromName("ai-travel-guide");
      const stub = env.CHATROOM.get(id);
      return stub.fetch(request);
    }

    return env.ASSETS.fetch(request);
  }
};
