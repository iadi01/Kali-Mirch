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
      <div className="w-full min-h-screen bg-zinc-950 py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-lg w-full p-8 space-y-6 text-center border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md rounded-3xl shadow-xl">
          <div className="h-16 w-16 bg-gold-950/20 border border-gold-600/30 text-gold-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-zinc-100">Reservation Confirmed</h2>
            <p className="text-xs text-gold-400 font-bold tracking-widest uppercase">
              Booking Ref: {confirmedBooking.id.substring(0, 8).toUpperCase()}
            </p>
          </div>

          <div className="border-t border-b border-zinc-800 py-4 my-6 text-left space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Name:</span>
              <span className="font-bold text-zinc-150">{confirmedBooking.guestName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Date:</span>
              <span className="font-bold text-zinc-150">{confirmedBooking.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Time:</span>
              <span className="font-bold text-zinc-150">{confirmedBooking.timeSlot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Table Zone:</span>
              <span className="font-bold text-zinc-150">{confirmedBooking.tableNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Guests:</span>
              <span className="font-bold text-zinc-150">{confirmedBooking.guestCount} Covers</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-zinc-500">
              A confirmation email has been dispatched to {confirmedBooking.guestEmail}.
            </p>
            <div className="flex gap-4">
              <Link
                href="/dashboard"
                className="flex-1 text-center bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-500 hover:to-gold-600 text-white py-3 text-xs tracking-widest uppercase font-bold transition-all rounded-full shadow-md hover:scale-105 active:scale-95"
              >
                My Bookings
              </Link>
              <Link
                href="/"
                className="flex-1 text-center border border-zinc-800 hover:border-gold-600/40 text-zinc-450 py-3 text-xs tracking-widest uppercase font-medium transition-all rounded-full hover:scale-105 active:scale-95"
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
    <div className="w-full min-h-screen bg-zinc-950 py-20 px-4 sm:px-6 lg:px-8 text-zinc-300 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest text-gold-450 font-bold">Real-Time Table Availability</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide text-zinc-100">Book A Table</h1>
          <div className="h-[1.5px] w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Input Form (7 cols) */}
          <form onSubmit={handleBooking} className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800/80 p-8 space-y-6 shadow-sm rounded-2xl">
            <h3 className="font-serif text-xl text-zinc-100 border-b border-zinc-800 pb-3 font-bold">Guest Information</h3>
            
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
                    className="w-full bg-zinc-900 border border-zinc-800 pl-10 pr-4 py-3 text-sm text-zinc-150 placeholder-zinc-500 rounded-lg focus:border-gold-600/50 outline-none transition-colors"
                  />
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
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
                    className="w-full bg-zinc-900 border border-zinc-800 pl-10 pr-4 py-3 text-sm text-zinc-150 placeholder-zinc-500 rounded-lg focus:border-gold-600/50 outline-none transition-colors"
                  />
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
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
                    className="w-full bg-zinc-900 border border-zinc-800 pl-10 pr-4 py-3 text-sm text-zinc-150 placeholder-zinc-500 rounded-lg focus:border-gold-600/50 outline-none transition-colors"
                  />
                  <Phone className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Covers/Guests *</label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-zinc-150 rounded-lg focus:border-gold-600/50 outline-none transition-colors font-semibold"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                    <option key={num} value={num} className="bg-zinc-900 text-zinc-300">
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
                    className="w-full bg-zinc-900 border border-zinc-800 pl-10 pr-4 py-3 text-sm text-zinc-150 rounded-lg focus:border-gold-600/50 outline-none transition-colors"
                  />
                  <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500 pointer-events-none" />
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
                        ? "border-gold-600 bg-gold-950/40 text-gold-400"
                        : "border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:text-zinc-300"
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
                  className="w-full bg-zinc-900 border border-zinc-800 pl-10 pr-4 py-3 text-sm text-zinc-150 placeholder-zinc-500 rounded-lg focus:border-gold-600/50 outline-none resize-none transition-colors"
                />
                <MessageSquare className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isBooking}
              className="w-full bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-500 hover:to-gold-600 disabled:from-zinc-800 disabled:to-zinc-900 text-white py-4 font-sans text-xs tracking-widest uppercase font-bold rounded-full transition-all shadow-lg shadow-gold-600/10"
            >
              {isBooking ? "Reserving..." : "Complete Reservation"}
            </button>
          </form>

          {/* Right: Table Selection Preview (5 cols) */}
          <div className="lg:col-span-5 bg-zinc-900/60 border border-zinc-800/80 p-6 space-y-6 shadow-sm rounded-2xl">
            <div className="flex items-center gap-2 text-gold-400">
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
                      ? "border-gold-600 bg-gold-950/40"
                      : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-xs text-gold-400 font-bold uppercase tracking-widest">
                      {table.id} — {table.type}
                    </span>
                    <p className="text-[11px] text-zinc-500 leading-normal">{table.desc}</p>
                  </div>
                  <span className="text-[10px] text-zinc-500 shrink-0 font-sans">
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
