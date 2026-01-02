import { 
  Home, 
  MessageSquare, 
  FileCode, 
  Network, 
  Settings, 
  HelpCircle,
  Workflow,
  Globe
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

const mainNavItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Generator", url: "/generator", icon: MessageSquare },
  { title: "Graph View", url: "/graph", icon: Network },
  { title: "SFILES Editor", url: "/editor", icon: FileCode },
];

const resourceItems = [
  { title: "Documentation", url: "/docs", icon: HelpCircle },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
            <Workflow className="w-5 h-5 text-primary" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight">
                <span className="gradient-text">Smart P&ID</span>
              </span>
              <span className="text-[10px] text-sidebar-foreground/60">by Patria & Co.</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Resources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {resourceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between">
          <ThemeToggle />
          {!isCollapsed && (
            <a
              href="https://www.patriaco.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>patriaco.co.uk</span>
            </a>
          )}
        </div>
        {!isCollapsed && (
          <p className="text-[10px] text-sidebar-foreground/40 mt-2">
            Dr Harry Patria - 2026
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
