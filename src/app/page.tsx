"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { MOCK_MENU_ITEMS, MOCK_REVIEWS } from "@/data/mockData";
import { Calendar, ShoppingBag, Star, Award, Compass, Heart, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { addToCart, favorites, toggleFavorite, cart, updateCartQuantity } = useApp();
  const featuredDishes = MOCK_MENU_ITEMS.filter((item) => item.featured).slice(0, 6);
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  const heroSlides = [
    "/km-img-1.jpg",
    "/km-img-2.jpg",
    "/km-img-3.jpg",
    "/km-img-4.jpg",
    "/km-img-6.jpg",
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const particles = React.useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1.5,
      duration: Math.random() * 12 + 8,
      delay: Math.random() * 6,
    }));
  }, []);

  const whyChooseUs = [
    {
      icon: <img src="/strength-fresh.png" alt="Fresh Ingredients" className="h-12 w-12 object-contain" />,
      title: "Fresh Ingredients",
      desc: "Handpicked premium vegetables, fine herbs, and top-tier meats sourced daily for absolute freshness."
    },
    {
      icon: <img src="/strength-dinein.png" alt="Dine In" className="h-12 w-12 object-contain" />,
      title: "Dine In",
      desc: "Experience luxury fine dining with warm lighting, grand tandoor fragrances, and royal hospitality."
    },
    {
      icon: <img src="/strength-takeaway.png" alt="Take Away" className="h-12 w-12 object-contain" />,
      title: "Take Away",
      desc: "Convenient, premium packaging that preserves heat and flavor, ready for quick contact-free pickup."
    },
    {
      icon: <img src="/strength-delivery.png" alt="Food Delivery" className="h-12 w-12 object-contain" />,
      title: "Food Delivery",
      desc: "Express hot delivery to your doorstep in Jamshedpur, ensuring a luxury restaurant taste at home."
    }
  ];

  return (
    <div className="w-full bg-zinc-950 overflow-x-hidden text-zinc-300 font-sans">
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
        {/* Slideshow background */}
        <div className="absolute inset-0 z-0">
          {heroSlides.map((slide, idx) => (
            <motion.div
              key={slide}
              initial={{ opacity: 0 }}
              animate={{ opacity: idx === currentSlide ? 1 : 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url('${slide}')`,
                display: Math.abs(idx - currentSlide) <= 1 || (currentSlide === 0 && idx === heroSlides.length - 1) ? "block" : "none"
              }}
            />
          ))}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-black/40 z-10" />

        {/* Floating Ember Particles */}
        <div className="absolute inset-0 z-15 overflow-hidden pointer-events-none">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 100 }}
              animate={{ 
                opacity: [0, 0.7, 0.7, 0], 
                y: -400,
                x: [0, Math.random() * 60 - 30, 0] 
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "linear"
              }}
              className="absolute bg-gold-450/40 rounded-full"
              style={{
                left: p.left,
                top: "100%",
                width: p.size,
                height: p.size,
                filter: "blur(0.8px)",
              }}
            />
          ))}
        </div>
        
        {/* Hero Content */}
        <div className="relative z-20 text-center max-w-4xl px-4 flex flex-col items-center">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xs uppercase tracking-widest text-gold-300 font-bold mb-3"
          >
            A Symphony of Taste & Tradition
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-5xl sm:text-7xl font-bold tracking-wider text-white leading-tight mb-6"
          >
            Welcome to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-450 to-gold-600">
              Kali Mirch
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm sm:text-base text-zinc-300 max-w-lg mb-10 leading-relaxed font-sans"
          >
            Taste the Magic, Sip the Moments. Discover bold Indian spices, cozy spaces, and a memory worth repeating.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md"
          >
            <Link
              href="/reservation"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white px-8 py-4 font-sans text-xs tracking-widest uppercase font-bold rounded-full transition-all duration-300 shadow-lg shadow-gold-500/10 hover:scale-105 active:scale-95"
            >
              <Calendar className="h-4 w-4" />
              Book A Table
            </Link>
            <Link
              href="/order"
              className="flex items-center justify-center gap-2 border border-white/20 hover:border-gold-400/60 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white px-8 py-4 font-sans text-xs tracking-widest uppercase font-medium rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="h-4 w-4 text-gold-400" />
              Order Online
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Restaurant Interior Image */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative h-[450px] w-full border border-zinc-800 group overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0 bg-gold-950/20 mix-blend-overlay z-10" />
            <img
              src="/km-story.jpg"
              alt="Kali Mirch dining hall view"
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-4 border border-gold-650/10 pointer-events-none z-20 rounded-xl" />
          </motion.div>

          {/* Story Text */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="space-y-6"
          >
            <span className="text-xs uppercase tracking-widest text-gold-450 font-bold">Our Story</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-wide text-zinc-100 leading-tight">
              Savouring Different Directions In Taste
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed font-sans">
              If you would like to pamper your palate with tastes from India&apos;s most flavoursome kitchens, welcome to Kali Mirch. As the name suggests, Kali Mirch is all about savouring different directions in food; taking detours into the hinterland of taste.
            </p>
            <p className="text-zinc-550 text-sm leading-relaxed font-sans">
              Flavours from traditional kitchens, vibrant streets, and popular eateries of India converge at Kali Mirch. North, South, East, West and more, served with a dollop of love on a delectably diverse vegetarian platter.
            </p>
            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-gold-400 hover:text-gold-300 font-bold transition-colors group"
              >
                Discover Our Heritage
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="py-24 bg-zinc-900/20 relative border-b border-zinc-900">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-950/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-gold-900/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl mx-auto mb-16 space-y-4"
          >
            <span className="text-xs uppercase tracking-widest text-gold-450 font-bold">Chef's Table Selection</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-wide text-zinc-100">Featured Delicacies</h2>
            <p className="text-zinc-500 text-sm font-sans">
              An exclusive look at our most celebrated chef creations, loved by food connoisseurs worldwide.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredDishes.map((dish) => {
              const isFav = favorites.includes(dish.id);
              return (
                <motion.div
                  key={dish.id}
                  variants={{
                    hidden: { opacity: 0, y: 35 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                  }}
                  whileHover={{ y: -8 }}
                  className="flex flex-col group transition-all duration-300 border border-zinc-800/50 hover:border-gold-600/30 hover:shadow-lg rounded-2xl overflow-hidden bg-zinc-900/60 backdrop-blur-md"
                >
                  {/* Dish Image */}
                  <div className="relative h-60 w-full overflow-hidden shrink-0 rounded-t-2xl">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Category Label */}
                    <span className="absolute top-4 left-4 bg-zinc-950/80 border border-gold-600/20 text-[10px] text-gold-300 tracking-widest uppercase px-3 py-1 font-medium backdrop-blur-sm rounded-full">
                      {dish.category}
                    </span>
                    
                    {/* Favorite Icon */}
                    <button
                      onClick={() => toggleFavorite(dish.id)}
                      className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/60 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-gold-450 transition-colors backdrop-blur-sm"
                    >
                      <Heart className={`h-4 w-4 ${isFav ? "fill-gold-400 text-gold-400" : ""}`} />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="p-6 flex flex-col flex-grow justify-between gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-serif text-lg font-bold text-zinc-100 group-hover:text-gold-400 transition-colors">
                          {dish.name}
                        </h3>
                        <span className="font-serif text-gold-400 font-bold">₹{dish.price}</span>
                      </div>
                      <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2">
                        {dish.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4 mt-auto">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-gold-500 text-gold-500" />
                        <span className="text-xs text-zinc-400 font-medium">{dish.rating}</span>
                      </div>
                      {(() => {
                        const inCart = cart.find(c => c.menuItem.id === dish.id);
                        return inCart ? (
                          <div className="flex items-center border border-gold-650 bg-gold-950/20 text-gold-400 rounded-full overflow-hidden h-8">
                            <button
                              onClick={() => updateCartQuantity(dish.id, inCart.quantity - 1)}
                              className="px-3.5 py-1 text-xs hover:bg-zinc-800 font-bold transition-colors"
                            >
                              -
                            </button>
                            <span className="px-1 text-xs font-bold text-zinc-100">{inCart.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(dish.id, inCart.quantity + 1)}
                              className="px-3.5 py-1 text-xs hover:bg-zinc-800 font-bold transition-colors"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(dish, 1)}
                            className="flex items-center gap-2 border border-gold-600/30 px-4 py-2 text-[10px] tracking-widest uppercase font-bold text-gold-400 rounded-full transition-all duration-300 hover:bg-gold-600 hover:text-white hover:border-gold-600"
                          >
                            <ShoppingBag className="h-3 w-3" />
                            Add To Order
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* View Full Menu Redirect Button */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mt-16"
          >
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-600 to-gold-800 hover:from-gold-500 hover:to-gold-650 text-white px-10 py-4 font-sans text-xs tracking-widest uppercase font-bold rounded-full transition-all duration-300 shadow-xl shadow-gold-950/20 hover:scale-105 active:scale-95 group"
            >
              View Full Menu
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-2"
        >
          <span className="text-xs uppercase tracking-widest text-gold-400 font-bold">Why Choose Us</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-wide text-zinc-100">Our Strength</h2>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {whyChooseUs.map((item, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
              whileHover={{ y: -6 }}
              className="flex flex-col items-center text-center p-8 border border-zinc-800/65 bg-zinc-900/40 hover:border-gold-600/30 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md"
            >
              <div className="h-20 w-20 rounded-full border border-gold-600/10 bg-gold-950/20 flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="font-serif text-lg font-bold text-zinc-100 mb-3">{item.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-sans font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-24 bg-zinc-900/20 border-b border-zinc-900">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-4 text-center"
        >
          <span className="text-xs uppercase tracking-widest text-gold-450 font-bold">Guest Impressions</span>
          <div className="mt-8 relative px-8 min-h-[220px] flex flex-col justify-center">
            <h3 className="text-gold-500 text-4xl font-serif mb-2">“</h3>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeReviewIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                <p className="font-serif text-xl sm:text-2xl italic text-zinc-200 leading-relaxed">
                  {MOCK_REVIEWS[activeReviewIdx].comment}
                </p>
                <div>
                  <h4 className="text-sm font-sans tracking-widest uppercase text-gold-450 font-bold mb-1">
                    {MOCK_REVIEWS[activeReviewIdx].guestName}
                  </h4>
                  <span className="text-xs text-zinc-500">Kali Mirch Guest</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Dots */}
            <div className="flex justify-center gap-3 mt-8">
              {MOCK_REVIEWS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveReviewIdx(idx)}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    idx === activeReviewIdx ? "bg-gold-500 w-6" : "bg-zinc-800"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-20 bg-zinc-950 border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 space-y-2"
          >
            <span className="text-xs uppercase tracking-widest text-gold-450 font-bold">Inside Kali Mirch</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-wide text-zinc-100">Our Ambiance</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { src: "/km-img-1.jpg", alt: "Storefront View" },
              { src: "/km-img-3.jpg", alt: "Birthday Decoration" },
              { src: "/km-img-4.jpg", alt: "Cafe Seating" },
              { src: "/km-img-6.jpg", alt: "Warm Table Seating" },
            ].map((photo, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.07 }}
                whileHover={{ scale: 1.03 }}
                className="relative overflow-hidden rounded-xl aspect-square group cursor-pointer"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Tour Section */}
      <section className="py-20 bg-zinc-950 relative overflow-hidden border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 space-y-2"
          >
            <span className="text-xs uppercase tracking-widest text-gold-450 font-bold">Experience the Vibe</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-wide text-zinc-100">Live Video Tour</h2>
          </motion.div>
          <div className="relative aspect-video max-w-4xl mx-auto rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
            <video 
              src="/km-video.mp4" 
              controls 
              muted 
              loop 
              autoPlay 
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Reservation CTA banner */}
      <section 
        className="relative py-24 bg-cover bg-center text-center overflow-hidden"
        style={{ backgroundImage: "url('/km-img-3.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/75" />
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto px-4 space-y-8"
        >
          <span className="text-xs uppercase tracking-widest text-gold-300 font-bold">Exclusive Experience</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-wide text-white">
            Secure Your Table for Dinner
          </h2>
          <p className="text-zinc-300 text-sm max-w-md mx-auto leading-relaxed">
            Reserve early to secure preferred dining slots and personalized multicourse suggestions.
          </p>
          <div>
            <Link
              href="/reservation"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white px-10 py-4 font-sans text-xs tracking-widest uppercase font-bold rounded-full transition-all duration-300 shadow-xl shadow-gold-500/10 hover:scale-105 active:scale-95"
            >
              <Calendar className="h-4 w-4" />
              Book Reservation
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
