"use client";

import React from "react";
import { Award, Compass, Heart, ShieldCheck, Flame, Users, CalendarDays } from "lucide-react";

export default function AboutPage() {
  const milestones = [
    { year: "2012", title: "Foundation", desc: "First launched in the historic sector with 5 signature dishes." },
    { year: "2016", title: "First Star Award", desc: "Received culinary recognition for architectural gastronomy." },
    { year: "2020", title: "Expansion", desc: "Renovated layout to include private lounge and wine cellar." },
    { year: "2024", title: "Digital Integration", desc: "Launched contactless table ordering and smart reservations." }
  ];

  const chefs = [
    {
      name: "Richard Dupont",
      role: "Chef de Cuisine",
      desc: "20+ years of fine dining leadership in Paris and Lyon.",
      image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Meera Singh",
      role: "Head Tandoor Master",
      desc: "Expert in clay oven chemistry and native tandoori spice blends.",
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-zinc-950 py-20 px-4 sm:px-6 lg:px-8 text-zinc-300 font-sans">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-widest text-gold-450 font-bold">Our Philosophy</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide text-zinc-100">The Culinary Heritage</h1>
          <div className="h-[1.5px] w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-4" />
        </div>

        {/* Narrative & Image Block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="font-serif text-2xl font-bold text-gold-400">Where Gastronomy Meets Luxury</h3>
            <p className="text-zinc-400 text-sm leading-relaxed font-sans font-medium">
              At Kali Mirch Restaurant & Cafe, we believe dining is not merely about sustenance; it is a celebration of authentic flavors and warm hospitality. Our space is styled with elegant nature-inspired green accents and comfortable settings to provide a relaxing dining experience.
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed font-sans font-medium">
              We source our fresh ingredients daily, selecting only the finest fresh seasonal vegetables, high-quality paneer, aromatic basmati rice, and authentic spices from local vendors. Every dish is made completely from scratch in our state-of-the-art kitchen.
            </p>
            <div className="flex gap-8 border-t border-zinc-800 pt-6 mt-6">
              <div className="space-y-1">
                <span className="font-serif text-2xl font-bold text-gold-400">8+</span>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Years of Excellence</p>
              </div>
              <div className="space-y-1">
                <span className="font-serif text-2xl font-bold text-gold-400">90k+</span>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Guests Welcomed</p>
              </div>
              <div className="space-y-1">
                <span className="font-serif text-2xl font-bold text-gold-400">10+</span>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Master Chefs</p>
              </div>
            </div>
          </div>
          <div className="relative h-[380px] border border-gold-600/20 overflow-hidden rounded-2xl group">
            <img
              src="/km-img-6.jpg"
              alt="Kali Mirch dining room glasshouse details"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-4 border border-gold-600/10 pointer-events-none rounded-xl" />
          </div>
        </div>

        {/* Timeline Milestones */}
        <div className="space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest text-gold-450 font-bold">Chronology</span>
            <h3 className="font-serif text-2xl font-bold text-zinc-150">Our Historic Journey</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {milestones.map((stone, idx) => (
              <div key={idx} className="bg-zinc-900/60 border border-zinc-800/80 p-6 flex flex-col justify-between h-48 shadow-sm rounded-2xl">
                <span className="font-serif text-3xl font-bold text-gold-400">{stone.year}</span>
                <div className="space-y-2">
                  <h4 className="font-serif text-sm font-bold text-zinc-150">{stone.title}</h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed font-medium">{stone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chefs Team Section */}
        <div className="space-y-12 pb-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest text-gold-450 font-bold">Artisans</span>
            <h3 className="font-serif text-2xl font-bold text-zinc-150">Master Kitchen Artisans</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {chefs.map((chef, idx) => (
              <div key={idx} className="bg-zinc-900/60 border border-zinc-800/80 flex flex-col md:flex-row overflow-hidden group shadow-sm rounded-2xl">
                <div className="h-64 md:h-auto w-full md:w-48 overflow-hidden shrink-0">
                  <img
                    src={chef.image}
                    alt={chef.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 flex flex-col justify-center space-y-3">
                  <div>
                    <h4 className="font-serif text-base font-bold text-zinc-150">{chef.name}</h4>
                    <span className="text-[10px] text-gold-400 uppercase tracking-widest font-bold">
                      {chef.role}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans font-medium">{chef.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
