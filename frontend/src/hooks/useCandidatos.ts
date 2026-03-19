import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiPatch } from '@/lib/api'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApplicationFull {
  id: string
  candidate_id: string
  job_id: string
  applied_date: string
  ai_score: number | null
  ai_decision: 'aprobado' | 'rechazado' | 'pendiente'
  human_decision: 'nuevo' | 'revisado' | 'entrevista' | 'aprobado' | 'rechazado'
  notes: string | null
  ai_justificacion: string | null
  candidate: {
    id: string
    name: string
    email: string
    phone: string | null
    location: string | null
    cv_url: string | null
    experience: Array<{
      id: number
      candidate_id: string
      position: string
      company: string
      start_date: string | null
      end_date: string | null
      details: string | null
    }>
    education: Array<{
      id: number
      candidate_id: string
      degree: string | null
      institution: string | null
      field_of_study: string | null
      graduation_date: string | null
    }>
    languages: Array<{
      id: number
      candidate_id: string
      language: string
      level: string
    }>
  }
  job: {
    id: string
    title: string
    area: string | null
    location: string | null
    ref_id: string | null
  }
}

export interface ApplicationFilters {
  job_id?: string
  ai_decision?: string
  human_decision?: string
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useAplicaciones(filters?: ApplicationFilters) {
  const params = new URLSearchParams()
  if (filters?.job_id) params.set('job_id', filters.job_id)
  if (filters?.ai_decision) params.set('ai_decision', filters.ai_decision)
  if (filters?.human_decision) params.set('human_decision', filters.human_decision)
  params.set('skip', '0')
  params.set('limit', '100')

  const query = params.toString()
  const path = `/api/v1/aplicaciones/${query ? `?${query}` : ''}`

  return useQuery<ApplicationFull[]>({
    queryKey: ['aplicaciones', filters],
    queryFn: () => apiGet<ApplicationFull[]>(path),
  })
}

export function useUpdateDecision() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      human_decision,
    }: {
      id: string
      human_decision: ApplicationFull['human_decision']
    }) =>
      apiPatch<ApplicationFull>(`/api/v1/aplicaciones/${id}/decision`, {
        human_decision,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aplicaciones'] })
    },
  })
}

export function useUpdateNotes() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      apiPatch<ApplicationFull>(`/api/v1/aplicaciones/${id}/notes`, { notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aplicaciones'] })
    },
  })
}
