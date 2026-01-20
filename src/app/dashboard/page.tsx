"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, Plus, TrendingUp, Users, ArrowRight, Sparkles } from "lucide-react"

export default function Page() {
  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      {/* Welcome Header Section */}
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight">
          {getGreeting()}
        </h1>
        <p className="text-lg text-muted-foreground">
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/50 hover:border-primary/20 transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Companies
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              Companies in your account
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:border-primary/20 transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Users
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-chart-1/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-chart-1" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:border-primary/20 transition-all duration-200 hover:shadow-md md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Growth Rate
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-chart-2/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-chart-2" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Quick Actions</h2>
            <p className="text-sm text-muted-foreground">
              Get started with your most common tasks
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-5xl">
          <Card className="group relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="relative">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Building className="h-5 w-5 text-primary" />
                    </div>
                    View Companies
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed pt-1">
                    Browse and manage all your companies in one centralized location
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <Button asChild className="w-full group/btn" variant="default">
                <Link href="/companies" className="flex items-center justify-center gap-2">
                  Open Companies
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="relative">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-chart-2/10 flex items-center justify-center group-hover:bg-chart-2/20 transition-colors">
                      <Plus className="h-5 w-5 text-chart-2" />
                    </div>
                    Create Company
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed pt-1">
                    Add a new company to your account and start managing it right away
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <Button asChild className="w-full group/btn" variant="default">
                <Link href="/companies/new" className="flex items-center justify-center gap-2">
                  Create New Company
                  <Sparkles className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Info Section - Can be expanded later */}
      <div className="mt-8 pt-6 border-t border-border/50">
        <p className="text-sm text-muted-foreground text-center">
          Need help? Check out our documentation or contact support.
        </p>
      </div>
    </div>
  )
}
