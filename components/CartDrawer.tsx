"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, MessageCircle, Trash2, Gift, IndianRupee, ChevronDown, ChevronUp, Info } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { formatINR } from "@/lib/currency";

interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  type: "percent" | "fixed";
  value: number;
  minSubtotal: number;
  active: boolean;
}

const CartDrawer = () => {
  const router = useRouter();
  const { items, removeItem, updateQuantity, totalItems, totalPrice, isCartOpen, setIsCartOpen } = useCart();

  const freeDeliveryThreshold = 800;
  const deliveryChargeBelowThreshold = 100;
  const firstGiftThreshold = 799;
  const secondGiftThreshold = 1399;

  const [isBreakupOpen, setIsBreakupOpen] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [isOffersOpen, setIsOffersOpen] = useState(false);

  const subtotal = totalPrice;
  const shippingFee = subtotal > 0 && subtotal < freeDeliveryThreshold ? deliveryChargeBelowThreshold : 0;

  const appliedCoupon = useMemo(
    () => coupons.find((coupon) => coupon.code === appliedCouponCode) ?? null,
    [coupons, appliedCouponCode]
  );

  const couponDiscount =
    appliedCoupon && subtotal >= appliedCoupon.minSubtotal
      ? appliedCoupon.type === "percent"
        ? (subtotal * appliedCoupon.value) / 100
        : appliedCoupon.value
      : 0;

  const normalizedCouponDiscount = Math.min(subtotal, couponDiscount);
  const grandTotal = subtotal - normalizedCouponDiscount + shippingFee;
  const mrpTotal = subtotal + shippingFee;
  const discountOnMrp = Math.max(0, mrpTotal - grandTotal);
  const discountPercent = mrpTotal > 0 ? Math.round((discountOnMrp / mrpTotal) * 100) : 0;

  const unlockedGiftCount = subtotal >= secondGiftThreshold ? 2 : subtotal >= firstGiftThreshold ? 1 : 0;
  const claimedGiftCount = items.filter((item) => item.isGift).length;
  const amountToFirstGift = Math.max(0, firstGiftThreshold - subtotal);
  const amountToSecondGift = Math.max(0, secondGiftThreshold - subtotal);
  const giftProgress = Math.min(100, (subtotal / secondGiftThreshold) * 100);

  const progressMessage =
    subtotal < firstGiftThreshold
      ? `Add ${formatINR(amountToFirstGift)} more for Gift 1`
      : subtotal < secondGiftThreshold
        ? `Add ${formatINR(amountToSecondGift)} more for Gift 2`
        : "Gift 1 and Gift 2 unlocked";

  useEffect(() => {
    let active = true;
    const loadCoupons = async () => {
      try {
        const response = await fetch("/api/coupons");
        if (!response.ok) throw new Error("Failed to fetch coupons");
        const data = (await response.json()) as Coupon[];
        if (active && Array.isArray(data)) {
          setCoupons(data);
        }
      } catch (error) {
        console.error("Failed to load coupons:", error);
      }
    };
    loadCoupons();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!appliedCoupon) return;
    if (subtotal < appliedCoupon.minSubtotal) {
      setAppliedCouponCode(null);
    }
  }, [appliedCoupon, subtotal]);

  const handleApplyToggleCoupon = (coupon: Coupon) => {
    if (appliedCouponCode === coupon.code) {
      setAppliedCouponCode(null);
      toast({ title: "Coupon removed", description: `${coupon.code} has been unapplied.` });
      return;
    }
    if (subtotal < coupon.minSubtotal) {
      toast({
        title: "Coupon not eligible",
        description: `Add ${formatINR(coupon.minSubtotal - subtotal)} more to apply ${coupon.code}.`,
      });
      return;
    }
    setAppliedCouponCode(coupon.code);
    toast({ title: "Coupon applied", description: `${coupon.code} has been applied.` });
  };

  const handleApplyCouponFromInput = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      toast({ title: "Enter a coupon code", description: "Type a valid coupon code to apply." });
      return;
    }

    const coupon = coupons.find((c) => c.code.toUpperCase() === code);
    if (!coupon) {
      toast({ title: "Invalid coupon", description: "This coupon code is not available right now." });
      return;
    }

    if (subtotal < coupon.minSubtotal) {
      toast({
        title: "Coupon not eligible",
        description: `Add ${formatINR(coupon.minSubtotal - subtotal)} more to apply ${coupon.code}.`,
      });
      return;
    }

    setAppliedCouponCode(coupon.code);
    setCouponInput("");
    toast({ title: "Coupon applied", description: `${coupon.code} has been applied.` });
  };

  const generateOrderMessage = () => {
    const orderLines = items
      .map(
        (item) =>
          `* ${item.name}${item.isGift ? " [FREE GIFT]" : ""} (${item.size ?? "50ml"}, Inspired by ${item.inspiration}) x${item.quantity} - ${formatINR(item.price * item.quantity)}`
      )
      .join("\n");

    const couponLine =
      appliedCoupon && normalizedCouponDiscount > 0
        ? `\nCoupon (${appliedCoupon.code}): -${formatINR(normalizedCouponDiscount)}`
        : "";

    return `Hello HUME Perfumes,\n\nI would like to place an order:\n\n${orderLines}\n\nSubtotal: ${formatINR(subtotal)}${couponLine}\nDelivery: ${shippingFee === 0 ? "FREE" : formatINR(shippingFee)}\nGrand Total: ${formatINR(grandTotal)}\nAuto Gifts: ${claimedGiftCount}/${unlockedGiftCount} added based on subtotal tiers (₹799 and ₹1399).\n\nPlease let me know how to proceed with the payment.`;
  };

  const handleWhatsAppCheckout = () => {
    const message = encodeURIComponent(generateOrderMessage());
    window.open(`https://wa.me/919559024822?text=${message}`, "_blank");
    toast({ title: "Opening WhatsApp", description: "Complete your order via WhatsApp." });
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
              <div className="flex items-center gap-2">
                <h2 className="font-sans text-xl font-semibold">Your Bag</h2>
                <span className="text-sm text-[#8fa1b6]">({totalItems} items)</span>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-muted transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-none px-5 py-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <p className="text-xl font-medium mb-2">Your bag is empty</p>
                  <p className="text-sm text-muted-foreground">Discover our collection of fragrances</p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="mb-8 pb-4 border-b border-border/70">
                    <div className="flex items-center justify-between mb-3 text-sm font-medium">
                      <span>{progressMessage}</span>
                      <span className="text-[#8fa1b6] text-[12px]">{claimedGiftCount}/{unlockedGiftCount} Unlocked</span>
                    </div>
                    <div className="relative pt-6">
                      <div className="absolute inset-x-0 top-0 text-[10px] font-medium text-[#8fa1b6]">
                        <span className="absolute left-0">₹0</span>
                        <span
                          className="absolute -translate-x-1/2"
                          style={{ left: `${(firstGiftThreshold / secondGiftThreshold) * 100}%` }}
                        >
                          ₹799
                        </span>
                        <span className="absolute right-0">₹1399</span>
                      </div>
                      <div className="relative h-1.5 rounded-full bg-[#e8edf4] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${giftProgress}%` }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          className="h-full bg-[#20c45a]"
                        />
                      </div>
                      <div className="relative mt-[-11px] h-0">
                        {[(firstGiftThreshold / secondGiftThreshold) * 100, 100].map((left, idx) => (
                          <span
                            key={`gift-marker-${idx}`}
                            className="absolute -translate-x-1/2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#20c45a] bg-white shadow-sm"
                            style={{ left: `${left}%` }}
                          >
                            <Gift className="h-3 w-3 text-[#20c45a]" />
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      className={`flex gap-3 pb-4 border-b border-border/40 ${item.isGift ? "cursor-pointer rounded-lg bg-secondary/20 p-2 border border-border/60" : ""}`}
                      onClick={() => {
                        if (!item.isGift) return;
                        router.push(`/accessory/${item.id.replace(/^gift-/, "")}`);
                      }}
                    >
                      <img
                        src={item.image || "/images/logo.png?v=2"}
                        alt={item.name}
                        className="w-20 h-20 rounded-md object-cover bg-secondary"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/images/logo.png?v=2";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                          <h3 className="font-sans text-[14px] font-medium leading-tight min-w-0">{item.name}</h3>
                          <p className="text-[14px] font-semibold leading-none whitespace-nowrap pl-2">
                            {item.isGift ? "FREE" : formatINR(item.price)}
                          </p>
                        </div>
                        <p className="max-w-full  pt-1 pr-2 text-[12px] italic text-[#8fa1b6] leading-snug break-words">
                          Inspired by {item.inspiration}
                        </p>

                        <div className="flex items-center gap-3 mt-2">
                          {item.isGift ? (
                            <span className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#20c45a]">Free Gift Item</span>
                          ) : (
                            <div className="inline-flex items-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateQuantity(item.id, item.quantity - 1);
                                }}
                                className="h-7 w-7 rounded-xl flex items-center justify-center border border-border bg-white"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="h-7 w-7 flex items-center justify-center border-y border-border bg-white text-[14px] font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateQuantity(item.id, item.quantity + 1);
                                }}
                                className="h-7 w-7 rounded-xl flex items-center justify-center border border-border bg-white"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeItem(item.id);
                            }}
                            className="ml-auto w-8 h-8 flex items-center justify-center rounded-2xl  bg-red-50 text-red-500 hover:text-red-600"
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {coupons.length > 0 && (
                    <div className="relative border border-border rounded-2xl bg-secondary/10 p-3">
                      <div className="rounded-xl bg-muted/50 p-2.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                            placeholder="Enter coupon code"
                            className="h-9 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-[#0b5ca8]/50"
                          />
                          <button
                            type="button"
                            onClick={handleApplyCouponFromInput}
                            className="h-9 rounded-full px-4 text-xs font-semibold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 disabled:opacity-60"
                            disabled={!couponInput.trim()}
                          >
                            Apply
                          </button>
                        </div>
                        {appliedCoupon && normalizedCouponDiscount > 0 ? (
                          <p className="mt-2 text-xs text-emerald-700">
                            {appliedCoupon.code} applied - You save {formatINR(normalizedCouponDiscount)}
                          </p>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsOffersOpen((v) => !v)}
                        className="mt-3 w-full rounded-full border border-[#0b5ca8]/30 bg-[#0b5ca8]/5 px-4 py-2 text-center text-sm font-semibold text-[#0b5ca8] hover:bg-[#0b5ca8]/10"
                      >
                        View All Offers {isOffersOpen ? "▴" : "▾"}
                      </button>

                      {isOffersOpen && (
                        <div className="mt-3 rounded-xl border border-border bg-background p-3 space-y-3">
                          <p className="font-semibold text-base">Available Offers</p>
                          {coupons.map((coupon) => {
                            const isApplied = appliedCouponCode === coupon.code;
                            const isEligible = subtotal >= coupon.minSubtotal;
                            return (
                              <div key={coupon.id} className="rounded-lg border border-border p-3">
                                <div className="flex items-center justify-between">
                                  <p className="font-semibold text-lg">{coupon.code}</p>
                                  <button
                                    type="button"
                                    onClick={() => handleApplyToggleCoupon(coupon)}
                                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                                      isApplied || isEligible
                                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                        : "bg-muted text-foreground/70 hover:bg-muted/80"
                                    }`}
                                  >
                                    {isApplied ? "Unapply" : "Apply"}
                                  </button>
                                </div>
                                <p className="mt-1 text-emerald-700 text-xs">
                                  {coupon.type === "percent"
                                    ? `You save ${coupon.value}%`
                                    : `You save ${formatINR(coupon.value)}`}
                                </p>
                                <p className="text-xs text-muted-foreground">{coupon.description}</p>
                                {!isEligible && !isApplied ? (
                                  <p className="mt-1 text-xs text-muted-foreground">Min order: {formatINR(coupon.minSubtotal)}</p>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border px-5 py-4 space-y-3">
                <button type="button" onClick={() => setIsBreakupOpen((v) => !v)} className="w-full flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-[13px] font-medium">
                    <Image src="/images/ruppee.png" alt="₹" width={16} height={16} />
                    Estimated Total
                    {isBreakupOpen ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
                  </span>
                  <span className="text-[18px] leading-none font-semibold">{formatINR(grandTotal).replace(/[^\d.,₹]/g, "")}</span>
                </button>

                {isBreakupOpen && (
                  <div className="rounded-xl border border-border bg-secondary/20 p-4 space-y-2 text-[14px]">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Order Summary</span>
                      <span className="rounded bg-emerald-100 px-2 py-1 text-xs text-emerald-700">
                        {formatINR(discountOnMrp)} saved so far
                      </span>
                    </div>
                    <div className="flex justify-between"><span className="text-muted-foreground">MRP total</span><span>{formatINR(mrpTotal)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Discount on MRP</span><span className="text-emerald-600">{formatINR(discountOnMrp)}</span></div>
                    {appliedCoupon && normalizedCouponDiscount > 0 ? (
                      <div className="flex justify-between"><span className="text-muted-foreground">Coupon ({appliedCoupon.code})</span><span className="text-emerald-600">-{formatINR(normalizedCouponDiscount)}</span></div>
                    ) : null}
                    <div className="flex justify-between"><span className="text-muted-foreground">Cart Subtotal</span><span>{formatINR(subtotal)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Shipping Charges</span><span className={shippingFee === 0 ? "text-emerald-600" : ""}>{shippingFee === 0 ? "FREE" : formatINR(shippingFee)}</span></div>
                    <div className="flex justify-between text-muted-foreground">
                      <span className="inline-flex items-center gap-1">Prepaid Discount <Info className="h-3.5 w-3.5" /></span>
                      <span>To be calculated</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border text-base font-semibold">
                      <span>Estimated Total</span>
                      <span>{formatINR(grandTotal)}</span>
                    </div>
                  </div>
                )}

                <Button onClick={handleWhatsAppCheckout} className="h-11 w-full rounded-md bg-[#25D366] hover:bg-[#20bd5a] text-white text-[14px] font-semibold">
                  <MessageCircle size={18} className="mr-2" />
                  Order via WhatsApp
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
