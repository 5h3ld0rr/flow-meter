"use client";

import { Button, GlassCard, Input, Logo, toast } from "@/components/ui";
import { login } from "@/lib/actions/auth";
import { Mail, Lock } from "lucide-react";
import { useActionState } from "react";
import { useEffect } from "react";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, undefined);

  useEffect(() => {
    if (state?.message) {
      toast("error", state.message);
    }
  }, [state]);

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
        <form className="space-y-4" action={action}>
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
            className="mt-12 justify-center"
            icon={<Lock size={18} />}
            loading={isPending}
          >
            {isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </GlassCard>
    </main>
  );
}
