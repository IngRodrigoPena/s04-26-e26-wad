"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/providers/i18n-provider";
import { getRoleLabel, getRoleColor, Role } from "@/lib/rbac";
import { usersApi } from "@/api/user";
import type { UserResponseDTO, CreateUserRequestDTO } from "@/api/types";
import Link from "next/link";
import { Shield, Mail, AlertCircle, Plus, UserPlus, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { extractApiError } from "@/lib/api-errors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const ROLE_OPTIONS: { id: number; name: Role }[] = [
  { id: 1, name: Role.ADMIN },
  { id: 2, name: Role.MANAGER },
  { id: 3, name: Role.SUPERVISOR },
  { id: 4, name: Role.TECHNICIAN },
  { id: 5, name: Role.OPERATOR },
];

const AREA_OPTIONS = [
  { id: 1, name: "PRODUCTION" },
  { id: 2, name: "CONTABILITY" },
  { id: 3, name: "RRHH" },
  { id: 4, name: "IT" },
  { id: 5, name: "LOGISTICS" },
];

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
  areaId: number | null;
}

const initialForm: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  roleId: 4, // default: TECHNICIAN
  areaId: null,
};

export default function UsuariosPage() {
  const { t, mounted } = useI18n();
  const [users, setUsers] = useState<UserResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    usersApi
      .getAll()
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
      const payload: CreateUserRequestDTO = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        roleId: form.roleId,
        areaId: form.areaId || null,
      };

      await usersApi.create(payload);
      setSheetOpen(false);
      fetchUsers();
    } catch (err: unknown) {
      setError(extractApiError(err, "Error al crear usuario"));
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
            {t("nav.usuarios")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("users.registered", { count: users.length })}
          </p>
        </div>
        <Button onClick={handleOpenSheet}>
          <UserPlus className="mr-1.5 h-4 w-4" />
          Crear Usuario
        </Button>
      </div>

      {/* User list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-muted-foreground">
            <AlertCircle className="mb-3 h-10 w-10 opacity-40" />
            <p className="text-sm">{t("users.noUsers")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {users.map((user) => {
            const role = user.role as Role;
            const colorClass = getRoleColor(role);
            const label = getRoleLabel(role, "es");
            return (
              <Link
                key={user.id}
                href={`/dashboard/usuarios/${user.id}`}
              >
                <Card className="transition-all hover:border-primary/50 hover:shadow-sm cursor-pointer">
                  <CardContent className="flex items-center gap-4 p-4">
                    {/* Avatar gradient */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-primary-foreground">
                      {(user.firstName?.[0] || user.email[0] || "?").toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-card-foreground">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </p>
                    </div>

                    {/* Role + Status */}
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn("text-xs font-medium", colorClass)}
                      >
                        <Shield className="mr-1 h-3 w-3" />
                        {label}
                      </Badge>
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full",
                          user.active ? "bg-emerald-500" : "bg-muted-foreground/40",
                        )}
                        title={user.active ? t("users.active") : t("users.inactive")}
                      />
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/40" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* ─── Sheet: Create User ─── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetHeader>
          <SheetTitle>Crear Usuario</SheetTitle>
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
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName">{t("profile.firstName")}</Label>
                <Input
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  required
                  placeholder="Ej: Juan"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName">{t("profile.lastName")}</Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  required
                  placeholder="Ej: Pérez"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">{t("profile.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  required
                  placeholder="ej: juan@ejemplo.com"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  minLength={4}
                  placeholder="••••••••"
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label>Rol</Label>
                <Select
                  value={String(form.roleId)}
                  onValueChange={(v) =>
                    setForm({ ...form, roleId: Number(v) })
                  }
                >
                  <SelectTrigger>
                    {getRoleLabel(
                      ROLE_OPTIONS.find((o) => o.id === form.roleId)?.name ?? Role.TECHNICIAN,
                      "es",
                    )}
                  </SelectTrigger>
                  <SelectPopup>
                    <SelectList>
                      {ROLE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.id} value={String(opt.id)}>
                          <SelectItemIndicator />
                          <SelectItemText>
                            {getRoleLabel(opt.name, "es")}
                          </SelectItemText>
                        </SelectItem>
                      ))}
                    </SelectList>
                  </SelectPopup>
                </Select>
              </div>

              {/* Area */}
              <div className="space-y-2">
                <Label>Área</Label>
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
                      ? AREA_OPTIONS.find((o) => o.id === form.areaId)?.name ?? "Sin área"
                      : "Sin área"}
                  </SelectTrigger>
                  <SelectPopup>
                    <SelectList>
                      <SelectItem value="">
                        <SelectItemIndicator />
                        <SelectItemText>Sin área</SelectItemText>
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
              Crear
            </Button>
          </SheetFooter>
        </form>
      </Sheet>
    </div>
  );
}
