"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, Car, ExternalLink } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);
    setTimeout(() => {
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="w-full min-h-screen bg-zinc-950 py-20 px-4 sm:px-6 lg:px-8 text-zinc-100 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest text-gold-400 font-bold">Get in Touch</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide text-zinc-100 font-bold">Contact & Concierge</h1>
          <div className="h-[1.5px] w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Cards & Form (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-900/60 border border-zinc-800/80 p-6 flex gap-4 items-start shadow-sm rounded-2xl">
                <MapPin className="h-5 w-5 text-gold-400 shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="font-serif text-sm font-bold text-zinc-150 uppercase tracking-wider">Address</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-medium">
                    Ground Floor, A191, near Bharat Mata Chowk, Main A-block, Shalimar Garden, Sahibabad, Ghaziabad, UP 201005
                  </p>
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800/80 p-6 flex gap-4 items-start shadow-sm rounded-2xl">
                <Phone className="h-5 w-5 text-gold-400 shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="font-serif text-sm font-bold text-zinc-150 uppercase tracking-wider">Phone</h4>
                  <p className="text-zinc-400 text-xs font-medium">
                    <a href="tel:07982994654" className="hover:text-gold-400 transition-colors">
                      07982994654
                    </a>
                  </p>
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800/80 p-6 flex gap-4 items-start shadow-sm rounded-2xl">
                <Mail className="h-5 w-5 text-gold-400 shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="font-serif text-sm font-bold text-zinc-150 uppercase tracking-wider">Email</h4>
                  <p className="text-zinc-400 text-xs font-medium">
                    <a href="mailto:info@kalimirch.com" className="hover:text-gold-400 transition-colors">
                      info@kalimirch.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800/80 p-6 flex gap-4 items-start shadow-sm rounded-2xl">
                <Clock className="h-5 w-5 text-gold-400 shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="font-serif text-sm font-bold text-zinc-150 uppercase tracking-wider">Hours</h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed font-medium">
                    Mon - Sun: 11:00 AM - 11:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 p-8 shadow-sm rounded-2xl">
              <h3 className="font-serif text-xl text-zinc-100 mb-6 border-b border-zinc-800 pb-3 font-bold">Send a Message</h3>
              {sent ? (
                <div className="text-center py-8 space-y-4">
                  <span className="text-gold-400 text-3xl font-serif">✓</span>
                  <p className="text-zinc-400 text-sm font-medium">Your message has been dispatched successfully. Our concierge team will connect shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Your Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 text-zinc-150 px-4 py-3 rounded-xl text-sm focus:border-gold-600/50 outline-none transition-colors font-medium"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 text-zinc-150 px-4 py-3 rounded-xl text-sm focus:border-gold-600/50 outline-none transition-colors font-medium"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Your Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={5}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-150 px-4 py-3 rounded-xl text-sm focus:border-gold-600/50 outline-none transition-colors resize-none font-medium"
                      placeholder="Share your booking query, feedback, or specific dining requirements..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-500 hover:to-gold-600 text-white py-4 font-sans text-xs tracking-widest uppercase font-bold transition-all shadow-lg shadow-gold-600/10 rounded-full hover:scale-[1.01] active:scale-95"
                  >
                    <Send className="h-4 w-4" />
                    {loading ? "Sending..." : "Submit Inquiry"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right: Interactive Location Map (5 cols) */}
          <div className="lg:col-span-5 p-[1px] bg-gradient-to-br from-gold-600/40 via-gold-600/15 to-gold-600/40 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 group shrink-0">
            <div className="bg-zinc-900 rounded-[23px] overflow-hidden flex flex-col h-[500px]">
              
              {/* Map Iframe */}
              <div className="relative w-full h-[290px] bg-zinc-950 overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.123456789!2d77.3343267!3d28.6887415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfb94a5ffd9bb%3A0xdaeb6287b9ea786d!2sKALI%20MIRCH%20RESTAURANT%20%26%20CAFE!5e0!3m2!1sen!2sin!4v1719800000000!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true}
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale-[5%] contrast-[102%] transition-transform duration-700 group-hover:scale-[1.01]"
                />
              </div>

              {/* Simplified Guide Card Body */}
              <div className="p-6 flex flex-col justify-between flex-grow bg-zinc-900/60 border-t border-zinc-800/80">
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-zinc-150 uppercase tracking-wide">Kali Mirch Restaurant & Cafe</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed font-medium">
                    Ground Floor, A191, near Bharat Mata Chowk, Shalimar Garden, Sahibabad, Ghaziabad, UP 201005
                  </p>
                  
                  {/* Valet notice */}
                  <div className="flex gap-2.5 items-center text-xs text-gold-400 font-bold bg-gold-950/20 px-4 py-2.5 rounded-full border border-gold-600/20">
                    <Car className="h-4 w-4 shrink-0" />
                    <span>Valet Parking available at the entrance</span>
                  </div>
                </div>

                {/* Redirect Button */}
                <div className="border-t border-zinc-800 pt-4 flex items-center justify-between gap-4">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold font-sans">Open in GPS Navigation</span>
                  <a 
                    href="https://www.google.com/maps/place/KALI%20MIRCH%20RESTAURANT+%26+CAFE/@28.6887415,77.3343267,17z" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-500 hover:to-gold-600 text-white font-bold uppercase tracking-widest text-[9px] px-5 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-md shadow-gold-600/10 group"
                  >
                    <span>Get Directions</span>
                    <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
