import { Header } from "@/components/header";

// Server Component
export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Bienvenido al sistema de gestión de incidentes.
          </p>
        </div>
      </main>
    </>
  );
}
