"use client";

import { useEffect } from "react";
import { useI18n } from "@/components/providers/i18n-provider";
import { useIncidentsStore } from "@/features/incidents/stores/incidents-store";
import { AlertTriangle, UserCheck, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function AsignacionesPage() {
  const { t, mounted } = useI18n();
  const { incidents, loading, fetchIncidents } = useIncidentsStore();

  useEffect(() => {
    fetchIncidents();
  }, []);

  // Incidents that need assignment: OPEN or ASSIGNED status
  const pending = incidents.filter(
    (i) => i.status === "OPEN" || i.status === "ASSIGNED",
  );
  const inProgress = incidents.filter((i) => i.status === "IN_PROGRESS");

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {t("nav.asignaciones")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("assignments.pendingLabel", { count: pending.length })}
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : pending.length === 0 && inProgress.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-muted-foreground">
            <CheckCircle2 className="mb-3 h-10 w-10 text-emerald-500/60" />
            <p className="text-sm">{t("assignments.noPending")}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Pending assignments */}
          {pending.length > 0 && (
            <div className="space-y-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                {t("assignments.pendingTitle")}
                <Badge variant="destructive" className="ml-auto">
                  {pending.length}
                </Badge>
              </h2>
              {pending.map((incident) => (
                <Card
                  key={incident.id}
                  className="border-l-4 border-l-destructive transition-colors hover:border-l-destructive/80"
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="rounded-lg bg-destructive/10 p-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-card-foreground">
                        {incident.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {incident.areaName || t("assignments.noArea")} ·{" "}
                        {new Date(incident.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {incident.priority}
                      </Badge>
                          <Button size="sm" variant="default">
                            <UserCheck className="mr-1 h-3.5 w-3.5" />
                            {t("assignments.assign")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* In progress */}
          {inProgress.length > 0 && (
            <div className="space-y-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Clock className="h-4 w-4 text-chart-3" />
                {t("assignments.inProgress")}
                <Badge variant="secondary" className="ml-auto">
                  {inProgress.length}
                </Badge>
              </h2>
              {inProgress.map((incident) => {
                const StatusIcon = incident.status === "IN_PROGRESS" ? Clock : CheckCircle2;
                return (
                  <Card
                    key={incident.id}
                    className="border-l-4 border-l-chart-3 transition-colors hover:border-l-chart-3/80"
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="rounded-lg bg-chart-3/10 p-2">
                        <StatusIcon className="h-4 w-4 text-chart-3" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-card-foreground">
                          {incident.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {incident.assignedToName
                        ? t("assignments.assignedTo", { name: incident.assignedToName })
                        : t("assignments.noAssignee")}{" "}
                          · {new Date(incident.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {incident.priority}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
