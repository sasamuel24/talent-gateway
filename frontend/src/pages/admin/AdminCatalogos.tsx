import { Database } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/admin/AdminLayout";
import CatalogManager from "@/components/admin/CatalogManager";
import {
  useCiudades, useCreateCiudad, useUpdateCiudad, useDeleteCiudad,
  useTiposCargo, useCreateTipoCargo, useUpdateTipoCargo, useDeleteTipoCargo,
  useAreasAdmin, useCreateArea, useUpdateArea, useDeleteArea,
  useTiposContrato, useCreateTipoContrato, useUpdateTipoContrato, useDeleteTipoContrato,
} from "@/hooks/useCatalogs";

interface TabConfig {
  value: string;
  label: string;
  description: string;
}

const TABS: TabConfig[] = [
  { value: "ciudades", label: "Ciudades", description: "Ciudades donde Café Quindío tiene operaciones o vacantes disponibles." },
  { value: "tipos-cargo", label: "Tipos de cargo", description: "Clasificación del tipo de rol o cargo (ej: Operativo, Administrativo, Comercial)." },
  { value: "areas", label: "Áreas de trabajo", description: "Áreas o departamentos de la empresa (ej: Producción, Tiendas, Logística)." },
  { value: "tipos-contrato", label: "Tipos de contrato", description: "Modalidades de contratación disponibles para las convocatorias." },
];

export default function AdminCatalogos() {
  // Ciudades
  const ciudades = useCiudades();
  const createCiudad = useCreateCiudad();
  const updateCiudad = useUpdateCiudad();
  const deleteCiudad = useDeleteCiudad();

  // Tipos de cargo
  const tiposCargo = useTiposCargo();
  const createTipoCargo = useCreateTipoCargo();
  const updateTipoCargo = useUpdateTipoCargo();
  const deleteTipoCargo = useDeleteTipoCargo();

  // Áreas
  const areas = useAreasAdmin();
  const createArea = useCreateArea();
  const updateArea = useUpdateArea();
  const deleteArea = useDeleteArea();

  // Tipos de contrato
  const tiposContrato = useTiposContrato();
  const createTipoContrato = useCreateTipoContrato();
  const updateTipoContrato = useUpdateTipoContrato();
  const deleteTipoContrato = useDeleteTipoContrato();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
            <Database className="w-6 h-6 text-primary" />
            Catálogos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona los valores disponibles para ciudades, cargos, áreas y tipos de contrato en las convocatorias.
          </p>
        </div>

        <Tabs defaultValue="ciudades">
          <div className="overflow-x-auto scrollbar-none -mx-1 px-1">
            <TabsList className="w-max sm:w-auto">
              {TABS.map((t) => (
                <TabsTrigger key={t.value} value={t.value} className="text-xs whitespace-nowrap">
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Ciudades */}
          <TabsContent value="ciudades" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-heading">Ciudades</CardTitle>
                <CardDescription className="text-xs">{TABS[0].description}</CardDescription>
              </CardHeader>
              <CardContent>
                <CatalogManager
                  items={ciudades.data}
                  isLoading={ciudades.isLoading}
                  onCreate={(name) => createCiudad.mutateAsync(name)}
                  onUpdate={(id, name, is_active) => updateCiudad.mutateAsync({ id, name, is_active })}
                  onDelete={(id) => deleteCiudad.mutateAsync(id)}
                  isCreating={createCiudad.isPending}
                  isUpdating={updateCiudad.isPending}
                  isDeleting={deleteCiudad.isPending}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tipos de cargo */}
          <TabsContent value="tipos-cargo" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-heading">Tipos de cargo</CardTitle>
                <CardDescription className="text-xs">{TABS[1].description}</CardDescription>
              </CardHeader>
              <CardContent>
                <CatalogManager
                  items={tiposCargo.data}
                  isLoading={tiposCargo.isLoading}
                  onCreate={(name) => createTipoCargo.mutateAsync(name)}
                  onUpdate={(id, name, is_active) => updateTipoCargo.mutateAsync({ id, name, is_active })}
                  onDelete={(id) => deleteTipoCargo.mutateAsync(id)}
                  isCreating={createTipoCargo.isPending}
                  isUpdating={updateTipoCargo.isPending}
                  isDeleting={deleteTipoCargo.isPending}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Áreas */}
          <TabsContent value="areas" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-heading">Áreas de trabajo</CardTitle>
                <CardDescription className="text-xs">{TABS[2].description}</CardDescription>
              </CardHeader>
              <CardContent>
                <CatalogManager
                  items={areas.data}
                  isLoading={areas.isLoading}
                  onCreate={(name) => createArea.mutateAsync(name)}
                  onUpdate={(id, name, is_active) => updateArea.mutateAsync({ id, name, is_active })}
                  onDelete={(id) => deleteArea.mutateAsync(id)}
                  isCreating={createArea.isPending}
                  isUpdating={updateArea.isPending}
                  isDeleting={deleteArea.isPending}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tipos de contrato */}
          <TabsContent value="tipos-contrato" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-heading">Tipos de contrato</CardTitle>
                <CardDescription className="text-xs">{TABS[3].description}</CardDescription>
              </CardHeader>
              <CardContent>
                <CatalogManager
                  items={tiposContrato.data}
                  isLoading={tiposContrato.isLoading}
                  onCreate={(name) => createTipoContrato.mutateAsync(name)}
                  onUpdate={(id, name, is_active) => updateTipoContrato.mutateAsync({ id, name, is_active })}
                  onDelete={(id) => deleteTipoContrato.mutateAsync(id)}
                  isCreating={createTipoContrato.isPending}
                  isUpdating={updateTipoContrato.isPending}
                  isDeleting={deleteTipoContrato.isPending}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
