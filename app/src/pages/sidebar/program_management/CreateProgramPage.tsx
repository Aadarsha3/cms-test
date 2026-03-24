import { useState } from "react";
import { useLocation } from "wouter";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { dashboardApi } from "@/lib/api";
import { ChevronLeft, Save, Loader2 } from "lucide-react";

export default function CreateProgramPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "",
    duration: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code || !formData.type || !formData.duration) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        duration: formData.duration,
        programCode: formData.code,
      };

      await dashboardApi.post("/programs", payload);
      toast({
        title: "Success",
        description: "Program created successfully.",
      });
      setLocation("/programs");
    } catch (err: any) {
      console.error("Failed to create program:", err?.response?.data || err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        JSON.stringify(err.response?.data) ||
        err.message ||
        "Failed to create program.";
        
      toast({
        title: "Error",
        description: typeof errorMsg === 'string' ? errorMsg : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const programTypes = ["Bachelor", "Master"];
  const durationOptions = [
    { label: "1 Year", value: "1 year" },
    { label: "2 Years", value: "2 year" },
    { label: "3 Years", value: "3 year" },
    { label: "4 Years", value: "4 year" },
    { label: "5 Years", value: "5 year" },
    { label: "6 Years", value: "6 year" },
    { label: "2 Semesters", value: "2 sem" },
    { label: "4 Semesters", value: "4 sem" },
    { label: "6 Semesters", value: "6 sem" },
    { label: "8 Semesters", value: "8 sem" },
  ];

  return (
    <MainLayout title="Create New Program">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/programs")}
            className="rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-[#243F76] dark:text-white">
            Program Details
          </h1>
        </div>

        <Card className="border-[#243F76]/10 dark:border-white/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-medium">New Program Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="program-name">
                      Program Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="program-name"
                      placeholder="e.g. Computer Science"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="program-code">
                      Program Code <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="program-code"
                      placeholder="e.g. CS101"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="program-type">
                      Program Type <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(v) => setFormData({ ...formData, type: v })}
                    >
                      <SelectTrigger id="program-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {programTypes.map((t) => (
                          <SelectItem key={t} value={t.toLowerCase()}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="program-duration">
                      Program Duration <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.duration}
                      onValueChange={(v) => setFormData({ ...formData, duration: v })}
                    >
                      <SelectTrigger id="program-duration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {durationOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#243F76]/10 dark:border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/programs")}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#243F76] hover:bg-[#1a2e56] text-white gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Create Program
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
