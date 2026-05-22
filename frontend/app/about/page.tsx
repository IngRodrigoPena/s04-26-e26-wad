"use client";

import { Header } from "@/components/header";
import { useTranslations } from "@/components/providers/i18n-provider";

export default function AboutPage() {
  const t = useTranslations("nav");

  return (
    <>
      <Header />
      <main className="flex-1 container py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-foreground">{t("about")}</h1>
          <div className="prose prose-invert max-w-none">
            <p className="text-muted-foreground text-lg mb-4">
              Esta es una aplicación moderna construida con las últimas tecnologías web.
            </p>
            <p className="text-muted-foreground mb-4">
              Utilizamos Next.js 16 con App Router, Tailwind CSS 4, shadcn/ui para componentes,
              i18n personalizado para internacionalización, y soporte completo para temas oscuros/claros.
            </p>
            <p className="text-muted-foreground">
              La paleta de colores está personalizada con tonos de negro y rojo para darle
              un estilo único y moderno.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
