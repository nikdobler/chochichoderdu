"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send, X } from "lucide-react";

export default function InviteButton() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    const appUrl = window.location.origin;
    const subject = encodeURIComponent("Chochichoderdu – Rezepte für den Thermomix");
    const body = encodeURIComponent(
      `Hey!\n\nIch nutze Chochichoderdu um Rezepte für den Thermomix umzuwandeln. Schau mal rein:\n\n${appUrl}\n\nEn Guete! 🍳`
    );

    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
    toast.success("Mail-App geöffnet");
    setEmail("");
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-orange-600 transition-colors"
      >
        <Send className="w-3.5 h-3.5" />
        Einladen
      </button>
    );
  }

  return (
    <form onSubmit={handleSend} className="flex items-center gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email@beispiel.ch"
        required
        autoFocus
        className="w-40 px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
      />
      <button type="submit" className="p-1 text-orange-600 hover:text-orange-700">
        <Send className="w-3.5 h-3.5" />
      </button>
      <button type="button" onClick={() => setOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
        <X className="w-3.5 h-3.5" />
      </button>
    </form>
  );
}
