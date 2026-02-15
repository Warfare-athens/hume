"use client";

import { motion } from "framer-motion";
import { Star, CheckCircle } from "lucide-react";
import { Review, getAverageRating } from "@/data/perfumes";

interface ProductReviewsProps {
  reviews: Review[];
  productName: string;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={
            star <= rating
              ? "fill-primary text-primary"
              : "fill-muted text-muted"
          }
        />
      ))}
    </div>
  );
};

const ProductReviews = ({ reviews, productName }: ProductReviewsProps) => {
  const averageRating = getAverageRating(reviews);
  const totalReviews = reviews.length;
  const avatarColors = [
    "bg-amber-100 text-amber-800",
    "bg-emerald-100 text-emerald-800",
    "bg-sky-100 text-sky-800",
    "bg-rose-100 text-rose-800",
    "bg-violet-100 text-violet-800",
    "bg-slate-100 text-slate-800",
  ];

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => r.rating === rating).length;
    const percentage = (count / totalReviews) * 100;
    return { rating, count, percentage };
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return `${first}${last}`.toUpperCase();
  };

  const getAvatarClass = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i += 1) {
      hash = (hash * 31 + name.charCodeAt(i)) % avatarColors.length;
    }
    return avatarColors[hash];
  };

  return (
    <section className="py-16 md:py-24 border-t border-border">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-caption text-muted-foreground mb-4">
              Customer Reviews
            </p>
            <h2 className="text-headline mb-4">
              What Our <span className="italic">Clients</span> Say
            </h2>
            <div className="divider-elegant mx-auto" />
          </div>

          {/* Rating Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 max-w-4xl mx-auto">
            {/* Average Rating */}
            <div className="text-center md:text-left md:border-r md:border-border md:pr-12">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <span className="font-serif text-5xl">{averageRating}</span>
                <div>
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        className={
                          star <= Math.round(averageRating)
                            ? "fill-primary text-primary"
                            : "fill-muted text-muted"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-caption text-muted-foreground">
                    Based on {totalReviews} reviews
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-caption w-12">{rating} stars</span>
                  <div className="flex-1 h-2 bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-caption text-muted-foreground w-8">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.article
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border border-border p-6 bg-background"
                itemScope
                itemType="https://schema.org/Review"
              >
                {/* Hidden SEO data */}
                <meta itemProp="itemReviewed" content={productName} />
                <meta itemProp="author" content={review.author} />
                <div
                  itemProp="reviewRating"
                  itemScope
                  itemType="https://schema.org/Rating"
                >
                  <meta itemProp="ratingValue" content={String(review.rating)} />
                  <meta itemProp="bestRating" content="5" />
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between mb-4">
                  <StarRating rating={review.rating} />
                </div>

                {/* Review Title */}
                <h3
                  className="font-serif text-lg mb-2"
                  itemProp="name"
                >
                  {review.title}
                </h3>

                {/* Review Content */}
                <p
                  className="text-body text-muted-foreground mb-4 leading-relaxed"
                  itemProp="reviewBody"
                >
                  {review.content}
                </p>

                {/* Author & Date */}
                <div className="flex items-center justify-between text-caption text-muted-foreground pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-9 w-9 rounded-full flex items-center justify-center text-[11px] font-medium ${getAvatarClass(
                        review.author
                      )}`}
                    >
                      {getInitials(review.author)}
                    </div>
                    <div className="leading-tight">
                      <span>{review.author}</span>
                      {review.verified && (
                        <span className="flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-emerald-700 mt-1">
                          <CheckCircle size={11} />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                  <time dateTime={review.date} itemProp="datePublished">
                    {formatDate(review.date)}
                  </time>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductReviews;
