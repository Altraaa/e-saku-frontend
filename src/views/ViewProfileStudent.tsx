import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Clock, Edit, Save, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useStudentById } from "@/config/Api/useStudent";
import { IStudent } from "@/config/Models/Student";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

const ViewProfileStudent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [studentData, setStudentData] = useState<IStudent | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [lastActive, setLastActive] = useState<string>("N/A");
  
  // Extracurricular state management
  const [isEditing, setIsEditing] = useState(false);
  const [tempExtracurriculars, setTempExtracurriculars] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const extracurricularOptions = [
    {
      category: "Sports",
      items: [
        { id: "sports-1", name: "Basketball" },
        { id: "sports-2", name: "Football" },
        { id: "sports-3", name: "Badminton" }
      ]
    },
    {
      category: "Arts",
      items: [
        { id: "arts-1", name: "Music Band" },
        { id: "arts-2", name: "Drawing Club" },
        { id: "arts-3", name: "Drama Club" }
      ]
    },
    {
      category: "Academic",
      items: [
        { id: "academic-1", name: "Science Club" },
        { id: "academic-2", name: "Math Olympiad" },
        { id: "academic-3", name: "Debate Team" }
      ]
    }
  ];

  // Get student ID from localStorage
  const studentId = localStorage.getItem("student_id") || "";

  // Fetch student data
  const { data: student, isLoading: studentLoading } = useStudentById(studentId);

  useEffect(() => {
    if (student) {
      setStudentData(student);
      if (student.profile_image) {
        setPhotoUrl(
          `${import.meta.env.VITE_API_URL?.replace("/api", "/public")}${
            student.profile_image
          }`
        );
      }

      // setTempExtracurriculars(student.extracurriculars || []);
      
      const lastActivityRaw = localStorage.getItem("last_activity");
      if (lastActivityRaw) {
        try {
          const date = new Date(lastActivityRaw);
          const formatted = date.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
          setLastActive(formatted);
        } catch (error) {
          console.error("Error formatting last_activity:", error);
          setLastActive("N/A");
        }
      }
    }

    if (!studentLoading) {
      setIsLoading(false);
    }
  }, [student, studentLoading]);

  const handleAddExtracurricular = (value: string) => {
    if (!tempExtracurriculars.includes(value)) {
      setTempExtracurriculars([...tempExtracurriculars, value]);
    }
  };

  const handleRemoveExtracurricular = (value: string) => {
    setTempExtracurriculars(
      tempExtracurriculars.filter((item) => item !== value)
    );
  };

  const handleEditClick = () => {
    setIsEditing(true);
    // Copy current extracurriculars to temp state when starting to edit
    setTempExtracurriculars(studentData?.extracurriculars || []);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset to original extracurriculars
    setTempExtracurriculars(studentData?.extracurriculars || []);
  };

  const handleSaveExtracurriculars = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Saving extracurriculars:", tempExtracurriculars);
      setIsSubmitting(false);
      setIsEditing(false);
      
      // Update student data with new extracurriculars
      if (studentData) {
        setStudentData({
          ...studentData,
          extracurriculars: tempExtracurriculars
        });
      }
      
      toast({
        title: "Perubahan Disimpan",
        description: "Pilihan ekstrakurikuler berhasil diperbarui",
        variant: "default",
      });
    }, 1000);
  };

  const imageSrc = photoUrl
    ? photoUrl
    : student?.profile_image
    ? `${import.meta.env.VITE_API_URL?.replace("/api", "/public")}${
        student.profile_image
      }`
    : "";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-14 h-14 border-4 border-gray-300 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-600 text-lg font-medium">
          Gagal memuat data profil
        </p>
      </div>
    );
  }

  // Helper to get extracurricular name by ID
  const getExtracurricularName = (id: string) => {
    for (const group of extracurricularOptions) {
      const found = group.items.find(item => item.id === id);
      if (found) return found.name;
    }
    return "Unknown";
  };

  return (
    <div className="container mx-auto py-4 sm:py-6 px-3 sm:px-4 text-black">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-black">
          Biodata Siswa
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(250px,300px)_1fr] gap-4 sm:gap-6 lg:gap-8">
        {/* Left Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Profile Photo Card */}
            <Card className="shadow-sm border border-gray-200 bg-white rounded-lg overflow-hidden">
              <CardHeader className="bg-white py-3 px-4">
                <CardTitle className="text-center text-black">
                  Foto Profil
                </CardTitle>
                <div className="relative flex justify-center mt-5">
                  <div className="absolute w-64 h-0.5 bg-green-400 rounded-full shadow-sm mt-1"></div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 flex flex-col items-center">
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-gray-200 flex items-center justify-center mb-4 sm:mb-6 border-4 border-green-100 overflow-hidden">
                  {photoUrl ? (
                    <img
                      src={imageSrc}
                      alt="Student profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User  
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-gray-400"
                      strokeWidth={1}
                    />
                  )}
                </div>
              </CardContent>

              <div className="p-4 w-full">
                <div className="flex justify-center gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={handleSaveExtracurriculars}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        disabled={isSubmitting || tempExtracurriculars.length === 0}
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Simpan
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Batal
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleEditClick}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profil
                    </Button>
                  )}
                </div>
              </div>
            </Card>

          {/* Last Activity */}
          <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-3 flex items-center text-sm text-gray-600">
            <Clock size={16} className="mr-2 text-green-600" />
            Terakhir aktif pada {lastActive}
          </div>
        </div>

        {/* Right Content */}
        <div className="space-y-4 sm:space-y-6">
          {/* Personal Information Card */}
          <Card className="shadow-sm border border-gray-200 bg-white rounded-lg overflow-hidden">
            <CardHeader className="bg-white py-3 px-4">
              <CardTitle className="text-black flex items-center">
                <User  className="mr-2 h-5 w-5" />
                Informasi Pribadi
              </CardTitle>
              <div className="relative flex justify-center mt-5">
                <div className="absolute w-full h-0.5 bg-green-400 rounded-full shadow-sm mt-1"></div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Nama Lengkap
                  </label>
                  <div className="p-2 bg-gray-100 border border-gray-200 rounded-lg">
                    {studentData.name}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      NIS
                    </label>
                    <div className="p-2 bg-gray-100 border border-gray-200 rounded-lg">
                      {studentData.nis || "Tidak diatur"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      NISN
                    </label>
                    <div className="p-2 bg-gray-100 border border-gray-200 rounded-lg">
                      {studentData.nisn || "Tidak diatur"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Kelas
                    </label>
                    <div className="p-2 bg-gray-100 border border-gray-200 rounded-lg">
                      {student?.classroom?.name || "Tidak diatur"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Email
                    </label>
                    <div className="p-2 bg-gray-100 border border-gray-200 rounded-lg">
                      {studentData.email || "Tidak diatur"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-gray-200 bg-white rounded-lg overflow-hidden">
            <CardHeader className="bg-white py-3 px-4">
              <CardTitle className="text-black">
                Ekstrakurikuler
              </CardTitle>
              <div className="relative flex justify-center mt-5">
                <div className="absolute w-full h-0.5 bg-green-400 rounded-full shadow-sm mt-1"></div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {!isEditing ? (
                // View Mode
                <div className="space-y-3">
                  {studentData.extracurriculars && studentData.extracurriculars.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {studentData.extracurriculars.map(id => (
                        <Badge 
                          key={id}
                          variant="secondary"
                          className="px-3 py-1 text-sm"
                        >
                          {getExtracurricularName(id)}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Belum ada ekstrakurikuler yang dipilih</p>
                  )}
                </div>
              ) : (
                // Edit Mode
                <div className="space-y-4">
                  {/* Add New */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Tambah Ekstrakurikuler
                    </h3>
                    <div className="flex gap-2">
                      <Select 
                        onValueChange={handleAddExtracurricular}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih ekstrakurikuler..." />
                        </SelectTrigger>
                        <SelectContent>
                          {extracurricularOptions.map((group) => (
                            <div key={group.category}>
                              <div className="px-2 py-1 text-xs font-medium text-gray-500">
                                {group.category}
                              </div>
                              {group.items.map((item) => (
                                <SelectItem
                                  key={item.id}
                                  value={item.id}
                                  disabled={tempExtracurriculars.includes(item.id)}
                                >
                                  {item.name}
                                </SelectItem>
                              ))}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Selected Items */}
                  {tempExtracurriculars.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Ekstrakurikuler Dipilih ({tempExtracurriculars.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {tempExtracurriculars.map((id) => (
                          <Badge
                            key={id}
                            variant="outline"
                            className="px-3 py-1 text-sm flex items-center gap-1"
                          >
                            {getExtracurricularName(id)}
                            <button
                              type="button"
                              onClick={() => handleRemoveExtracurricular(id)}
                              className="text-gray-500 hover:text-red-500"
                              disabled={isSubmitting}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewProfileStudent;
