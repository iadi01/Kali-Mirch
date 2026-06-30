"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { MOCK_MENU_ITEMS } from "@/data/mockData";
import { Search, ShoppingBag, Star, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MenuPage() {
  const { addToCart, favorites, toggleFavorite, cart, updateCartQuantity } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [vegFilter, setVegFilter] = useState<"ALL" | "VEG" | "NON_VEG">("ALL");

  // Extract unique categories
  const categories = useMemo(() => {
    const list = Array.from(new Set(MOCK_MENU_ITEMS.map((item) => item.category)));
    return ["All", ...list];
  }, []);

  // Filter menu items
  const filteredItems = useMemo(() => {
    return MOCK_MENU_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesVeg = vegFilter === "ALL" || 
                         (vegFilter === "VEG" && item.isVeg) || 
                         (vegFilter === "NON_VEG" && !item.isVeg);

      return matchesCategory && matchesSearch && matchesVeg;
    });
  }, [selectedCategory, searchQuery, vegFilter]);

  return (
    <div className="w-full min-h-screen bg-zinc-950 py-20 px-4 sm:px-6 lg:px-8 text-zinc-300 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest text-gold-450 font-bold">Gastronomic Selection</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide text-zinc-100">Our Culinary Menu</h1>
          <div className="h-[1.5px] w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-4" />
        </div>

        {/* Filter Controls (Search + Veg Toggle) */}
        <div className="glass p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 bg-zinc-900/40 border border-zinc-800/60 rounded-3xl">
          {/* Search Bar */}
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              placeholder="Search our delicacies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/60 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 pl-10 pr-4 py-3 rounded-full outline-none focus:border-gold-650/50 transition-colors"
            />
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
          </div>

          {/* Veg/Non-Veg Filter Buttons */}
          <div className="flex bg-zinc-950 border border-zinc-850 p-1 rounded-full">
            {(["ALL", "VEG", "NON_VEG"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setVegFilter(filter)}
                className={`px-6 py-2 text-xs tracking-wider uppercase transition-all duration-300 font-bold ${
                  vegFilter === filter
                    ? "bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-full shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {filter === "ALL" ? "Show All" : filter === "VEG" ? "Veg Only" : "Non-Veg Only"}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Sidebar/Navbar + Menu Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Category Tabs (Left) */}
          <div className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar border-b lg:border-b-0 lg:border-r border-zinc-850 pb-4 lg:pb-0 lg:pr-8 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-3 text-left text-xs tracking-widest uppercase shrink-0 transition-all font-sans rounded-lg ${
                  selectedCategory === cat
                    ? "text-gold-400 font-bold border-l-0 lg:border-l-2 lg:border-gold-600 bg-gold-650/10 pl-4"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Items Grid (Right) */}
          <div className="flex-1">
            {filteredItems.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
                <p className="text-zinc-500 text-sm">No culinary items found matching your filters.</p>
              </div>
            ) : (
              <motion.div 
                layout 
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {filteredItems.map((dish) => {
                    const isFav = favorites.includes(dish.id);
                    return (
                      <motion.div
                        key={dish.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col group border border-zinc-800/60 hover:border-gold-600/30 hover:shadow-lg rounded-2xl overflow-hidden bg-zinc-900/60 backdrop-blur-md transition-all duration-300"
                      >
                        {/* Food Image */}
                        <div className="relative h-48 w-full overflow-hidden shrink-0">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          
                          {/* Veg/Non-Veg Indicator Badge */}
                          <span className={`absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 text-[9px] tracking-widest uppercase font-bold backdrop-blur-sm border rounded-full ${
                            dish.isVeg 
                              ? "bg-zinc-950/80 border-emerald-900/40 text-emerald-400" 
                              : "bg-zinc-950/80 border-red-900/40 text-red-400"
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${dish.isVeg ? "bg-emerald-500" : "bg-red-500"}`} />
                            {dish.isVeg ? "Veg" : "Non-Veg"}
                          </span>

                          {/* Favorite button */}
                          <button
                            onClick={() => toggleFavorite(dish.id)}
                            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-zinc-950/80 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-gold-400 transition-colors backdrop-blur-sm shadow-sm"
                          >
                            <Heart className={`h-4 w-4 ${isFav ? "fill-gold-500 text-gold-500" : ""}`} />
                          </button>
                        </div>

                        {/* Dish Details */}
                        <div className="p-5 flex flex-col flex-grow justify-between gap-5">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start gap-4">
                              <h3 className="font-serif text-base font-bold text-zinc-150 group-hover:text-gold-400 transition-colors">
                                {dish.name}
                              </h3>
                              <span className="font-serif text-gold-400 font-bold text-sm shrink-0">₹{dish.price}</span>
                            </div>
                            <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2 font-medium">
                              {dish.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between border-t border-zinc-800 pt-4 mt-auto">
                            <div className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
                              <span className="text-xs text-zinc-400 font-medium">{dish.rating}</span>
                            </div>
                            
                            {(() => {
                              const inCart = cart.find(c => c.menuItem.id === dish.id);
                              return inCart ? (
                                <div className="flex items-center border border-gold-600 bg-gold-950/40 text-gold-400 rounded-full overflow-hidden h-8">
                                  <button
                                    onClick={() => updateCartQuantity(dish.id, inCart.quantity - 1)}
                                    className="px-3 py-1 text-xs hover:bg-zinc-800 font-bold transition-colors"
                                  >
                                    -
                                  </button>
                                  <span className="px-1 text-xs font-bold text-zinc-100">{inCart.quantity}</span>
                                  <button
                                    onClick={() => updateCartQuantity(dish.id, inCart.quantity + 1)}
                                    className="px-3 py-1 text-xs hover:bg-zinc-800 font-bold transition-colors"
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => addToCart(dish, 1)}
                                  className="flex items-center gap-1.5 border border-gold-600/35 px-3 py-1.5 text-[9px] tracking-widest uppercase font-bold text-gold-450 rounded-full transition-all duration-300 hover:bg-gold-600 hover:text-white hover:border-gold-600"
                                >
                                  <ShoppingBag className="h-3 w-3" />
                                  Add to Order
                                </button>
                              );
                            })()}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
