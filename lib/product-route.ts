type ProductRouteLike = {
  id: string;
  name: string;
  inspirationBrand: string;
  inspiration: string;
};

export function slugifyProductPart(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function getProductSeoSlug(product: ProductRouteLike): string {
  const name = slugifyProductPart(product.name);
  const brand = slugifyProductPart(product.inspirationBrand);
  const inspiration = slugifyProductPart(product.inspiration);
  return `hume-${name}-inspired-by-${brand}-${inspiration}`;
}

export function getProductPath(product: ProductRouteLike): string {
  return `/product/${getProductSeoSlug(product)}`;
}

