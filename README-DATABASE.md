# Database Setup Guide

This project uses **Drizzle ORM** with **Neon PostgreSQL** for managing products and blog posts.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Environment Variables

The `.env.local` file has been created with your Neon database connection string. Make sure it's configured correctly.

### 3. Push Database Schema

Push the schema to your Neon database:

```bash
npm run db:push
```

This will create the following tables:
- `products` - Stores perfume/product data
- `reviews` - Stores product reviews
- `blog_posts` - Stores blog post data

### 4. Seed the Database

Seed the database with your existing product and blog data:

```bash
npm run db:seed
```

This will:
- Clear existing data
- Insert all products from `data/perfumes.ts`
- Insert all reviews for each product
- Insert all blog posts from `data/blogPosts.ts`

### 5. Verify Setup

You can use Drizzle Studio to view and manage your data:

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:4983` where you can browse and edit your database.

## API Routes

### Products

- `GET /api/products` - Get all products (supports `?categoryId=` and `?gender=` query params)
- `GET /api/products/[id]` - Get single product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product
- `GET /api/products/[id]/reviews` - Get reviews for a product
- `POST /api/products/[id]/reviews` - Add review to a product

### Blog Posts

- `GET /api/blog` - Get all blog posts (supports `?category=` and `?featured=true` query params)
- `GET /api/blog/[slug]` - Get single blog post by slug
- `POST /api/blog` - Create new blog post
- `PUT /api/blog/[slug]` - Update blog post
- `DELETE /api/blog/[slug]` - Delete blog post

## Database Schema

### Products Table
- `id` (string, primary key)
- `name`, `inspiration`, `inspirationBrand`
- `category`, `categoryId`, `gender`
- `images` (JSON array)
- `price` (decimal)
- `description`, `seoDescription`
- `seoKeywords` (JSON array)
- `notes` (JSON: top, heart, base arrays)
- `longevity` (JSON: duration, sillage, season, occasion)
- `size`
- `createdAt`, `updatedAt`

### Reviews Table
- `id` (string, primary key)
- `productId` (foreign key to products)
- `author`, `rating`, `date`
- `title`, `content`
- `verified` (boolean)
- `createdAt`

### Blog Posts Table
- `id` (string, primary key)
- `title`, `slug` (unique)
- `excerpt`, `content`
- `seoTitle`, `seoDescription`
- `seoKeywords` (JSON array)
- `category`, `author`
- `date`, `readTime`
- `featured` (boolean)
- `createdAt`, `updatedAt`

## Migration Commands

- `npm run db:generate` - Generate migration files
- `npm run db:migrate` - Run migrations
- `npm run db:push` - Push schema changes directly (development)
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:seed` - Seed database with initial data

## Notes

- The app now uses the database instead of local TypeScript files
- All pages have been updated to fetch from the database
- Client components fetch via API routes
- Server components use direct database functions from `lib/db/`
