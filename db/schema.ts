import { pgTable, text, varchar, decimal, jsonb, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";

// Enums
export const genderEnum = pgEnum("gender", ["Men", "Women", "Unisex"]);

// Products/Perfumes Table
export const products = pgTable("products", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  inspiration: varchar("inspiration", { length: 255 }).notNull(),
  inspirationBrand: varchar("inspiration_brand", { length: 255 }).notNull(),
  woreBy: varchar("wore_by", { length: 255 }),
  woreByImageUrl: varchar("wore_by_image_url", { length: 2048 })
    .notNull()
    .default("https://placehold.co/600x600?text=Celeb"),
  category: varchar("category", { length: 100 }).notNull(),
  categoryId: varchar("category_id", { length: 100 }).notNull(),
  gender: genderEnum("gender").notNull(),
  images: jsonb("images").$type<string[]>().notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  priceCurrency: varchar("price_currency", { length: 3 }).notNull().default("INR"),
  description: text("description").notNull(),
  seoDescription: text("seo_description").notNull(),
  seoKeywords: jsonb("seo_keywords").$type<string[]>().notNull(),
  notes: jsonb("notes").$type<{
    top: string[];
    heart: string[];
    base: string[];
  }>().notNull(),
  longevity: jsonb("longevity").$type<{
    duration: string;
    sillage: string;
    season: string[];
    occasion: string[];
  }>().notNull(),
  size: varchar("size", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Reviews Table
export const reviews = pgTable("reviews", {
  id: varchar("id", { length: 255 }).primaryKey(),
  productId: varchar("product_id", { length: 255 })
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  author: varchar("author", { length: 255 }).notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).notNull(),
  date: varchar("date", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  verified: boolean("verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Blog Posts Table
export const blogPosts = pgTable("blog_posts", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  seoTitle: varchar("seo_title", { length: 500 }).notNull(),
  seoDescription: text("seo_description").notNull(),
  seoKeywords: jsonb("seo_keywords").$type<string[]>().notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  date: varchar("date", { length: 50 }).notNull(),
  readTime: varchar("read_time", { length: 50 }).notNull(),
  featured: boolean("featured").default(false).notNull(),
  imageUrl: varchar("image_url", { length: 2048 }),
  relatedProductId: varchar("related_product_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Bottles Table
export const bottles = pgTable("bottles", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  imageUrl: varchar("image_url", { length: 2048 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  priceCurrency: varchar("price_currency", { length: 3 }).notNull().default("INR"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Images Library Table
export const images = pgTable("images", {
  id: varchar("id", { length: 255 }).primaryKey(),
  label: varchar("label", { length: 255 }).notNull(),
  url: varchar("url", { length: 2048 }).notNull(),
  link: varchar("link", { length: 2048 }),
  usage: varchar("usage", { length: 100 }).notNull().default("general"),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Export types
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
export type Bottle = typeof bottles.$inferSelect;
export type NewBottle = typeof bottles.$inferInsert;
export type ImageAsset = typeof images.$inferSelect;
export type NewImageAsset = typeof images.$inferInsert;
