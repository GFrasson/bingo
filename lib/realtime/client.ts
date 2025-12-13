"use client";

import { useEffect, useRef } from 'react';
import Pusher from 'pusher-js';

export const useRealtime = (channelName: string, eventName: string, callback: (data: any) => void) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY) {
      console.warn('Pusher key not found');
      return;
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2',
    });

    const channel = pusher.subscribe(channelName);

    const handler = (data: any) => {
      if (savedCallback.current) {
        savedCallback.current(data);
      }
    };

    channel.bind(eventName, handler);

    return () => {
      channel.unbind(eventName, handler);
      pusher.unsubscribe(channelName);
    };
  }, [channelName, eventName]);
};
