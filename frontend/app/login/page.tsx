import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-6xl">🐦‍🔥</span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">OpsCore</h1>
            <p className="text-sm text-muted-foreground">
              Sistema de Gestión de Incidentes
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold text-card-foreground">
              Iniciar Sesión
            </h2>
            <p className="text-sm text-muted-foreground">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          © 2026 OpsCore. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
