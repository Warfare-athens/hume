export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "HUME Perfumes",
  url: "https://humeperfumes.com",
  logo: "https://humeperfumes.com/logo.png",
  description:
    "HUME Perfumes crafts premium fragrance interpretations, offering refined luxury scents inspired by iconic olfactory profiles.",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: "English",
    telephone: "+91 95590 24822",
    areaServed: "IN",
  },
});

export const getWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "HUME Perfumes",
  url: "https://humeperfumes.com",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://humeperfumes.com/shop?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
});

export const getProductSchema = (product: {
  name: string;
  description: string;
  seoDescription: string;
  price: number;
  images: string[];
  inspiration: string;
  inspirationBrand: string;
  id: string;
  reviews: { rating: number; author: string; content: string; date: string }[];
  category: string;
}) => {
  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} - Luxury Fragrance`,
    description: product.seoDescription,
    image: product.images[0],
    brand: { "@type": "Brand", name: "HUME Perfumes" },
    category: `Fragrances > ${product.category}`,
    url: `https://humeperfumes.com/product/${product.id}`,
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "HUME Perfumes" },
    },
    aggregateRating:
      product.reviews.length > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: averageRating.toFixed(1),
            reviewCount: product.reviews.length,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
    review: product.reviews.slice(0, 3).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      datePublished: r.date,
      reviewBody: r.content,
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
    })),
  };
};

export const getBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: item.url,
  })),
});

export const getCollectionPageSchema = (
  products: { name: string; id: string; price: number; inspiration: string }[]
) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Shop All Fragrances - HUME Perfumes",
  description:
    "Browse our complete collection of premium fragrance interpretations and modern luxury scents.",
  url: "https://humeperfumes.com/shop",
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://humeperfumes.com/product/${p.id}`,
      name: `${p.name} - Luxury Fragrance`,
    })),
  },
});

export const getFAQSchema = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are inspired perfumes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Inspired perfumes are fragrances crafted to capture the essence and character of iconic luxury scents. HUME Perfumes uses premium ingredients to create refined alternatives with a modern, elevated profile.",
      },
    },
    {
      "@type": "Question",
      name: "How long do HUME perfumes last?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "HUME perfumes are formulated for exceptional longevity, typically lasting 6-12+ hours depending on the fragrance. Our oriental and oud-based scents offer the longest performance.",
      },
    },
    {
      "@type": "Question",
      name: "Are HUME perfumes the same as designer originals?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "HUME perfumes are inspired by iconic fragrance profiles and crafted to capture their essence. While they share similar scent profiles, they are unique formulations by HUME with a modern, elevated character.", 
      },
    },
    {
      "@type": "Question",
      name: "Which brands does HUME have inspired alternatives for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "HUME offers inspired alternatives across a curated range of luxury scent profiles, with new interpretations added regularly.", 
      },
    },
  ],
});

export const getProductFAQSchema = (product: {
  name: string;
  inspiration: string;
  inspirationBrand: string;
  longevity: { duration: string };
  gender: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: `What does ${product.name} smell like?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${product.name} is crafted as a luxury interpretation with a refined scent profile and premium performance.`,
      },
    },
    {
      "@type": "Question",
      name: `How long does ${product.name} last?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${product.name} typically lasts around ${product.longevity.duration}, depending on skin type and application.`,
      },
    },
    {
      "@type": "Question",
      name: `Who is ${product.name} best for?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${product.name} is positioned for ${product.gender} wearers and suitable for customers looking for premium fragrances.`,
      },
    },
  ],
});

export const getProductReviewSchema = (product: {
  id: string;
  name: string;
  reviews: { rating: number; author: string; content: string; date: string }[];
}) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `${product.name} Reviews`,
  itemListElement: product.reviews.slice(0, 10).map((review, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Review",
      itemReviewed: {
        "@type": "Product",
        name: product.name,
        url: `https://humeperfumes.com/product/${product.id}`,
      },
      author: { "@type": "Person", name: review.author },
      datePublished: review.date,
      reviewBody: review.content,
      reviewRating: { "@type": "Rating", ratingValue: review.rating, bestRating: 5 },
    },
  })),
});






