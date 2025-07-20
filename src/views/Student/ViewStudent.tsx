import {
  Search,
  Plus,
  X,
  GraduationCap,
  Trash2,
  MoreVertical,
  Edit,
} from "lucide-react";
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
import { useState, useEffect, useRef } from "react";
import {
  useClassroomByTeacherId,
  useClassroomCreate,
  useClassroomDelete,
  useClassroomUpdate,
} from "@/config/Api/useClasroom";
import { useMajors } from "@/config/Api/useMajor";
import { Link } from "react-router-dom";
import { IClassroom } from "@/config/Models/Classroom";
import { IMajor } from "@/config/Models/Major";
import StudentSkeleton from "@/components/shared/component/StudentSekeleton";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import toast from "react-hot-toast";
import ConfirmationModal from "@/components/ui/confirmation";

const ViewStudent = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [programFilter, setProgramFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isAddClassModalOpen, setIsAddClassModalOpen] =
    useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [submitError, setSubmitError] = useState<string>("");
  // Di dalam komponen ViewStudent
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingClass, setEditingClass] = useState<IClassroom | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<number | null>(null);

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

  const { mutate: createClassroom } = useClassroomCreate();

  // Di dalam komponen ViewStudent
  const { mutate: updateClassroom } = useClassroomUpdate();
  const { mutate: deleteClassroom } = useClassroomDelete();

  const [newClass, setNewClass] = useState({
    name: "",
    teacherId: 0,
    totalStudent: 0,
    majorId: undefined as number | undefined,
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
        setNewClass((prev) => ({ ...prev, teacherId: currentTeacherId }));
      }
    }
  }, [classrooms]);

  const handleInputChange = (field: string, value: string | number) => {
    setNewClass((prev) => ({ ...prev, [field]: value }));
    if (submitError) {
      setSubmitError("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenPopoverId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const validateForm = () => {
    if (!newClass.name.trim()) {
      setSubmitError("Class Name is required");
      return false;
    }
    if (!newClass.majorId) {
      setSubmitError("Majors are required");
      return false;
    }
    return true;
  };

  const handleSubmitClass = () => {
    if (!validateForm()) return;
    setSubmitStatus("submitting");

    createClassroom(
      {
        name: newClass.name,
        teacher_id: newClass.teacherId,
        major_id: newClass.majorId,
        total_student: newClass.totalStudent,
      },
      {
        onSuccess: () => {
          setSubmitStatus("success");
          setTimeout(() => {
            setIsAddClassModalOpen(false);
            resetForm();
          }, 1500);
        },
        onError: (error: any) => {
          setSubmitStatus("error");
          setSubmitError(
            error?.response?.data?.message ||
              "Gagal membuat kelas. Silakan coba lagi."
          );
        },
      }
    );
  };

  const resetForm = () => {
    setNewClass({
      name: "",
      majorId: undefined as number | undefined,
      teacherId: classrooms?.[0]?.teacher?.id || 0,
      totalStudent: 0,
    });
    setSubmitStatus("idle");
    setSubmitError("");
  };

  const findMajorByNamePattern = (className: string): IMajor | null => {
    if (!majors || !className) return null;

    const codeMatch = className.match(/\s([A-Z]{2,3})\s?\d/);
    const extractedCode = codeMatch ? codeMatch[1] : "";

    if (!extractedCode) return null;

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

    const classroomMajor = findMajorByNamePattern(classroom.name);
    const matchesProgram = classroomMajor?.id?.toString() === programFilter;

    return matchesSearch && matchesProgram;
  });

  const getProgramInitial = (className: string): string => {
    const major = findMajorByNamePattern(className);
    if (major) {
      const words = major.name.split(" ");
      if (words.length > 1) {
        return words
          .map((word) => word.charAt(0))
          .join("")
          .toUpperCase();
      }
      return major.name.charAt(0).toUpperCase();
    }

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

  const handleEdit = (classroom: IClassroom, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingClass(classroom);
    setIsEditModalOpen(true);
    setOpenPopoverId(null);
  };

 const openDeleteConfirmation = (classroomId: number, e: React.MouseEvent) => {
   e.preventDefault();
   e.stopPropagation();
   setClassToDelete(classroomId);
   setIsDeleteModalOpen(true);
   setOpenPopoverId(null);
 };

 // Fungsi untuk menghapus kelas setelah konfirmasi
 const confirmDelete = () => {
   if (classToDelete) {
     deleteClassroom(classToDelete, {
       onSuccess: () => {
         toast.success("Kelas berhasil dihapus!");
         setIsDeleteModalOpen(false);
         setClassToDelete(null);
       },
       onError: (error) => {
         console.error("Delete error:", error);
         toast.error(`Gagal menghapus kelas: ${error.message}`);
         setIsDeleteModalOpen(false);
       },
     });
   }
 };


  return (
    <div className="container mx-auto px-2 sm:px-4 md:py-4 max-w-full">
      {/* Header Card - Made Responsive */}
      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 shadow-md mb-4 sm:mb-6">
        <CardContent className="p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:mb-2">
            <div className="bg-green-600/40 p-2 rounded-lg mr-0 sm:mr-3 mb-2 sm:mb-0 self-start sm:self-auto">
              <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 break-words">
              {classrooms?.[0]?.teacher?.name || "Teacher name not available"}
            </h1>
          </div>
          <p className="text-sm sm:text-base md:text-lg font-semibold mb-2">
            Kelas yang diampu :
          </p>
        </CardContent>
      </Card>

      {/* Controls Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
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
              className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto text-sm sm:text-base"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-[500px] p-3 sm:p-4 md:p-6 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg md:text-xl">
                Add New Class
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm md:text-base">
                Create a new class by filling in the information below
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 sm:gap-4 py-2 sm:py-4">
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="className"
                    className="text-xs sm:text-sm md:text-base font-medium text-gray-900"
                  >
                    Class Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="className"
                    placeholder="Enter class name (e.g., XI TKR 1)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 text-xs sm:text-sm md:text-base"
                    value={newClass.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={submitStatus === "submitting"}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="majorSelect"
                    className="text-xs sm:text-sm md:text-base font-medium text-gray-900"
                  >
                    Major <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={newClass.majorId?.toString()}
                    onValueChange={(value) =>
                      handleInputChange("majorId", parseInt(value))
                    }
                  >
                    <SelectTrigger className="border-gray-300 focus:ring-green-500 focus:border-green-500 rounded-lg h-9 sm:h-10 bg-white text-xs sm:text-sm md:text-base">
                      <SelectValue placeholder="Select a major" />
                    </SelectTrigger>
                    <SelectContent>
                      {majors?.map((major) => (
                        <SelectItem
                          key={major.id}
                          value={major.id.toString()}
                          className="text-xs sm:text-sm md:text-base"
                        >
                          {major.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="teacherSelect"
                    className="text-xs sm:text-sm md:text-base font-medium text-gray-500"
                  >
                    Teacher (Auto-assigned)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={
                        classrooms?.[0]?.teacher?.name ||
                        "Teacher name not available"
                      }
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-600 cursor-not-allowed text-xs sm:text-sm md:text-base"
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
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-2 text-xs sm:text-sm text-red-600">
                        <X className="w-4 h-4 flex-shrink-0" />
                        <span>{submitError}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {submitStatus === "success" && (
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-2 text-xs sm:text-sm text-green-600">
                        <div className="w-4 h-4 flex-shrink-0">✓</div>
                        <span>Class created successfully!</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {submitStatus === "submitting" && (
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-green-500 h-2 rounded-full transition-all duration-1000 animate-pulse w-3/4"></div>
                  </div>
                )}
              </div>

              {/* Guidelines Card - Made Responsive */}
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-3 sm:p-4">
                  <h4 className="text-xs sm:text-sm md:text-base font-medium mb-2">
                    Class Creation Guidelines:
                  </h4>
                  <ul className="space-y-1 text-xs sm:text-sm">
                    <li className="flex items-start">
                      <span className="mr-1">•</span>
                      <span>
                        Class name should follow format:
                        <p className="font-medium">
                          Grade + Program + Number (e.g., XI TKR 1)
                        </p>
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1">•</span>
                      <span>
                        The major must be in accordance with the class that will
                        be created
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
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddClassModalOpen(false)}
                  disabled={submitStatus === "submitting"}
                  className="w-full sm:w-auto text-xs sm:text-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitClass}
                  disabled={submitStatus === "submitting"}
                  className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto text-xs sm:text-sm"
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

        <Dialog
          open={isEditModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsEditModalOpen(false);
              setEditingClass(null);
            }
          }}
        >
          <DialogContent className="max-w-[95vw] sm:max-w-[500px] p-3 sm:p-4 md:p-6 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg md:text-xl">
                Edit Class
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm md:text-base">
                Update class information below
              </DialogDescription>
            </DialogHeader>

            {editingClass && (
              <div className="grid gap-3 sm:gap-4 py-2 sm:py-4">
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="editClassName"
                      className="text-xs sm:text-sm md:text-base font-medium text-gray-900"
                    >
                      Class Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="editClassName"
                      placeholder="Enter class name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 text-xs sm:text-sm md:text-base"
                      value={editingClass.name}
                      onChange={(e) =>
                        setEditingClass({
                          ...editingClass,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="editMajorSelect"
                      className="text-xs sm:text-sm md:text-base font-medium text-gray-900"
                    >
                      Major <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={editingClass.major_id?.toString()}
                      onValueChange={(value) =>
                        setEditingClass({
                          ...editingClass,
                          major_id: parseInt(value),
                        })
                      }
                    >
                      <SelectTrigger className="border-gray-300 focus:ring-green-500 focus:border-green-500 rounded-lg h-9 sm:h-10 bg-white text-xs sm:text-sm md:text-base">
                        <SelectValue placeholder="Select a major" />
                      </SelectTrigger>
                      <SelectContent>
                        {majors?.map((major) => (
                          <SelectItem
                            key={major.id}
                            value={major.id.toString()}
                            className="text-xs sm:text-sm md:text-base"
                          >
                            {major.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {submitError && (
                    <Card className="border-red-200 bg-red-50">
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-red-600">
                          <X className="w-4 h-4 flex-shrink-0" />
                          <span>{submitError}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {submitStatus === "success" && (
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-green-600">
                          <div className="w-4 h-4 flex-shrink-0">✓</div>
                          <span>Class updated successfully!</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditModalOpen(false)}
                    disabled={submitStatus === "submitting"}
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (!editingClass.name.trim()) {
                        setSubmitError("Class Name is required");
                        return;
                      }
                      if (!editingClass.major_id) {
                        setSubmitError("Majors are required");
                        return;
                      }

                      setSubmitStatus("submitting");

                      updateClassroom(
                        {
                          id: editingClass.id,
                          data: {
                            name: editingClass.name,
                            major_id: editingClass.major_id,
                          },
                        },
                        {
                          onSuccess: () => {
                            setSubmitStatus("success");
                            setTimeout(() => {
                              setIsEditModalOpen(false);
                              setEditingClass(null);
                            }, 1500);
                          },
                          onError: (error: any) => {
                            setSubmitStatus("error");
                            setSubmitError(
                              error?.response?.data?.message ||
                                "Failed to update class. Please try again."
                            );
                          },
                        }
                      );
                    }}
                    disabled={submitStatus === "submitting"}
                    className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto text-xs sm:text-sm"
                  >
                    {submitStatus === "submitting" ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating Class...
                      </>
                    ) : submitStatus === "success" ? (
                      <>
                        <div className="w-4 h-4 mr-2">✓</div>
                        Class Updated!
                      </>
                    ) : (
                      "Update Class"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full lg:w-auto">
          <div className="w-full sm:w-40 md:w-48">
            <Select
              value={programFilter}
              onValueChange={setProgramFilter}
              disabled={majorsLoading}
            >
              <SelectTrigger className="border-green-300 focus:ring-green-400 focus:border-green-500 rounded-lg h-9 sm:h-10 bg-white shadow-sm text-xs sm:text-sm md:text-base">
                <SelectValue
                  placeholder={majorsLoading ? "Loading..." : "Pilih Jurusan"}
                />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto z-10 text-xs sm:text-sm md:text-base">
                <SelectItem value="all">Semua Jurusan</SelectItem>
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

          <div className="relative w-full sm:w-64 md:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="searchName"
              placeholder="Search by class name..."
              className="pl-9 pr-4 py-2 bg-white border border-gray-300 w-full rounded-lg h-9 sm:h-10 text-xs sm:text-sm md:text-base outline-none placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {error ? (
          <div className="col-span-full">
            <Card className="border-red-200">
              <CardContent className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                  Error Loading Classes
                </h3>
                <p className="text-sm sm:text-base text-gray-500">
                  Unable to load classes. Please try again later.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : filteredClassrooms?.length === 0 ? (
          <div className="col-span-full">
            <Card className="border-gray-200">
              <CardContent className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                  No Classes Found
                </h3>
                <p className="text-sm sm:text-base text-gray-500 mb-4">
                  {searchTerm || programFilter !== "all"
                    ? "No classes match your current filters."
                    : "You haven't created any classes yet."}
                </p>
                {!searchTerm && programFilter === "all" && (
                  <Button
                    onClick={() => setIsAddClassModalOpen(true)}
                    className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto text-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Class
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredClassrooms?.map((classroom: IClassroom) => (
            <Link
              key={classroom.id}
              to={`/student/class/${classroom.id}`}
              className="group"
            >
              <Card className="bg-white shadow-md hover:shadow-lg hover:border-green-500 hover:border transition-all duration-200 relative rounded-lg min-h-[200px] sm:min-h-[220px]">
                <div className="w-2 h-full absolute left-0 top-0 bg-green-500 rounded-l-lg"></div>
                <div className="absolute top-3 right-3 z-10">
                  <Popover
                    open={openPopoverId === classroom.id}
                    onOpenChange={(open) =>
                      setOpenPopoverId(open ? classroom.id : null)
                    }
                  >
                    <PopoverTrigger asChild>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Toggle the popover state
                          setOpenPopoverId(
                            openPopoverId === classroom.id ? null : classroom.id
                          );
                        }}
                        className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 hover:shadow-md active:scale-95"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-44 p-1 shadow-lg border border-gray-200 bg-white rounded-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                      side="bottom"
                      align="end"
                      sideOffset={5}
                    >
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={(e) => handleEdit(classroom, e)}
                          className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200 w-full text-left"
                        >
                          <Edit className="w-4 h-4 mr-3 text-gray-500" />
                          Edit Class
                        </button>
                        <hr className="border-gray-100" />
                        <button
                          onClick={(e) =>
                            openDeleteConfirmation(classroom.id, e)
                          }
                          className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 w-full text-left"
                        >
                          <Trash2 className="w-4 h-4 mr-3 text-red-500" />
                          Delete Class
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center h-full justify-center">
                  <CardHeader className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gray-200 flex items-center justify-center p-0 mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-400">
                      {getProgramInitial(classroom.name)}
                    </span>
                  </CardHeader>
                  <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-2 break-words">
                    <span className="group-hover:text-green-500 transition-all duration-200">
                      {classroom.name}
                    </span>
                  </CardTitle>
                  <div className="text-gray-400 text-xs sm:text-sm md:text-base mb-3">
                    {classroom.total_student || 0} SISWA
                  </div>
                  <div className="flex items-center justify-center px-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-green-100 border border-green-500 flex items-center justify-center mr-2 flex-shrink-0">
                      <span className="text-green-500 text-xs font-bold">
                        {getProgramInitial(classroom.name)}
                      </span>
                    </div>
                    <span className="text-gray-500 text-xs sm:text-sm break-words text-center">
                      {getProgramFullName(classroom.name)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Konfirmasi Penghapusan"
        description="Apakah Anda yakin ingin menghapus kelas ini? Data yang dihapus tidak dapat dikembalikan."
        confirmText="Hapus"
        cancelText="Batal"
        type="delete"
      />
    </div>
  );
};

export default ViewStudent;
