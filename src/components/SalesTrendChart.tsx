"use client";

import React, { useState, useEffect } from "react";
import { Order } from "@/types";

interface SalesTrendChartProps {
  orders: Order[];
}

export default function SalesTrendChart({ orders }: SalesTrendChartProps) {
  const [salesDays, setSalesDays] = useState<{ label: string; key: string; sales: number }[]>([]);
  const [maxSales, setMaxSales] = useState(1000);
  const [linePath, setLinePath] = useState("M 0 180 L 600 180");
  const [areaPath, setAreaPath] = useState("M 0 180 L 600 180 L 600 200 L 0 200 Z");

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

    orders.forEach((o) => {
      if (o.status !== "CANCELLED" && o.createdAt) {
        const key = o.createdAt.split("T")[0];
        const match = list.find((item) => item.key === key);
        if (match) {
          match.sales += o.totalAmount;
        }
      }
    });

    const max = Math.max(...list.map((d) => d.sales)) || 1000;
    
    let lp = "";
    for (let i = 0; i < list.length; i++) {
      const x = (i / 6) * 600;
      const y = 180 - (list[i].sales / max) * 140;
      if (i === 0) {
        lp += `M ${x} ${y}`;
      } else {
        lp += ` L ${x} ${y}`;
      }
    }
    const ap = `${lp} L 600 200 L 0 200 Z`;

    setSalesDays(list);
    setMaxSales(max);
    setLinePath(lp);
    setAreaPath(ap);
  }, [orders]);

  return (
    <div className="w-full h-64 border border-zinc-150 rounded-xl relative overflow-hidden flex flex-col justify-end bg-white">
      {/* SVG Line Graph */}
      <div className="relative w-full h-48">
        <svg className="w-full h-full absolute inset-0" viewBox="0 0 600 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C5A059" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#C5A059" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#chart-glow)" />
          <path d={linePath} fill="none" stroke="#C5A059" strokeWidth="2.5" />
        </svg>
        {/* Graph Grid markings */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none text-[9px] text-zinc-400 font-sans font-bold">
          <span>₹{maxSales.toLocaleString()}</span>
          <span>₹{Math.floor(maxSales / 2).toLocaleString()}</span>
          <span>₹0</span>
        </div>
      </div>
      
      {/* Day Labels */}
      <div className="flex justify-between border-t border-zinc-100 p-3 bg-zinc-50/50 text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
        {salesDays.map((d) => (
          <span key={d.key}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}
