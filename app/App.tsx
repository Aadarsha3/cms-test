import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-context";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { LoginPage } from "@/pages/auth/LoginPage";
import { CallbackPage } from "@/pages/auth/CallbackPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { ChangePasswordPage } from "./pages/profile/ChangePasswordPage";
import { EnrollUserPage } from "@/pages/users/EnrollUserPage";
import { StudentsPage } from "@/pages/users/student/StudentsPage";
import { StudentDetailsPage } from "@/pages/users/student/StudentDetailsPage";
import { StaffPage } from "@/pages/users/staff/StaffPage";
import { StaffDetailsPage } from "@/pages/users/staff/StaffDetailsPage";
import ProgramsPage from "./pages/programs/ProgramsPage";
import CreateProgramPage from "./pages/programs/CreateProgramPage";
import ProgramDetailsPage from "./pages/programs/ProgramDetailsPage";
import CreateCoursePage from "./pages/programs/courses/CreateCoursePage";
import CourseDetailsPage from "./pages/programs/courses/CourseDetailsPage";
import AnnouncementsPage from "./pages/announcements/AnnouncementsPage";
import AnnouncementDetailsPage from "./pages/announcements/AnnouncementDetailsPage";
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

      <Route path="/students">
        <ProtectedRoute component={StudentsPage} permission="students_view" />
      </Route>
      <Route path="/student/:id">
        <ProtectedRoute component={StudentDetailsPage} permission="students_view" />
      </Route>
      <Route path="/staff">
        <ProtectedRoute component={StaffPage} permission="users_view" />
      </Route>
      <Route path="/staff/:id">
        <ProtectedRoute component={StaffDetailsPage} permission="users_view" />
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
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;




























