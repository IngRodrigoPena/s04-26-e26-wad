"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/providers/i18n-provider";
import { areasApi, type AreaResponseDTO } from "@/api/areas";
import { Building2, MapPin, AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const AREA_COLORS: Record<string, string> = {
  PRODUCTION: "text-chart-1",
  CONTABILITY: "text-chart-2",
  RRHH: "text-chart-3",
  LOGISTICS: "text-chart-4",
  QUALITY: "text-chart-5",
  MAINTENANCE: "text-chart-6",
  IT: "text-primary",
  SECURITY: "text-destructive",
  WAREHOUSE: "text-chart-3",
  SALES: "text-chart-4",
};

function getAreaColor(name: string): string {
  const upper = name.toUpperCase();
  return AREA_COLORS[upper] || "text-muted-foreground";
}

function getAreaBg(name: string): string {
  const upper = name.toUpperCase();
  const colorMap: Record<string, string> = {
    PRODUCTION: "bg-chart-1/10",
    CONTABILITY: "bg-chart-2/10",
    RRHH: "bg-chart-3/10",
    LOGISTICS: "bg-chart-4/10",
    QUALITY: "bg-chart-5/10",
    MAINTENANCE: "bg-chart-6/10",
    IT: "bg-primary/10",
    SECURITY: "bg-destructive/10",
    WAREHOUSE: "bg-chart-3/10",
    SALES: "bg-chart-4/10",
  };
  return colorMap[upper] || "bg-muted";
}

function getBadgeColor(name: string): string {
  const upper = name.toUpperCase();
  const map: Record<string, string> = {
    PRODUCTION: "border-chart-1/30 text-chart-1",
    CONTABILITY: "border-chart-2/30 text-chart-2",
    RRHH: "border-chart-3/30 text-chart-3",
    LOGISTICS: "border-chart-4/30 text-chart-4",
    IT: "border-primary/30 text-primary",
    SECURITY: "border-destructive/30 text-destructive",
  };
  return map[upper] || "border-border text-muted-foreground";
}

export default function AreasPage() {
  const { t, mounted } = useI18n();
  const [areas, setAreas] = useState<AreaResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAreas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await areasApi.getAll();
      setAreas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar áreas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("nav.areas") || "Áreas"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("areasPage.subtitle") || "Áreas operativas del sistema"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAreas} disabled={loading}>
          <RefreshCw className={cn("mr-1.5 h-4 w-4", loading && "animate-spin")} />
          {t("reports.refresh") || "Actualizar"}
        </Button>
      </div>

      {/* Error banner */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
            <p className="flex-1 text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchAreas}>
              Reintentar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Area Cards */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-5 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="mt-4 h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : areas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-muted-foreground">
            <Building2 className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm">{t("areasPage.noAreas") || "No hay áreas registradas"}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {areas.map((area) => (
            <Card
              key={area.id}
              className="transition-colors hover:border-primary/50"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("rounded-lg p-2.5", getAreaBg(area.name))}>
                      <Building2 className={cn("h-5 w-5", getAreaColor(area.name))} />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {area.name}
                      </CardTitle>
                      {area.color && (
                        <Badge variant="outline" className={cn("mt-0.5 text-[10px] font-mono", getBadgeColor(area.name))}>
                          {area.color}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    {area.incidentCount}
                  </Badge>
                </div>
                <CardDescription className="mt-3 text-sm">
                  {area.description || (
                    <span className="italic text-muted-foreground/60">
                      {t("areasPage.noDescription") || "Sin descripción"}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>
                    {area.incidentCount === 1
                      ? (t("areasPage.oneIncident") || "1 incidente")
                      : (t("areasPage.nIncidents", { count: area.incidentCount }) || `${area.incidentCount} incidentes`)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
