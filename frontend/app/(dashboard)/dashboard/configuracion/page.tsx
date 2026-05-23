"use client";

import { useState } from "react";
import { useTheme } from "@/components/providers/theme-provider";
import { useI18n } from "@/components/providers/i18n-provider";
import { Sun, Moon, Languages, Bell, Cog, Info, Server, Globe, Volume2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const SYSTEM_INFO = {
  version: "1.0.0",
  environment: process.env.NODE_ENV || "development",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
};

export default function ConfiguracionPage() {
  const { t, mounted, locale, setLocale } = useI18n();
  const { theme, setTheme } = useTheme();
  const [notifSettings, setNotifSettings] = useState({
    email: true,
    push: false,
    sound: true,
  });

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {t("nav.configuracion")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("configuracionPage.subtitle")}
        </p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Cog className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>{t("configuracionPage.appearance")}</CardTitle>
              <CardDescription>{t("configuracionPage.appearanceDesc")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              {theme === "dark" ? (
                <Moon className="h-4 w-4 text-primary" />
              ) : (
                <Sun className="h-4 w-4 text-primary" />
              )}
              {t("profile.theme")}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:w-72">
              {(["light", "dark"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTheme(mode)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
                    theme === mode
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  {mode === "light" ? (
                    <Sun className="h-6 w-6" />
                  ) : (
                    <Moon className="h-6 w-6" />
                  )}
                  <span className="text-xs font-medium">
                    {mode === "light" ? t("profile.light") : t("profile.dark")}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Language */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Globe className="h-4 w-4 text-primary" />
              {t("profile.language")}
            </div>
            <div className="flex flex-wrap gap-2">
              {(["es", "en", "pt"] as const).map((code) => {
                const flag = code === "es" ? "🇪🇸" : code === "en" ? "🇺🇸" : "🇧🇷";
                return (
                  <button
                    key={code}
                    onClick={() => setLocale(code)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all",
                      locale === code
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <span className="text-lg">{flag}</span>
                    {t(`language.${code}`)}
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>{t("configuracionPage.notifications")}</CardTitle>
              <CardDescription>{t("configuracionPage.notificationsDesc")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "email", icon: Mail, label: "configuracionPage.emailNotif" },
            { key: "push", icon: Bell, label: "configuracionPage.pushNotif" },
            { key: "sound", icon: Volume2, label: "configuracionPage.soundEnabled" },
          ].map(({ key, icon: Icon, label }) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-muted p-1.5">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {t(label)}
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={notifSettings[key as keyof typeof notifSettings]}
                onClick={() =>
                  setNotifSettings((prev) => ({
                    ...prev,
                    [key]: !prev[key as keyof typeof notifSettings],
                  }))
                }
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  notifSettings[key as keyof typeof notifSettings]
                    ? "bg-primary"
                    : "bg-input",
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-sm ring-0 transition-transform",
                    notifSettings[key as keyof typeof notifSettings]
                      ? "translate-x-5"
                      : "translate-x-0",
                  )}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Server className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>{t("configuracionPage.systemInfo")}</CardTitle>
              <CardDescription>{t("configuracionPage.systemInfoDesc")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border rounded-lg border border-border">
            {[
              { label: "configuracionPage.version", value: SYSTEM_INFO.version, icon: Info },
              { label: "configuracionPage.environment", value: SYSTEM_INFO.environment, icon: Cog },
              { label: "configuracionPage.apiUrl", value: SYSTEM_INFO.apiUrl, icon: Server },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {t(label)}
                  </span>
                </div>
                <Badge variant="secondary" className="font-mono text-[11px]">
                  {value}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
