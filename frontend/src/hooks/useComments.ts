import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiPost, apiDelete } from '@/lib/api'

export interface Comment {
  id: number
  application_id: string
  user_id: string | null
  user_name: string
  body: string
  created_at: string
}

export function useComments(applicationId: string | null) {
  return useQuery<Comment[]>({
    queryKey: ['comentarios', applicationId],
    queryFn: () => apiGet<Comment[]>(`/api/v1/aplicaciones/${applicationId}/comentarios`),
    enabled: !!applicationId,
  })
}

export function useAddComment(applicationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: string) =>
      apiPost<Comment>(`/api/v1/aplicaciones/${applicationId}/comentarios`, { body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comentarios', applicationId] })
    },
  })
}

export function useDeleteComment(applicationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (commentId: number) =>
      apiDelete(`/api/v1/aplicaciones/${applicationId}/comentarios/${commentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comentarios', applicationId] })
    },
  })
}
