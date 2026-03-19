import { useState, useEffect } from "react";
import { userApi } from "@/lib/api";
import { UserPlus, Search, Loader2, RefreshCw } from "lucide-react";
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
import { useLocation } from "wouter";

interface UserResponse {
  id: string;
  primaryEmail: string;
  username: string;
  givenName: string;
  familyName: string;
  createdDate: number[];
}

interface UserTableProps {
  title: string;
  roleFilter?: string; // Optional role string (e.g., "student", "teacher", "staff,admin")
  enrollPath?: string; // Path to redirect for enrolling a new user
  enrollLabel?: string; // Text for the enroll button
}

export function UserTable({
  title,
  roleFilter,
  enrollPath = "/users/enroll",
  enrollLabel = "Enroll User",
}: UserTableProps) {
  const [apiUsers, setApiUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [sort] = useState("id");
  const [direction] = useState("DESC");

  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page, size, sort, direction };
      if (roleFilter) {
        params.role = roleFilter;
      }

      const response = await userApi.get<UserResponse[]>("/users", { params });

      if (Array.isArray(response.data)) {
        setApiUsers(response.data);
      } else {
        const data = response.data as any;
        if (data && Array.isArray(data.content)) {
          setApiUsers(data.content);
        } else {
          console.warn("Unexpected API response format:", response.data);
          setApiUsers([]);
          setError("Invalid response format from server");
        }
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
  }, [page, size, sort, direction, roleFilter]);

  const filteredUsers = apiUsers.filter((u) => {
    if (!u) return false;
    const searchLower = search.toLowerCase();
    const username = u.username?.toLowerCase() || "";
    const email = u.primaryEmail?.toLowerCase() || "";
    const id = u.id?.toLowerCase() || "";
    const givenName = u.givenName?.toLowerCase() || "";
    const familyName = u.familyName?.toLowerCase() || "";
    const fullName = `${givenName} ${familyName}`.trim();
    const createdDate = u.createdDate;
    console.log("abc :" + createdDate);

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

  const handleNextPage = () => {
    if (apiUsers.length === size) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    setPage(0);
  }, [search]);

  return (
    <MainLayout title={title}>
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
              onClick={() => setLocation(enrollPath)}
              className="gap-2 h-11 px-6 shadow-md hover:shadow-lg transition-all"
            >
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">{enrollLabel}</span>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {error ? (
                        <span className="text-destructive">
                          Failed to load data.
                          8001?
                        </span>
                      ) : (
                        "No matching users found."
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
                      <TableCell>{page * size + index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {user.givenName || "-"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.familyName || "-"}
                      </TableCell>
                      <TableCell>{user.username || "N/A"}</TableCell>
                      <TableCell>{user.primaryEmail || "N/A"}</TableCell>
                      <TableCell>
                        {user.createdDate
                          ? (() => {
                              const [y, m, d] = user.createdDate;
                              return `${y} /${m}/${d}`;
                            })()
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {!loading && apiUsers.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {page * size + 1}-{page * size + apiUsers.length} entries
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={page === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={apiUsers.length < size}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
