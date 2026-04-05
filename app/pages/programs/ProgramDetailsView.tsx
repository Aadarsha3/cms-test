
import { MainLayout } from "@/components/layout/MainLayout";
import { DetailsLoading } from "@/components/common/details/DetailsLoading";
import { DetailsError } from "@/components/common/details/DetailsError";
import { DetailsActionBar } from "@/components/common/details/DetailsActionBar";
import { ProgramInfoCard } from "@/components/program/ProgramInfoCard";
import { CurriculumCard } from "@/components/program/CurriculumCard";
import { EditProgramCard } from "@/components/program/EditProgramCard";

interface ProgramDetail {
  id: string;
  name: string;
  duration: string;
  programCode: string;
  type?: string;
}

interface CourseDetail {
  id: string;
  name: string;
  courseCode: string;
  creditHour: string;
  program?: string;
}

interface EditData {
  name: string;
  code: string;
  type: string;
  duration: string;
}

interface ProgramDetailsViewProps {
  id: string;
  program: ProgramDetail | null;
  loading: boolean;
  error: string | null;
  isEditing: boolean;
  isSaving: boolean;
  courses: CourseDetail[];
  loadingCourses: boolean;
  editData: EditData;
  handleEditFieldChange: (field: keyof EditData, value: string) => void;
  handleSave: () => void;
  handleDelete: () => void;
  setIsEditing: (editing: boolean) => void;
  setEditData: (data: EditData) => void;
  hasPermission: (permission: string) => boolean;
  setLocation: (loc: string) => void;
}

export function ProgramDetailsView({
  id,
  program,
  loading,
  error,
  isEditing,
  isSaving,
  courses,
  loadingCourses,
  editData,
  handleEditFieldChange,
  handleSave,
  handleDelete,
  setIsEditing,
  setEditData,
  hasPermission,
  setLocation,
}: ProgramDetailsViewProps) {
  if (loading) return <DetailsLoading title="Program Details" />;
  if (error || !program)
    return (
      <DetailsError
        title="Program Details"
        error={error || "Not found."}
        backLabel="Go Back"
        onBack={() => setLocation("/programs")}
      />
    );

  return (
    <MainLayout title="Program Details">
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <DetailsActionBar
          onBack={() => setLocation("/programs")}
          canEdit={hasPermission("users_edit")}
          isEditing={isEditing}
          saving={isSaving}
          onEdit={() => setIsEditing(true)}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={() => {
            setIsEditing(false);
            setEditData({
              name: program.name,
              code: program.programCode,
              type: program.type || "",
              duration: program.duration,
            });
          }}
          editLabel="Edit Program"
          deleteLabel="Delete Program"
          confirmDelete={{
            title: "Are you sure?",
            description: `This will permanently delete "${program.name}".`,
          }}
        />

        {isEditing ? (
          <EditProgramCard
            editData={editData}
            onChange={handleEditFieldChange}
            isLoading={isSaving}
          />
        ) : (
          <ProgramInfoCard program={program} />
        )}

        <CurriculumCard programId={id} courses={courses} loading={loadingCourses} />
      </div>
    </MainLayout>
  );
}
