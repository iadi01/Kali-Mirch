"use client";

import React from "react";
import { motion } from "framer-motion";
import { HelpCircle, RefreshCcw, XCircle, ShieldAlert } from "lucide-react";

export default function RefundsCancellationPage() {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } 
    }
  };

  const sections = [
    {
      icon: <XCircle className="h-6 w-6 text-gold-400" />,
      title: "1. Order Cancellation",
      content: "Since food items are prepared fresh to order, cancellations are not accepted once the restaurant accepts and starts preparing your order. Please review your cart items carefully before finalizing your payment."
    },
    {
      icon: <RefreshCcw className="h-6 w-6 text-gold-400" />,
      title: "2. Refund Eligibility",
      content: "Refunds may be processed in exceptional circumstances, such as: receiving an entirely incorrect dish, missing items from your order bag, or order cancellation by the restaurant due to out-of-stock items. Approved refunds will be credited back to your original payment method within 5 to 7 business days."
    },
    {
      icon: <ShieldAlert className="h-6 w-6 text-gold-400" />,
      title: "3. Reservation Deposits",
      content: "For premium table bookings or events that require an upfront holding deposit, cancellations made at least 24 hours prior to the reservation time are eligible for a 100% refund. Cancellations inside of 24 hours are non-refundable."
    },
    {
      icon: <HelpCircle className="h-6 w-6 text-gold-400" />,
      title: "4. Disputes & Support",
      content: "If you have any feedback or dispute regarding food quality or deliveries, please contact our helpline immediately at 07982994654 with your order number. We strive to provide a positive resolution."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-zinc-950 py-24 px-4 sm:px-6 lg:px-8 text-zinc-300 font-sans">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest text-gold-400 font-bold">Kali Mirch Support</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide text-zinc-100">Refunds & Cancellation</h1>
          <div className="h-[1.5px] w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-4" />
          <p className="text-zinc-500 text-xs mt-2">Last Updated: June 30, 2026</p>
        </div>

        {/* Introduction */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 p-8 rounded-3xl mb-12 leading-relaxed">
          <p className="text-sm font-medium">
            Thank you for dining with <span className="text-gold-400 font-serif font-bold">Kali Mirch</span>. Here is our policy regarding order cancellation, refunds, and booking deposits. We aim to keep transactions transparent and fair for all our valued guests.
          </p>
        </div>

        {/* Section Cards */}
        <div className="space-y-8">
          {sections.map((sect, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-zinc-900/60 border border-zinc-800/60 p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-start hover:border-gold-600/25 transition-all duration-300 group"
            >
              <div className="h-12 w-12 rounded-full bg-gold-950/20 border border-gold-600/10 flex items-center justify-center shrink-0">
                {sect.icon}
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-zinc-100 group-hover:text-gold-400 transition-colors">
                  {sect.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                  {sect.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact footer */}
        <div className="mt-16 text-center border-t border-zinc-900 pt-8">
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">
            If you need assistance regarding a refund, please write to us at <a href="mailto:support@kalimirch.com" className="text-gold-400 hover:underline">support@kalimirch.com</a> or call our team.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
