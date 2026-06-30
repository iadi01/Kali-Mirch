"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, MapPin, Phone, ArrowRight } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-zinc-950 border-t border-zinc-800/60 pt-16 pb-12 text-zinc-400 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Kali Mirch Restaurant & Cafe logo"
                className="h-14 w-auto object-contain invert brightness-125 contrast-125 mix-blend-screen"
              />
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-sm">
              Bold flavours. Honest food. Kali Mirch Restaurant & Cafe brings you the real taste of India — spiced with tradition, served with warmth.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/kali_mirch_restaurant"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-gold-400 hover:border-gold-600 transition-all duration-300 bg-zinc-900"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.swiggy.com/restaurants/kali-mirch-restaurant-and-cafe-shalimar-garden-noida-588038/dineout"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 px-3 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-gold-400 hover:border-gold-600 transition-all duration-300 bg-zinc-900 text-xs font-bold"
              >
                Swiggy
              </a>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-6">
            <h4 className="font-serif text-lg tracking-wider text-zinc-100 font-bold">Opening Hours</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold-600" />
                <span>Monday – Sunday</span>
              </li>
              <li className="pl-6 text-xs text-zinc-400">11:00 AM – 11:00 PM</li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div className="space-y-6">
            <h4 className="font-serif text-lg tracking-wider text-zinc-100 font-bold">Location & Contact</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gold-600 mt-1 shrink-0" />
                <span>Ground Floor, A191, near Bharat Mata Chowk, Main A-block, Shalimar Garden, Sahibabad, Ghaziabad, UP 201005</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold-600" />
                <a href="tel:07982994654" className="hover:text-gold-400 transition-colors">
                  07982994654
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className="font-serif text-lg tracking-wider text-zinc-100 font-bold">Stay Updated</h4>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Subscribe for exclusive offers, seasonal specials, and event invitations.
            </p>
            {subscribed ? (
              <p className="text-sm text-gold-400">Thank you! You&apos;re now on our list. 🌶️</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex border border-zinc-700 focus-within:border-gold-600 bg-zinc-900">
                <input
                  type="email"
                  placeholder="Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 outline-none bg-transparent"
                  required
                />
                <button type="submit" className="bg-gold-600 hover:bg-gold-700 text-white px-4 flex items-center justify-center transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-600 gap-4">
          <p>© {new Date().getFullYear()} Kali Mirch Restaurant & Cafe. All rights reserved.</p>
          <div className="flex flex-wrap gap-6 justify-center md:justify-end">
            <Link href="/privacy-policy" className="hover:text-gold-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-gold-400 transition-colors">Terms of Service</Link>
            <Link href="/refunds-cancellation" className="hover:text-gold-400 transition-colors">Refunds & Cancellation</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
