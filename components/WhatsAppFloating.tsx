"use client";

import { usePathname } from "next/navigation";

const WhatsAppFloating = () => {
  const pathname = usePathname();
  if (pathname?.startsWith("/product/")) {
    return null;
  }

  return (
    <a
      href="https://wa.me/919559024822"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with HUME on WhatsApp"
      className="fixed bottom-5 left-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#1fbf63] text-white shadow-lg shadow-black/15 transition-transform hover:-translate-y-0.5"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M19.05 4.91A9.82 9.82 0 0 0 12.03 2a9.94 9.94 0 0 0-8.47 15.14L2 22l5.02-1.56a9.98 9.98 0 0 0 5 .36A9.99 9.99 0 0 0 20 8.01a9.8 9.8 0 0 0-.95-3.1zm-7.02 14a8.01 8.01 0 0 1-4.08-1.12l-.29-.17-2.98.93.97-2.9-.19-.3a8 8 0 1 1 6.57 3.56zm4.39-5.86c-.24-.12-1.39-.69-1.61-.77-.22-.08-.38-.12-.54.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.18-.7-.62-1.17-1.38-1.3-1.62-.14-.24-.01-.37.1-.5.1-.1.24-.26.36-.39.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.41-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.3.98 2.46c.12.16 1.67 2.56 4.04 3.59.56.24 1 .39 1.35.5.57.18 1.08.16 1.49.1.45-.07 1.39-.57 1.59-1.12.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.28z" />
      </svg>
    </a>
  );
};

export default WhatsAppFloating;
