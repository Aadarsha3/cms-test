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
import { DashboardPage } from "@/pages/sidebar/dashboard/DashboardPage";
import { ProfilePage } from "./pages/sidebar/profile/ProfilePage";
import { ChangePasswordPage } from "./pages/sidebar/profile/ChangePasswordPage";
import { EnrollUserPage } from "@/pages/sidebar/user/EnrollUserPage";
import { UserDetailsPage } from "@/pages/sidebar/user/UserDetailsPage";
import { StudentsPage } from "@/pages/sidebar/user/student/StudentsPage";
import { StudentDetailsPage } from "@/pages/sidebar/user/student/StudentDetailsPage";
import { StaffPage } from "@/pages/sidebar/user/staff/StaffPage";
import ProgramsPage from "./pages/sidebar/programs/ProgramsPage";
import CreateProgramPage from "./pages/sidebar/programs/CreateProgramPage";
import ProgramDetailsPage from "./pages/sidebar/programs/ProgramDetailsPage";
import CreateCoursePage from "./pages/sidebar/programs/courses/CreateCoursePage";
import CourseDetailsPage from "./pages/sidebar/programs/courses/CourseDetailsPage";
import AnnouncementsPage from "./pages/sidebar/announcements/AnnouncementsPage";
import AnnouncementDetailsPage from "./pages/sidebar/announcements/AnnouncementDetailsPage";
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
    if (permission === "dashboard_view") {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold">Unauthorized</h1>
          <p className="mt-2 text-muted-foreground">You do not have permission to view the dashboard.</p>
        </div>
      );
    }
    return <Redirect to="/dashboard" />;
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
      <Route path="/users/enroll">
        <ProtectedRoute component={EnrollUserPage} permission="users_create" />
      </Route>
      <Route path="/users/:id/edit">
        <ProtectedRoute component={EnrollUserPage} permission="users_edit" />
      </Route>
      <Route path="/users/:id">
        <ProtectedRoute component={UserDetailsPage} permission="users_view" />
      </Route>

      <Route path="/students">
        <ProtectedRoute component={StudentsPage} permission="students_view" />
      </Route>
      <Route path="/student/:id">
        <ProtectedRoute component={StudentDetailsPage} permission="students_view" />
      </Route>
      <Route path="/staff">
        <ProtectedRoute component={StaffPage} permission="users_view" />
      </Route>
      <Route path="/programs">
        <ProtectedRoute component={ProgramsPage} permission="users_view" />
      </Route>
      <Route path="/programs/create">
        <ProtectedRoute component={CreateProgramPage} permission="users_view" />
      </Route>
      <Route path="/programs/:id">
        <ProtectedRoute component={ProgramDetailsPage} permission="users_view" />
      </Route>

      <Route path="/courses/create">
        <ProtectedRoute component={CreateCoursePage} permission="users_view" />
      </Route>
      <Route path="/courses/:id">
        <ProtectedRoute component={CourseDetailsPage} permission="users_view" />
      </Route>

      <Route path="/announcements">
        <ProtectedRoute component={AnnouncementsPage} permission="dashboard_view" />
      </Route>
      <Route path="/announcements/:id">
        <ProtectedRoute component={AnnouncementDetailsPage} permission="dashboard_view" />
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
