"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  MapPin,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { Incident, useI18nStore } from "@/lib/store";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface IncidentDetailsDialogProps {
  incident: Incident;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IncidentDetailsDialog({
  incident,
  open,
  onOpenChange,
}: IncidentDetailsDialogProps) {
  const { language } = useI18nStore();
  const t = useTranslation(language);

  const priorityConfig = {
    baja: { color: "bg-blue-500", label: t.incidents.priority.baja },
    media: { color: "bg-yellow-500", label: t.incidents.priority.media },
    alta: { color: "bg-orange-500", label: t.incidents.priority.alta },
    critica: { color: "bg-red-500", label: t.incidents.priority.critica },
  };

  const statusConfig = {
    abierto: { color: "text-red-500", label: t.incidents.status.abierto },
    en_proceso: { color: "text-yellow-500", label: t.incidents.status.en_proceso },
    cerrado: { color: "text-green-500", label: t.incidents.status.cerrado },
  };

  const priority = priorityConfig[incident.prioridad];
  const status = statusConfig[incident.estado];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl">{incident.titulo}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="font-mono">
                  {incident.id}
                </Badge>
                <Badge className={cn("text-white", priority.color)}>
                  {priority.label}
                </Badge>
                <Badge variant="outline" className={status.color}>
                  {status.label}
                </Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {t.incidents.fields.descripcion}
            </h3>
            <p className="text-sm">{incident.descripcion}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <AlertTriangle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t.incidents.fields.tipo}</p>
                <p className="text-sm font-medium">{t.incidents.type[incident.tipo]}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <MapPin className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t.incidents.fields.area}</p>
                <p className="text-sm font-medium">{t.incidents.area[incident.area]}</p>
              </div>
            </div>

            {incident.ubicacion && (
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <MapPin className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t.incidents.fields.ubicacion}</p>
                  <p className="text-sm font-medium">{incident.ubicacion}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <User className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t.incidents.fields.reportadoPor}</p>
                <p className="text-sm font-medium">{incident.reportadoPorNombre}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Calendar className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t.incidents.fields.fechaCreacion}</p>
                <p className="text-sm font-medium">
                  {new Date(incident.fechaCreacion).toLocaleString(language)}
                </p>
              </div>
            </div>

            {incident.asignadoANombre && (
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <User className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t.incidents.fields.asignadoA}</p>
                  <p className="text-sm font-medium">{incident.asignadoANombre}</p>
                </div>
              </div>
            )}

            {incident.fechaAsignacion && (
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <Calendar className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Fecha de Asignación</p>
                  <p className="text-sm font-medium">
                    {new Date(incident.fechaAsignacion).toLocaleString(language)}
                  </p>
                </div>
              </div>
            )}

            {incident.fechaCierre && (
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t.incidents.fields.fechaCierre}</p>
                  <p className="text-sm font-medium">
                    {new Date(incident.fechaCierre).toLocaleString(language)}
                  </p>
                </div>
              </div>
            )}

            {incident.tiempoResolucion && (
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10">
                  <Clock className="w-5 h-5 text-cyan-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t.incidents.fields.tiempoResolucion}</p>
                  <p className="text-sm font-medium text-cyan-500">
                    {Math.floor(incident.tiempoResolucion / 60)}h {incident.tiempoResolucion % 60}m
                  </p>
                </div>
              </div>
            )}
          </div>

          {incident.solucion && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <h3 className="text-sm font-medium">{t.incidents.fields.solucion}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{incident.solucion}</p>
              </div>
            </>
          )}

          {incident.causaRaiz && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-medium">{t.incidents.fields.causaRaiz}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{incident.causaRaiz}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
