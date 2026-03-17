import { useState } from "react";
import { Save, UserCircle, Bell, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "activo" | "inactivo";
}

const initialTeam: TeamMember[] = [
  {
    id: 1,
    name: "Valentina Ospina",
    email: "v.ospina@cafequindio.com",
    role: "Gestora de Talento",
    status: "activo",
  },
  {
    id: 2,
    name: "Juan Camilo Ríos",
    email: "jc.rios@cafequindio.com",
    role: "Coordinador RRHH",
    status: "activo",
  },
  {
    id: 3,
    name: "Andrés Felipe Giraldo",
    email: "af.giraldo@cafequindio.com",
    role: "Analista de Talento",
    status: "activo",
  },
  {
    id: 4,
    name: "Marcela Herrera",
    email: "m.herrera@cafequindio.com",
    role: "Auxiliar RRHH",
    status: "inactivo",
  },
];

interface NotificationSettings {
  nuevasAplicaciones: boolean;
  decisionesIA: boolean;
  alertasSistema: boolean;
  reportesSemanal: boolean;
}

interface ProfileData {
  name: string;
  email: string;
  role: string;
}

export default function AdminConfiguracion() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData>({
    name: "Valentina Ospina",
    email: "v.ospina@cafequindio.com",
    role: "Gestora de Talento",
  });
  const [notifications, setNotifications] = useState<NotificationSettings>({
    nuevasAplicaciones: true,
    decisionesIA: true,
    alertasSistema: true,
    reportesSemanal: false,
  });
  const [team] = useState<TeamMember[]>(initialTeam);

  const saveProfile = () => {
    toast({
      title: "Perfil guardado",
      description: "Tu información de perfil fue actualizada.",
    });
  };

  const saveNotifications = () => {
    toast({
      title: "Notificaciones guardadas",
      description: "Tu configuración de notificaciones fue actualizada.",
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Configuración</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona tu perfil, notificaciones y equipo
          </p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-primary" />
              <CardTitle className="text-base font-heading">
                Perfil de usuario
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 pb-4">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white font-heading font-bold text-lg shrink-0">
                VO
              </div>
              <div>
                <p className="font-medium">{profile.name}</p>
                <p className="text-sm text-muted-foreground">{profile.role}</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="role">Cargo</Label>
                <Input
                  id="role"
                  value={profile.role}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, role: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button size="sm" onClick={saveProfile}>
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Guardar perfil
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <CardTitle className="text-base font-heading">
                Notificaciones
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {(
              [
                {
                  key: "nuevasAplicaciones",
                  label: "Nuevas aplicaciones",
                  description:
                    "Recibir alerta cuando un candidato aplique a una vacante activa",
                },
                {
                  key: "decisionesIA",
                  label: "Decisiones de IA",
                  description:
                    "Notificación cuando el motor procese nuevos candidatos",
                },
                {
                  key: "alertasSistema",
                  label: "Alertas del sistema",
                  description:
                    "Actualizaciones importantes sobre el funcionamiento del portal",
                },
                {
                  key: "reportesSemanal",
                  label: "Reporte semanal",
                  description:
                    "Resumen automático de actividad cada lunes",
                },
              ] as const
            ).map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-1"
              >
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <Switch
                  checked={notifications[item.key]}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({
                      ...prev,
                      [item.key]: checked,
                    }))
                  }
                />
              </div>
            ))}
            <div className="flex justify-end pt-2">
              <Button size="sm" onClick={saveNotifications}>
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Guardar notificaciones
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Team Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <CardTitle className="text-base font-heading">
                  Equipo de Gestión Humana
                </CardTitle>
              </div>
              <Button size="sm" variant="outline">
                Invitar miembro
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="hidden sm:table-cell">Cargo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-semibold shrink-0">
                          {member.name
                            .split(" ")
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {member.role}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          member.status === "activo"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }
                      >
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7"
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        Permisos
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
