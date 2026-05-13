"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    await new Promise((r) => setTimeout(r, 1000));

    if (email === "gerente@opscore.com" && password === "gerente123") {
      login({
        id: "1",
        email: "gerente@opscore.com",
        name: "Carlos Gerente",
        role: "gerente",
      });
      router.push("/dashboard");
    } else if (email === "supervisor@opscore.com" && password === "supervisor123") {
      login({
        id: "2",
        email: "supervisor@opscore.com",
        name: "María Supervisor",
        role: "supervisor",
      });
      router.push("/dashboard");
    } else if (email === "operario@opscore.com" && password === "operario123") {
      login({
        id: "3",
        email: "operario@opscore.com",
        name: "Juan Operario",
        role: "operario",
      });
      router.push("/dashboard");
    } else {
      setError("Credenciales incorrectas");
    }

    setLoading(false);
  };

  const fillCredentials = (role: "gerente" | "supervisor" | "operario") => {
    if (role === "gerente") {
      setEmail("gerente@opscore.com");
      setPassword("gerente123");
    } else if (role === "supervisor") {
      setEmail("supervisor@opscore.com");
      setPassword("supervisor123");
    } else {
      setEmail("operario@opscore.com");
      setPassword("operario123");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      <div className="bg-shapes" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-purple-500 bg-clip-text text-transparent">
              Propotito
            </CardTitle>
            <CardDescription>Ingresa a tu cuenta</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 size-8"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-destructive text-sm text-center"
                >
                  {error}
                </motion.p>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Ingresar
                    <ArrowRight className="size-5" data-icon="inline-end" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 w-full text-center text-sm">
              <Link href="/recovery" className="text-muted-foreground hover:text-foreground">
                ¿Olvidaste tu contraseña?
              </Link>
              <Link href="/register" className="text-primary hover:underline">
                ¿No tienes cuenta? Regístrate
              </Link>
            </div>

            <Card className="w-full">
              <CardHeader>
                <CardDescription className="text-center">Credenciales de prueba</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fillCredentials("gerente")}
                  className="border-purple-500/30 text-purple-500 hover:bg-purple-500/10"
                >
                  Gerente
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fillCredentials("supervisor")}
                  className="border-blue-500/30 text-blue-500 hover:bg-blue-500/10"
                >
                  Supervisor
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fillCredentials("operario")}
                  className="border-green-500/30 text-green-500 hover:bg-green-500/10"
                >
                  Operario
                </Button>
              </CardContent>
            </Card>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}