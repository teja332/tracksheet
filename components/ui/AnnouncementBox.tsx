"use client";
import React from "react";
import { motion } from "framer-motion";

export default function AnnouncementBox({
  text,
  cta,
  onClose,
}: {
  text: string;
  cta?: { label: string; onClick: () => void };
  onClose?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.28 }}
      className="mx-4 my-3 glass-sm border border-sky-200/50 rounded-xl p-3 md:p-4"
      role="region"
      aria-live="polite"
      aria-label="Announcement"
    >
      <div className="flex items-center justify-between gap-3 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex-shrink-0 w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-sky-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-900 font-medium">{text}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {cta && (
            <button
              className="px-3 py-1.5 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-600 transition-colors"
              onClick={cta.onClick}
            >
              {cta.label}
            </button>
          )}
          {onClose && (
            <button
              className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
              onClick={onClose}
              aria-label="Close announcement"
            >
              <svg
                className="w-4 h-4 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
