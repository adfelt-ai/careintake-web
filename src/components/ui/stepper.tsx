import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepperProps {
  steps: string[]
  currentStep: number
  className?: string
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        {/* Background connector line - full width gray line */}
        <div className="absolute top-[18px] left-0 right-0 h-0.5 bg-muted" />
        
        <div className="relative flex">
          {steps.map((step, index) => {
            const stepNumber = index + 1
            const isActive = stepNumber === currentStep
            const isCompleted = stepNumber < currentStep
            const isLast = index === steps.length - 1

            // Calculate connector line position
            const connectorStart = (index / steps.length) * 100
            const connectorEnd = ((index + 1) / steps.length) * 100

            return (
              <React.Fragment key={step}>
                <div className="relative flex flex-col items-center flex-1">
                  {/* Step Circle */}
                  <div className="relative z-10 mb-2">
                    <div
                      className={cn(
                        "flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-300",
                        "shadow-sm bg-background",
                        isCompleted
                          ? "bg-primary border-primary text-primary-foreground shadow-primary/20"
                          : isActive
                          ? "bg-primary border-primary text-primary-foreground shadow-primary/30 ring-3 ring-primary/10"
                          : "border-muted-foreground/30 text-muted-foreground"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span
                          className={cn(
                            "text-xs font-bold",
                            isActive && "text-primary-foreground"
                          )}
                        >
                          {stepNumber}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Step Label */}
                  <div className="w-full px-1">
                    <p
                      className={cn(
                        "text-[10px] font-medium text-center transition-colors duration-200 leading-tight",
                        isActive
                          ? "text-primary"
                          : isCompleted
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {step}
                    </p>
                    {isActive && (
                      <div className="mt-1 h-0.5 w-6 bg-primary rounded-full mx-auto" />
                    )}
                  </div>
                </div>
                
                {/* Connector Line between steps */}
                {!isLast && (
                  <div 
                    className="absolute top-[18px] h-0.5 z-0"
                    style={{
                      left: `${connectorStart + (100 / steps.length / 2)}%`,
                      width: `${100 / steps.length}%`,
                    }}
                  >
                    <div
                      className={cn(
                        "h-full transition-all duration-300",
                        isCompleted ? "bg-primary" : "bg-muted"
                      )}
                    />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}
