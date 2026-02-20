export interface AccessoryData {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  images: string[];
  price: number;
  priceCurrency: "INR";
  isComplementary: boolean;
  giftTier?: 1 | 2;
}

export const accessories: AccessoryData[] = [
  {
    id: "travel-atomizer-black",
    name: "Travel Atomizer - Black",
    shortDescription: "Pocket spray atomizer for fragrance carry.",
    description:
      "Compact refillable metal atomizer with leak-proof design. Ideal for travel and daily carry.",
    images: [
      "https://res.cloudinary.com/dmbfo7uzl/image/upload/f_auto,q_auto,w_515,dpr_auto/v1772230400/ChatGPT_Image_Accessory_Atomizer_1_vz4x5a.png",
      "https://res.cloudinary.com/dmbfo7uzl/image/upload/f_auto,q_auto,w_515,dpr_auto/v1772230400/ChatGPT_Image_Accessory_Atomizer_2_r6w9bt.png",
    ],
    price: 299,
    priceCurrency: "INR",
    isComplementary: true,
    giftTier: 1,
  },
  {
    id: "gift-box-premium",
    name: "Premium Gift Box",
    shortDescription: "Luxury rigid gift box with insert.",
    description:
      "Premium magnetic gift box designed for 1-2 bottles with protective foam insert and satin finish.",
    images: [
      "https://res.cloudinary.com/dmbfo7uzl/image/upload/f_auto,q_auto,w_515,dpr_auto/v1772230400/ChatGPT_Image_Accessory_Box_1_p0sk9t.png",
      "https://res.cloudinary.com/dmbfo7uzl/image/upload/f_auto,q_auto,w_515,dpr_auto/v1772230400/ChatGPT_Image_Accessory_Box_2_g6yqtw.png",
    ],
    price: 499,
    priceCurrency: "INR",
    isComplementary: true,
    giftTier: 2,
  },
];

export const tierGiftAccessories = accessories
  .filter((item): item is AccessoryData & { giftTier: 1 | 2 } => Boolean(item.isComplementary && item.giftTier))
  .sort((a, b) => (a.giftTier ?? 0) - (b.giftTier ?? 0));

