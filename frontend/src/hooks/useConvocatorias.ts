import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '@/lib/api'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CatalogRef {
  id: number
  name: string
  is_active: boolean
}

export interface JobListItem {
  id: string
  title: string
  location: string | null
  department: string | null
  area: string | null
  type: string | null
  date_posted: string | null
  ref_id: string | null
  status: 'activa' | 'borrador' | 'cerrada'
  views: number
  ai_prompt: string | null
  candidates_count: number
  created_at: string
  // Catalog FK ids
  city_id: number | null
  job_type_id: number | null
  area_id: number | null
  contract_type_id: number | null
  // Catalog objects
  city: CatalogRef | null
  job_type: CatalogRef | null
  area_catalog: CatalogRef | null
  contract_type: CatalogRef | null
}

export interface JobRequirement {
  id: number
  job_id: string
  type: 'funcion' | 'requisito' | 'perfil_ideal'
  label: string | null
  content: string
  order: number
}

export interface JobDetail extends JobListItem {
  description: string | null
  ai_prompt: string | null
  created_by: string | null
  requirements: JobRequirement[]
}

export interface JobCreatePayload {
  title: string
  area?: string
  location?: string
  department?: string
  type?: string
  area_id?: number
  city_id?: number
  job_type_id?: number
  contract_type_id?: number
  status: 'borrador' | 'activa'
  description: string
  ref_id?: string
  ai_prompt: string
}

export interface JobRequirementCreate {
  type: 'funcion' | 'requisito' | 'perfil_ideal'
  content: string
  label?: string
  order?: number
}

interface ConvocatoriasFilters {
  status?: string
  area?: string
  search?: string
  skip?: number
  limit?: number
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useConvocatorias(filters?: ConvocatoriasFilters) {
  const params = new URLSearchParams()
  if (filters?.status && filters.status !== 'todas') params.set('status', filters.status)
  if (filters?.area && filters.area !== 'Todas') params.set('area', filters.area)
  if (filters?.search) params.set('search', filters.search)
  if (filters?.skip != null) params.set('skip', String(filters.skip))
  if (filters?.limit != null) params.set('limit', String(filters.limit))

  const query = params.toString()
  const path = `/api/v1/convocatorias${query ? `?${query}` : ''}`

  return useQuery<JobListItem[]>({
    queryKey: ['convocatorias', filters],
    queryFn: () => apiGet<JobListItem[]>(path),
  })
}

export function useConvocatoria(id: string | undefined) {
  return useQuery<JobDetail>({
    queryKey: ['convocatoria', id],
    queryFn: () => apiGet<JobDetail>(`/api/v1/convocatorias/${id}`),
    enabled: Boolean(id),
  })
}

export function useCreateConvocatoria() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      payload,
      requirements,
    }: {
      payload: JobCreatePayload
      requirements: JobRequirementCreate[]
    }) => {
      // Step 1: create the job
      const job = await apiPost<JobDetail>('/api/v1/convocatorias', payload)

      // Step 2: create each requirement
      for (let i = 0; i < requirements.length; i++) {
        const req = requirements[i]
        await apiPost(`/api/v1/convocatorias/${job.id}/requirements`, {
          ...req,
          order: req.order ?? i,
        })
      }

      return job
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convocatorias'] })
    },
  })
}

export function useUpdateConvocatoria() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
      requirements,
    }: {
      id: string
      payload: Partial<JobCreatePayload>
      requirements?: JobRequirementCreate[]
    }) => {
      // Step 1: update the job
      const job = await apiPut<JobDetail>(`/api/v1/convocatorias/${id}`, payload)

      // Step 2 (optional): re-create requirements if provided
      if (requirements && requirements.length > 0) {
        for (let i = 0; i < requirements.length; i++) {
          const req = requirements[i]
          await apiPost(`/api/v1/convocatorias/${id}/requirements`, {
            ...req,
            order: req.order ?? i,
          })
        }
      }

      return job
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['convocatorias'] })
      queryClient.invalidateQueries({ queryKey: ['convocatoria', variables.id] })
    },
  })
}

export function useDeleteConvocatoria() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/api/v1/convocatorias/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convocatorias'] })
    },
  })
}

export function useToggleStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      currentStatus,
    }: {
      id: string
      currentStatus: 'activa' | 'borrador' | 'cerrada'
    }) => {
      const next: 'activa' | 'cerrada' = currentStatus === 'activa' ? 'cerrada' : 'activa'
      return apiPut<JobDetail>(`/api/v1/convocatorias/${id}`, { status: next })
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['convocatorias'] })
      queryClient.invalidateQueries({ queryKey: ['convocatoria', variables.id] })
    },
  })
}

export function useIncrementViews() {
  return useMutation({
    mutationFn: (id: string) => apiPatch<JobDetail>(`/api/v1/convocatorias/${id}/views`),
  })
}
