"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { TrendingUp, Calendar, ShoppingBag, LogOut, RefreshCw, Volume2, VolumeX, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import SalesTrendChart from "@/components/SalesTrendChart";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const { 
    user, 
    updateOrderStatus, 
    updateReservationStatus, 
    logout 
  } = useApp();
  
  const router = useRouter();

  // Local state for live-polling MongoDB database
  const [orders, setOrders] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [alarmActive, setAlarmActive] = useState(false);
  const [activeAlertOrder, setActiveAlertOrder] = useState<any>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  const alarmIntervalRef = useRef<any>(null);
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      router.push("/login");
    }
  }, [user, router]);

  // DB Polling logic
  const fetchLiveDatabaseData = async () => {
    try {
      const [ordersRes, resRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/reservations")
      ]);
      
      if (ordersRes.ok && resRes.ok) {
        const freshOrders = await ordersRes.json();
        const freshReservations = await resRes.json();
        
        setReservations(freshReservations);
        
        // Autoplay/Alarm detection logic
        if (!isInitialLoadRef.current) {
          // Find any newly arrived orders with status "PLACED"
          const currentIds = new Set(orders.map(o => o.id));
          const newOrders = freshOrders.filter((o: any) => !currentIds.has(o.id) && o.status === "PLACED");
          
          if (newOrders.length > 0) {
            setActiveAlertOrder(newOrders[0]);
            setAlarmActive(true);
          }
        } else {
          isInitialLoadRef.current = false;
        }
        
        setOrders(freshOrders);
      }
    } catch (e) {
      console.error("Admin real-time sync failed", e);
    }
  };

  useEffect(() => {
    if (user && user.role === "ADMIN") {
      fetchLiveDatabaseData();
      const interval = setInterval(fetchLiveDatabaseData, 3000); // Poll every 3 seconds for extremely fast alerts!
      return () => clearInterval(interval);
    }
  }, [user, orders]);

  // Audio alert controller loop using Web Audio API Synthesizer (No network WAV files, 100% reliable)
  useEffect(() => {
    let timeoutId: any = null;

    if (alarmActive && audioEnabled) {
      // Clear any existing interval
      if (alarmIntervalRef.current) {
        clearInterval(alarmIntervalRef.current);
      }

      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        const playBeep = () => {
          if (audioCtx.state === "suspended") {
            audioCtx.resume();
          }
          
          const osc1 = audioCtx.createOscillator();
          const osc2 = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          
          // Dual oscillator detuned buzzer
          osc1.type = "sawtooth";
          osc1.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
          
          osc2.type = "square";
          osc2.frequency.setValueAtTime(884, audioCtx.currentTime); //detuned beat
          
          gainNode.gain.setValueAtTime(0.7, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
          
          osc1.connect(gainNode);
          osc2.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          
          osc1.start();
          osc2.start();
          osc1.stop(audioCtx.currentTime + 0.45);
          osc2.stop(audioCtx.currentTime + 0.45);
        };

        playBeep();
        alarmIntervalRef.current = setInterval(playBeep, 650);

        // Auto-silence sound loop after 8.5 seconds (8-9 seconds range)
        timeoutId = setTimeout(() => {
          if (alarmIntervalRef.current) {
            clearInterval(alarmIntervalRef.current);
            alarmIntervalRef.current = null;
          }
        }, 8500);
      } catch (err) {
        console.error("Synthesizer playback failed", err);
      }
    } else {
      if (alarmIntervalRef.current) {
        clearInterval(alarmIntervalRef.current);
        alarmIntervalRef.current = null;
      }
    }

    return () => {
      if (alarmIntervalRef.current) {
        clearInterval(alarmIntervalRef.current);
        alarmIntervalRef.current = null;
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [alarmActive, audioEnabled]);

  const handleUpdateOrderStatus = async (id: string, status: any) => {
    await updateOrderStatus(id, status);
    fetchLiveDatabaseData();
  };

  const handleUpdateReservationStatus = async (id: string, status: any) => {
    await updateReservationStatus(id, status);
    fetchLiveDatabaseData();
  };

  if (!user || user.role !== "ADMIN") return null;

  // Calculate metrics
  const totalSales = orders.reduce((sum, o) => o.status !== "CANCELLED" ? sum + o.totalAmount : sum, 0);
  const pendingReservations = reservations.filter(r => r.status === "PENDING" || r.status === "CONFIRMED").length;
  const activeOrdersCount = orders.filter(o => o.status !== "DELIVERED" && o.status !== "CANCELLED").length;

  // Calculate popular items from real orders
  const itemCounts: Record<string, number> = {};
  orders.forEach(o => {
    if (o.status !== "CANCELLED") {
      o.items.forEach((item: any) => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
      });
    }
  });

  const sortedItems = Object.entries(itemCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const maxCount = sortedItems[0]?.count || 1;

  const popularItems = sortedItems.slice(0, 3).map(item => {
    const percentage = Math.round((item.count / maxCount) * 100);
    return {
      name: item.name,
      percentage,
      count: item.count
    };
  });

  const displayPopularItems = popularItems;

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-zinc-300 font-sans">
      {/* Top Header Panel */}
      <header className="border-b border-zinc-800 bg-zinc-900/90 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Kali Mirch logo"
              className="h-10 w-10 rounded-full border border-gold-600/30 object-contain invert brightness-125 contrast-125 mix-blend-screen"
            />
            <div className="space-y-0.5">
              <span className="font-serif text-lg font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">
                CONSOLE PANEL
              </span>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Kali Mirch Restaurant & Cafe</p>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <button
              onClick={() => {
                setAudioEnabled(true);
                if (alarmActive) {
                  setAlarmActive(false);
                  setActiveAlertOrder(null);
                } else {
                  // Find the latest placed real order if available, otherwise fallback to mock
                  const latestRealOrder = orders.find(o => o.status === "PLACED") || orders[0];
                  setActiveAlertOrder(latestRealOrder || {
                    id: "test",
                    customerName: "Test Order (Aadi)",
                    phone: "07982994654",
                    type: "DELIVERY",
                    totalAmount: 450,
                    items: [{ name: "Veg Mexican Paneer Brown Rice", quantity: 2 }, { name: "Virgin Mojito", quantity: 1 }]
                  });
                  setAlarmActive(true);
                }
              }}
              className={`text-xs px-4 py-2 rounded-full transition-all flex items-center gap-1.5 font-bold uppercase tracking-widest ${
                alarmActive 
                  ? "bg-red-600 text-white animate-pulse" 
                  : "text-gold-400 border border-gold-900/30 hover:border-gold-600 hover:bg-gold-950/20"
              }`}
            >
              {alarmActive ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              {alarmActive ? "Stop Alarm" : "Test Sound"}
            </button>
            
            <Link href="/" className="text-xs text-zinc-400 hover:text-gold-400 tracking-widest uppercase font-bold transition-colors">
              Main Site
            </Link>
            
            <button
              onClick={() => { logout(); router.push("/"); }}
              className="text-xs tracking-widest uppercase text-red-400 border border-red-900/30 hover:border-red-500 hover:bg-red-950/20 px-4 py-2 rounded-full transition-all flex items-center gap-1.5 font-bold"
            >
              <LogOut className="h-3.5 w-3.5" />
              Exit Panel
            </button>
          </div>
        </div>
      </header>

      {/* Audio permission banner */}
      {!audioEnabled && (
        <div className="bg-gradient-to-r from-gold-950/40 via-gold-900/10 to-gold-950/40 border-b border-gold-900/20 px-4 py-3.5 text-center flex flex-col sm:flex-row items-center justify-center gap-3 animate-pulse">
          <span className="text-xs text-gold-400 font-bold uppercase tracking-widest flex items-center gap-1.5 justify-center">
            <AlertCircle className="h-4 w-4 shrink-0 text-gold-500" />
            Live audio alerts are currently muted. Grant speaker permission to unlock real-time kitchen alarms.
          </span>
          <button
            onClick={() => {
              try {
                // Initialize context to satisfy user gesture policy
                const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                
                // Play a brief pleasant synthesizer chime
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                
                osc.type = "sine";
                osc.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5 note
                
                gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35); // fade out
                
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                
                osc.start();
                osc.stop(audioCtx.currentTime + 0.4);
                
                setAudioEnabled(true);
              } catch (err) {
                console.error("Audio synthesizer unlock failed", err);
              }
            }}
            className="bg-gold-600 hover:bg-gold-500 text-zinc-950 font-bold uppercase tracking-widest text-[9px] px-5 py-2 rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-1 shadow-md shadow-gold-600/10"
          >
            <Volume2 className="h-3 w-3" />
            Enable Speaker
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Core Metrics Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/60 border border-zinc-800/80 p-6 flex items-center justify-between shadow-sm rounded-2xl">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Total Revenue</span>
              <p className="text-2xl font-bold font-serif text-zinc-150">₹{totalSales.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-emerald-950/20 border border-emerald-900/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800/80 p-6 flex items-center justify-between shadow-sm rounded-2xl">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Active Bookings</span>
              <p className="text-2xl font-bold font-serif text-zinc-150">{pendingReservations}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-gold-950/20 border border-gold-600/30 flex items-center justify-center text-gold-400">
              <Calendar className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800/80 p-6 flex items-center justify-between shadow-sm rounded-2xl">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Active Kitchen Orders</span>
              <p className="text-2xl font-bold font-serif text-zinc-150">{activeOrdersCount}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-950/20 border border-amber-900/30 flex items-center justify-center text-amber-400">
              <ShoppingBag className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sales Trend Chart Component */}
          <div className="lg:col-span-8 bg-zinc-900/60 border border-zinc-800/80 p-6 space-y-4 shadow-sm rounded-2xl">
            <h4 className="font-serif text-base font-bold text-zinc-150 uppercase tracking-wider">Recent 7-Day Sales Trend</h4>
            <SalesTrendChart orders={orders} />
          </div>

          {/* Popular Delicacies Representational Chart */}
          <div className="lg:col-span-4 bg-zinc-900/60 border border-zinc-800/80 p-6 flex flex-col justify-between gap-4 shadow-sm rounded-2xl">
            <h4 className="font-serif text-base font-bold text-zinc-150 uppercase tracking-wider">Popular Delicacies</h4>
            
            {displayPopularItems.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center py-8 space-y-4">
                <div className="relative h-28 w-28 rounded-full border-4 border-zinc-800 flex flex-col items-center justify-center bg-zinc-950/40">
                  <span className="text-[8px] text-zinc-650 tracking-widest uppercase font-bold">Top Seller</span>
                  <span className="text-base text-zinc-500 font-black font-serif">0%</span>
                  <span className="text-[8px] text-zinc-600 font-medium px-2 text-center truncate max-w-[90px]">None</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-sans font-bold uppercase tracking-wider">No active orders recorded.</span>
              </div>
            ) : (
              <>
                <div className="flex justify-center py-2">
                  <div className="relative h-28 w-28 rounded-full border-4 border-gold-600 flex flex-col items-center justify-center bg-zinc-950 shadow-[0_0_20px_rgba(212,163,89,0.15)]">
                    <span className="text-[8px] text-zinc-500 tracking-widest uppercase font-bold">Top Seller</span>
                    <span className="text-base text-gold-400 font-black font-serif">{displayPopularItems[0]?.percentage}%</span>
                    <span className="text-[8px] text-zinc-400 font-medium px-2 text-center truncate max-w-[90px]">{displayPopularItems[0]?.name}</span>
                  </div>
                </div>

                <div className="space-y-3.5 text-[9px] uppercase font-bold tracking-widest text-zinc-500 font-sans">
                  {displayPopularItems.map((item, index) => (
                    <div key={index} className="space-y-1.5">
                      <div className="flex justify-between items-center text-zinc-350">
                        <span className="truncate max-w-[190px] text-zinc-300 normal-case font-semibold">{index + 1}. {item.name}</span>
                        <span className="text-gold-400 font-bold font-serif">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-900">
                        <div 
                          className="bg-gradient-to-r from-gold-600 to-gold-400 h-full rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Database Logs Manager Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Reservations Manager Log */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-zinc-150 uppercase tracking-wider">Bookings Dispatcher</h3>
              <span className="text-[10px] text-zinc-500 font-sans font-bold uppercase">Total: {reservations.length}</span>
            </div>

            {reservations.length === 0 ? (
              <p className="text-zinc-500 text-xs py-8 text-center">No reservations logged.</p>
            ) : (
              <div className="space-y-4">
                {reservations.map((res) => (
                  <div key={res.id} className="bg-zinc-900/60 border border-zinc-800/80 p-5 space-y-3 text-xs font-sans shadow-sm rounded-2xl">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-gold-400 font-bold uppercase tracking-widest">
                          {res.guestName} (x{res.guestCount})
                        </span>
                        <p className="text-zinc-500 text-[10px] font-medium">{res.guestPhone} • {res.guestEmail}</p>
                      </div>
                      <span className={`px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold border rounded-full ${
                        res.status === "CONFIRMED" 
                          ? "bg-emerald-950/20 border-emerald-900/30 text-emerald-400"
                          : res.status === "CANCELLED"
                            ? "bg-red-950/20 border-red-900/30 text-red-400"
                            : "bg-amber-950/20 border-amber-900/30 text-amber-400"
                      }`}>
                        {res.status}
                      </span>
                    </div>

                    <div className="border-t border-zinc-800 pt-3 flex justify-between items-center">
                      <span className="text-zinc-400 font-semibold">
                        Slot: {res.date} at {res.timeSlot} (Table: {res.tableNumber || "TBD"})
                      </span>
                      {res.status === "PENDING" && (
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleUpdateReservationStatus(res.id, "CONFIRMED")}
                            className="bg-emerald-950/20 hover:bg-emerald-900/30 text-emerald-400 border border-emerald-900/30 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider text-[9px]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateReservationStatus(res.id, "CANCELLED")}
                            className="bg-red-950/20 hover:bg-red-900/30 text-red-400 border border-red-900/30 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider text-[9px]"
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
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-zinc-150 uppercase tracking-wider">Kitchen Order Dispatcher</h3>
              <span className="text-[10px] text-zinc-500 font-sans font-bold uppercase">Total: {orders.length}</span>
            </div>

            {orders.length === 0 ? (
              <p className="text-zinc-500 text-xs py-8 text-center">No orders placed.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div key={ord.id} className="bg-zinc-900/60 border border-zinc-800/80 p-5 space-y-3 text-xs font-sans shadow-sm rounded-2xl">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-gold-400 font-bold uppercase tracking-widest flex items-center gap-2">
                          <span>{ord.customerName}</span>
                          {ord.tableNumber && (
                            <span className="text-[10px] bg-gold-950/40 text-gold-400 px-2 py-0.5 rounded border border-gold-600/30 font-bold">
                              {ord.tableNumber}
                            </span>
                          )}
                        </span>
                        <p className="text-zinc-500 text-[10px] font-medium">Phone: {ord.phone}</p>
                      </div>
                      <span className={`px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold border rounded-full ${
                        ord.status === "DELIVERED"
                          ? "bg-emerald-950/20 border-emerald-900/30 text-emerald-400"
                          : ord.status === "CANCELLED"
                            ? "bg-red-950/20 border-red-900/30 text-red-400"
                            : "bg-amber-950/20 border-amber-900/30 text-amber-400 animate-pulse"
                      }`}>
                        {ord.status.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div className="border-t border-zinc-800 pt-3 flex justify-between items-center gap-4">
                      <div className="text-zinc-400 font-semibold max-w-xs truncate">
                        {ord.items.map((i: any) => `${i.name} (x${i.quantity})`).join(", ")}
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
                              if (next) handleUpdateOrderStatus(ord.id, next);
                            }}
                            className="bg-gold-950/20 hover:bg-gold-900/30 text-gold-400 border border-gold-600/30 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider text-[9px] flex items-center gap-1"
                          >
                            <RefreshCw className="h-3 w-3" />
                            Next Step
                          </button>
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, "CANCELLED")}
                            className="bg-red-950/20 hover:bg-red-900/30 text-red-400 border border-red-900/30 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider text-[9px]"
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

      {/* Real-time Order Alarm Popup Modal */}
      <AnimatePresence>
        {alarmActive && activeAlertOrder && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-zinc-900 border border-red-500/40 rounded-3xl max-w-lg w-full overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.25)] flex flex-col"
            >
              {/* Pulsing warning banner */}
              <div className="bg-gradient-to-r from-red-600 to-amber-600 px-6 py-5 text-center text-white space-y-1 animate-pulse">
                <div className="flex justify-center gap-2 items-center">
                  <AlertCircle className="h-6 w-6 animate-bounce" />
                  <h3 className="font-serif text-xl font-bold tracking-wider uppercase">NEW KITCHEN ORDER RECEIVED!</h3>
                </div>
                <p className="text-[10px] tracking-widest uppercase font-bold text-red-100">Live order radar detected a new transaction</p>
              </div>

              {/* Order Info */}
              <div className="p-8 space-y-6 text-sm flex-grow">
                <div className="grid grid-cols-2 gap-4 border-b border-zinc-800 pb-4">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Customer</span>
                    <span className="font-bold text-zinc-150 text-base">{activeAlertOrder.customerName}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Contact</span>
                    <span className="font-bold text-zinc-300">{activeAlertOrder.phone}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b border-zinc-800 pb-4">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Order Type</span>
                    <span className="font-bold text-gold-400 uppercase tracking-widest">{activeAlertOrder.type}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Total Amount</span>
                    <span className="font-bold text-zinc-100 font-serif text-base">₹{activeAlertOrder.totalAmount}</span>
                  </div>
                </div>

                {/* Item List */}
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Items Prepared</span>
                  <div className="bg-zinc-950 p-4 rounded-xl space-y-2 border border-zinc-850 font-medium">
                    {activeAlertOrder.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-xs text-zinc-350">
                        <span>{item.name}</span>
                        <span className="text-zinc-500">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-zinc-950 p-6 border-t border-zinc-800 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={async () => {
                    setAlarmActive(false);
                    // Update status to preparing if it's a real database order
                    if (activeAlertOrder.id !== "test") {
                      await handleUpdateOrderStatus(activeAlertOrder.id, "PREPARING");
                    }
                    setActiveAlertOrder(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-650 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-full transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-red-950/20 active:scale-95"
                >
                  <CheckCircle className="h-4 w-4" />
                  Accept & Stop Alarm
                </button>
                
                <button
                  onClick={() => {
                    setAlarmActive(false);
                  }}
                  className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 px-6 py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all active:scale-95"
                >
                  Mute Sound
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
