"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, MessageCircle, Sparkles, Trash2, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { formatINR } from "@/lib/currency";
import { perfumes } from "@/data/perfumes";

const CartDrawer = () => {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const giftGoal = 3;
  const freeDeliveryThreshold = 1000;
  const deliveryChargeBelowThreshold = 100;
  const [selectedOffer, setSelectedOffer] = useState<"10off2" | "20off3" | "gift">("gift");
  const eligible50mlCount = items.reduce(
    (sum, item) => sum + (!item.isGift && (item.size ?? "50ml") === "50ml" ? item.quantity : 0),
    0
  );
  const paidItemCount = items.reduce((sum, item) => sum + (!item.isGift ? item.quantity : 0), 0);
  const giftUnlocked = selectedOffer === "gift" && eligible50mlCount >= giftGoal;
  const hasClaimedGift = items.some((item) => item.isGift);
  const remainingForGift = Math.max(0, giftGoal - eligible50mlCount);
  const giftProgress = Math.min(100, (eligible50mlCount / giftGoal) * 100);
  const subtotal = totalPrice;
  const shippingFee = subtotal > 0 && subtotal < freeDeliveryThreshold ? deliveryChargeBelowThreshold : 0;
  const discountPercent =
    selectedOffer === "10off2" && paidItemCount >= 2
      ? 0.1
      : selectedOffer === "20off3" && paidItemCount >= 3
        ? 0.2
        : 0;
  const discountAmount = subtotal * discountPercent;
  const grandTotal = subtotal - discountAmount + shippingFee;

  const giftCandidates = useMemo(
    () => perfumes.filter((p) => (p.size || "50ml").toLowerCase() === "50ml"),
    []
  );
  const [selectedGiftId, setSelectedGiftId] = useState(giftCandidates[0]?.id ?? "");
  useEffect(() => {
    if (selectedOffer === "gift") return;
    const giftItems = items.filter((item) => item.isGift);
    if (giftItems.length === 0) return;
    giftItems.forEach((gift) => removeItem(gift.id));
  }, [items, removeItem, selectedOffer]);

  const generateOrderMessage = () => {
    const orderLines = items
      .map(
        (item) =>
          `* ${item.name}${item.isGift ? " [FREE GIFT]" : ""} (${item.size ?? "50ml"}, Inspired by ${item.inspiration}${item.bottleName ? `, Bottle: ${item.bottleName}${item.bottlePrice ? ` (${formatINR(item.bottlePrice)})` : ""}` : ""}) x${item.quantity} - ${formatINR(item.price * item.quantity)}`
      )
      .join("\n");

    const offerLine =
      selectedOffer === "gift"
        ? giftUnlocked
          ? "\n\nPromo: Buy 3 get 1 free (50ml). Please include my selected gift in this order."
          : "\n\nPromo: Buy 3 get 1 free (50ml)."
        : selectedOffer === "10off2"
          ? "\n\nPromo: 10% off on 2 perfumes."
          : "\n\nPromo: 20% off on 3 perfumes.";

    const discountLine =
      discountAmount > 0 ? `\nDiscount: -${formatINR(discountAmount)}` : "";

    return `Hello HUME Perfumes,\n\nI would like to place an order:\n\n${orderLines}\n\nSubtotal: ${formatINR(subtotal)}${discountLine}\nDelivery: ${shippingFee === 0 ? "FREE" : formatINR(shippingFee)}\nGrand Total: ${formatINR(grandTotal)}${offerLine}\n\nPlease let me know how to proceed with the payment.`;
  };

  const handleWhatsAppCheckout = () => {
    const message = encodeURIComponent(generateOrderMessage());
    const whatsappNumber = "919559024822";
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
    toast({
      title: "Opening WhatsApp",
      description: "Complete your order via WhatsApp.",
    });
  };

  const handleClaimGift = () => {
    if (!giftUnlocked || hasClaimedGift) return;
    const selected = giftCandidates.find((p) => p.id === selectedGiftId);
    if (!selected) return;

    addItem({
      id: `gift-${selected.id}`,
      name: `${selected.name} - Free Gift`,
      inspiration: selected.inspiration,
      category: selected.category,
      image: selected.images[0],
      price: 0,
      size: "50ml",
      isGift: true,
    });

    toast({
      title: "Gift added",
      description: `${selected.name} added as your free 50ml gift.`,
    });
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
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} />
                <h2 className="font-serif text-lg">Your Bag</h2>
                <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  ({totalItems} {totalItems === 1 ? "item" : "items"})
                </span>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-muted transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag size={48} className="text-muted-foreground mb-4" />
                  <p className="font-serif text-xl mb-2">Your bag is empty</p>
                  <p className="text-body text-muted-foreground">Discover our collection of luxury fragrances</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="border border-border p-4 bg-secondary/30 space-y-4">
                    <details className="border border-border/60 bg-background/70 p-3">
                      <summary className="cursor-pointer text-caption text-foreground flex items-center justify-between list-none [&::-webkit-details-marker]:hidden">
                        <span>Choose Your Offer</span>
                        <ChevronDown size={14} className="text-muted-foreground" />
                      </summary>
                      <div className="mt-3 space-y-3 text-xs text-muted-foreground">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="offer"
                            checked={selectedOffer === "10off2"}
                            onChange={() => setSelectedOffer("10off2")}
                          />
                          10% off when you add 2 perfumes
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="offer"
                            checked={selectedOffer === "20off3"}
                            onChange={() => setSelectedOffer("20off3")}
                          />
                          20% off when you add 3 perfumes
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="offer"
                            checked={selectedOffer === "gift"}
                            onChange={() => setSelectedOffer("gift")}
                          />
                          Buy 3 get 1 free (50ml)
                        </label>
                      </div>
                    </details>

                    {discountAmount > 0 && (
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        <span>Offer Savings</span>
                        <span className="text-foreground">-{formatINR(discountAmount)}</span>
                      </div>
                    )}

                    {selectedOffer === "gift" && (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Free 50ml Gift Progress</p>
                          <p className="text-xs text-muted-foreground">{Math.min(eligible50mlCount, giftGoal)}/{giftGoal}</p>
                        </div>
                        <div className="h-2 bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${giftProgress}%` }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="h-full bg-foreground"
                          />
                        </div>

                        {giftUnlocked ? (
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 p-3 border border-foreground/20 bg-gradient-to-r from-foreground to-zinc-700 text-background"
                          >
                            <p className="text-sm flex items-center gap-2">
                              <Sparkles size={14} />
                              Your free 50ml gift is ready to claim.
                            </p>
                            {!hasClaimedGift ? (
                              <div className="mt-3 flex items-center gap-2">
                                <select
                                  value={selectedGiftId}
                                  onChange={(e) => setSelectedGiftId(e.target.value)}
                                  className="flex-1 bg-background/10 border border-background/30 text-background text-xs px-2 py-1.5 outline-none"
                                >
                                  {giftCandidates.map((p) => (
                                    <option key={p.id} value={p.id} className="text-black">
                                      {p.name}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={handleClaimGift}
                                  className="px-3 py-1.5 text-xs uppercase tracking-[0.14em] border border-background/40 hover:bg-background/10 transition-luxury"
                                >
                                  Claim
                                </button>
                              </div>
                            ) : (
                              <p className="text-xs mt-2 opacity-90">Gift already added to your bag.</p>
                            )}
                          </motion.div>
                        ) : (
                          <p className="text-xs text-muted-foreground mt-3">
                            Add {remainingForGift} more 50ml {remainingForGift === 1 ? "item" : "items"} to unlock your free 50ml gift.
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-4"
                    >
                      <img src={item.image} alt={item.name} className="w-20 h-24 object-cover bg-secondary" />
                      <div className="flex-1">
                        <h3 className="font-serif text-base">{item.name}</h3>
                        {item.category === "Kit" ? (
                          <p className="text-[11px] text-muted-foreground/70 mb-2 whitespace-pre-wrap">
                            {item.inspiration.split(", ").join(" | ")}
                          </p>
                        ) : (
                          <p className="text-[11px] text-muted-foreground/70 mb-2 line-clamp-1">
                            Inspired by {item.inspiration}
                          </p>
                        )}
                        {item.bottleName && (
                          <p className="text-[11px] text-muted-foreground/70 mb-2">
                            Bottle: {item.bottleName}
                            {item.bottlePrice ? ` (${formatINR(item.bottlePrice)})` : ""}
                          </p>
                        )}
                        <p className="text-body font-medium">{item.isGift ? "FREE" : formatINR(item.price)}</p>

                        <div className="flex items-center gap-3 mt-3">
                          {item.isGift ? (
                            <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Free Gift Item</span>
                          ) : (
                            <>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center border border-border hover:bg-muted transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="text-body w-6 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center border border-border hover:bg-muted transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto w-8 h-8 flex items-center justify-center border border-red-300 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                <details className="border border-border p-3 bg-secondary/20">
                  <summary className="cursor-pointer text-caption text-foreground flex items-center justify-between list-none [&::-webkit-details-marker]:hidden">
                    <span>Order Summary</span>
                    <ChevronDown size={14} className="text-muted-foreground" />
                  </summary>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatINR(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Offer Discount</span>
                        <span>-{formatINR(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span>{shippingFee === 0 ? "FREE" : formatINR(shippingFee)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="font-medium">Grand Total</span>
                      <span className="font-medium">{formatINR(grandTotal)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Free delivery on orders of {formatINR(freeDeliveryThreshold)} or more.
                      Orders below {formatINR(freeDeliveryThreshold)} include {formatINR(deliveryChargeBelowThreshold)} delivery.
                    </p>
                  </div>
                </details>

                <div className="space-y-3">
                  <Button
                    onClick={handleWhatsAppCheckout}
                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-primary-foreground"
                  >
                    <MessageCircle size={18} className="mr-2" />
                    Order via WhatsApp
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
