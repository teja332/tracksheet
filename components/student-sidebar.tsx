"use client";

import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  User,
  BookOpen,
  Users,
  Zap,
  Globe,
  BarChart3,
  Bell,
} from "lucide-react";

interface StudentSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  searchQuery?: string;
}

export default function StudentSidebar({
  activeSection,
  onSectionChange,
  searchQuery = "",
}: StudentSidebarProps) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "profile", label: "Profile", icon: User },
    { id: "academic", label: "Academic Details", icon: BookOpen },
    { id: "cocircular", label: "Co-Circulars", icon: Users },
    { id: "extracircular", label: "Extra-Circulars", icon: Zap },
    { id: "platforms", label: "Online Platforms", icon: Globe },
    { id: "analysis", label: "Overall Analysis", icon: BarChart3 },
    { id: "alerts", label: "Alerts", icon: Bell },
  ];

  return (
    <div className="w-64 glass glass-lg border-r border-slate-200/80 p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="text-lg font-bold gradient-text">Menu</h2>
      </div>
      <nav className="space-y-2 flex-1">
        {menuItems
          .filter((item) =>
            item.label.toLowerCase().includes(searchQuery)
          )
          .map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 rounded-2xl text-sm transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-400 to-indigo-500 text-white shadow-md shadow-cyan-400/40 border-0"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border-transparent"
                }`}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon size={20} />
                {item.label}
              </Button>
            );
          })}
      </nav>
    </div>
  );
}
