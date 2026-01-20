"use client"

import {
  Toast,
  type ToastProps,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] flex items-end px-4 py-6 sm:items-start sm:p-6"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        {toasts.map((toast) => {
          const { id, title, description, action, ...props } = toast
          return (
            <Toast
              key={id}
              title={title}
              description={description}
              action={action}
              {...props}
            />
          )
        })}
      </div>
    </div>
  )
}
