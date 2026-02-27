"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
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

  const formatDate = (dateString: string) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const [yearRaw, monthRaw] = dateString.split("-");
    const monthIndex = Number(monthRaw) - 1;
    const year = Number(yearRaw);
    if (!Number.isFinite(year) || monthIndex < 0 || monthIndex > 11) {
      return dateString;
    }
    return `${months[monthIndex]} ${year}`;
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
          <div className="text-center mb-10">
            <p className="text-caption text-muted-foreground mb-4">
              Customer Reviews
            </p>
            <h2 className="text-headline mb-3">
              Real Buyers, Real Feedback
            </h2>
            <p className="text-body text-muted-foreground">
              {averageRating} / 5 • {totalReviews} reviews
            </p>
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
                <div className="mb-4">
                  <StarRating rating={review.rating} />
                </div>

                {/* Review Content */}
                <p
                  className="text-body text-muted-foreground mb-5 leading-relaxed"
                  itemProp="reviewBody"
                >
                  {review.content}
                </p>

                {/* Author & Date */}
                <div className="flex items-center justify-between text-caption text-muted-foreground pt-4 border-t border-border">
                  <span className="text-foreground">{review.author}</span>
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
