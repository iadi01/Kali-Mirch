"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ShoppingBag, User, Menu, X, Calendar } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { cart, user, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Order Online", href: "/order" },
    { name: "Reservation", href: "/reservation" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800/60 bg-zinc-950/95 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Kali Mirch Restaurant & Cafe logo"
                className="h-14 w-auto object-contain transition-all duration-300 group-hover:scale-105 invert brightness-125 contrast-125 mix-blend-screen"
              />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative font-sans text-xs tracking-widest uppercase transition-colors duration-300 hover:text-gold-400 ${
                    isActive ? "text-gold-400 font-bold" : "text-zinc-400"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 h-[1.5px] w-full bg-gradient-to-r from-gold-500 to-gold-600" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Icons */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/reservation"
              className="flex items-center gap-2 border border-gold-600 px-4 py-2 text-xs tracking-widest uppercase text-gold-400 rounded-full transition-all duration-300 hover:bg-gold-600 hover:text-white"
            >
              <Calendar className="h-4 w-4" />
              Book Table
            </Link>

            <Link href="/order" className="relative p-2 text-zinc-400 hover:text-gold-400 transition-colors">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold-600 text-[10px] font-bold text-white ring-2 ring-zinc-950">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <Link
                href={user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"}
                className="p-2 text-zinc-400 hover:text-gold-400 transition-colors"
                title={`Dashboard (${user.name})`}
              >
                <User className="h-5 w-5 text-gold-400" />
              </Link>
            ) : (
              <Link href="/login" className="p-2 text-zinc-400 hover:text-gold-400 transition-colors">
                <User className="h-5 w-5" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            <Link href="/order" className="relative p-2 text-zinc-400 hover:text-gold-400 transition-colors">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold-600 text-[10px] font-bold text-white ring-2 ring-zinc-950">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-gold-400 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-800">
          <div className="space-y-1 px-4 pb-6 pt-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-3 text-sm font-sans tracking-widest uppercase transition-colors ${
                    isActive ? "text-gold-400 bg-gold-600/10 font-bold" : "text-zinc-400 hover:text-gold-400"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="border-t border-zinc-800 pt-4 mt-4 flex flex-col gap-3 px-3">
              <Link
                href="/reservation"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 border border-gold-600 py-3 text-xs tracking-widest uppercase text-gold-400 rounded-full hover:bg-gold-600 hover:text-white"
              >
                <Calendar className="h-4 w-4" />
                Book a Table
              </Link>
              {user ? (
                <div className="flex items-center justify-between py-2 text-zinc-400">
                  <Link
                    href={user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 hover:text-gold-400"
                  >
                    <User className="h-5 w-5" />
                    <span>My Dashboard ({user.name.split(" ")[0]})</span>
                  </Link>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-red-400 text-sm">
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 bg-gold-600 text-white py-3 text-xs tracking-widest uppercase font-bold rounded-full hover:bg-gold-700"
                >
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
