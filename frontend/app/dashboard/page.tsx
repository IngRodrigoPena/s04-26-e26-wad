"use client";

import { Header } from "@/components/header";
import { useAuthStore } from "@/features/auth/stores/auth-store";

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <>
      <Header />
      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Bienvenido, {user?.firstName}!
            </h1>
            <p className="text-muted-foreground mt-2">
              Has iniciado sesión correctamente en OpsCore.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-card-foreground mb-2">
                Tu Perfil
              </h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Nombre:</span>{" "}
                  {user?.firstName} {user?.lastName}
                </p>
                <p>
                  <span className="text-muted-foreground">Email:</span>{" "}
                  {user?.email}
                </p>
                <p>
                  <span className="text-muted-foreground">Rol:</span>{" "}
                  <span className="capitalize">{user?.role?.toLowerCase()}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Área:</span>{" "}
                  {user?.area || "No asignada"}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-card-foreground mb-2">
                Estado del Sistema
              </h2>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span>Autenticado</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span>Cuenta activa</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
