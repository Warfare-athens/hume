"use client";

const WhatsAppFloating = () => {
  return (
    <a
      href="https://wa.me/919559024822"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with HUME on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#1fbf63] px-4 py-3 text-sm font-medium text-white shadow-lg shadow-black/15 transition-transform hover:-translate-y-0.5"
    >
      <span className="text-base">WhatsApp</span>
    </a>
  );
};

export default WhatsAppFloating;
