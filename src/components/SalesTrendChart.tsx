"use client";

import React, { useState, useEffect } from "react";
import { Order } from "@/types";
import { TrendingUp, ShoppingBag, ArrowUpRight, Download } from "lucide-react";

interface SalesTrendChartProps {
  orders: Order[];
}

export default function SalesTrendChart({ orders }: SalesTrendChartProps) {
  const [salesDays, setSalesDays] = useState<{ label: string; key: string; sales: number }[]>([]);
  const [maxSales, setMaxSales] = useState(1000);
  const [linePath, setLinePath] = useState("M 0 180 L 600 180");
  const [areaPath, setAreaPath] = useState("M 0 180 L 600 180 L 600 200 L 0 200 Z");
  
  // Analytics
  const [todaySales, setTodaySales] = useState(0);
  const [aov, setAov] = useState(0);

  const downloadCSVReport = () => {
    // Generate CSV headers
    const headers = ["Date", "Total Revenue (INR)", "Average Order Value (INR)", "Order Volume"];
    
    // Process rows
    const rows = salesDays.map(day => {
      const dayOrders = orders.filter(o => o.status !== "CANCELLED" && o.createdAt && o.createdAt.split("T")[0] === day.key);
      const daySales = day.sales;
      const dayVolume = dayOrders.length;
      const dayAov = dayVolume > 0 ? Math.round(daySales / dayVolume) : 0;
      return [day.key, daySales, dayAov, dayVolume];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sales_report_7days_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const list: { label: string; key: string; sales: number }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      list.push({
        label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        key: d.toISOString().split("T")[0],
        sales: 0
      });
    }

    let todayAmt = 0;
    let completedOrdersCount = 0;
    let totalAmtSum = 0;

    orders.forEach((o) => {
      if (o.status !== "CANCELLED" && o.createdAt) {
        completedOrdersCount++;
        totalAmtSum += o.totalAmount;
        
        const key = o.createdAt.split("T")[0];
        const match = list.find((item) => item.key === key);
        if (match) {
          match.sales += o.totalAmount;
        }

        const todayKey = now.toISOString().split("T")[0];
        if (key === todayKey) {
          todayAmt += o.totalAmount;
        }
      }
    });

    const max = Math.max(...list.map((d) => d.sales)) || 1000;
    
    let lp = "";
    for (let i = 0; i < list.length; i++) {
      const x = (i / 6) * 600;
      const y = 160 - (list[i].sales / max) * 120;
      if (i === 0) {
        lp += `M ${x} ${y}`;
      } else {
        lp += ` L ${x} ${y}`;
      }
    }
    const ap = lp ? `${lp} L 600 180 L 0 180 Z` : "";

    setSalesDays(list);
    setMaxSales(max);
    setLinePath(lp);
    setAreaPath(ap);
    setTodaySales(todayAmt);
    setAov(completedOrdersCount > 0 ? Math.round(totalAmtSum / completedOrdersCount) : 0);
  }, [orders]);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top mini-badges for analytics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-950/60 border border-zinc-900 p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Today's Revenue</span>
            <span className="text-sm font-bold font-serif text-gold-400">₹{todaySales.toLocaleString()}</span>
          </div>
          <span className="text-[10px] bg-gold-950/20 text-gold-450 border border-gold-900/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
            Live <span className="h-1.5 w-1.5 rounded-full bg-gold-500 animate-pulse inline-block" />
          </span>
        </div>

        <div className="bg-zinc-950/60 border border-zinc-900 p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Average Order</span>
            <span className="text-sm font-bold font-serif text-zinc-200">₹{aov}</span>
          </div>
          <TrendingUp className="h-4 w-4 text-emerald-500 shrink-0" />
        </div>

        <div className="bg-zinc-950/60 border border-zinc-900 p-4 rounded-xl hidden sm:flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Order Volume</span>
            <span className="text-sm font-bold font-serif text-zinc-200">{orders.length}</span>
          </div>
          <ShoppingBag className="h-4 w-4 text-zinc-500 shrink-0" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <span className="text-[10px] text-zinc-500 font-sans font-bold uppercase tracking-wider">
          Sales data updates automatically when orders are confirmed.
        </span>
        <button
          onClick={downloadCSVReport}
          className="bg-gold-600 hover:bg-gold-500 text-zinc-950 px-4 py-2.5 rounded-full font-bold uppercase tracking-widest text-[9px] flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-md shadow-gold-600/10"
        >
          <Download className="h-3 w-3" />
          Download 7-Day Report
        </button>
      </div>

      {/* Main Chart Box */}
      <div className="w-full border border-zinc-800/80 rounded-2xl relative overflow-hidden flex flex-col justify-end bg-zinc-950/40 backdrop-blur-md p-1">
        {/* SVG Line Graph */}
        <div className="relative w-full h-44">
          <svg className="w-full h-full absolute inset-0" viewBox="0 0 600 180" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chart-glow-dark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C5A059" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#C5A059" stopOpacity="0.01" />
              </linearGradient>
              <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#C5A059" floodOpacity="0.3"/>
              </filter>
            </defs>
            {/* Grid markings SVG */}
            <line x1="0" y1="40" x2="600" y2="40" stroke="#1f1f23" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="0" y1="100" x2="600" y2="100" stroke="#1f1f23" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="0" y1="160" x2="600" y2="160" stroke="#1f1f23" strokeWidth="0.5" />

            {areaPath && <path d={areaPath} fill="url(#chart-glow-dark)" />}
            {linePath && <path d={linePath} fill="none" stroke="#C5A059" strokeWidth="2.5" filter="url(#glow)" />}
          </svg>
          
          {/* Graph Grid markings */}
          <div className="absolute inset-y-0 left-4 flex flex-col justify-between py-2 pointer-events-none text-[8px] text-zinc-500 font-sans font-bold">
            <span>₹{maxSales.toLocaleString()}</span>
            <span>₹{Math.floor(maxSales / 2).toLocaleString()}</span>
            <span>₹0</span>
          </div>
        </div>
        
        {/* Day Labels */}
        <div className="flex justify-between border-t border-zinc-800/80 p-3.5 bg-zinc-900/20 text-[9px] text-zinc-450 font-bold uppercase tracking-wider">
          {salesDays.map((d) => (
            <span key={d.key} className="hover:text-gold-400 transition-colors cursor-pointer">{d.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
