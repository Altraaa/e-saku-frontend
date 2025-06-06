import { Search, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useClassroomByTeacherId } from "@/config/Api/useClasroom";
import { useMajors } from "@/config/Api/useMajor";
import { Link } from "react-router-dom";
import { IClassroom } from "@/config/Models/Classroom";
import { IMajor } from "@/config/Models/Major";


const StudentSkeleton = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start gap-2 lg:flex-row lg:justify-between lg:items-center">
        <div>
          <div className="h-8 w-56 bg-gray-200 rounded-md animate-pulse mb-2"></div>
          <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
          <div className="w-full sm:w-32">
            <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="relative w-full sm:w-48">
            <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="relative w-full sm:w-72">
            <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="my-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-8 mt-10">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
          >
            <div className="w-2 h-full absolute left-0 top-0 bg-green-100 rounded-l-lg"></div>
            <div className="py-8 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-200"></div>
              <div className="mt-4 h-6 w-32 bg-gray-200 rounded-md"></div>
              <div className="mt-2 h-4 w-16 bg-gray-200 rounded-md"></div>
              <div className="mt-2 flex items-center px-4">
                <div className="w-6 h-6 rounded-full bg-gray-200 mr-2"></div>
                <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ViewStudent = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [programFilter, setProgramFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddClassModalOpen, setIsAddClassModalOpen] =
    useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [submitError, setSubmitError] = useState<string>("");

  const {
    data: classrooms,
    isLoading: classroomsLoading,
    error,
  } = useClassroomByTeacherId();
  const {
    data: majors,
    isLoading: majorsLoading,
    error: majorsError,
  } = useMajors();

  const teacherName =
    classrooms?.[0]?.teacher?.name || "Teacher name not available";
  const teacherId = classrooms?.[0]?.teacher?.id || 0;

  const [newClass, setNewClass] = useState({
    name: "",
    description: "",
    teacherId: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (classrooms?.length) {
      const currentTeacherId = classrooms[0]?.teacher?.id;
      if (currentTeacherId) {
        setNewClass((prev) => ({
          ...prev,
          teacherId: currentTeacherId,
        }));
      }
    }
  }, [classrooms]);

  const handleInputChange = (field: string, value: string | number) => {
    setNewClass((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (submitError) {
      setSubmitError("");
    }
  };

  const validateForm = () => {
    if (!newClass.name.trim()) {
      setSubmitError("Class name is required");
      return false;
    }
    if (!newClass.description.trim()) {
      setSubmitError("Class description is required");
      return false;
    }
    return true;
  };

  const handleSubmitClass = async () => {
    if (!validateForm()) return;

    setSubmitStatus("submitting");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitStatus("success");

      setTimeout(() => {
        setIsAddClassModalOpen(false);
        resetForm();
      }, 1500);
    } catch (error) {
      setSubmitStatus("error");
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to create class. Please try again."
      );
    }
  };

  const resetForm = () => {
    setNewClass({
      name: "",
      description: "",
      teacherId: teacherId,
    });
    setSubmitStatus("idle");
    setSubmitError("");
  };

  // Helper function to find major by name pattern
  const findMajorByNamePattern = (className: string): IMajor | null => {
    if (!majors || !className) return null;

    // Extract code from class name (e.g., "XI TKR 1" -> "TKR")
    const codeMatch = className.match(/\s([A-Z]{2,3})\s?\d/);
    const extractedCode = codeMatch ? codeMatch[1] : "";

    if (!extractedCode) return null;

    // Find major by checking if the major name contains the extracted code
    return (
      majors.find(
        (major: IMajor) =>
          major.name.toUpperCase().includes(extractedCode) ||
          major.name.toLowerCase().includes(extractedCode.toLowerCase())
      ) || null
    );
  };

  const filteredClassrooms = classrooms?.filter((classroom: IClassroom) => {
    const matchesSearch = classroom.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (programFilter === "all") {
      return matchesSearch;
    }

    // Filter by major ID
    const classroomMajor = findMajorByNamePattern(classroom.name);
    const matchesProgram = classroomMajor?.id?.toString() === programFilter;

    return matchesSearch && matchesProgram;
  });

  // Helper functions for display
  const getProgramInitial = (className: string): string => {
    const major = findMajorByNamePattern(className);
    if (major) {
      // Try to get initials from major name
      const words = major.name.split(" ");
      if (words.length > 1) {
        return words
          .map((word) => word.charAt(0))
          .join("")
          .toUpperCase();
      }
      return major.name.charAt(0).toUpperCase();
    }

    // Fallback to extracting from class name
    const codeMatch = className.match(/\s([A-Z]{2,3})\s?\d/);
    return codeMatch ? codeMatch[1].charAt(0) : "X";
  };

  const getProgramFullName = (className: string): string => {
    const major = findMajorByNamePattern(className);
    return major?.name || "Program Studi";
  };

  if (isLoading || classroomsLoading) {
    return <StudentSkeleton />;
  }

  return (
    <>
      <div className="flex flex-col items-start gap-2 lg:flex-row lg:justify-between lg:items-center">
        <div>
          <h1 className="text-3xl font-bold text-green-500">{teacherName}</h1>
          <p className="text-xl ">Kelas yang diampu :</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
          <Dialog
            open={isAddClassModalOpen}
            onOpenChange={(open) => {
              setIsAddClassModalOpen(open);
              if (!open) {
                resetForm();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                variant="default"
                className="hover:bg-[#009616] hover:text-white transition-all"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Class
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Class</DialogTitle>
                <DialogDescription>
                  Create a new class by filling in the information below
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="className"
                      className="text-sm font-medium text-gray-900"
                    >
                      Class Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="className"
                      placeholder="Enter class name (e.g., XI TKR 1)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                      value={newClass.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      disabled={submitStatus === "submitting"}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="classDescription"
                      className="text-sm font-medium text-gray-900"
                    >
                      Class Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="classDescription"
                      placeholder="Enter class description..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-colors duration-200"
                      value={newClass.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      disabled={submitStatus === "submitting"}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="teacherSelect"
                      className="text-sm font-medium text-gray-500"
                    >
                      Teacher (Auto-assigned)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={teacherName}
                        disabled
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-600 cursor-not-allowed"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Classes will be assigned to the current teacher
                      automatically
                    </p>
                  </div>

                  {submitError && (
                    <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                      <X className="w-4 h-4 flex-shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {submitStatus === "success" && (
                    <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="w-4 h-4 flex-shrink-0">✓</div>
                      <span>Class created successfully!</span>
                    </div>
                  )}

                  {submitStatus === "submitting" && (
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-green-500 h-2 rounded-full transition-all duration-1000 animate-pulse w-3/4"></div>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium mb-2">
                    Class Creation Guidelines:
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li className="flex items-start">
                      <span className="mr-1">•</span>
                      <span>
                        Class name should follow format: Grade + Program +
                        Number (e.g., XI TKR 1)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1">•</span>
                      <span>
                        Description should include program details and academic
                        year
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1">•</span>
                      <span>
                        Teacher assignment is automatic based on current user
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1">•</span>
                      <span>
                        Students can be added to the class after creation
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddClassModalOpen(false)}
                    disabled={submitStatus === "submitting"}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitClass}
                    disabled={submitStatus === "submitting"}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    {submitStatus === "submitting" ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Class...
                      </>
                    ) : submitStatus === "success" ? (
                      <>
                        <div className="w-4 h-4 mr-2">✓</div>
                        Class Created!
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Class
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="w-full sm:w-48">
            <Select
              value={programFilter}
              onValueChange={setProgramFilter}
              disabled={majorsLoading}
            >
              <SelectTrigger className="border-green-500 focus:ring-green-400 rounded-lg h-10">
                <SelectValue
                  placeholder={majorsLoading ? "Loading..." : "Pilih Jurusan"}
                />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto z-10">
                <SelectItem value="all">Pilih Jurusan</SelectItem>
                {majorsError ? (
                  <SelectItem value="error" disabled>
                    Error loading majors
                  </SelectItem>
                ) : (
                  majors?.map((major: IMajor) => (
                    <SelectItem key={major.id} value={major.id.toString()}>
                      {major.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="searchName"
              placeholder="Search by students name"
              className="pl-9 bg-white border border-gray-300 w-full rounded-lg h-10 text-sm outline-none placeholder:text-xs focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="my-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-8 mt-10">
        {error ? (
          <p className="col-span-full text-center text-red-500">
            Error loading data. Please try again.
          </p>
        ) : filteredClassrooms?.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            No classes found matching your filters
          </p>
        ) : (
          filteredClassrooms?.map((classroom: IClassroom) => (
            <Link
              key={classroom.id}
              to={`/student/class/${classroom.id}`}
              className="group"
            >
              <Card className="bg-white shadow-md py-8 flex flex-col items-center group-hover:shadow-lg hover:border-green-500 hover:border transition-all duration-200 relative rounded-lg">
                <div className="w-2 h-full absolute left-0 top-0 bg-green-500 rounded-l-lg"></div>
                <CardHeader className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center p-0">
                  <span className="text-3xl font-bold text-gray-400">
                    {getProgramInitial(classroom.name)}
                  </span>
                </CardHeader>
                <CardTitle className="mt-4 text-2xl font-semibold">
                  <span className="group-hover:text-green-500 transition-all duration-200">
                    {classroom.name}
                  </span>
                </CardTitle>
                <CardContent className="text-gray-400 text-base pt-0">
                  {classroom.total_student || 0} SISWA
                </CardContent>
                <div className="mt-2 flex items-center px-4">
                  <div className="w-6 h-6 rounded-full bg-green-100 border border-green-500 flex items-center justify-center mr-2">
                    <span className="text-green-500 text-xs font-bold">
                      {getProgramInitial(classroom.name)}
                    </span>
                  </div>
                  <span className="text-gray-500 text-sm">
                    {getProgramFullName(classroom.name)}
                  </span>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </>
  );
};

export default ViewStudent;
