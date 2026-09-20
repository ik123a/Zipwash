"use client"

import * as React from "react"
import {
  Home,
  Package,
  CircleDollarSign,
  Gift,
  MessageSquare,
  History,
  Info,
  LifeBuoy,
  Languages,
  Moon,
  Sun,
  Bell,
  ChevronRight,
  ShieldCheck,
  Locate,
  BookOpen,
  X,
  LayoutDashboard,
  ShoppingBag,
  Users,
  Warehouse,
  Settings,
  WashingMachine,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { FeedbackModal } from "../modals/FeedbackModal"
import { useAuth } from "../../context/AuthContext"

const navItems = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Book Machine",
    url: "/dashboard",
    icon: WashingMachine,
  },
  {
    title: "Track Laundry",
    url: "/track",
    icon: Package,
  },
  {
    title: "Dry Clean Pricing",
    url: "/pricing",
    icon: CircleDollarSign,
  },
  {
    title: "Rewards",
    url: "/rewards",
    icon: Gift,
  },
  {
    title: "Feedback",
    url: "#",
    icon: MessageSquare,
  },
  {
    title: "Transaction History",
    url: "/transactions",
    icon: History,
  },
]

const aboutItems = [
  { title: "Privacy Center", url: "/privacy", icon: ShieldCheck },
  { title: "Cookie Policy", url: "/cookies", icon: Locate },
  { title: "Terms & Conditions", url: "/terms", icon: BookOpen },
]

const adminItems = [
  { title: "Admin Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Orders", url: "/admin/orders", icon: ShoppingBag },
  { title: "Customers", url: "/admin/customers", icon: Users },
  { title: "Inventory", url: "/admin/inventory", icon: Warehouse },
  { title: "Settings", url: "/admin/settings", icon: Settings },
]

export function MainSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setOpen, setOpenMobile } = useSidebar()
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()
  const [language, setLanguage] = React.useState("English")
  const [isFeedbackOpen, setIsFeedbackOpen] = React.useState(false)

  const isDark = theme === "dark"
  const isStaff = user?.role === 'staff'

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar/70 backdrop-blur-xl" {...props}>
      <SidebarHeader className="h-16 flex items-center justify-between px-6 border-b border-sidebar-border/60 bg-gradient-to-r from-sidebar-background to-sidebar-accent/30">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow ring-1 ring-white/20">
            <Package className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-sidebar-foreground">ZIPPWASH</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-sidebar-foreground/50 hover:text-sidebar-foreground relative z-50"
          onClick={() => {
            setOpen(false)
            setOpenMobile(false)
          }}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      </SidebarHeader>

      <SidebarContent className="px-4 py-4">
        {/* Main Navigation - Only for Students */}
        {!isStaff && (
          <SidebarGroup>
            <SidebarGroupLabel className="px-2 text-sidebar-foreground/50 font-semibold uppercase text-[10px] tracking-wider mb-2">
              Main Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild={item.title !== "Feedback"}
                      tooltip={item.title}
                      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 py-5 rounded-xl"
                      onClick={() => {
                        if (item.title === "Feedback") {
                          setIsFeedbackOpen(true)
                        } else {
                          setOpenMobile(false)
                        }
                      }}
                    >
                      {item.title === "Feedback" ? (
                        <>
                          <div className="w-9 h-9 rounded-lg bg-sidebar-accent/50 flex items-center justify-center">
                            <item.icon className="h-4 w-4 text-sidebar-foreground" />
                          </div>
                          <span>{item.title}</span>
                        </>
                      ) : (
                        <Link to={item.url}>
                          <div className="w-9 h-9 rounded-lg bg-sidebar-accent/50 flex items-center justify-center">
                            <item.icon className="h-4 w-4 text-sidebar-foreground" />
                          </div>
                          <span>{item.title}</span>
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                {/* Reminders with Badge */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip="Reminders"
                    className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 py-5 rounded-xl"
                    onClick={() => setOpenMobile(false)}
                  >
                    <Link to="/reminders">
                      <Bell className="h-5 w-5 mr-3" />
                      <span>Reminders</span>
                      <SidebarMenuBadge className="bg-primary text-primary-foreground rounded-full">
                        3
                      </SidebarMenuBadge>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Collapsible About Section */}
                <Collapsible asChild className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip="About"
                        className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 py-5 rounded-xl"
                      >
                        <Info className="h-5 w-5 mr-3" />
                        <span>About</span>
                        <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="ml-8 border-l border-sidebar-border pl-2">
                        {aboutItems.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild className="hover:text-sidebar-accent-foreground py-3">
                              <Link to={subItem.url} onClick={() => setOpenMobile(false)}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Admin Navigation - Only for Staff */}
        {isStaff && (
          <SidebarGroup>
            <SidebarGroupLabel className="px-2 text-sidebar-foreground/50 font-semibold uppercase text-[10px] tracking-wider mb-2">
              Admin Panel
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 py-5 rounded-xl"
                      onClick={() => setOpenMobile(false)}
                    >
                      <Link to={item.url}>
                        <div className="w-9 h-9 rounded-lg bg-sidebar-accent/50 flex items-center justify-center">
                          <item.icon className="h-4 w-4 text-sidebar-foreground" />
                        </div>
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Support & Preferences */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="px-2 text-sidebar-foreground/50 font-semibold uppercase text-[10px] tracking-wider mb-2">
            Support & Config
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground py-6 text-base">
                  <div className="w-9 h-9 rounded-lg bg-sidebar-accent/50 flex items-center justify-center">
                    <LifeBuoy className="h-4 w-4 text-sidebar-foreground" />
                  </div>
                  <span>Chat with Us</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Language Selector */}
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground py-6 text-base">
                      <div className="w-9 h-9 rounded-lg bg-sidebar-accent/50 flex items-center justify-center">
                        <Languages className="h-4 w-4 text-sidebar-foreground" />
                      </div>
                      <span>{language}</span>
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem onClick={() => setLanguage("English")}>English</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage("Hindi")}>Hindi</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage("Spanish")}>Spanish</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between px-2 py-3 bg-sidebar-accent/50 rounded-xl border border-sidebar-border shadow-sm">
          <div className="flex items-center gap-2">
            {isDark ? (
              <Moon className="h-4 w-4 text-blue-400" />
            ) : (
              <Sun className="h-4 w-4 text-amber-500" />
            )}
            <span className="text-sm font-medium text-sidebar-foreground">Dark Mode</span>
          </div>
          <Switch
            checked={isDark}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            className="data-[state=checked]:bg-blue-600"
          />
        </div>
      </SidebarFooter>
      <FeedbackModal isOpen={isFeedbackOpen} onClose={setIsFeedbackOpen} />
    </Sidebar>
  )
}
