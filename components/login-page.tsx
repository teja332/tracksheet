"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { containerVariants, itemVariants } from "@/lib/animations";
import { useToast } from "@/hooks/use-toast";

interface LoginPageProps {
  onLogin: (payload: {
    role: "student" | "staff";
    rollNumber?: string;
    staffId?: string;
    email: string;
  }) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [isStudent, setIsStudent] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing details",
        description: "Enter your email and password to continue.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        toast({
          title: "Login failed",
          description: data.error || "Login failed. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const data = await response.json();
      toast({
        title: "Login successful",
        description: "Redirecting to your dashboard...",
      });
      setTimeout(() => onLogin(data), 700);
    } catch (err) {
      toast({
        title: "Login failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <Card className="w-full max-w-md glass glass-lg">
          <CardHeader className="space-y-2">
            <motion.div variants={itemVariants} className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex-shrink-0">
                  <Image
                    src="/tracksheet-logo.svg"
                    alt="TRACKSHEET Logo"
                    width={48}
                    height={48}
                    className="w-full h-full"
                    priority
                  />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold gradient-text">
                    TRACKSHEET
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-500">
                    Student Performance Tracking
                  </CardDescription>
                </div>
              </div>
            </motion.div>
          </CardHeader>

          <CardContent>
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-5"
              variants={containerVariants}
            >
              {/* Role toggle */}
              <motion.div variants={itemVariants} className="flex gap-2 mb-2">
                <Button
                  type="button"
                  variant={isStudent ? "default" : "outline"}
                  className={`flex-1 rounded-2xl text-sm font-medium transition-all ${
                    isStudent
                      ? "bg-gradient-to-r from-cyan-400 to-indigo-500 text-white border-0 shadow-md shadow-cyan-400/40"
                      : "border-slate-200 text-slate-600 bg-white/70 hover:bg-slate-50"
                  }`}
                  onClick={() => setIsStudent(true)}
                >
                  Student
                </Button>

                <Button
                  type="button"
                  variant={!isStudent ? "default" : "outline"}
                  className={`flex-1 rounded-2xl text-sm font-medium transition-all ${
                    !isStudent
                      ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white border-0 shadow-md shadow-indigo-400/40"
                      : "border-slate-200 text-slate-600 bg-white/70 hover:bg-slate-50"
                  }`}
                  onClick={() => setIsStudent(false)}
                >
                  Staff
                </Button>
              </motion.div>

              {/* Email */}
              <motion.div variants={itemVariants} className="space-y-1">
                <label className="text-xs font-medium text-slate-600">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder={
                    isStudent
                      ? "student@example.com"
                      : "staff@example.com"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl bg-white/80 border-slate-200 text-slate-800"
                />
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants} className="space-y-1">
                <label className="text-xs font-medium text-slate-600">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter any password for demo"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-2xl bg-white/80 border-slate-200 text-slate-800"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full mt-2 primary-btn rounded-2xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Signing in..."
                    : `Continue as ${isStudent ? "Student" : "Staff"}`}
                </Button>
              </motion.div>
            </motion.form>

            {/* Demo credentials */}
            <motion.div variants={itemVariants} className="mt-6 px-4 py-3 rounded-2xl bg-slate-50/90 border border-slate-200 text-xs text-slate-600">
              <p className="font-semibold mb-2 text-slate-700">
                Demo Credentials
              </p>
              <p>Student: use your student email (password: student123)</p>
              <p>Staff: staff01@tracksheet.edu (password: staff123)</p>
              <p className="text-[0.7rem] text-slate-500 mt-1">
                These are seeded demo credentials. Ask admin for real accounts.
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
