'use client';
import { useEffect, useRef } from 'react';

export default function useCampaignPoller(intervalMs = 5000) {
  const isPolling = useRef(false);

  useEffect(() => {
    let timeoutId;

    const poll = async () => {
      if (isPolling.current) return;
      isPolling.current = true;

      try {
        const res = await fetch('/api/send/batch', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          if (data.processed > 0) {
            console.log(`Processed ${data.processed} emails. Success: ${data.delivered}, Failed: ${data.failed}`);
            // If it processed > 0, we might want to poll again sooner, but let's stick to interval
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      } finally {
        isPolling.current = false;
        timeoutId = setTimeout(poll, intervalMs);
      }
    };

    timeoutId = setTimeout(poll, intervalMs);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [intervalMs]);
}
