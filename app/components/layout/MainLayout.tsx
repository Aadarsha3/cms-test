import { useState, type ReactNode } from "react";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar/sidebar";
import { cn } from "@/lib/utils";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";
import { LogOut, User, KeyRound, GraduationCap, Settings } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

function MainLayoutContent({ children, title, className }: MainLayoutProps) {
  const { open, isMobile } = useSidebar();
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  return (
    <div className="flex flex-col h-screen w-full">
      <header className="flex h-[60px] md:h-[72px] shrink-0 items-center justify-between pr-2 md:pr-6 bg-background border-b z-10 w-full relative">
        <div className="flex items-center h-full">
          <div
            className={cn(
              "flex h-full items-center gap-3 shrink-0 transition-[width,padding] duration-200 ease-linear overflow-hidden relative",
              open && !isMobile ? "w-[--sidebar-width] pl-4" : "w-0 p-0",
              isMobile && "hidden"
            )}
          >
            <div className={cn("absolute right-0 top-[5px] bottom-[5px] w-px bg-border transition-opacity duration-200", open ? "opacity-100" : "opacity-0")} />
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground shrink-0">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="flex flex-col whitespace-nowrap">
              <span className="text-lg font-semibold leading-tight" data-testid="text-app-name">MetaHorizon</span>
              <span className="text-xs text-muted-foreground leading-tight">College Management System</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 pl-1 md:pl-4">
            <SidebarTrigger className={cn(isMobile && "ml-[2px]")} data-testid="button-sidebar-toggle" />
            {title && (
              <h1 className="text-sm md:text-xl font-semibold line-clamp-1" data-testid="text-page-title">{title}</h1>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 md:mr-[20px]">
          <div className={cn("flex items-center gap-2", isMobile && "mr-[10px]")}>
            <ThemeToggle />

            {user && (
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-3 cursor-pointer group/profile" data-testid="button-profile-menu">
                      <Settings className="h-5 w-5 text-muted-foreground group-hover/profile:text-primary transition-colors" />
                      <div className="hidden md:flex flex-col items-start gap-0.5">
                        <span className="text-sm font-bold text-foreground/90 leading-tight group-hover/profile:text-primary transition-colors" data-testid="text-user-name">
                          {user.name}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem onClick={() => setLocation("/profile")} data-testid="menu-item-profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>View Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLocation("/change-password")} data-testid="menu-item-change-password">
                      <KeyRound className="mr-2 h-4 w-4" />
                      <span>Change Password</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowLogoutDialog(true)}
                      className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                      data-testid="menu-item-logout"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You will need to sign in again to access the application.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={logout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Sign Out</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        <main className={cn("flex-1 overflow-auto p-4 md:p-6", className)}>
          {children}
        </main>
      </div>
    </div>
  );
}

export function MainLayout(props: MainLayoutProps) {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <MainLayoutContent {...props} />
    </SidebarProvider>
  );
}
