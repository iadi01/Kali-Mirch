"use client";

import React, { useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { TrendingUp, Calendar, ShoppingBag, LogOut, RefreshCw } from "lucide-react";
import Link from "next/link";
import SalesTrendChart from "@/components/SalesTrendChart";

export default function AdminDashboard() {
  const { 
    user, 
    reservations, 
    orders, 
    updateOrderStatus, 
    updateReservationStatus, 
    logout 
  } = useApp();
  
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      router.push("/login");
    }
  }, [user, router]);

  if (!user || user.role !== "ADMIN") return null;

  // Calculate metrics
  const totalSales = orders.reduce((sum, o) => o.status !== "CANCELLED" ? sum + o.totalAmount : sum, 0);
  const pendingReservations = reservations.filter(r => r.status === "PENDING" || r.status === "CONFIRMED").length;
  const activeOrdersCount = orders.filter(o => o.status !== "DELIVERED" && o.status !== "CANCELLED").length;

  return (
    <div className="w-full min-h-screen bg-zinc-50 text-zinc-800 font-sans">
      {/* Top Header Panel */}
      <header className="border-b border-zinc-200 bg-white/90 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Kali Mirch Pure Veg logo"
              className="h-10 w-10 rounded-full border border-gold-500/20 object-contain"
            />
            <div className="space-y-0.5">
              <span className="font-serif text-lg font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-gold-700">
                CONSOLE PANEL
              </span>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Kali Mirch Pure Veg Jamshedpur</p>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <Link href="/" className="text-xs text-zinc-500 hover:text-gold-600 tracking-widest uppercase font-bold transition-colors">
              Main Site
            </Link>
            <button
              onClick={() => { logout(); router.push("/"); }}
              className="text-xs tracking-widest uppercase text-red-500 border border-red-200 hover:border-red-500 hover:bg-red-50 px-4 py-2 rounded-full transition-all flex items-center gap-1.5 font-bold"
            >
              <LogOut className="h-3.5 w-3.5" />
              Exit Panel
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Core Metrics Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-premium p-6 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Total Revenue</span>
              <p className="text-2xl font-bold font-serif text-zinc-900">₹{totalSales.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>

          <div className="glass-premium p-6 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Active Bookings</span>
              <p className="text-2xl font-bold font-serif text-zinc-900">{pendingReservations}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-gold-50 border border-gold-100 flex items-center justify-center text-gold-600">
              <Calendar className="h-6 w-6" />
            </div>
          </div>

          <div className="glass-premium p-6 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Active Kitchen Orders</span>
              <p className="text-2xl font-bold font-serif text-zinc-900">{activeOrdersCount}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <ShoppingBag className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sales Trend Chart Component */}
          <div className="lg:col-span-8 glass p-6 space-y-4 shadow-sm bg-white">
            <h4 className="font-serif text-base font-bold text-zinc-900 uppercase tracking-wider">Recent 7-Day Sales Trend</h4>
            <SalesTrendChart orders={orders} />
            <p className="text-[10px] text-zinc-400 font-sans font-bold">Sales data updates automatically when orders are confirmed in MongoDB.</p>
          </div>

          {/* Categories Representational Chart */}
          <div className="lg:col-span-4 glass p-6 flex flex-col justify-between gap-4 shadow-sm bg-white">
            <h4 className="font-serif text-base font-bold text-zinc-900 uppercase tracking-wider">Popular Categories</h4>
            <div className="flex justify-center py-4">
              <div className="relative h-32 w-32 rounded-full border-4 border-gold-500 flex items-center justify-center bg-zinc-50">
                <div className="absolute h-24 w-24 rounded-full border border-dashed border-zinc-200" />
                <span className="text-xs text-gold-700 font-bold font-serif">Mains (42%)</span>
              </div>
            </div>
            <div className="space-y-2 text-[10px] uppercase font-bold tracking-widest text-zinc-500 font-sans">
              <div className="flex justify-between">
                <span>1. Mains (Gravies/Rice)</span>
                <span className="text-zinc-800 font-bold">42%</span>
              </div>
              <div className="flex justify-between">
                <span>2. Tandoor Starters</span>
                <span className="text-zinc-800 font-bold">30%</span>
              </div>
              <div className="flex justify-between">
                <span>3. Desserts</span>
                <span className="text-zinc-800 font-bold">18%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Database Logs Manager Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Reservations Manager Log */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
              <h3 className="font-serif text-lg font-bold text-zinc-900 uppercase tracking-wider">Bookings Dispatcher</h3>
              <span className="text-[10px] text-zinc-500 font-sans font-bold uppercase">Total: {reservations.length}</span>
            </div>

            {reservations.length === 0 ? (
              <p className="text-zinc-500 text-xs py-8 text-center">No reservations logged.</p>
            ) : (
              <div className="space-y-4">
                {reservations.map((res) => (
                  <div key={res.id} className="glass p-5 border-zinc-200 space-y-3 text-xs font-sans shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-gold-700 font-bold uppercase tracking-widest">
                          {res.guestName} (x{res.guestCount})
                        </span>
                        <p className="text-zinc-500 text-[10px] font-medium">{res.guestPhone} • {res.guestEmail}</p>
                      </div>
                      <span className={`px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold border rounded-full ${
                        res.status === "CONFIRMED" 
                          ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                          : res.status === "CANCELLED"
                            ? "bg-red-50 border-red-200 text-red-650"
                            : "bg-amber-50 border-amber-200 text-amber-600"
                      }`}>
                        {res.status}
                      </span>
                    </div>

                    <div className="border-t border-zinc-150 pt-3 flex justify-between items-center">
                      <span className="text-zinc-650 font-semibold">
                        Slot: {res.date} at {res.timeSlot} (Table: {res.tableNumber || "TBD"})
                      </span>
                      {res.status === "PENDING" && (
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => updateReservationStatus(res.id, "CONFIRMED")}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider text-[9px]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateReservationStatus(res.id, "CANCELLED")}
                            className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider text-[9px]"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Orders Dispatcher Manager Log */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
              <h3 className="font-serif text-lg font-bold text-zinc-900 uppercase tracking-wider">Kitchen Order Dispatcher</h3>
              <span className="text-[10px] text-zinc-500 font-sans font-bold uppercase">Total: {orders.length}</span>
            </div>

            {orders.length === 0 ? (
              <p className="text-zinc-500 text-xs py-8 text-center">No orders placed.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div key={ord.id} className="glass p-5 border-zinc-200 space-y-3 text-xs font-sans shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-gold-700 font-bold uppercase tracking-widest flex items-center gap-2">
                          <span>{ord.customerName}</span>
                          {ord.tableNumber && (
                            <span className="text-[10px] bg-gold-100 text-gold-800 px-2 py-0.5 rounded border border-gold-300/30 font-bold">
                              {ord.tableNumber}
                            </span>
                          )}
                        </span>
                        <p className="text-zinc-500 text-[10px] font-medium">Phone: {ord.phone}</p>
                      </div>
                      <span className={`px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold border rounded-full ${
                        ord.status === "DELIVERED"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                          : ord.status === "CANCELLED"
                            ? "bg-red-50 border-red-200 text-red-600"
                            : "bg-amber-50 border-amber-200 text-amber-600 animate-pulse"
                      }`}>
                        {ord.status.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div className="border-t border-zinc-150 pt-3 flex justify-between items-center gap-4">
                      <div className="text-zinc-650 font-semibold max-w-xs truncate">
                        {ord.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}
                      </div>
                      
                      {ord.status !== "DELIVERED" && ord.status !== "CANCELLED" && (
                        <div className="flex gap-3 shrink-0">
                          <button
                            onClick={() => {
                              const nextStatusMap: Record<string, string> = {
                                PLACED: "PREPARING",
                                PREPARING: "DELIVERED"
                              };
                              const next = nextStatusMap[ord.status] as any;
                              if (next) updateOrderStatus(ord.id, next);
                            }}
                            className="bg-gold-50 hover:bg-gold-100 text-gold-700 border border-gold-200 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider text-[9px] flex items-center gap-1"
                          >
                            <RefreshCw className="h-3 w-3" />
                            Next Step
                          </button>
                          <button
                            onClick={() => updateOrderStatus(ord.id, "CANCELLED")}
                            className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider text-[9px]"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
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
