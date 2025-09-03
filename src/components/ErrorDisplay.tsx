"use client"

interface ErrorDisplayProps {
  error: string
  onRetry?: () => void
}

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  const getErrorIcon = (errorMessage: string) => {
    if (errorMessage.toLowerCase().includes('not found')) {
      return '👤'
    } else if (errorMessage.toLowerCase().includes('rate limit')) {
      return '⏱️'
    } else if (errorMessage.toLowerCase().includes('authentication')) {
      return '🔐'
    } else if (errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('unavailable')) {
      return '🌐'
    }
    return '❌'
  }

  const getErrorSuggestion = (errorMessage: string) => {
    if (errorMessage.toLowerCase().includes('not found')) {
      return 'Please check if the username is correct and the user exists on GitHub.'
    } else if (errorMessage.toLowerCase().includes('rate limit')) {
      return 'Please wait a few minutes before trying again.'
    } else if (errorMessage.toLowerCase().includes('authentication')) {
      return 'There seems to be an issue with the GitHub token configuration.'
    } else if (errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('unavailable')) {
      return 'Please check your internet connection and try again.'
    }
    return 'Please try again later or contact support if the problem persists.'
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="text-6xl mb-4">
        {getErrorIcon(error)}
      </div>
      
      <h3 className="text-xl font-semibold text-red-400 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-red-300 mb-4 max-w-md">
        {error}
      </p>
      
      <p className="text-gray-400 text-sm mb-6 max-w-md">
        {getErrorSuggestion(error)}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Try Again
        </button>
      )}
    </div>
  )
}