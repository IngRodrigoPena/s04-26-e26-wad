"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import { useIncidentsStore, useAuthStore, useI18nStore, useCatalogsStore } from "@/lib/stores";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { language } = useI18nStore();
  const t = useTranslation(language);
  const { incidents, getIncidentStats } = useIncidentsStore();
  const { statuses, priorities, types, areas } = useCatalogsStore();

  const stats = getIncidentStats();
  const recentIncidents = incidents.slice(-5).reverse();
  
  const getStatusName = (statusId: string) => {
    const status = statuses.find(s => s.id === statusId);
    return status?.name || statusId;
  };
  
  const getPriorityName = (priorityId: string) => {
    const priority = priorities.find(p => p.id === priorityId);
    return priority?.name || priorityId;
  };
  
  const getTypeName = (typeId: string) => {
    const type = types.find(t => t.id === typeId);
    return type?.name || typeId;
  };
  
  const getAreaName = (areaId: string) => {
    const area = areas.find(a => a.id === areaId);
    return area?.name || areaId;
  };
  
  const statusOpen = statuses.find(s => s.name === "Abierto")?.id || "status-001";
  const statusInProgress = statuses.find(s => s.name === "En Proceso")?.id || "status-002";
  const statusClosed = statuses.find(s => s.name === "Cerrado")?.id || "status-003";
  
  const openCount = stats.byStatus[statusOpen] || 0;
  const inProgressCount = stats.byStatus[statusInProgress] || 0;
  const closedCount = stats.byStatus[statusClosed] || 0;

  const dashboardStats = [
    {
      title: t.incidents.stats.total,
      value: stats.total.toString(),
      change: "+12.5%",
      trend: "up",
      icon: BarChart3,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: t.incidents.stats.open,
      value: openCount.toString(),
      change: openCount > 0 ? "Requiere atención" : "Todo bien",
      trend: openCount > 0 ? "down" : "up",
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: t.incidents.stats.inProgress,
      value: inProgressCount.toString(),
      change: "En resolución",
      trend: "up",
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: t.incidents.stats.closed,
      value: closedCount.toString(),
      change: `${stats.total > 0 ? ((closedCount / stats.total) * 100).toFixed(1) : 0}% resueltos`,
      trend: "up",
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-purple-500 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Bienvenido, {user?.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/incidentes">
            <Button>
              <AlertTriangle className="w-4 h-4 mr-2" />
              {t.incidents.newIncident}
            </Button>
          </Link>
          <Link href="/dashboard/canvas">
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              {t.incidents.analytics}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              {stat.trend === "up" ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-500" />
              )}
              <span className="text-sm text-muted-foreground">
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold">Incidentes Recientes</h2>
            <Link href="/dashboard/incidentes">
              <Button variant="ghost" size="sm">
                Ver todos
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentIncidents.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay incidentes registrados</p>
              </div>
            ) : (
              recentIncidents.map((incident, index) => (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`p-2 rounded-lg ${
                        incident.id_status === statusOpen
                          ? "bg-red-500/10"
                          : incident.id_status === statusInProgress
                          ? "bg-yellow-500/10"
                          : "bg-green-500/10"
                      }`}
                    >
                      {incident.id_status === statusOpen ? (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      ) : incident.id_status === statusInProgress ? (
                        <Clock className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{incident.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {getTypeName(incident.id_type)} - {getAreaName(incident.id_area)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {getPriorityName(incident.id_priority)}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(incident.opening_date).toLocaleDateString(language)}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold">Resumen por Área</h2>
          </div>
          <div className="p-6 space-y-4">
            {Object.entries(stats.byArea).map(([areaId, count], index) => (
              <motion.div
                key={areaId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {getAreaName(areaId)}
                  </span>
                  <span className="text-muted-foreground">
                    {count} ({stats.total > 0 ? ((count / stats.total) * 100).toFixed(0) : 0}%)
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%`,
                    }}
                    transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {stats.avgResolutionTime > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-primary/10 via-accent/10 to-purple-500/10 border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {t.incidents.stats.avgResolutionTime}
              </h3>
              <p className="text-3xl font-bold text-primary">
                {Math.floor(stats.avgResolutionTime / 60)}h{" "}
                {Math.floor(stats.avgResolutionTime % 60)}m
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Basado en {closedCount} incidentes cerrados
              </p>
            </div>
            <TrendingUp className="w-16 h-16 text-primary opacity-20" />
          </div>
        </motion.div>
      )}
    </div>
  );
}