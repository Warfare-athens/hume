export interface IntentPageConfig {
  slug: string;
  title: string;
  description: string;
  heading: string;
  intro: string;
  targetTerms: string[];
}

export const intentPages: IntentPageConfig[] = [
  {
    slug: "best-dior-sauvage-alternative",
    title: "Best Dior Sauvage Alternative",
    description:
      "Explore premium alternatives inspired by Dior Sauvage with excellent longevity and value.",
    heading: "Best Dior Sauvage Alternative",
    intro:
      "Looking for a high-quality Dior Sauvage alternative? Here are our closest inspired matches with strong performance and modern fresh-spicy character.",
    targetTerms: ["dior sauvage", "sauvage", "dior"],
  },
  {
    slug: "best-creed-aventus-alternative",
    title: "Best Creed Aventus Alternative",
    description:
      "Find inspired alternatives to Creed Aventus with the same fruity-smoky DNA.",
    heading: "Best Creed Aventus Alternative",
    intro:
      "Creed Aventus is iconic. These inspired options deliver the same confident fruity-smoky profile at a more accessible price.",
    targetTerms: ["creed aventus", "aventus", "creed"],
  },
  {
    slug: "best-tom-ford-oud-wood-alternative",
    title: "Best Tom Ford Oud Wood Alternative",
    description:
      "Discover inspired fragrances with rich oud-wood depth similar to Tom Ford Oud Wood.",
    heading: "Best Tom Ford Oud Wood Alternative",
    intro:
      "If you love the smooth woody-spicy feel of Oud Wood, these inspired perfumes offer the same luxurious direction for less.",
    targetTerms: ["tom ford oud wood", "oud wood", "tom ford"],
  },
  {
    slug: "best-bleu-de-chanel-alternative",
    title: "Best Bleu de Chanel Alternative",
    description:
      "Shop inspired alternatives to Bleu de Chanel with clean citrus-woody versatility.",
    heading: "Best Bleu de Chanel Alternative",
    intro:
      "Bleu de Chanel is a modern classic. These inspired options are ideal if you want a similarly refined daily signature.",
    targetTerms: ["bleu de chanel", "chanel", "bleu"],
  },
  {
    slug: "best-ysl-y-edp-alternative",
    title: "Best YSL Y EDP Alternative",
    description:
      "Compare inspired alternatives to YSL Y EDP with fresh aromatic projection.",
    heading: "Best YSL Y EDP Alternative",
    intro:
      "For fans of YSL Y EDP, these inspired fragrances capture the same fresh aromatic energy and everyday versatility.",
    targetTerms: ["ysl y edp", "ysl y", "yves saint laurent", "ysl"],
  },
];

export function getIntentPageBySlug(slug: string): IntentPageConfig | undefined {
  return intentPages.find((page) => page.slug === slug);
}

