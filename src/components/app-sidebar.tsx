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
    <Sidebar {...props}>
      <SidebarHeader className="flex items-center justify-center p-6 border-b">
        <Image
          src="/adfelt-logo.png"
          alt="Adfelt Logo"
          width={120}
          height={40}
          priority
          className="object-contain"
        />
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive} className="w-full justify-start px-4 py-3">
                  <Link href={item.href}>
                    {Icon && (
                      <span className="mr-2">
                        <Icon className="h-4 w-4" />
                      </span>
                    )}
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full justify-start px-3 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground bg-sidebar-background cursor-pointer transition-colors duration-200 border shadow-sm"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  {userInitials}
                </div>
                <div className="flex flex-col gap-0.5 overflow-hidden text-left min-w-0 flex-1">
                  <span className="truncate text-sm font-semibold">{userName}</span>
                  {userEmail && (
                    <span className="truncate text-xs text-muted-foreground">
                      {userEmail}
                    </span>
                  )}
                </div>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  {userInitials}
                </div>
                <div className="flex flex-col gap-0.5 overflow-hidden">
                  <span className="truncate font-semibold">{userName}</span>
                  {userEmail && (
                    <span className="truncate text-xs text-muted-foreground">
                      {userEmail}
                    </span>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
