"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

export default function GalleryPage() {
  const [selectedCat, setSelectedCat] = useState<"ALL" | "FOOD" | "INTERIOR" | "EVENTS">("ALL");
  const [lightboxImg, setLightboxImg] = useState<{ src: string; caption: string } | null>(null);

  const images = [
    {
      src: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=800&q=80",
      category: "FOOD",
      caption: "Golden Caviar Blinis with 24k Gold Leaf"
    },
    {
      src: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=800&q=80",
      category: "FOOD",
      caption: "Truffle & Forest Mushroom Hand-rolled Gnocchi"
    },
    {
      src: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
      category: "FOOD",
      caption: "Decadent Gold Leaf Chocolate Marquis"
    },
    {
      src: "/resto-interior.jpg",
      category: "INTERIOR",
      caption: "Our main indoor dining lounge with overhead circle lighting and custom flora."
    },
    {
      src: "/resto-glasshouse.jpg",
      category: "INTERIOR",
      caption: "Bespoke Glasshouse dining chamber for premium family gatherings."
    },
    {
      src: "/resto-patio.jpg",
      category: "EVENTS",
      caption: "Open-air courtyard patio seating under a beautiful twilight sunset sky."
    },
    {
      src: "/resto-lawn.jpg",
      category: "EVENTS",
      caption: "Lawn dining banquet tables and umbrellas on soft artificial turf."
    }
  ];

  const filteredImages = selectedCat === "ALL" ? images : images.filter(img => img.category === selectedCat);

  return (
    <div className="w-full min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8 text-zinc-800 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest text-gold-600 font-bold">Visual Expressions</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide text-zinc-900">Opulence Gallery</h1>
          <div className="h-[1.5px] w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-4" />
        </div>

        {/* Categories Tab Selectors */}
        <div className="flex justify-center border-b border-zinc-200 pb-4 mb-12 gap-6 overflow-x-auto no-scrollbar">
          {(["ALL", "FOOD", "INTERIOR", "EVENTS"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`text-xs tracking-widest uppercase transition-colors shrink-0 pb-2 font-bold ${
                selectedCat === cat
                  ? "text-gold-600 border-b-2 border-gold-500"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setLightboxImg({ src: img.src, caption: img.caption })}
              className="break-inside-avoid relative overflow-hidden group cursor-zoom-in border border-zinc-150 bg-zinc-50 shadow-sm"
            >
              <img
                src={img.src}
                alt={img.caption}
                className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-[10px] text-gold-300 tracking-widest uppercase font-bold mb-1">
                  {img.category}
                </span>
                <p className="font-serif text-sm text-white leading-normal">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-6 right-6 h-10 w-10 text-zinc-400 hover:text-white flex items-center justify-center rounded-full border border-zinc-800 hover:border-zinc-500 bg-black"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="max-w-4xl w-full flex flex-col items-center gap-4">
            <img
              src={lightboxImg.src}
              alt={lightboxImg.caption}
              className="max-h-[80vh] object-contain border border-zinc-900 shadow-2xl"
            />
            <p className="font-serif text-lg text-gold-300 text-center">{lightboxImg.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
}
