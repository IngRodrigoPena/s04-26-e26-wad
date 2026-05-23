"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { BarChart3, TrendingUp, PieChart, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CanvasPage() {
  const { t, mounted } = useI18n();

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {t("nav.reportes")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("dashboard.description")}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.incidentsTotal")}
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-center justify-center rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">{t("reports.comingSoon")}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.incidentsOpen")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-center justify-center rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">{t("reports.comingSoon")}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.incidentsInProgress")}
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-center justify-center rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">{t("reports.comingSoon")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            {t("reports.distribution")}
          </CardTitle>
          <CardDescription>
            {t("reports.dataComingSoon")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">
                {t("reports.phase2")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
