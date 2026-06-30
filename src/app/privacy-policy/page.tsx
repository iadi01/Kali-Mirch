"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Eye, Lock, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
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
      icon: <Eye className="h-6 w-6 text-gold-400" />,
      title: "1. Information We Collect",
      content: "We collect information you provide directly to us when making a reservation, placing an online order, or signing up for our concierge newsletter. This includes your name, email address, phone number, physical address, and table preferences."
    },
    {
      icon: <Lock className="h-6 w-6 text-gold-400" />,
      title: "2. How We Protect Your Data",
      content: "Your security is paramount. We implement a variety of premium security measures, including SSL encryption and secure database gateways, to maintain the safety of your personal credentials when booking or checking out."
    },
    {
      icon: <FileText className="h-6 w-6 text-gold-400" />,
      title: "3. Use of Cookies & Tracking",
      content: "We use performance and functional cookies to elevate your browsing experience, remember your cart items, and analyze site traffic patterns. You can manage cookies at any time through your local browser settings."
    },
    {
      icon: <Shield className="h-6 w-6 text-gold-400" />,
      title: "4. Third-Party Disclosures",
      content: "Kali Mirch does not sell, trade, or transfer your personally identifiable information to external parties. This excludes trusted service providers who assist us in operating our online ordering system under strict confidentiality agreements."
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
          <span className="text-xs uppercase tracking-widest text-gold-400 font-bold">Kali Mirch Legal</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide text-zinc-100">Privacy Policy</h1>
          <div className="h-[1.5px] w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-4" />
          <p className="text-zinc-500 text-xs mt-2">Last Updated: June 30, 2026</p>
        </div>

        {/* Introduction */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 p-8 rounded-3xl mb-12 leading-relaxed">
          <p className="text-sm font-medium">
            Welcome to <span className="text-gold-400 font-serif font-bold">Kali Mirch Restaurant & Cafe</span>. We respect your privacy and are committed to protecting any personal data you share with us. This policy details our guidelines regarding information collection, protection, and usage across our web reservation and ordering services.
          </p>
        </div>

        {/* Section Cards */}
        <div className="space-y-8">
          {sections.map((sect, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
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
            Have questions regarding our data practices? Reach out to our privacy officer at <a href="mailto:privacy@kalimirch.com" className="text-gold-400 hover:underline">privacy@kalimirch.com</a>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
