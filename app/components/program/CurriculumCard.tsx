import { BookOpen, ChevronRight, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";

interface CourseDetail {
  id: string;
  name: string;
  courseCode: string;
  creditHour: string;
  program?: string;
}

interface CurriculumCardProps {
  programId: string;
  courses: CourseDetail[];
  loading: boolean;
}

export function CurriculumCard({ programId, courses, loading }: CurriculumCardProps) {
  const [, setLocation] = useLocation();

  return (
    <Card className="border-border shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/40 py-4 border-b flex flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg font-bold">Courses</CardTitle>
        </div>
        <Button size="sm" onClick={() => setLocation(`/courses/create?program=${programId}`)} className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          <span>Add Course</span>
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-3">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground border border-dashed rounded-lg bg-muted/10">
              <Loader2 className="h-5 w-5 animate-spin mr-3 opacity-50" />
              <span>Loading courses...</span>
            </div>
          ) : courses.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground border border-dashed rounded-lg bg-muted/10">
              No courses found for this program.
            </div>
          ) : (
            courses.map((course) => (
              <div
                key={course.id}
                onClick={() => setLocation(`/courses/${course.id}`)}
                className="group flex items-center justify-between p-4 rounded-xl border border-border bg-card/50 transition-all cursor-pointer hover:bg-muted/30 hover:border-primary/20 hover:shadow-sm gap-3"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {course.name || "-"}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground/80 mt-0.5">
                      {course.courseCode && (
                        <>
                          <span className="font-mono">{course.courseCode}</span>
                          <span>•</span>
                        </>
                      )}
                      <span>{course.creditHour || "0"} Credits</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
