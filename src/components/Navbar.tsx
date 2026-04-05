"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const linkClass = (path: string) =>
    `flex flex-col items-center gap-1 text-xs transition-colors ${
      pathname === path
        ? "text-orange-600"
        : "text-gray-400 hover:text-gray-600"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        <Link href="/" className={linkClass("/")}>
          <Home className="w-5 h-5" />
          <span>Rezepte</span>
        </Link>
        <Link href="/rezept/neu" className={linkClass("/rezept/neu")}>
          <PlusCircle className="w-5 h-5" />
          <span>Importieren</span>
        </Link>
        <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Abmelden</span>
        </button>
      </div>
    </nav>
  );
}
