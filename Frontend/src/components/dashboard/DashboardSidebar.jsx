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
  Sparkles,
  LifeBuoy
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
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import useAuthStore from '@/store/authStore';

// Define navigation items for each role
const roleNavItems = {
  Admin: [
    { title: 'Overview', url: '/dashboard/admin', icon: LayoutDashboard },
    { title: 'User Management', url: '/users', icon: Users },
    { title: 'Audit Logs', url: '/admin/audit', icon: FileText },
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
  
  const userRole = user?.role || 'Cashier';
  const navItems = roleNavItems[userRole] || roleNavItems['Cashier'];

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarHeader className="pt-6 pb-2 px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
              <Link to="/">
                <div className="relative flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 text-primary-foreground shadow-lg shadow-primary/20">
                  <BookOpen className="size-5 md:size-6" />
                  <div className="absolute -bottom-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-background">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 leading-none px-1">
                  <span className="font-bold text-lg tracking-tight gradient-text">BookLedger</span>
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Workspace 1.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-3 flex flex-col h-full mt-4">
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="text-xs uppercase tracking-wider font-semibold text-primary/70 px-4 mb-2">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={item.title}
                      className={`h-11 px-4 transition-all duration-300 rounded-xl ${
                        isActive 
                          ? 'bg-primary/10 text-primary font-semibold shadow-sm border border-primary/20' 
                          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                      }`}
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className={`size-5 ${isActive ? 'text-primary' : 'opacity-70'}`} />
                        <span className="text-[15px]">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-border/40">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-14 rounded-xl border border-transparent hover:border-border/50 hover:bg-muted/50 transition-all duration-300"
                >
                  <Avatar className="h-9 w-9 rounded-lg border border-border shadow-sm">
                    <AvatarImage src={user?.profileImage} alt={user?.name} className="object-cover" />
                    <AvatarFallback className="rounded-lg bg-gradient-to-br from-primary to-purple-500 text-white font-semibold">
                      {user?.name?.substring(0, 2).toUpperCase() || 'US'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight ml-1">
                    <span className="truncate font-bold">{user?.name}</span>
                    <span className="truncate text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Shield className="size-3" /> {userRole}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-56 rounded-xl border-border/50 shadow-xl"
                align="end"
              >
                <div className="px-2 py-2.5 text-sm font-medium text-muted-foreground">
                  Logged in as <span className="text-foreground">{user?.email}</span>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="rounded-lg my-1 cursor-pointer">
                  <Link to="/dashboard/profile" className="flex items-center w-full">
                    <User className="mr-2 size-4 text-primary" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="rounded-lg text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
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