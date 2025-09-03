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
      try {
        if (!username || username.trim() === '') {
          throw new Error('Username is required')
        }

        const params = new URLSearchParams({ username: username.trim() })
        if (from) params.append('from', from)
        if (to) params.append('to', to)

        const response = await fetch(`/api/github/contributions?${params}`)
        
        if (!response.ok) {
          let errorMessage = `HTTP error! status: ${response.status}`
          
          try {
            const errorData = await response.json()
            if (errorData.error) {
              errorMessage = errorData.error
            }
          } catch {
            // If we can't parse the error response, use the default message
          }
          
          throw new Error(errorMessage)
        }
        
        const data = await response.json()
        
        // Ensure the response has the expected structure
        if (!data) {
          throw new Error('No data received from API')
        }
        
        return data
      } catch (error) {
        console.error('Error in useGitHubContributions:', error)
        throw error
      }
    },
    enabled: !!username && username.trim() !== '',
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (error instanceof Error && error.message.includes('status: 4')) {
        return false
      }
      // Retry up to 2 times for server errors (5xx) or network errors
      return failureCount < 2
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}