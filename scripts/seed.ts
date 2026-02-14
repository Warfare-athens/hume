import { config } from "dotenv";
import { resolve } from "path";
import { perfumes } from "../data/perfumes";
import { blogPosts as blogPostsData } from "../data/blogPosts";

config({ path: resolve(process.cwd(), ".env.local") });
const defaultCelebImage = "https://placehold.co/600x600?text=Celeb";

async function seed() {
  const { db } = await import("../db/index");
  const { products, reviews, blogPosts: blogPostsTable } = await import("../db/schema");

  console.log("Seeding database...");

  try {
    console.log("Clearing existing data...");
    await db.delete(reviews);
    await db.delete(products);
    await db.delete(blogPostsTable);

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
        .returning();

      if (perfume.reviews && perfume.reviews.length > 0) {
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
        );
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
      }))
    );

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
