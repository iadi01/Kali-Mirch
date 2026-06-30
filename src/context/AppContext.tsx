"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, MenuItem, Reservation, Order, OrderStatus, ReservationStatus } from "@/types";

interface AppContextProps {
  user: User | null;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  cart: { menuItem: MenuItem; quantity: number }[];
  addToCart: (item: MenuItem, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  updateCartQuantity: (itemId: string, qty: number) => void;
  reservations: Reservation[];
  addReservation: (res: Omit<Reservation, "id" | "status" | "createdAt">) => Promise<Reservation>;
  updateReservationStatus: (id: string, status: ReservationStatus) => void;
  orders: Order[];
  addOrder: (orderData: { customerName: string; phone: string; address?: string; tableNumber?: string; type: "DELIVERY" | "PICKUP" | "DINE_IN"; couponCode?: string }) => Promise<Order>;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  favorites: string[];
  toggleFavorite: (itemId: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<{ menuItem: MenuItem; quantity: number }[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load user from localStorage & cart/favs
  useEffect(() => {
    const savedUser = localStorage.getItem("gilded_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedCart = localStorage.getItem("gilded_cart");
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedFavs = localStorage.getItem("gilded_favs");
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, []);

  // Fetch reservations & orders for the current user (or all if admin) from MongoDB
  const fetchReservations = async (email?: string) => {
    try {
      const url = email ? `/api/reservations?email=${encodeURIComponent(email)}` : `/api/reservations`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setReservations(data);
      }
    } catch (e) {
      console.error("Failed to fetch reservations from MongoDB", e);
    }
  };

  const fetchOrders = async (email?: string) => {
    try {
      const url = email ? `/api/orders?email=${encodeURIComponent(email)}` : `/api/orders`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error("Failed to fetch orders from MongoDB", e);
    }
  };

  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        fetchReservations();
        fetchOrders();
      } else {
        fetchReservations(user.email);
        fetchOrders(user.email);
      }
    } else {
      setReservations([]);
      setOrders([]);
    }
  }, [user]);

  const saveToLocal = (key: string, val: any) => {
    localStorage.setItem(key, JSON.stringify(val));
  };

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        saveToLocal("gilded_user", data);
        return { success: true };
      } else {
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const signup = async (name: string, email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        saveToLocal("gilded_user", data);
        return { success: true };
      } else {
        return { success: false, error: data.error || "Registration failed" };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("gilded_user");
  };

  const addToCart = (item: MenuItem, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.menuItem.id === item.id);
      let updated;
      if (existing) {
        updated = prev.map((i) =>
          i.menuItem.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        updated = [...prev, { menuItem: item, quantity }];
      }
      saveToLocal("gilded_cart", updated);
      return updated;
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const updated = prev.filter((i) => i.menuItem.id !== itemId);
      saveToLocal("gilded_cart", updated);
      return updated;
    });
  };

  const updateCartQuantity = (itemId: string, qty: number) => {
    setCart((prev) => {
      const updated = qty <= 0
        ? prev.filter((i) => i.menuItem.id !== itemId)
        : prev.map((i) => (i.menuItem.id === itemId ? { ...i, quantity: qty } : i));
      saveToLocal("gilded_cart", updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("gilded_cart");
  };

  const addReservation = async (resData: Omit<Reservation, "id" | "status" | "createdAt">): Promise<Reservation> => {
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resData)
    });
    const data = await res.json();
    setReservations((prev) => [data, ...prev]);
    return data;
  };

  const updateReservationStatus = async (id: string, status: ReservationStatus) => {
    const res = await fetch(`/api/admin/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    }
  };

  const addOrder = async (orderData: { customerName: string; phone: string; address?: string; tableNumber?: string; type: "DELIVERY" | "PICKUP" | "DINE_IN"; couponCode?: string }): Promise<Order> => {
    const totalAmount = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
    const finalTotal = orderData.couponCode === "GOLD20" ? totalAmount * 0.8 : totalAmount;

    const payload = {
      customerName: orderData.customerName,
      customerEmail: user?.email || null,
      phone: orderData.phone,
      address: orderData.address,
      tableNumber: orderData.tableNumber,
      type: orderData.type,
      totalAmount: parseFloat(finalTotal.toFixed(2)),
      items: cart.map(i => ({
        menuItemId: i.menuItem.id,
        name: i.menuItem.name,
        quantity: i.quantity,
        price: i.menuItem.price
      })),
      couponCode: orderData.couponCode
    };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    // Credit loyalty points locally
    if (user) {
      const pointsEarned = Math.floor(finalTotal * 0.1);
      const updatedUser = { ...user, loyaltyPoints: user.loyaltyPoints + pointsEarned };
      setUser(updatedUser);
      saveToLocal("gilded_user", updatedUser);
    }

    setOrders((prev) => [data, ...prev]);
    clearCart();
    return data;
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    }
  };

  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId];
      saveToLocal("gilded_favs", updated);
      return updated;
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartQuantity,
        reservations,
        addReservation,
        updateReservationStatus,
        orders,
        addOrder,
        updateOrderStatus,
        favorites,
        toggleFavorite
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
