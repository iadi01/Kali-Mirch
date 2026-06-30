"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { TIME_SLOTS } from "@/data/mockData";
import { Calendar, User, Phone, Mail, Clock, MessageSquare, ShieldCheck, Armchair } from "lucide-react";
import Link from "next/link";

export default function ReservationPage() {
  const { addReservation, user } = useApp();
  
  const [guestName, setGuestName] = useState(user?.name || "");
  const [guestEmail, setGuestEmail] = useState(user?.email || "");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [selectedTable, setSelectedTable] = useState<string>("");

  const [isBooking, setIsBooking] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  // Available mock tables
  const tables = [
    { id: "T1", type: "Window Seat", desc: "View of the luxury skyline.", capacity: 2 },
    { id: "T2", type: "Standard Booth", desc: "Intimate and cozy dining.", capacity: 4 },
    { id: "T3", type: "Private Lounge", desc: "Enclosed luxury room.", capacity: 8 },
    { id: "T4", type: "Chef's Table", desc: "Interact directly with the kitchen.", capacity: 2 },
    { id: "T5", type: "Courtyard Garden", desc: "Alfresco dining under the stars.", capacity: 6 }
  ];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestEmail || !guestPhone || !date || !timeSlot || !selectedTable) {
      alert("Please fill in all details and select a table preference.");
      return;
    }

    setIsBooking(true);
    try {
      const res = await addReservation({
        guestName,
        guestEmail,
        guestPhone,
        guestCount,
        date,
        timeSlot,
        tableNumber: selectedTable,
        specialNotes: specialNotes || undefined
      });
      setConfirmedBooking(res);
    } catch (error: any) {
      alert("Reservation failed: " + error.message);
    } finally {
      setIsBooking(false);
    }
  };

  if (confirmedBooking) {
    return (
      <div className="w-full min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="glass-premium max-w-lg w-full p-8 space-y-6 text-center border-gold-500/30 shadow-md">
          <div className="h-16 w-16 bg-gold-50 border border-gold-200 text-gold-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-zinc-900">Reservation Confirmed</h2>
            <p className="text-xs text-gold-600 font-bold tracking-widest uppercase">
              Booking Ref: {confirmedBooking.id.substring(0, 8).toUpperCase()}
            </p>
          </div>

          <div className="border-t border-b border-zinc-150 py-4 my-6 text-left space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Name:</span>
              <span className="font-bold text-zinc-950">{confirmedBooking.guestName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Date:</span>
              <span className="font-bold text-zinc-950">{confirmedBooking.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Time:</span>
              <span className="font-bold text-zinc-950">{confirmedBooking.timeSlot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Table Zone:</span>
              <span className="font-bold text-zinc-950">{confirmedBooking.tableNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Guests:</span>
              <span className="font-bold text-zinc-950">{confirmedBooking.guestCount} Covers</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-zinc-500">
              A confirmation email has been dispatched to {confirmedBooking.guestEmail}.
            </p>
            <div className="flex gap-4">
              <Link
                href="/dashboard"
                className="flex-1 text-center bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white py-3 text-xs tracking-widest uppercase font-bold transition-colors shadow-md"
              >
                My Bookings
              </Link>
              <Link
                href="/"
                className="flex-1 text-center border border-zinc-200 hover:border-gold-500/40 text-zinc-650 py-3 text-xs tracking-widest uppercase font-medium transition-colors"
              >
                Back Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8 text-zinc-800 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest text-gold-600 font-bold">Real-Time Table Availability</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide text-zinc-900">Book A Table</h1>
          <div className="h-[1.5px] w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Input Form (7 cols) */}
          <form onSubmit={handleBooking} className="lg:col-span-7 glass p-8 space-y-6 shadow-sm">
            <h3 className="font-serif text-xl text-zinc-900 border-b border-zinc-150 pb-3">Guest Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Alexander Vane"
                    className="w-full bg-zinc-50 border border-zinc-200 pl-10 pr-4 py-3 text-sm text-zinc-850 placeholder-zinc-400 rounded-lg focus:border-gold-500/50 outline-none transition-colors"
                  />
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="alex@vane.com"
                    className="w-full bg-zinc-50 border border-zinc-200 pl-10 pr-4 py-3 text-sm text-zinc-850 placeholder-zinc-400 rounded-lg focus:border-gold-500/50 outline-none transition-colors"
                  />
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Phone Number *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-zinc-50 border border-zinc-200 pl-10 pr-4 py-3 text-sm text-zinc-850 placeholder-zinc-400 rounded-lg focus:border-gold-500/50 outline-none transition-colors"
                  />
                  <Phone className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Covers/Guests *</label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value))}
                  className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm text-zinc-850 rounded-lg focus:border-gold-500/50 outline-none transition-colors"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                    <option key={num} value={num} className="bg-white text-zinc-800">
                      {num} {num === 1 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Booking Date *</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 pl-10 pr-4 py-3 text-sm text-zinc-850 rounded-lg focus:border-gold-500/50 outline-none transition-colors"
                  />
                  <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Preferred Time Slot *</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`py-2.5 text-xs tracking-wider font-semibold border rounded-lg transition-colors ${
                      timeSlot === slot
                        ? "border-gold-500 bg-gold-50 text-gold-600"
                        : "border-zinc-200 bg-zinc-50 text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Special Accommodations</label>
              <div className="relative">
                <textarea
                  rows={2}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g. wheelchair access, eggless cake, window seat preferred..."
                  className="w-full bg-zinc-50 border border-zinc-200 pl-10 pr-4 py-3 text-sm text-zinc-850 placeholder-zinc-400 rounded-lg focus:border-gold-500/50 outline-none resize-none transition-colors"
                />
                <MessageSquare className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isBooking}
              className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 disabled:from-zinc-300 disabled:to-zinc-200 text-white py-4 font-sans text-xs tracking-widest uppercase font-bold rounded-full transition-all shadow-lg shadow-gold-500/10"
            >
              {isBooking ? "Reserving..." : "Complete Reservation"}
            </button>
          </form>

          {/* Right: Table Selection Preview (5 cols) */}
          <div className="lg:col-span-5 glass p-6 space-y-6 shadow-sm">
            <div className="flex items-center gap-2 text-gold-600">
              <Armchair className="h-4 w-4" />
              <h3 className="font-serif text-xl font-bold uppercase tracking-wider">Select Seating Zone</h3>
            </div>
            <p className="text-xs text-zinc-500 font-sans">
              Choose your dining location. Each table is sanitized and decorated with fresh flowers daily.
            </p>

            <div className="space-y-4">
              {tables.map((table) => (
                <button
                  key={table.id}
                  type="button"
                  onClick={() => setSelectedTable(table.id)}
                  className={`w-full text-left p-4 border transition-all flex justify-between items-center rounded-xl ${
                    selectedTable === table.id
                      ? "border-gold-500 bg-gold-50"
                      : "border-zinc-200 bg-zinc-50 hover:border-zinc-300"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-xs text-gold-600 font-bold uppercase tracking-widest">
                      {table.id} — {table.type}
                    </span>
                    <p className="text-[11px] text-zinc-500 leading-normal">{table.desc}</p>
                  </div>
                  <span className="text-[10px] text-zinc-400 shrink-0 font-sans">
                    Max: {table.capacity} covers
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
