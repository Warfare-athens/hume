"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { BlogPost } from "@/data/blogPosts";

const LatestJournal = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const response = await fetch("/api/blog");
        if (!response.ok) {
          throw new Error(`Failed to fetch blog posts: ${response.status}`);
        }

        const data = await response.json();
        setBlogPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setBlogPosts([]);
      }
    }
    fetchBlogPosts();
  }, []);

  const latest = blogPosts.slice(0, 6);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container-luxury">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-[0.2em] mb-3 block">
              The Journal
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide">
              Latest Articles
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden md:inline text-caption link-underline text-muted-foreground hover:text-foreground transition-luxury"
          >
            View All →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {latest.slice(0, 2).map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group border border-border p-8 hover:border-foreground transition-luxury"
            >
              <span className="text-xs text-muted-foreground uppercase tracking-[0.15em]">
                {post.category} · {post.readTime}
              </span>
              <h3 className="font-serif text-xl md:text-2xl font-light mt-3 mb-3 group-hover:opacity-70 transition-opacity">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {latest.slice(2, 6).map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group border border-border p-5 hover:border-foreground transition-luxury"
            >
              <span className="text-xs text-muted-foreground uppercase tracking-[0.15em]">
                {post.category}
              </span>
              <h3 className="font-serif text-base font-light mt-2 mb-2 group-hover:opacity-70 transition-opacity line-clamp-2">
                {post.title}
              </h3>
              <span className="text-xs text-muted-foreground">{post.readTime}</span>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/blog"
            className="text-caption link-underline text-muted-foreground hover:text-foreground transition-luxury"
          >
            View All Articles →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestJournal;
