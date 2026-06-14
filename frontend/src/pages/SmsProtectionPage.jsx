import React from "react";
import Scanner from "../components/Scanner";

export default function SmsProtectionPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-white">SMS Protection (Smishing)</h1>
        <p className="text-slate-400 mt-1">Analyze text messages and phone numbers for social engineering.</p>
      </div>
      
      {/* We reuse the Scanner component which allows switching to number/SMS mode. */}
      <div className="w-full bg-[#0a0a0b] min-h-screen">
        <Scanner />
      </div>
    </div>
  );
}
