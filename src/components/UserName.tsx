"use client";

import { useState, useEffect } from "react";
import { User } from "lucide-react";

const STORAGE_KEY = "chochichoderdu_username";

export function getUserName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export default function UserName() {
  const [name, setName] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    setName(getUserName());
  }, []);

  function save() {
    const trimmed = input.trim();
    if (!trimmed) return;
    localStorage.setItem(STORAGE_KEY, trimmed);
    setName(trimmed);
    setEditing(false);
  }

  if (!name && !editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 transition-colors"
      >
        <User className="w-3.5 h-3.5" />
        Name setzen
      </button>
    );
  }

  if (editing) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        className="flex items-center gap-1"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Dein Name"
          autoFocus
          className="w-24 px-2 py-0.5 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg outline-none focus:ring-1 focus:ring-orange-500"
        />
        <button type="submit" className="text-xs text-orange-600 font-medium">
          OK
        </button>
      </form>
    );
  }

  return (
    <button
      onClick={() => {
        setInput(name || "");
        setEditing(true);
      }}
      className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-orange-600 transition-colors"
    >
      <User className="w-3.5 h-3.5" />
      {name}
    </button>
  );
}
