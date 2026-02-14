export interface CelebrityFavorite {
  label: string;
  description: string;
  image: string;
  perfumeIds: string[];
}

const defaultCelebImage = "https://placehold.co/600x600?text=Celeb";

export const celebrityFavorites: CelebrityFavorite[] = [
  {
    label: "SRK",
    description: "SRK Special combo profile",
    image: defaultCelebImage,
    perfumeIds: ["srk-special"],
  },
  {
    label: "Virat Kohli",
    description: "Creed Viking style profile",
    image: defaultCelebImage,
    perfumeIds: ["creed-viking"],
  },
  {
    label: "Taylor Swift",
    description: "Byredo Gypsy Water style profile",
    image: defaultCelebImage,
    perfumeIds: ["gypsy-water"],
  },
  {
    label: "David Beckham",
    description: "Bleu de Chanel style profile",
    image: defaultCelebImage,
    perfumeIds: ["bleu-de-chanel"],
  },
  {
    label: "Johnny Depp",
    description: "Dior Sauvage style profile",
    image: defaultCelebImage,
    perfumeIds: ["sauvage-noir"],
  },
];
