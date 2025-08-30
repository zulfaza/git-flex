import { useQuery } from '@tanstack/react-query'
import type { ContributionGridCell } from '@/lib/githubApi'

interface GitHubContributionsResponse {
  success: boolean
  data: (ContributionGridCell | null)[][]
  username: string
  from?: string
  to?: string
  error?: string
}

export function useGitHubContributions(
  username: string,
  from?: string,
  to?: string
) {
  return useQuery({
    queryKey: ['github-contributions', username, from, to],
    queryFn: async (): Promise<GitHubContributionsResponse> => {
      const params = new URLSearchParams({ username })
      if (from) params.append('from', from)
      if (to) params.append('to', to)

      const response = await fetch(`/api/github/contributions?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return response.json()
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })
}