"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `flex flex-col items-center gap-1 text-xs transition-colors ${
      pathname === path
        ? "text-orange-600"
        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        <Link href="/" className={linkClass("/")}>
          <Home className="w-5 h-5" />
          <span>Rezepte</span>
        </Link>
        <Link href="/rezept/neu" className={linkClass("/rezept/neu")}>
          <PlusCircle className="w-5 h-5" />
          <span>Importieren</span>
        </Link>
      </div>
    </nav>
  );
}
