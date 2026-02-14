"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import NotificationCenter from "@/components/NotificationCenter";

export default function TopBar({
  onSearch,
  userName = "Student",
  userEmail = "student@tracksheet.com",
  onLogout,
  onProfileClick,
  onSettingsClick,
  onDashboardClick,
}: {
  onSearch?: (q: string) => void;
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onDashboardClick?: () => void;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const avatarRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuRef.current) return;
      if (
        menuRef.current.contains(e.target as Node) ||
        (avatarRef.current && avatarRef.current.contains(e.target as Node))
      )
        return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const submit = (ev?: React.FormEvent) => {
    ev?.preventDefault();
    if (onSearch) onSearch(q.trim());
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -6, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md bg-white/75 border-b border-slate-200/50"
      role="banner"
      aria-label="Top navigation"
    >
      <div className="flex gap-3 items-center justify-between px-4 md:px-6 py-3 max-w-[1400px] mx-auto">
        <div className="font-bold text-3xl md:text-4xl gradient-text tracking-wider flex items-center gap-2">
          <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
            <Image
              src="/tracksheet-logo.svg"
              alt="TRACKSHEET Logo"
              width={48}
              height={48}
              className="w-full h-full"
              priority
            />
          </div>
          <span className="hidden sm:inline">TRACKSHEET</span>
          <span className="sm:hidden">TS</span>
        </div>

        <form
          className="flex items-center gap-2 flex-1 max-w-xl mx-4"
          role="search"
          onSubmit={submit}
        >
          <label htmlFor="top-search" className="sr-only">
            Search
          </label>
          <input
            id="top-search"
            name="q"
            placeholder="Search assignments, students..."
            className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-slate-200 bg-white/80 text-slate-900 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-200 transition-all"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            aria-label="Search"
            autoComplete="off"
          />
          <button
            type="submit"
            aria-label="Search"
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>

        <div className="flex gap-2 items-center">
          <NotificationCenter />

          <div className="relative">
            <button
              ref={avatarRef}
              className="flex items-center gap-2 p-1 pr-3 rounded-xl hover:bg-slate-100 transition-all"
              aria-haspopup="true"
              aria-expanded={open}
              aria-controls="avatar-menu"
              onClick={() => setOpen((s) => !s)}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <svg
                className={`w-4 h-4 text-slate-600 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  id="avatar-menu"
                  ref={menuRef}
                  className="absolute right-0 top-full mt-2 min-w-[220px] glass-sm border border-slate-200/80 rounded-xl p-2 shadow-lg"
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={menuVariants}
                  transition={{ duration: 0.22 }}
                  role="menu"
                  aria-label="Profile menu"
                >
                  <div className="px-3 py-2 border-b border-slate-200/80 mb-2">
                    <p className="font-semibold text-slate-900 text-sm">
                      {userName}
                    </p>
                    <p className="text-xs text-slate-500">{userEmail}</p>
                  </div>

                  <div className="border-t border-slate-200/80 mt-2 pt-2">
                    <button
                      role="menuitem"
                      onClick={() => {
                        setOpen(false);
                        onLogout?.();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 text-sm text-rose-600 font-medium transition-colors"
                    >
                      🚪 Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
