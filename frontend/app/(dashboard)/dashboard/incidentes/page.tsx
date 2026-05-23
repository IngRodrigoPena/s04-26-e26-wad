"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/providers/i18n-provider";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { useIncidentsStore } from "@/features/incidents/stores/incidents-store";
import { Priority, IncidentType, priorityConfig } from "@/api/incidents/types";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { extractApiError } from "@/lib/api-errors";
import {
  Select,
  SelectTrigger,
  SelectPopup,
  SelectList,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
} from "@/components/ui/select";
import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetContent,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TYPE_OPTIONS = Object.values(IncidentType);
const PRIORITY_OPTIONS = Object.values(Priority);

const AREA_OPTIONS = [
  { id: 1, name: "PRODUCTION" },
  { id: 2, name: "CONTABILITY" },
  { id: 3, name: "RRHH" },
  { id: 4, name: "IT" },
  { id: 5, name: "LOGISTICS" },
];

interface FormState {
  title: string;
  description: string;
  type: IncidentType;
  priority: Priority;
  areaId: number | null;
}

const initialForm: FormState = {
  title: "",
  description: "",
  type: IncidentType.OTHER,
  priority: Priority.MEDIUM,
  areaId: null,
};

export default function IncidentsPage() {
  const { t, mounted } = useI18n();
  const { user } = useAuthStore();
  const {
    incidents,
    loading,
    fetchIncidents,
    createIncident,
  } = useIncidentsStore();
  const [activeTab, setActiveTab] = useState("todos");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const stats = incidents.reduce(
    (acc, inc) => {
      acc.total++;
      if (inc.status === "OPEN") acc.open++;
      if (inc.status === "IN_PROGRESS") acc.inProgress++;
      if (inc.status === "RESOLVED" || inc.status === "CLOSED") acc.closed++;
      return acc;
    },
    { total: 0, open: 0, inProgress: 0, closed: 0 },
  );

  const getFilteredIncidents = () => {
    switch (activeTab) {
      case "abiertos":
        return incidents.filter((i) => i.status === "OPEN");
      case "en_proceso":
        return incidents.filter((i) => i.status === "IN_PROGRESS");
      case "cerrados":
        return incidents.filter(
          (i) => i.status === "RESOLVED" || i.status === "CLOSED",
        );
      case "mis_incidentes":
        return incidents.filter(
          (i) =>
            i.reportedById === user?.id || i.assignedToId === user?.id,
        );
      default:
        return incidents;
    }
  };

  const filtered = getFilteredIncidents();

  const handleOpenSheet = () => {
    setForm(initialForm);
    setError(null);
    setSheetOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await createIncident({
        title: form.title.trim(),
        description: form.description.trim(),
        type: form.type,
        priority: form.priority,
        areaId: form.areaId || undefined,
        isFalseAlarm: false,
        reportedById: user?.id,
      });
      setSheetOpen(false);
    } catch (err: unknown) {
      setError(extractApiError(err, "Error al crear incidente"));
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("nav.incidentes")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("dashboard.incidentsTotal")}: {stats.total}
          </p>
        </div>
        <Button onClick={handleOpenSheet}>
          <Plus className="mr-1.5 h-4 w-4" />
          {t("dashboard.createIncident")}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            key: "total",
            label: "dashboard.incidentsTotal",
            value: stats.total,
            icon: BarChart3,
            color: "text-primary",
            border: "border-l-primary",
          },
          {
            key: "open",
            label: "dashboard.incidentsOpen",
            value: stats.open,
            icon: AlertTriangle,
            color: "text-destructive",
            border: "border-l-destructive",
          },
          {
            key: "inProgress",
            label: "dashboard.incidentsInProgress",
            value: stats.inProgress,
            icon: Clock,
            color: "text-chart-3",
            border: "border-l-chart-3",
          },
          {
            key: "closed",
            label: "dashboard.incidentsResolved",
            value: stats.closed,
            icon: CheckCircle2,
            color: "text-emerald-500",
            border: "border-l-emerald-500",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.key} className={cn("border-l-4", stat.border)}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t(stat.label)}
                  </p>
                  {loading ? (
                    <Skeleton className="mt-1 h-7 w-12" />
                  ) : (
                    <p className="text-2xl font-bold text-card-foreground">
                      {stat.value}
                    </p>
                  )}
                </div>
                <div className={cn("rounded-lg p-2.5", `${stat.color.replace("text-", "bg-")}/10`)}>
                  <Icon className={cn("h-5 w-5", stat.color)} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs + List */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as string)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="todos">{t("incidents.tabs.all")}</TabsTrigger>
          <TabsTrigger value="abiertos">
            {t("incidents.tabs.open")}
            {stats.open > 0 && (
              <Badge variant="destructive" className="ml-1.5">
                {stats.open}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="en_proceso">
            {t("incidents.tabs.inProgress")}
            {stats.inProgress > 0 && (
              <Badge variant="secondary" className="ml-1.5">
                {stats.inProgress}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="cerrados">{t("incidents.tabs.closed")}</TabsTrigger>
          <TabsTrigger value="mis_incidentes">{t("incidents.tabs.myIncidents")}</TabsTrigger>
        </TabsList>

        {(["todos", "abiertos", "en_proceso", "cerrados", "mis_incidentes"] as const).map((tab) => (
          <TabsContent key={tab} value={tab}>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center py-12 text-muted-foreground">
                  <AlertCircle className="mb-3 h-10 w-10 opacity-40" />
                  <p className="text-sm">{t("dashboard.noIncidents")}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filtered.map((incident) => {
                  const StatusIcon = getStatusIcon(incident.status);
                  const statusStyle = getStatusStyle(incident.status);
                  return (
                    <Card key={incident.id} className="transition-colors hover:border-primary/50">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={cn("rounded-lg p-2", statusStyle.bg)}>
                            <StatusIcon
                              className={cn("h-4 w-4", statusStyle.text)}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-card-foreground">
                              {incident.title}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {incident.areaName || getTypeShort(t, incident.type)}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="text-[10px] font-medium"
                              >
                                {incident.priority}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground">
                                {new Date(incident.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* ─── Sheet: Create Incident ─── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetHeader>
          <SheetTitle>{t("incidents.form.sheetTitle")}</SheetTitle>
          <SheetClose />
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <SheetContent>
            {error && (
              <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="incident-title">{t("incidents.form.title")}</Label>
                <Input
                  id="incident-title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  required
                  minLength={5}
                  maxLength={100}
                  placeholder={t("incidents.form.titlePlaceholder")}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="incident-desc">{t("incidents.form.description")}</Label>
                <Textarea
                  id="incident-desc"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                  minLength={10}
                  maxLength={500}
                  placeholder={t("incidents.form.descriptionPlaceholder")}
                  rows={4}
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label>{t("incidents.form.type")}</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) =>
                    setForm({ ...form, type: v as IncidentType })
                  }
                >
                  <SelectTrigger>
                    {t(`incidents.type.${form.type}`)}
                  </SelectTrigger>
                  <SelectPopup>
                    <SelectList>
                      {TYPE_OPTIONS.map((type) => (
                        <SelectItem key={type} value={type}>
                          <SelectItemIndicator />
                          <SelectItemText>
                            {t(`incidents.type.${type}`)}
                          </SelectItemText>
                        </SelectItem>
                      ))}
                    </SelectList>
                  </SelectPopup>
                </Select>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label>{t("incidents.form.priority")}</Label>
                <Select
                  value={form.priority}
                  onValueChange={(v) =>
                    setForm({ ...form, priority: v as Priority })
                  }
                >
                  <SelectTrigger>
                    {priorityConfig[form.priority]?.label}
                  </SelectTrigger>
                  <SelectPopup>
                    <SelectList>
                      {PRIORITY_OPTIONS.map((pri) => {
                        const cfg = priorityConfig[pri];
                        return (
                          <SelectItem key={pri} value={pri}>
                            <SelectItemIndicator />
                            <SelectItemText>
                              <span className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "inline-block h-2 w-2 rounded-full",
                                    cfg.color,
                                  )}
                                />
                                {cfg.label}
                              </span>
                            </SelectItemText>
                          </SelectItem>
                        );
                      })}
                    </SelectList>
                  </SelectPopup>
                </Select>
              </div>

              {/* Area */}
              <div className="space-y-2">
                <Label>{t("incidents.form.area")}</Label>
                <Select
                  value={form.areaId ? String(form.areaId) : ""}
                  onValueChange={(v) =>
                    setForm({
                      ...form,
                      areaId: v ? Number(v) : null,
                    })
                  }
                >
                  <SelectTrigger>
                    {form.areaId
                      ? AREA_OPTIONS.find((o) => o.id === form.areaId)?.name ?? ""
                      : t("incidents.form.selectArea")}
                  </SelectTrigger>
                  <SelectPopup>
                    <SelectList>
                      <SelectItem value="">
                        <SelectItemIndicator />
                        <SelectItemText>{t("incidents.form.selectArea")}</SelectItemText>
                      </SelectItem>
                      {AREA_OPTIONS.map((opt) => (
                        <SelectItem key={opt.id} value={String(opt.id)}>
                          <SelectItemIndicator />
                          <SelectItemText>{opt.name}</SelectItemText>
                        </SelectItem>
                      ))}
                    </SelectList>
                  </SelectPopup>
                </Select>
              </div>
            </div>
          </SheetContent>

          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSheetOpen(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Plus className="mr-1.5 h-4 w-4" />
              )}
              {t("incidents.form.submit")}
            </Button>
          </SheetFooter>
        </form>
      </Sheet>
    </div>
  );
}

function getStatusIcon(status: string) {
  switch (status) {
    case "OPEN":
      return AlertTriangle;
    case "IN_PROGRESS":
      return Clock;
    case "RESOLVED":
    case "CLOSED":
      return CheckCircle2;
    default:
      return AlertTriangle;
  }
}

function getStatusStyle(status: string): { bg: string; text: string } {
  switch (status) {
    case "OPEN":
      return { bg: "bg-destructive/10", text: "text-destructive" };
    case "IN_PROGRESS":
      return { bg: "bg-chart-3/10", text: "text-chart-3" };
    case "RESOLVED":
    case "CLOSED":
      return { bg: "bg-emerald-500/10", text: "text-emerald-500" };
    default:
      return { bg: "bg-muted", text: "text-muted-foreground" };
  }
}

function getTypeShort(t: (key: string) => string, type: string): string {
  const key = `incidents.type.${type}`;
  const label = t(key);
  return label !== key ? label : type;
}
