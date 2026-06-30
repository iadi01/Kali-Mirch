"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Trash2, ShoppingBag, Plus, Minus, CreditCard, ClipboardCheck, Tag, QrCode } from "lucide-react";
import Link from "next/link";

export default function OrderPage() {
  const { user, cart, removeFromCart, updateCartQuantity, addOrder } = useApp();
  
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [isQrSelected, setIsQrSelected] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<any>(null);

  // Loyalty states
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [redeemedPoints, setRedeemedPoints] = useState(0);

  // Check URL query parameters for table number on mount & load saved guest info / JWT cookie
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tableVal = params.get("table");
      if (tableVal) {
        // Format nicely e.g. "Table 5"
        const formattedTable = tableVal.toLowerCase().startsWith("table") 
          ? tableVal 
          : `Table ${tableVal}`;
        setTableNumber(formattedTable);
        setIsQrSelected(true);
      }

      // Load from localStorage to keep guest session alive
      const savedName = localStorage.getItem("gilded_customer_name");
      const savedPhone = localStorage.getItem("gilded_customer_phone");
      if (savedName) setCustomerName(savedName);
      if (savedPhone) setPhone(savedPhone);

      // Parse cookie JWT token if present
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };

      const jwtToken = getCookie("jwt");
      if (jwtToken) {
        try {
          const base64Url = jwtToken.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            window.atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const parsed = JSON.parse(jsonPayload);
          if (parsed && parsed.name && !savedName) {
            setCustomerName(parsed.name);
          }
        } catch (e) {
          console.warn("JWT cookie decoding failed", e);
        }
      }
    }
  }, []);

  // Sync user profile details or lookup guest profile by phone
  useEffect(() => {
    if (user) {
      setLoyaltyPoints(user.loyaltyPoints || 0);
      setCustomerName(user.name || "");
      return;
    }

    if (phone.length >= 10) {
      const queryLoyalty = async () => {
        try {
          const res = await fetch(`/api/users/loyalty?phone=${encodeURIComponent(phone)}`);
          if (res.ok) {
            const data = await res.json();
            setLoyaltyPoints(data.loyaltyPoints || 0);
            if (data.name && data.name !== "Guest Diner" && !customerName) {
              setCustomerName(data.name);
            }
          }
        } catch (err) {
          console.error("Loyalty profile query failed", err);
        }
      };
      queryLoyalty();
    } else {
      setLoyaltyPoints(0);
      setRedeemedPoints(0);
    }
  }, [phone, user]);

  const cartSubtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const discountAmount = appliedCoupon === "GOLD20" ? cartSubtotal * 0.2 : 0;
  
  // Loyalty points discount calculation: 500 points = ₹100 discount
  const loyaltyDiscount = Math.floor(redeemedPoints / 500) * 100;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount - loyaltyDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === "GOLD20") {
      setAppliedCoupon("GOLD20");
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code. Try 'GOLD20'");
      setAppliedCoupon("");
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !tableNumber) {
      alert("Please fill in all required fields (Name, Phone, and Table Number).");
      return;
    }

    // Save name & phone to localStorage for persistent session
    if (typeof window !== "undefined") {
      localStorage.setItem("gilded_customer_name", customerName);
      localStorage.setItem("gilded_customer_phone", phone);
    }

    setIsPlacingOrder(true);
    try {
      const order = await addOrder({
        customerName,
        phone,
        tableNumber,
        type: "DINE_IN",
        couponCode: appliedCoupon || undefined,
        redeemedPoints: redeemedPoints
      });
      setReceiptOrder(order);
    } catch (error: any) {
      alert("Order failed: " + error.message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (receiptOrder) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-lg w-full p-8 space-y-6 text-center border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md rounded-3xl shadow-xl">
          <div className="h-16 w-16 rounded-full border border-gold-600/30 bg-gold-950/20 flex items-center justify-center mx-auto text-gold-400 animate-pulse">
            <ClipboardCheck className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-gold-400 font-bold">Order Received</span>
            <h2 className="font-serif text-3xl font-bold text-zinc-100">Sent to Kitchen</h2>
            <p className="text-zinc-500 text-xs">Order ID: {receiptOrder.id}</p>
          </div>

          <div className="border-t border-b border-zinc-800 py-6 my-6 text-left space-y-4 font-sans rounded-2xl">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Customer:</span>
              <span className="text-zinc-150 font-semibold">{receiptOrder.customerName}</span>
            </div>
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Service Type:</span>
              <span className="text-gold-400 font-bold">In-House Table Dine-in</span>
            </div>
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Table Selected:</span>
              <span className="text-gold-400 font-bold bg-gold-950/40 px-3 py-1 rounded-full text-[11px] border border-gold-600/30">{receiptOrder.tableNumber}</span>
            </div>
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Payment Type:</span>
              <span className="text-zinc-150 font-semibold">Pay at Counter (Cash/UPI)</span>
            </div>
            <div className="border-t border-zinc-800 pt-4 space-y-2">
              {receiptOrder.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between text-xs text-zinc-400">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-800 pt-4 flex justify-between text-sm font-bold text-zinc-100">
              <span>Grand Total:</span>
              <span className="text-gold-400">₹{receiptOrder.totalAmount}</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-zinc-500 leading-relaxed">
              Your gourmet order is sent directly to the chefs. Please wait at your table while we serve you!
            </p>
            <div className="flex gap-4">
              <Link
                href="/dashboard"
                className="flex-1 text-center bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-500 hover:to-gold-600 text-white py-3 text-xs tracking-widest uppercase font-bold transition-all rounded-full shadow-md hover:scale-105 active:scale-95"
              >
                Track Orders
              </Link>
              <Link
                href="/menu"
                className="flex-1 text-center border border-zinc-800 hover:border-gold-600/40 text-zinc-400 py-3 text-xs tracking-widest uppercase font-medium transition-all rounded-full hover:scale-105 active:scale-95"
              >
                Order More
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
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest text-gold-450 font-bold">Smart Table Ordering</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide text-zinc-100">In-House Dining Order</h1>
          <div className="h-[1.5px] w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-4" />
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-24 bg-zinc-900/60 border border-zinc-800/80 max-w-xl mx-auto space-y-6 shadow-sm rounded-3xl">
            <ShoppingBag className="h-12 w-12 text-zinc-650 mx-auto animate-pulse" />
            <h2 className="font-serif text-xl text-zinc-100">Your Cart is Empty</h2>
            <p className="text-zinc-500 text-xs max-w-sm mx-auto leading-relaxed">
              Scan your table QR code or choose dishes from our online menu catalog to add them to your cart.
            </p>
            <div className="pt-2">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-500 hover:to-gold-600 text-white px-8 py-3 text-xs tracking-widest uppercase font-bold transition-all rounded-full shadow-md"
              >
                Go to Menu
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Cart Items & Details Form (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Table QR Info Banner */}
              <div className="bg-gold-650/10 border border-gold-600/20 p-5 rounded-2xl flex gap-4 items-start shadow-sm">
                <QrCode className="h-6 w-6 text-gold-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs font-bold text-gold-400">Digital QR Table Order System</span>
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                    This order system is strictly configured for guests seated inside **Kali Mirch Restaurant & Cafe**. Scan the QR code placed on your dining table to auto-select your table number, or pick it manually below to place your order directly.
                  </p>
                </div>
              </div>

              {/* Cart List */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 p-6 space-y-6 shadow-sm rounded-2xl">
                <h3 className="font-serif text-xl text-zinc-100 border-b border-zinc-800 pb-3 font-bold">Selected Items</h3>
                <div className="divide-y divide-zinc-800 space-y-4">
                  {cart.map((item) => (
                    <div key={item.menuItem.id} className="flex gap-4 pt-4 first:pt-0 items-center justify-between">
                      <div className="flex gap-4 items-center">
                        <img
                          src={item.menuItem.image}
                          alt={item.menuItem.name}
                          className="h-16 w-16 object-cover border border-zinc-800 rounded-lg shadow-sm"
                          loading="lazy"
                        />
                        <div className="space-y-1">
                          <h4 className="font-serif text-sm font-bold text-zinc-150">{item.menuItem.name}</h4>
                          <span className="text-gold-400 text-xs font-semibold">₹{item.menuItem.price}</span>
                        </div>
                      </div>

                      {/* Quantity Selectors */}
                      <div className="flex items-center gap-6">
                        <div className="flex items-center border border-zinc-800 bg-zinc-900 rounded-full overflow-hidden">
                          <button
                            onClick={() => updateCartQuantity(item.menuItem.id, item.quantity - 1)}
                            className="px-3 py-2 text-zinc-500 hover:text-zinc-300"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-xs text-zinc-100 font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.menuItem.id, item.quantity + 1)}
                            className="px-3 py-2 text-zinc-500 hover:text-zinc-300"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.menuItem.id)}
                          className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkout Form */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 p-6 space-y-6 shadow-sm rounded-2xl">
                <h3 className="font-serif text-xl text-zinc-100 border-b border-zinc-800 pb-3 font-bold">Dine-in Reservation Checkout</h3>
                
                <form onSubmit={handlePlaceOrder} className="space-y-6">
                  {/* Table Selection segment */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Select Table Number *</label>
                    {isQrSelected ? (
                      <div className="w-full bg-gold-950/40 border border-gold-600/30 text-gold-400 px-4 py-3 rounded-lg text-sm font-bold flex justify-between items-center shadow-sm">
                        <span>Assigned to: {tableNumber}</span>
                        <span className="text-[10px] uppercase bg-gold-600 text-white px-2.5 py-0.5 rounded tracking-widest font-bold">QR Scanned</span>
                      </div>
                    ) : (
                      <select
                        required
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 text-zinc-150 px-4 py-3 rounded-lg text-sm focus:border-gold-600/50 outline-none transition-colors font-semibold"
                      >
                        <option value="">-- Choose Your Table Number --</option>
                        {Array.from({ length: 25 }, (_, i) => `Table ${i + 1}`).map((tbl) => (
                          <option key={tbl} value={tbl}>{tbl}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter guest name"
                        className="w-full bg-zinc-900 border border-zinc-800 text-zinc-150 px-4 py-3 rounded-lg text-sm focus:border-gold-600/50 outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter mobile number"
                        className="w-full bg-zinc-900 border border-zinc-800 text-zinc-150 px-4 py-3 rounded-lg text-sm focus:border-gold-600/50 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="border-t border-zinc-800 pt-6">
                    <h4 className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-3">Billing & Payment</h4>
                    <div className="flex gap-4 border border-gold-600/20 p-4 bg-gold-950/20 rounded-2xl shadow-sm">
                      <CreditCard className="h-5 w-5 text-gold-400 mt-0.5" />
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-gold-400">Pay at Counter (UPI scanner / Cash)</span>
                        <p className="text-[10px] text-zinc-500 leading-normal font-medium">
                          Ordering is strictly post-dining. Enjoy your hot multicourse meal, and settle the final bill via cash or UPI scanner at the counter.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPlacingOrder}
                    className="w-full bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-500 hover:to-gold-600 disabled:from-zinc-800 disabled:to-zinc-900 text-white py-4 font-sans text-xs tracking-widest uppercase font-bold transition-all shadow-lg shadow-gold-600/10 rounded-full hover:scale-[1.01] active:scale-95"
                  >
                    {isPlacingOrder ? "Sending to Kitchen..." : "Send Order to Kitchen"}
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Order Summary Sidebar (5 cols) */}
            <div className="lg:col-span-5 bg-zinc-900/60 border border-zinc-800/80 p-6 space-y-6 shadow-sm rounded-2xl">
              <h3 className="font-serif text-xl text-zinc-100 border-b border-zinc-800 pb-3 font-bold">Summary</h3>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.menuItem.id} className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400">
                      {item.menuItem.name} <span className="text-zinc-500 font-semibold">(x{item.quantity})</span>
                    </span>
                    <span className="text-zinc-150 font-bold">₹{item.menuItem.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Coupon Code Panel */}
              <div className="border-t border-zinc-800 pt-6">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="Coupon (e.g. GOLD20)"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 pl-8 pr-4 py-2.5 rounded-full text-xs text-zinc-150 placeholder-zinc-600 focus:border-gold-600/50 outline-none uppercase font-bold"
                    />
                    <Tag className="absolute left-2.5 top-3 h-3.5 w-3.5 text-zinc-500" />
                  </div>
                  <button
                    type="submit"
                    className="border border-gold-600 text-gold-400 px-4 py-2 text-xs font-bold uppercase rounded-full hover:bg-gold-600 hover:text-white transition-colors"
                  >
                    Apply
                  </button>
                </form>
                {appliedCoupon && (
                  <p className="text-[10px] text-emerald-500 mt-2 font-bold uppercase tracking-wider">
                    Coupon 'GOLD20' applied successfully! (20% Off subtotal)
                  </p>
                )}
                {couponError && <p className="text-[10px] text-red-500 mt-2">{couponError}</p>}
              </div>

              {/* Loyalty Points Redemption Panel */}
              <div className="border-t border-zinc-800 pt-6 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-bold uppercase tracking-wider">Loyalty Points Balance:</span>
                  <span className="text-gold-400 font-bold font-serif">{loyaltyPoints} PTS</span>
                </div>
                
                {loyaltyPoints >= 500 ? (
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase text-zinc-500 font-bold block">Redeem Points for Discount</label>
                    <select
                      value={redeemedPoints}
                      onChange={(e) => setRedeemedPoints(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 px-3 py-2.5 rounded-full text-xs outline-none focus:border-gold-600/50 font-semibold"
                    >
                      <option value={0}>Do not redeem points (Save ₹0)</option>
                      {Array.from({ length: Math.floor(loyaltyPoints / 500) }, (_, i) => (i + 1) * 500).map((pts) => (
                        <option key={pts} value={pts}>
                          Redeem {pts} PTS (Save ₹{Math.floor(pts / 500) * 100})
                        </option>
                      ))}
                    </select>
                    <p className="text-[9px] text-zinc-500">You will also earn {Math.floor(grandTotal / 10)} points on this order!</p>
                  </div>
                ) : (
                  <p className="text-[10px] text-zinc-500 italic leading-relaxed">
                    Earn 1 Loyalty Point on every ₹10 spent. Collect 500 Points & Get ₹100 OFF! (You will earn {Math.floor(grandTotal / 10)} points on this order!)
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-zinc-800 pt-6 space-y-3 text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal:</span>
                  <span className="text-zinc-300 font-bold">₹{cartSubtotal}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-500 font-bold">
                    <span>Discount (20%):</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                {redeemedPoints > 0 && (
                  <div className="flex justify-between text-emerald-500 font-bold">
                    <span>Loyalty Discount:</span>
                    <span>-₹{loyaltyDiscount}</span>
                  </div>
                )}
                <div className="border-t border-zinc-800 pt-3 flex justify-between text-sm font-bold text-zinc-100">
                  <span>Grand Total:</span>
                  <span className="text-gold-400 text-base">₹{grandTotal}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
