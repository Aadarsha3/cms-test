import { useState, useEffect } from "react";
import { userApi } from "@/lib/api";
import {
  UserPlus,
  Search,
  SeparatorHorizontal,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { Link, useLocation } from "wouter";

interface UserResponse {
  id: string;
  primaryEmail: string;
  username: string;
  givenName: string;
  familyName: string;
  createdAt: string;
}

export function UsersPage() {
  const { user } = useAuth();
  const [apiUsers, setApiUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userApi.get<UserResponse[]>("/users");
      if (Array.isArray(response.data)) {
        setApiUsers(response.data);
      } else {
        console.warn("API response is not an array:", response.data);
        setApiUsers([]);
        setError("Invalid response format from server");
      }
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
      setError(err.message || "Failed to load users");
      toast({
        title: "Error fetching users",
        description: err.message || "Could not connect to the server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = apiUsers.filter((u) => {
    if (!u) return false;
    const searchLower = search.toLowerCase();
    const username = u.username?.toLowerCase() || "";
    const email = u.primaryEmail?.toLowerCase() || "";
    const id = u.id?.toLowerCase() || "";
    const givenName = u.givenName?.toLowerCase() || "";
    const familyName = u.familyName?.toLowerCase() || "";
    const fullName = `${givenName} ${familyName}`.trim();

    return (
      username.includes(searchLower) ||
      email.includes(searchLower) ||
      id.includes(searchLower) ||
      givenName.includes(searchLower) ||
      familyName.includes(searchLower) ||
      fullName.includes(searchLower)
    );
  });

  const openUserDetails = (userId: string) => {
    setLocation(`/users/${userId}`);
  };

  return (
    <MainLayout title="User Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="user-search-query"
              placeholder="Search by username, email, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11 bg-white dark:bg-zinc-950 border-[#243F76]/10 dark:border-white/10 shadow-sm"
              autoComplete="off"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={fetchUsers}
              className="h-11 w-11 shrink-0"
              title="Refresh List"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              onClick={() => setLocation("/users/enroll")}
              className="gap-2 h-11 px-6 shadow-md hover:shadow-lg transition-all"
            >
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Enroll User</span>
              <span className="sm:hidden">Enroll</span>
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">SN</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-[100px]">ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading users...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {error ? (
                        <span className="text-destructive">
                          Failed to load data. Is the backend running on port
                          8001?
                        </span>
                      ) : (
                        "No users found matching your search."
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user, index) => (
                    <TableRow
                      key={user.id || index}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => user.id && openUserDetails(user.id)}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {user.givenName || "-"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.familyName || "-"}
                      </TableCell>
                      <TableCell>{user.username || "N/A"}</TableCell>
                      <TableCell>{user.primaryEmail || "N/A"}</TableCell>
                      <TableCell>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {user.id ? user.id.slice(0, 8) + "..." : "No ID"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="text-sm text-muted-foreground text-center">
          Showing {filteredUsers.length} users
        </div>
      </div>
    </MainLayout>
  );
}
