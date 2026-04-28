import { useQuery } from "@tanstack/react-query";
import { candidateApiGet } from "@/lib/candidateApi";

export interface PortalApplication {
  id: string;
  job_id: string;
  job_title: string;
  job_location: string | null;
  applied_date: string;
  status_key: string;
  status_label: string;
}

export function useCandidateApplications(enabled: boolean) {
  return useQuery<PortalApplication[]>({
    queryKey: ["candidate-portal", "applications"],
    queryFn: () => candidateApiGet("/api/v1/candidate-portal/applications"),
    enabled,
    staleTime: 1000 * 30,
  });
}
