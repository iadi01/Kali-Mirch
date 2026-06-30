"use client";

import React from "react";
import { AppProvider } from "@/context/AppContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { usePathname } from "next/navigation";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <AppProvider>
      {!isAdminPage && <Navbar />}
      <main className="flex-grow flex flex-col bg-white text-zinc-900">{children}</main>
      {!isAdminPage && <Footer />}
    </AppProvider>
  );
}
