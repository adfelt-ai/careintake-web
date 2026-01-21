"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Building, Home, User, LogOut, type LucideIcon } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth"

// Navigation items array - Add new pages here
const navItems: Array<{
  title: string
  href: string
  icon: LucideIcon | null
}> = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Companies",
    href: "/companies",
    icon: Building,
  },
  // Add more navigation items here:
  // {
  //   title: "Settings",
  //   href: "/settings",
  //   icon: Settings,
  // },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [user, setUser] = React.useState<FirebaseUser | null>(null)
  
  // Get current user from Firebase Auth
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
    })
    return () => unsubscribe()
  }, [])
  
  // Get user display name or email from Firebase Auth
  const userEmail = user?.email || ""
  const displayName = user?.displayName || ""
  const userName = displayName || userEmail?.split("@")[0] || "User"
  
  // Generate user initials from name or email
  const getInitials = (name: string) => {
    if (!name) return "U"
    const parts = name.trim().split(" ")
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2)
    }
    return name.slice(0, 2).toUpperCase()
  }
  
  const userInitials = getInitials(userName)

  return (
    <Sidebar {...props} className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="flex items-center justify-center pt-8 pb-4">
        <Image
          src="/adfelt-logo.png"
          alt="Adfelt Logo"
          width={130}
          height={42}
          priority
          className="object-contain"
        />
      </SidebarHeader>
      <SidebarContent className="px-3 py-4">
        <SidebarMenu className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive} 
                  className={`w-full justify-start px-4 py-6 transition-all duration-200 ease-in-out hover:bg-sidebar-accent/50 ${isActive ? 'bg-primary/10 text-primary font-medium shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    {Icon && (
                      <span className={`${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                    )}
                    <span className="text-sm">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="w-full justify-start px-3 py-3 rounded-xl hover:bg-sidebar-accent transition-colors duration-200 border border-sidebar-border/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] bg-white dark:bg-sidebar-accent/10"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-bold shadow-sm">
                  {userInitials}
                </div>
                <div className="flex flex-col gap-0.5 overflow-hidden text-left min-w-0 flex-1">
                  <span className="truncate text-sm font-semibold text-foreground">{userName}</span>
                  {userEmail && (
                    <span className="truncate text-xs text-muted-foreground/80">
                      {userEmail}
                    </span>
                  )}
                </div>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-60 rounded-xl border border-border/50 shadow-lg p-2"
            side="bottom"
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-2 py-2 text-left text-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {userInitials}
                </div>
                <div className="flex flex-col gap-0.5 overflow-hidden">
                  <span className="truncate font-semibold text-foreground">{userName}</span>
                  {userEmail && (
                    <span className="truncate text-xs text-muted-foreground">
                      {userEmail}
                    </span>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-2 bg-border/50" />
            <DropdownMenuItem asChild className="rounded-lg focus:bg-sidebar-accent cursor-pointer">
              <Link href="/profile" className="flex items-center px-2 py-2">
                <User className="mr-3 h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-2 bg-border/50" />
            <DropdownMenuItem
              onClick={logout}
              className="rounded-lg focus:bg-destructive/10 focus:text-destructive cursor-pointer px-2 py-2 text-destructive/80"
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span className="text-sm font-medium">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
