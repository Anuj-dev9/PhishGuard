import React from "react";
import Scanner from "../components/Scanner";

export default function EmailProtectionPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Email Protection</h1>
        <p className="text-slate-400 mt-1">Scan and analyze emails for potential phishing threats.</p>
      </div>
      
      {/* 
        The Scanner component defaults to email mode initially.
        We provide a wrapper to just render the scanner.
      */}
      <div className="w-full bg-[#0a0a0b] min-h-screen">
        <Scanner />
      </div>
    </div>
  );
}
