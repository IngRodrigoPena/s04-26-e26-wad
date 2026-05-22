"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login, loading, error, clearError } = useAuthStore();
  const [showError, setShowError] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    clearError();
    setShowError(false);
    try {
      await login(values);
      // Redirigir al dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      setShowError(true);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Error Alert */}
      {(showError || error) && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error || "Error al iniciar sesión"}
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Correo electrónico
          </label>
          <Input
            id="email"
            placeholder="email@ejemplo.com"
            type="email"
            disabled={loading}
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Contraseña
          </label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            disabled={loading}
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-sm text-red-500">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Ingresando...
            </>
          ) : (
            "Ingresar"
          )}
        </Button>
      </form>
    </div>
  );
}
