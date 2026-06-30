"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

export default function GalleryPage() {
  const [selectedCat, setSelectedCat] = useState<"ALL" | "INTERIOR" | "EVENTS">("ALL");
  const [lightboxImg, setLightboxImg] = useState<{ src: string; caption: string } | null>(null);

  const images = [
    {
      src: "/km-img-1.jpg",
      category: "INTERIOR" as const,
      caption: "Our main entrance storefront displaying the glowing Kali Mirch Board."
    },
    {
      src: "/km-img-2.jpg",
      category: "INTERIOR" as const,
      caption: "Fascinating balloon decorations at the cafe entrance."
    },
    {
      src: "/km-img-3.jpg",
      category: "EVENTS" as const,
      caption: "Cozy private room fully decorated for kids birthday parties."
    },
    {
      src: "/km-img-4.jpg",
      category: "INTERIOR" as const,
      caption: "Comfy modern cafe seating and warm lighting setup."
    },
    {
      src: "/km-img-5.jpg",
      category: "INTERIOR" as const,
      caption: "Storefront facade displaying party booking availability."
    },
    {
      src: "/km-img-6.jpg",
      category: "INTERIOR" as const,
      caption: "Warm indoor restaurant table setup."
    },
    {
      src: "/km-img-7.jpg",
      category: "EVENTS" as const,
      caption: "Lovely interior decorations for baby milestone events."
    },
    {
      src: "/km-img-8.jpg",
      category: "INTERIOR" as const,
      caption: "Dining area displaying clean space and modern chairs."
    },
    {
      src: "/km-img-9.jpg",
      category: "EVENTS" as const,
      caption: "Vibrant party hall arrangement with gorgeous balloon arches."
    }
  ];

  const filteredImages = selectedCat === "ALL" ? images : images.filter(img => img.category === selectedCat);

  return (
    <div className="w-full min-h-screen bg-zinc-950 py-20 px-4 sm:px-6 lg:px-8 text-zinc-150 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest text-gold-450 font-bold">Visual Expressions</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide text-zinc-100">Gallery & Memories</h1>
          <div className="h-[1.5px] w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-4" />
        </div>

        {/* Categories Tab Selectors */}
        <div className="flex justify-center border-b border-zinc-800 pb-4 mb-12 gap-6 overflow-x-auto no-scrollbar">
          {(["ALL", "INTERIOR", "EVENTS"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`text-xs tracking-widest uppercase transition-colors shrink-0 pb-2 font-bold ${
                selectedCat === cat
                  ? "text-gold-400 border-b-2 border-gold-600"
                  : "text-zinc-500 hover:text-zinc-300"
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
              className="break-inside-avoid relative overflow-hidden group cursor-zoom-in border border-zinc-800/80 bg-zinc-900/40 rounded-xl"
            >
              <img
                src={img.src}
                alt={img.caption}
                className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 rounded-xl"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 rounded-xl">
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
              className="max-h-[80vh] object-contain border border-zinc-900 shadow-2xl rounded-2xl"
            />
            <p className="font-serif text-lg text-gold-400 text-center">{lightboxImg.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
}
