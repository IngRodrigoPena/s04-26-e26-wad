"use client";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/components/providers/i18n-provider";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const t = useTranslations("hero");

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="container flex flex-col items-center justify-center gap-4 pb-8 pt-6 md:py-10">
          <div className="flex max-w-[980px] flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-3 justify-center">
              <span className="text-4xl md:text-6xl">🐦‍🔥</span>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
                <span className="text-foreground">{t("title")}</span>
              </h1>
              <span className="text-4xl md:text-6xl">🐦‍🔥</span>
            </div>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              {t("subtitle")}
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="gap-2">
                {t("cta")}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-card-foreground">Modern Stack</h3>
              <p className="text-muted-foreground">
                Built with Next.js 16, Tailwind CSS, and shadcn/ui for the best developer experience.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-card-foreground">Multi-language</h3>
              <p className="text-muted-foreground">
                Full internationalization support. Switch between Spanish and English seamlessly.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-card-foreground">Dark Mode</h3>
              <p className="text-muted-foreground">
                Beautiful dark theme with custom red accents. Toggle between light and dark modes.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
