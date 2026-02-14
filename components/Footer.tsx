"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer id="contact" className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container-luxury">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-baseline gap-1 mb-6">
              <span className="font-serif text-2xl md:text-3xl font-light tracking-widest">
                HUME
              </span>
              <span className="text-caption opacity-60">PERFUMES</span>
            </Link>
            <p className="text-body opacity-70 max-w-sm">
              Luxury fragrances reimagined. Experience the world's most
              celebrated scents, crafted with passion and precision.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-caption mb-6">Explore</h4>
            <nav className="flex flex-col gap-3">
              <a href="#collection" className="text-body opacity-70 hover:opacity-100 transition-opacity">
                Collection
              </a>
              <Link href="/blog" className="text-body opacity-70 hover:opacity-100 transition-opacity">
                Journal
              </Link>
              <a href="#craft" className="text-body opacity-70 hover:opacity-100 transition-opacity">
                Our Craft
              </a>
              <a href="#about" className="text-body opacity-70 hover:opacity-100 transition-opacity">
                About Us
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-caption mb-6">Contact</h4>
            <div className="space-y-3 text-body opacity-70">
              <p>hello@humeperfumes.com</p>
              <p>+44 20 7123 4567</p>
              <p>London, United Kingdom</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-caption opacity-50">
            © 2025 HUME Perfumes. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-caption opacity-50 hover:opacity-100 transition-opacity">
              Privacy Policy
            </a>
            <a href="#" className="text-caption opacity-50 hover:opacity-100 transition-opacity">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;