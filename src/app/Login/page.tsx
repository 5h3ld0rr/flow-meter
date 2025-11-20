"use client";

import { Button, GlassCard, Input, Logo } from "@/components";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex justify-center items-center w-full">
      <GlassCard variant="strong" className="w-full max-w-md p-8 relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="lg" showText={true} />
          </div>
          <p className="text-gray-600 dark:text-slate-400">
            Sign in to access your utility management dashboard
          </p>
        </div>
        {/* Login Form */}
        <form className="space-y-4">
          <Input
            name="email"
            type="email"
            label="Email Address"
            placeholder="admin@flowmeter.com"
            icon={<Mail size={18} />}
            required
          />
          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            icon={<Lock size={18} />}
            required
          />
          <Button
            variant="primary"
            fullWidth
            size="lg"
            type="submit"
            className="mt-7 justify-center"
          >
            Sign In
          </Button>
        </form>
      </GlassCard>
    </main>
  );
}
