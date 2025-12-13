import Pusher from "pusher";
import { RealtimeService } from "./interface";

class PusherService implements RealtimeService {
  private pusher: Pusher;

  constructor() {
    this.pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID || "",
      key: process.env.PUSHER_KEY || "",
      secret: process.env.PUSHER_SECRET || "",
      cluster: process.env.PUSHER_CLUSTER || "us2",
      useTLS: true,
    });
  }

  async trigger<T>(channel: string, event: string, data: T): Promise<void> {
    if (!process.env.PUSHER_APP_ID) {
      console.warn("Pusher not configured, skipping trigger");
      return;
    }
    await this.pusher.trigger(channel, event, data);
  }
}

// Singleton instance
export const realtime = new PusherService();
