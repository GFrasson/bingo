export interface RealtimeService {
  /**
   * Triggers an event on a specfic channel.
   * @param channel The channel name (e.g. 'room-123')
   * @param event The event name (e.g. 'game_update')
   * @param data The data payload to send
   */
  trigger<T>(channel: string, event: string, data: T): Promise<void>;
}
