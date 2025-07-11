"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/admin/products");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "'Vyskytla sa chyba'");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)} {...props}>
      <Link href="/">
        <Image
          src="/images/logoputec.svg"
          alt="Logo Pútec"
          width={120}
          height={40}
        />
      </Link>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Prihlásenie</CardTitle>
          <CardDescription>
            Zadajte svoj e-mail a prihláste sa do svojho účtu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Heslo</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:text-primary hover:no-underline"
                  >
                    Zabudli ste heslo?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Prihlasujem..." : "Prihlásiť sa"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Nemáte účet?{" "}
              <Link
                href="/auth/sign-up"
                className="underline underline-offset-4 hover:text-primary hover:no-underline"
              >
                Zaregistrujte sa
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
