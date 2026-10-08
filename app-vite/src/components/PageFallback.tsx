import { cn } from '@/lib/utils'

export function PageFallback({ fullScreen = false }: { fullScreen?: boolean }) {
  return (
    <div
      role="status"
      className={cn(
        'flex items-center justify-center text-muted-foreground',
        fullScreen ? 'min-h-screen' : 'py-24',
      )}
    >
      Loading…
    </div>
  )
}
