"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  MapPin,
  Calendar,
  Edit,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Incident, useAuthStore, useI18nStore } from "@/lib/store";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { AssignIncidentDialog } from "./assign-incident-dialog";
import { CloseIncidentDialog } from "./close-incident-dialog";
import { IncidentDetailsDialog } from "./incident-details-dialog";

interface IncidentCardProps {
  incident: Incident;
}

export function IncidentCard({ incident }: IncidentCardProps) {
  const { user } = useAuthStore();
  const { language } = useI18nStore();
  const t = useTranslation(language);
  const [showAssign, setShowAssign] = useState(false);
  const [showClose, setShowClose] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const canAssign = user?.role === "supervisor" || user?.role === "gerente";
  const canClose = user?.role === "supervisor" || user?.role === "gerente" || incident.asignadoA === user?.id;

  const statusConfig = {
    abierto: {
      color: "bg-red-500",
      icon: AlertTriangle,
      label: t.incidents.status.abierto,
    },
    en_proceso: {
      color: "bg-yellow-500",
      icon: Clock,
      label: t.incidents.status.en_proceso,
    },
    cerrado: {
      color: "bg-green-500",
      icon: CheckCircle2,
      label: t.incidents.status.cerrado,
    },
  };

  const priorityConfig = {
    baja: { color: "bg-blue-500", label: t.incidents.priority.baja },
    media: { color: "bg-yellow-500", label: t.incidents.priority.media },
    alta: { color: "bg-orange-500", label: t.incidents.priority.alta },
    critica: { color: "bg-red-500", label: t.incidents.priority.critica },
  };

  const status = statusConfig[incident.estado];
  const priority = priorityConfig[incident.prioridad];
  const StatusIcon = status.icon;

  return (
    <>
      <motion.div
        className="incident-card"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={cn("relative overflow-hidden", incident.estado === "abierto" && "border-l-4 border-l-red-500")}>
          <div className={cn("absolute top-0 right-0 w-32 h-32 opacity-10", status.color)} style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />
          
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {incident.id}
                  </Badge>
                  <Badge className={cn("text-white", priority.color)}>
                    {priority.label}
                  </Badge>
                </div>
                <CardTitle className="text-lg truncate">{incident.titulo}</CardTitle>
              </div>
              <div className={cn("p-2 rounded-full", status.color)}>
                <StatusIcon className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {incident.descripcion}
            </p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-primary/10">
                  <AlertTriangle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t.incidents.fields.tipo}</p>
                  <p className="font-medium">{t.incidents.type[incident.tipo]}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-accent/10">
                  <MapPin className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t.incidents.fields.area}</p>
                  <p className="font-medium">{t.incidents.area[incident.area]}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-blue-500/10">
                  <User className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t.incidents.fields.reportadoPor}</p>
                  <p className="font-medium truncate">{incident.reportadoPorNombre}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-purple-500/10">
                  <Calendar className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t.incidents.fields.fechaCreacion}</p>
                  <p className="font-medium">
                    {new Date(incident.fechaCreacion).toLocaleDateString(language)}
                  </p>
                </div>
              </div>
            </div>

            {incident.asignadoANombre && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                <User className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{t.incidents.fields.asignadoA}</p>
                  <p className="text-sm font-medium">{incident.asignadoANombre}</p>
                </div>
              </div>
            )}

            {incident.tiempoResolucion && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10">
                <Clock className="w-4 h-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{t.incidents.fields.tiempoResolucion}</p>
                  <p className="text-sm font-medium text-green-500">
                    {Math.floor(incident.tiempoResolucion / 60)}h {incident.tiempoResolucion % 60}m
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setShowDetails(true)}
              >
                {t.incidents.actions.view}
              </Button>

              {incident.estado === "abierto" && canAssign && (
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={() => setShowAssign(true)}
                >
                  {t.incidents.actions.assign}
                </Button>
              )}

              {incident.estado === "en_proceso" && canClose && (
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 bg-green-500 hover:bg-green-600"
                  onClick={() => setShowClose(true)}
                >
                  {t.incidents.actions.close}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AssignIncidentDialog
        incident={incident}
        open={showAssign}
        onOpenChange={setShowAssign}
      />

      <CloseIncidentDialog
        incident={incident}
        open={showClose}
        onOpenChange={setShowClose}
      />

      <IncidentDetailsDialog
        incident={incident}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
    </>
  );
}
