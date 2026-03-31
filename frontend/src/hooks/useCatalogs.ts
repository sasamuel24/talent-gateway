import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api'

export interface CatalogItem {
  id: number
  name: string
  is_active: boolean
}

// ─── Generic factory ──────────────────────────────────────────────────────────

function useCatalogList(endpoint: string, key: string) {
  return useQuery<CatalogItem[]>({
    queryKey: ['catalogs', key],
    queryFn: () => apiGet<CatalogItem[]>(`/api/v1/catalogs/${endpoint}`),
  })
}

function useCatalogCreate(endpoint: string, key: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (name: string) =>
      apiPost<CatalogItem>(`/api/v1/catalogs/${endpoint}`, { name }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['catalogs', key] }),
  })
}

function useCatalogUpdate(endpoint: string, key: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, name, is_active }: { id: number; name?: string; is_active?: boolean }) =>
      apiPut<CatalogItem>(`/api/v1/catalogs/${endpoint}/${id}`, { name, is_active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['catalogs', key] }),
  })
}

function useCatalogDelete(endpoint: string, key: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => apiDelete(`/api/v1/catalogs/${endpoint}/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['catalogs', key] }),
  })
}

// ─── Ciudades ─────────────────────────────────────────────────────────────────
export const useCiudades = () => useCatalogList('ciudades', 'ciudades')
export const useCreateCiudad = () => useCatalogCreate('ciudades', 'ciudades')
export const useUpdateCiudad = () => useCatalogUpdate('ciudades', 'ciudades')
export const useDeleteCiudad = () => useCatalogDelete('ciudades', 'ciudades')

// ─── Tipos de cargo ───────────────────────────────────────────────────────────
export const useTiposCargo = () => useCatalogList('tipos-cargo', 'tipos-cargo')
export const useCreateTipoCargo = () => useCatalogCreate('tipos-cargo', 'tipos-cargo')
export const useUpdateTipoCargo = () => useCatalogUpdate('tipos-cargo', 'tipos-cargo')
export const useDeleteTipoCargo = () => useCatalogDelete('tipos-cargo', 'tipos-cargo')

// ─── Áreas de trabajo ─────────────────────────────────────────────────────────
export const useAreasAdmin = () => useCatalogList('areas', 'areas')
export const useCreateArea = () => useCatalogCreate('areas', 'areas')
export const useUpdateArea = () => useCatalogUpdate('areas', 'areas')
export const useDeleteArea = () => useCatalogDelete('areas', 'areas')

// ─── Tipos de contrato ────────────────────────────────────────────────────────
export const useTiposContrato = () => useCatalogList('tipos-contrato', 'tipos-contrato')
export const useCreateTipoContrato = () => useCatalogCreate('tipos-contrato', 'tipos-contrato')
export const useUpdateTipoContrato = () => useCatalogUpdate('tipos-contrato', 'tipos-contrato')
export const useDeleteTipoContrato = () => useCatalogDelete('tipos-contrato', 'tipos-contrato')
