"use client"

import { Alert } from "@/components/retroui/Alert"
import { Button } from "@/components/retroui/Button"

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
      <div className="text-6xl mb-6">
        {getErrorIcon(error)}
      </div>
      
      <Alert status="error" className="max-w-md mb-6">
        <Alert.Title className="mb-2">
          Oops! Something went wrong
        </Alert.Title>
        <Alert.Description className="mb-4">
          {error}
        </Alert.Description>
        <p className="text-sm text-muted-foreground">
          {getErrorSuggestion(error)}
        </p>
      </Alert>
      
      {onRetry && (
        <Button onClick={onRetry} variant="secondary">
          Try Again
        </Button>
      )}
    </div>
  )
}