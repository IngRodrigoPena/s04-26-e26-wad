"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIncidentStore, useI18nStore } from "@/lib/store";
import { useTranslation } from "@/lib/i18n";
import { StatusChart } from "@/components/canvas/status-chart";
import { PriorityChart } from "@/components/canvas/priority-chart";
import { TypeChart } from "@/components/canvas/type-chart";
import { TimelineChart } from "@/components/canvas/timeline-chart";
import { HeatmapChart } from "@/components/canvas/heatmap-chart";

export default function CanvasPage() {
  const containerRef = useRef(null);
  const { language } = useI18nStore();
  const t = useTranslation(language);
  const { incidents, getIncidentStats } = useIncidentStore();
  const [activeView, setActiveView] = useState("status");

  const stats = getIncidentStats();

  useGSAP(
    () => {
      gsap.from(".chart-card", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });

      gsap.from(".stat-badge", {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
        delay: 0.3,
      });
    },
    { scope: containerRef }
  );

  const handleExport = () => {
    const dataStr = JSON.stringify(incidents, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `incidentes-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-purple-500 bg-clip-text text-transparent">
            Canvas de Análisis
          </h1>
          <p className="text-muted-foreground mt-1">
            Visualizaciones interactivas de incidentes
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          className="stat-badge"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="stat-badge"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-500">{stats.abiertos}</div>
              <p className="text-xs text-muted-foreground">Abiertos</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="stat-badge"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-500">{stats.enProceso}</div>
              <p className="text-xs text-muted-foreground">En Proceso</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="stat-badge"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-500">{stats.cerrados}</div>
              <p className="text-xs text-muted-foreground">Cerrados</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="status">
            <BarChart3 className="w-4 h-4 mr-2" />
            Estado
          </TabsTrigger>
          <TabsTrigger value="priority">
            <TrendingUp className="w-4 h-4 mr-2" />
            Prioridad
          </TabsTrigger>
          <TabsTrigger value="type">
            <PieChart className="w-4 h-4 mr-2" />
            Tipo
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="heatmap">
            <Filter className="w-4 h-4 mr-2" />
            Heatmap
          </TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="chart-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Distribución por Estado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StatusChart stats={stats} />
              </CardContent>
            </Card>

            <Card className="chart-card">
              <CardHeader>
                <CardTitle>Métricas de Estado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tasa de Apertura</span>
                    <span className="text-sm font-medium">
                      {stats.total > 0 ? ((stats.abiertos / stats.total) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-red-500"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${stats.total > 0 ? (stats.abiertos / stats.total) * 100 : 0}%`,
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tasa en Proceso</span>
                    <span className="text-sm font-medium">
                      {stats.total > 0 ? ((stats.enProceso / stats.total) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-yellow-500"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${stats.total > 0 ? (stats.enProceso / stats.total) * 100 : 0}%`,
                      }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tasa de Resolución</span>
                    <span className="text-sm font-medium text-green-500">
                      {stats.total > 0 ? ((stats.cerrados / stats.total) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-green-500"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${stats.total > 0 ? (stats.cerrados / stats.total) * 100 : 0}%`,
                      }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="priority" className="space-y-4">
          <Card className="chart-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Distribución por Prioridad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PriorityChart stats={stats} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="type" className="space-y-4">
          <Card className="chart-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-500" />
                Distribución por Tipo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TypeChart stats={stats} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card className="chart-card">
            <CardHeader>
              <CardTitle>Timeline de Incidentes</CardTitle>
            </CardHeader>
            <CardContent>
              <TimelineChart incidents={incidents} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-4">
          <Card className="chart-card">
            <CardHeader>
              <CardTitle>Heatmap: Área vs Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              <HeatmapChart incidents={incidents} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
