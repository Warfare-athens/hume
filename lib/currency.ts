const INR_TO_USD_RATE = 83; // fallback display rate
const INTERNATIONAL_PRICE_MULTIPLIER = 2;

type DisplayCurrency = "INR" | "USD";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function detectDisplayCurrency(): DisplayCurrency {
  if (typeof window === "undefined") return "INR";

  const country = (getCookie("hf_country") || "").toUpperCase();
  if (country && country !== "IN") return "USD";
  if (country === "IN") return "INR";

  const locale = navigator.language || "en-IN";
  const parts = locale.split("-");
  const region = (parts[1] || "IN").toUpperCase();
  return region === "IN" ? "INR" : "USD";
}

function formatAs(amount: number, currency: DisplayCurrency) {
  if (currency === "USD") {
    // Outside India, show international price as 2x of INR->USD converted amount.
    const usd = (amount / INR_TO_USD_RATE) * INTERNATIONAL_PRICE_MULTIPLIER;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(usd);
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export const formatINR = (amount: number) => formatAs(amount, detectDisplayCurrency());
