import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-context";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { UserProvider } from "@/lib/user-context";
import { LoginPage } from "@/pages/auth/LoginPage";
import { CallbackPage } from "@/pages/auth/CallbackPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";

import { ActivityPage } from "@/pages/dashboard/ActivityPage";
import { ProfilePage } from "@/pages/user/ProfilePage";
import { ChangePasswordPage } from "@/pages/user/ChangePasswordPage";
import { UsersPage } from "@/pages/user_management/UsersPage";
import { EnrollUserPage } from "@/pages/user_management/EnrollUserPage";
import { UserDetailsPage } from "@/pages/user_management/UserDetailsPage";
import NotFound from "@/pages/common/not-found";

function ProtectedRoute({
  component: Component,
  roles,
  permission,
}: {
  component: React.ComponentType;
  roles?: string[];
  permission?: string;
}) {
  const { isAuthenticated, user, hasPermission } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  // Check permission if provided
  if (permission && !hasPermission(permission)) {
    return (
      <Redirect
        to={permission === "dashboard_view" ? "/login" : "/dashboard"}
      />
    );
  }

  // Check roles if provided (and no permission was checked or already passed)
  if (roles && user && !roles.includes(user.role)) {
    return <Redirect to="/dashboard" />;
  }

  return <Component />;
}

function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route path="/login/oauth2/code/react-client" component={CallbackPage} />
      <Route path="/login">
        {isAuthenticated ? <Redirect to="/dashboard" /> : <LoginPage />}
      </Route>
      <Route path="/">
        {isAuthenticated ? (
          <Redirect to="/dashboard" />
        ) : (
          <Redirect to="/login" />
        )}
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute component={DashboardPage} permission="dashboard_view" />
      </Route>

      <Route path="/activity">
        <ProtectedRoute component={ActivityPage} permission="dashboard_view" />
      </Route>

      <Route path="/profile">
        <ProtectedRoute component={ProfilePage} permission="profile_view" />
      </Route>
      <Route path="/change-password">
        <ProtectedRoute
          component={ChangePasswordPage}
          permission="password_change"
        />
      </Route>

      {/* User Management Routes */}
      <Route path="/users">
        <ProtectedRoute component={UsersPage} permission="users_view" />
      </Route>
      <Route path="/users/enroll">
        <ProtectedRoute component={EnrollUserPage} permission="users_create" />
      </Route>
      <Route path="/users/:id/edit">
        <ProtectedRoute component={EnrollUserPage} permission="users_edit" />
      </Route>
      <Route path="/users/:id">
        <ProtectedRoute component={UserDetailsPage} permission="users_view" />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
