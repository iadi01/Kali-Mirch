"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { Award, Calendar, ShoppingBag, ShieldCheck, Clock, User, Compass } from "lucide-react";
import Link from "next/link";

export default function CustomerDashboard() {
  const { user, reservations, orders, logout } = useApp();
  const router = useRouter();

  React.useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  // Filter orders & reservations belonging to current guest
  // In a simulated layout, we can show all local storage entries
  const customerReservations = reservations;
  const customerOrders = orders;

  return (
    <div className="w-full min-h-screen bg-zinc-950 py-20 px-4 sm:px-6 lg:px-8 text-zinc-300 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Welcome Banner */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl rounded-3xl backdrop-blur-md">
          <div className="flex gap-4 items-center">
            <div className="h-16 w-16 rounded-full border border-gold-600/30 bg-gold-950/20 flex items-center justify-center text-gold-400">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-zinc-150 tracking-wide">{user.name}</h1>
              <span className="text-zinc-500 text-xs">{user.email}</span>
            </div>
          </div>

          <div className="flex gap-6 items-center shrink-0">
            {/* Loyalty points card */}
            <div className="border border-gold-600/30 bg-gold-950/20 px-6 py-4 flex flex-col items-end gap-1 rounded-xl">
              <span className="text-[10px] uppercase tracking-widest text-gold-400 font-bold flex items-center gap-1">
                <Award className="h-3.5 w-3.5" />
                Loyalty Points
              </span>
              <span className="font-serif text-2xl font-bold text-zinc-150">{user.loyaltyPoints}</span>
            </div>
            <button
              onClick={() => { logout(); router.push("/"); }}
              className="text-xs tracking-widest uppercase text-red-400 border border-red-900/30 hover:border-red-500 bg-red-950/20 hover:bg-red-950/40 px-4 py-3 rounded-full transition-colors font-bold"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Panels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Bookings Log (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Calendar className="h-5 w-5 text-gold-400" />
              <h3 className="font-serif text-xl font-bold text-zinc-150 uppercase tracking-wider">Table Bookings</h3>
            </div>
            {customerReservations.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl">
                <p className="text-zinc-500 text-xs">No active table bookings found.</p>
                <Link href="/reservation" className="text-gold-400 text-xs font-bold underline mt-2 block">
                  Book a Table Now
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {customerReservations.map((res) => (
                  <div key={res.id} className="bg-zinc-900/60 border border-zinc-800/80 p-5 flex justify-between items-center font-sans shadow-sm rounded-2xl">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gold-400 font-bold uppercase tracking-widest">
                          Table {res.tableNumber || "TBD"}
                        </span>
                        <span className="text-[10px] text-zinc-500">• {res.guestCount} covers</span>
                      </div>
                      <p className="text-sm font-semibold text-zinc-150">{res.date} at {res.timeSlot}</p>
                      <p className="text-[10px] text-zinc-500 font-medium">Booking Code: {res.id.substring(0, 8).toUpperCase()}</p>
                    </div>

                    <span className={`px-2.5 py-1 text-[9px] tracking-widest uppercase font-bold border rounded-full ${
                      res.status === "CONFIRMED"
                        ? "bg-emerald-950/20 border-emerald-900/30 text-emerald-400"
                        : res.status === "CANCELLED"
                          ? "bg-red-950/20 border-red-900/30 text-red-400"
                          : "bg-amber-950/20 border-amber-900/30 text-amber-400"
                    }`}>
                      {res.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Direct Orders Log (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <ShoppingBag className="h-5 w-5 text-gold-400" />
              <h3 className="font-serif text-xl font-bold text-zinc-150 uppercase tracking-wider">Direct Orders</h3>
            </div>
            {customerOrders.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl">
                <p className="text-zinc-500 text-xs">No online delivery/pickup orders found.</p>
                <Link href="/order" className="text-gold-400 text-xs font-bold underline mt-2 block">
                  Order Food Now
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {customerOrders.map((ord) => (
                  <div key={ord.id} className="bg-zinc-900/60 border border-zinc-800/80 p-5 space-y-4 font-sans shadow-sm rounded-2xl">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-xs text-gold-400 font-bold uppercase tracking-widest">
                          {ord.type} Order
                        </span>
                        <p className="text-[10px] text-zinc-500 font-medium">ID: {ord.id.substring(0, 8).toUpperCase()} • {new Date(ord.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2.5 py-1 text-[9px] tracking-widest uppercase font-bold border rounded-full ${
                        ord.status === "DELIVERED"
                          ? "bg-emerald-950/20 border-emerald-900/30 text-emerald-400"
                          : ord.status === "CANCELLED"
                            ? "bg-red-950/20 border-red-900/30 text-red-400"
                            : "bg-gold-950/20 border-gold-600/30 text-gold-400 animate-pulse"
                      }`}>
                        {ord.status.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div className="border-t border-zinc-800 pt-3 flex justify-between items-center text-xs">
                      <div className="text-zinc-400 font-semibold max-w-xs truncate">
                        {ord.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}
                      </div>
                      <span className="font-bold text-zinc-150 shrink-0">₹{ord.totalAmount}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
