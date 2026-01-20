import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "./skeleton"

interface PageLoaderProps {
  message?: string
  className?: string
}

export function PageLoader({ message = "Loading...", className }: PageLoaderProps) {
  return (
    <div className={cn("w-full h-screen flex items-center justify-center", className)}>
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}

interface TableSkeletonProps {
  rows?: number
  columns?: number
  showHeader?: boolean
}

export function TableSkeleton({ rows = 5, columns = 5, showHeader = true }: TableSkeletonProps) {
  return (
    <div className="space-y-3">
      {showHeader && (
        <div className="flex gap-4 pb-2 border-b">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={`header-${i}`} className="h-4 flex-1" />
          ))}
        </div>
      )}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-12 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

interface CardSkeletonProps {
  count?: number
  showDescription?: boolean
  className?: string
}

export function CardSkeleton({ count = 3, showDescription = true, className }: CardSkeletonProps) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-9 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-32" />
          {showDescription && <Skeleton className="h-3 w-3/4" />}
        </div>
      ))}
    </div>
  )
}

interface InlineLoaderProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function InlineLoader({ size = "md", className }: InlineLoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <Loader2 className={cn("animate-spin text-primary", sizeClasses[size], className)} />
  )
}
