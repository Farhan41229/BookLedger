import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Shield,
  BookOpen,
  Package,
  ShoppingCart,
  BarChart3,
  Calculator,
  History,
  LogOut,
  User,
  ChevronUp,
} from 'lucide-react';
import { useLocation, Link } from 'react-router';
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
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import useAuthStore from '@/store/authStore';

// Define navigation items for each role
const roleNavItems = {
  Admin: [
    { title: 'Overview', url: '/dashboard/admin', icon: LayoutDashboard },
    { title: 'User Management', url: '/users', icon: Users },
    { title: 'Audit Logs', url: '/admin/audit', icon: FileText },
    { title: 'System Settings', url: '/settings', icon: Settings },
  ],
  Manager: [
    { title: 'Overview', url: '/dashboard/manager', icon: LayoutDashboard },
    { title: 'Inventory', url: '/inventory', icon: Package },
    { title: 'Books', url: '/books', icon: BookOpen },
    { title: 'Sales Reports', url: '/sales/reports', icon: BarChart3 },
  ],
  Cashier: [
    { title: 'POS', url: '/dashboard/cashier', icon: Calculator },
    { title: 'Sales History', url: '/sales/history', icon: History },
    { title: 'My Performance', url: '/dashboard/cashier/stats', icon: BarChart3 },
  ],
};

export function DashboardSidebar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  
  // Fallback to Cashier if role is undefined, or handle accordingly
  const userRole = user?.role || 'Cashier';
  const navItems = roleNavItems[userRole] || roleNavItems['Cashier'];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BookOpen className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">BookLedger</span>
                  <span className="">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{userRole} Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      {user?.name?.substring(0, 2).toUpperCase() || 'US'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              >
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}