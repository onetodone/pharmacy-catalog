import { Component, Suspense, type ErrorInfo, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { PageFallback } from '@/components/PageFallback'
import { Button } from '@/components/ui/button'

type BoundaryProps = {
  fullScreen: boolean
  resetKey: string
  children: ReactNode
}

class ErrorBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack)
  }

  componentDidUpdate(prev: BoundaryProps) {
    if (this.state.failed && prev.resetKey !== this.props.resetKey) {
      this.setState({ failed: false })
    }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div
        role="alert"
        className={cn(
          'flex flex-col items-center justify-center gap-4 text-center',
          this.props.fullScreen ? 'min-h-screen' : 'py-24',
        )}
      >
        <div>
          <p className="font-medium">This page failed to load.</p>
          <p className="text-sm text-muted-foreground">
            Check your connection and reload the page.
          </p>
        </div>
        {/* React.lazy keeps a failed import, so only a reload retries it. */}
        <Button onClick={() => window.location.reload()}>Reload</Button>
      </div>
    )
  }
}

/**
 * Suspense plus an error boundary for lazy routes: shows a loading state while
 * a page chunk loads and a reload prompt if the chunk or the page fails. The
 * boundary resets on navigation.
 */
export function PageBoundary({
  fullScreen = false,
  children,
}: {
  fullScreen?: boolean
  children: ReactNode
}) {
  const { pathname } = useLocation()
  return (
    <ErrorBoundary resetKey={pathname} fullScreen={fullScreen}>
      <Suspense fallback={<PageFallback fullScreen={fullScreen} />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}
