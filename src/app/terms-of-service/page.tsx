"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scale, Coffee, UserCheck, AlertOctagon } from "lucide-react";

export default function TermsOfServicePage() {
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
      icon: <UserCheck className="h-6 w-6 text-gold-400" />,
      title: "1. Acceptance of Terms",
      content: "By accessing this website, placing online orders, or booking a table with us, you agree to comply with and be bound by these Terms of Service. If you do not agree, please refrain from using our digital services."
    },
    {
      icon: <Coffee className="h-6 w-6 text-gold-400" />,
      title: "2. Dining & Reservation Policy",
      content: "Reservations must be verified via mobile OTP. Tables are held for a maximum of 15 minutes past the scheduled arrival time, after which the table may be released. Outside food or drinks are strictly prohibited in the dining hall."
    },
    {
      icon: <Scale className="h-6 w-6 text-gold-400" />,
      title: "3. Online Ordering & Payments",
      content: "All online orders must be paid securely through our approved gateways. We make every effort to display accurate pricing and ingredients. We reserve the right to cancel or modify orders in the event of stock unavailability."
    },
    {
      icon: <AlertOctagon className="h-6 w-6 text-gold-400" />,
      title: "4. Limitation of Liability",
      content: "Kali Mirch shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use of, or inability to use, our online services or dining platforms."
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
          <span className="text-xs uppercase tracking-widest text-gold-400 font-bold">Kali Mirch Rules</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide text-zinc-100">Terms of Service</h1>
          <div className="h-[1.5px] w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-4" />
          <p className="text-zinc-500 text-xs mt-2">Last Updated: June 30, 2026</p>
        </div>

        {/* Introduction */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 p-8 rounded-3xl mb-12 leading-relaxed">
          <p className="text-sm font-medium">
            Please read these Terms of Service carefully before interacting with <span className="text-gold-400 font-serif font-bold">Kali Mirch Restaurant & Cafe</span>. By using our website, ordering systems, or reservations, you agree to these legally binding terms.
          </p>
        </div>

        {/* Section Cards */}
        <div className="space-y-8">
          {sections.map((sect, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
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
            If you have any queries about these terms, please write to us at <a href="mailto:terms@kalimirch.com" className="text-gold-400 hover:underline">terms@kalimirch.com</a>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
