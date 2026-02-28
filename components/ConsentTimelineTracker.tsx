"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const CONSENT_DECISION_KEY = "hume_consent_decision";
const CONSENT_SESSION_KEY = "hume_consent_session_id";

type TrackingDetail = {
  eventType: string;
  payload?: Record<string, unknown>;
};

function getSessionId() {
  const existing = localStorage.getItem(CONSENT_SESSION_KEY);
  if (existing) return existing;
  const next = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem(CONSENT_SESSION_KEY, next);
  return next;
}

export default function ConsentTimelineTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPathRef = useRef<string | null>(null);

  const sendEvent = async (eventType: string, payload?: Record<string, unknown>) => {
    try {
      if (localStorage.getItem(CONSENT_DECISION_KEY) !== "allow") return;

      const sessionId = getSessionId();
      const pathWithQuery = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;
      await fetch("/api/consent-timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          sessionId,
          path: pathWithQuery,
          eventType,
          language: navigator.language || undefined,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || undefined,
          payload,
        }),
      });
    } catch (error) {
      console.error("Timeline tracking failed:", error);
    }
  };

  useEffect(() => {
    const toPath = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;
    const fromPath = previousPathRef.current;
    previousPathRef.current = toPath;

    void sendEvent("page_view", {
      fromPath,
      toPath,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<TrackingDetail>;
      if (!customEvent.detail?.eventType) return;
      void sendEvent(customEvent.detail.eventType, customEvent.detail.payload);
    };

    window.addEventListener("hume:tracking", handler as EventListener);
    return () => window.removeEventListener("hume:tracking", handler as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return null;
}

