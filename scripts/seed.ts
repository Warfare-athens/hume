import { config } from "dotenv";
import { resolve } from "path";
import { perfumes } from "../data/perfumes";
import { blogPosts as blogPostsData } from "../data/blogPosts";
import { accessories as accessoriesData } from "../data/accessories";
import { coupons as couponsData } from "../data/coupons";

config({ path: resolve(process.cwd(), ".env.local") });
const defaultCelebImage = "https://placehold.co/600x600?text=Celeb";
const defaultBlogImage =
  "https://res.cloudinary.com/dmbfo7uzl/image/upload/v1771309250/Gemini_Generated_Image_y1gde7y1gde7y1gd_toe3wm.png";

async function seed() {
  const { db } = await import("../db/index");
  const { products, reviews, blogPosts: blogPostsTable, accessories, coupons } = await import("../db/schema");

  console.log("Seeding database...");

  try {
    console.log(`Inserting ${perfumes.length} products...`);
    for (const perfume of perfumes) {
      const [product] = await db
        .insert(products)
        .values({
          id: perfume.id,
          name: perfume.name,
          inspiration: perfume.inspiration,
          inspirationBrand: perfume.inspirationBrand,
          woreBy: perfume.woreBy ?? null,
          woreByImageUrl: perfume.woreByImageUrl ?? defaultCelebImage,
          category: perfume.category,
          categoryId: perfume.categoryId,
          gender: perfume.gender,
          images: perfume.images,
          price: perfume.price.toString(),
          priceCurrency: "INR",
          description: perfume.description,
          seoDescription: perfume.seoDescription,
          seoKeywords: perfume.seoKeywords,
          notes: perfume.notes,
          longevity: perfume.longevity,
          size: perfume.size,
        })
        .onConflictDoNothing()
        .returning();

      if (product && perfume.reviews && perfume.reviews.length > 0) {
        await db.insert(reviews).values(
          perfume.reviews.map((review) => ({
            id: review.id,
            productId: product.id,
            author: review.author,
            rating: review.rating.toString(),
            date: review.date,
            title: review.title,
            content: review.content,
            verified: review.verified,
          }))
        ).onConflictDoNothing();
      }
    }

    console.log(`Inserting ${blogPostsData.length} blog posts...`);
    await db.insert(blogPostsTable).values(
      blogPostsData.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        seoKeywords: post.seoKeywords,
        category: post.category,
        author: post.author,
        date: post.date,
        readTime: post.readTime,
        featured: post.featured,
        imageUrl: post.imageUrl?.trim() ? post.imageUrl : defaultBlogImage,
        relatedProductId: post.relatedProductId ?? "",
      }))
    ).onConflictDoNothing();

    // Keep blog images in sync without creating duplicate posts.
    await db.update(blogPostsTable).set({
      imageUrl: defaultBlogImage,
    });

    console.log(`Inserting ${accessoriesData.length} accessories...`);
    for (const accessory of accessoriesData) {
      await db
        .insert(accessories)
        .values({
          id: accessory.id,
          name: accessory.name,
          shortDescription: accessory.shortDescription,
          description: accessory.description,
          images: accessory.images,
          price: accessory.price.toString(),
          priceCurrency: accessory.priceCurrency,
          isComplementary: accessory.isComplementary,
          giftTier: accessory.giftTier ?? null,
        })
        .onConflictDoNothing();
    }

    console.log(`Inserting ${couponsData.length} coupons...`);
    for (const coupon of couponsData) {
      await db
        .insert(coupons)
        .values({
          id: coupon.id,
          code: coupon.code,
          title: coupon.title,
          description: coupon.description,
          type: coupon.type,
          value: coupon.value.toString(),
          minSubtotal: coupon.minSubtotal.toString(),
          active: coupon.active,
          displayInCart: coupon.displayInCart,
        })
        .onConflictDoNothing();
    }

    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("Seed completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
