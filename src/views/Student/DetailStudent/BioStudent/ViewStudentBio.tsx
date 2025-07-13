import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  User,
  Award,
  AlertTriangle,
  SquarePen,
  Trash2,
  MoveLeft,
  BookOpen,
  Users,
  Save,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form";
import {
  useStudentById,
  useStudentDeleteProfile,
  useStudentUpdate,
  useStudentUpload,
} from "@/config/Api/useStudent";
import { useClassroomById } from "@/config/Api/useClasroom";
import { IStudent } from "@/config/Models/Student";
import { IClassroom } from "@/config/Models/Classroom";
import toast from "react-hot-toast";
import ConfirmationModal from "@/components/ui/confirmation";

const ViewStudentBio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const studentId = id ?? "";
  const [loading, setLoading] = useState(true);
  const [classroomData, setClassroomData] = useState<IClassroom | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data: student, isLoading, refetch } = useStudentById(studentId);
  const uploadMutation = useStudentUpload();
  const deleteProfileMutation = useStudentDeleteProfile();
  const updateMutation = useStudentUpdate();

  const [formData, setFormData] = useState<IStudent>({
    id: 0,
    name: "",
    nis: "",
    nisn: "",
    email: "",
    class_id: 0,
    major_id: 0,
    place_of_birth: "",
    birth_date: "",
    gender: "",
    religion: "",
    height: "",
    weight: "",
    phone_number: "",
    address: "",
    sub_district: "",
    district: "",
    father_name: null,
    father_job: null,
    mother_name: null,
    mother_job: null,
    guardian_name: null,
    guardian_job: null,
    profile_image: null,
    point_total: 0,
    created_at: "",
    updated_at: "",
    violations_sum_points: 0,
    accomplishments_sum_points: 0,
    classroom: undefined,
    major: [],
  });

  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (student) {
      setFormData(student);
      if (student.profile_image) {
        setPhotoUrl(
          (import.meta.env.VITE_API_URL?.replace("/api", "/public") || "") +
            student.profile_image
        );
      }
    }
  }, [student]);

  // Fetch classroom data separately
  const classId = formData?.class_id || 0;
  const { data: classroom } = useClassroomById(classId);

  useEffect(() => {
    if (classroom) {
      setClassroomData(classroom);
    }
  }, [classroom]);

  const handleInputChange = (field: string, value: unknown) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      if (student) {
        setFormData(student);
      }
    }
  };

  // Start Profile Image
  const handleChangeAvatar = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const localUrl = URL.createObjectURL(file);
        setPhotoUrl(localUrl);
        setSelectedFile(file);
        console.log("File selected:", file);
      } else {
        console.log("No file selected");
      }
    };

    fileInput.click();
  };

  const handleSavePhoto = () => {
    if (!selectedFile || !studentId) return;
    console.log("studentId", studentId);

    uploadMutation.mutate(
      { id: studentId, file: selectedFile },
      {
        onSuccess: () => {
          toast.success("Foto profil berhasil diubah!");
          setSelectedFile(null);
        },
        onError: () => {
          toast.error("Gagal mengubah foto profil!");
        },
      }
    );
  };

  const handleDeleteProfile = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setDeleteModalOpen(false);
    if (!studentId) return;

    deleteProfileMutation.mutate(studentId, {
      onSuccess: () => {
        toast.success("Foto profil berhasil dihapus!");
        setPhotoUrl(undefined);
        setSelectedFile(null);
      },
      onError: () => {
        toast.error("Gagal menghapus foto profil!");
      },
    });
  };
  // End Profile Image

  const handleSaveChanges = () => {
    if (!formData || !studentId) return;

    const updateData = {
      name: formData.name,
      nis: formData.nis,
      nisn: formData.nisn,
      place_of_birth: formData.place_of_birth,
      birth_date: formData.birth_date,
      gender: formData.gender,
      religion: formData.religion,
      address: formData.address ?? "",
      sub_district: formData.sub_district ?? "",
      district: formData.district ?? "",
      height: formData.height,
      weight: formData.weight,
      phone_number: formData.phone_number ?? "",
      father_name: formData.father_name ?? "",
      father_job: formData.father_job ?? "",
      mother_name: formData.mother_name ?? "",
      mother_job: formData.mother_job ?? "",
      guardian_name: formData.guardian_name ?? "",
      guardian_job: formData.guardian_job ?? "",
    };

    updateMutation.mutate(
      {
        id: studentId,
        data: updateData,
      },
      {
        onSuccess: () => {
          toast.success("Data profil berhasil diperbarui!");
          setIsEditing(false);
          refetch();
        },
        onError: (error) => {
          console.error("Error updating data:", error);
          toast.error("Gagal memperbarui profil. Coba lagi.");
        },
      }
    );
  };

  if (!id) {
    return <div className="p-4 md:p-6 text-red-500">Invalid student ID</div>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 md:w-14 md:h-14 border-4 border-gray-300 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!formData) {
    return <div className="p-4 md:p-6 text-red-500">Student not found</div>;
  }

  const imageSrc = photoUrl
    ? photoUrl
    : formData?.profile_image
    ? `${import.meta.env.VITE_API_URL?.replace("/api", "/public")}${
        formData.profile_image
      }`
    : "";

  return (
    <div className="container mx-auto py-4 sm:py-6 px-3 sm:px-4 text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 sm:mb-4 gap-3">
        <div className="items-center gap-4">
          <button
            onClick={() => navigate(`/student/class/${formData.class_id}`)}
            className="group flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 group-hover:border-green-500 group-hover:bg-green-50 transition-all">
              <MoveLeft className="h-4 w-4" />
            </div>
            <span className="font-medium text-sm md:text-base">
              Back to Class
            </span>
          </button>
          <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 mt-2 md:mt-4">
            Biodata Siswa
          </div>
        </div>
      </div>

      {/* Updated Layout Structure */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
        {/* Left Sidebar - Fixed width */}
        <div className="lg:w-[300px] lg:flex-shrink-0 space-y-4 sm:space-y-6">
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
                    alt={formData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-gray-400"
                    strokeWidth={1}
                  />
                )}
              </div>

              <div className="space-y-2 w-full">
                {selectedFile ? (
                  <Button
                    onClick={handleSavePhoto}
                    disabled={!selectedFile}
                    type="button"
                    className="w-full bg-blue-600 p-3 font-semibold text-white rounded-md hover:bg-blue-500 transition-all duration-200 text-sm md:text-base"
                  >
                    Save Profile Picture
                  </Button>
                ) : (
                  <Button
                    onClick={handleChangeAvatar}
                    type="button"
                    className="w-full bg-blue-600 p-3 font-semibold text-white rounded-md hover:bg-blue-500 transition-all duration-200 text-sm md:text-base"
                  >
                    Update Profile Picture
                  </Button>
                )}

                <Button
                  onClick={handleDeleteProfile}
                  variant="default"
                  className="w-full bg-red-600 hover:bg-red-700 text-white transition-all"
                >
                  <Trash2 size={16} className="inline-block mr-2" />
                  Hapus Foto
                </Button>

                {/* Edit Control Bar */}
                <div className="flex justify-center gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={handleSaveChanges}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Simpan
                      </Button>
                      <Button
                        onClick={toggleEditMode}
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Batal
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={toggleEditMode}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <SquarePen className="w-4 h-4 mr-2" />
                      Edit Profil
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="shadow-sm border border-gray-200 bg-white rounded-lg overflow-hidden">
            <CardHeader className="bg-white py-3 px-4">
              <CardTitle className="text-center text-black flex items-center justify-center gap-2">
                <BookOpen size={20} className="text-green-600" />
                Aksi Cepat
              </CardTitle>
              <div className="relative flex justify-center mt-5">
                <div className="absolute w-64 h-0.5 bg-green-400 rounded-full shadow-sm mt-1"></div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-green-600 hover:bg-green-700 text-white transition-all"
                >
                  <Link to={`/studentbio/accomplishments/${formData.id}`}>
                    <Award size={16} className="mr-2" />
                    Prestasi Saya
                  </Link>
                </Button>

                <Button
                  asChild
                  className="w-full bg-red-600 hover:bg-red-700 text-white transition-all"
                >
                  <Link to={`/studentbio/violations/${formData.id}`}>
                    <AlertTriangle size={16} className="mr-2" />
                    Pelanggaran Saya
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Content - Full width with left margin compensation */}
        <div className="flex-1 space-y-4 sm:space-y-6">
          {/* Personal Information Card */}
          <Card className="shadow-sm border border-gray-200 bg-white rounded-lg overflow-hidden">
            <CardHeader className="bg-white py-3 px-4">
              <CardTitle className="text-black flex items-center">
                <User className="mr-2 h-5 w-5" />
                Informasi Pribadi
              </CardTitle>
              <div className="relative flex justify-center mt-5">
                <div className="absolute w-full h-0.5 bg-green-400 rounded-full shadow-sm mt-1"></div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    {isEditing ? (
                      <FormInput
                        type="text"
                        value={formData.nis}
                        onChange={(e) =>
                          handleInputChange("nis", e.target.value)
                        }
                        className="w-full"
                        id={formData.nis}
                        label={"NIS"}
                      />
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          NIS
                        </label>
                        <div className="p-2 pl-4 bg-gray-100 border border-gray-200 rounded-lg">
                          {formData.nis || "Tidak diatur"}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    {isEditing ? (
                      <FormInput
                        type="text"
                        value={formData.nisn}
                        onChange={(e) =>
                          handleInputChange("nisn", e.target.value)
                        }
                        className="w-full"
                        id={formData.nisn}
                        label={"NISN"}
                      />
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          NISN
                        </label>
                        <div className="p-2 pl-4 bg-gray-100 border border-gray-200 rounded-lg">
                          {formData.nisn || "Tidak diatur"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  {isEditing ? (
                    <FormInput
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full"
                      id={formData.name}
                      label={"Nama Lengkap"}
                    />
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">
                        Nama Lengkap
                      </label>
                      <div className="p-2 pl-4 bg-gray-100 border border-gray-200 rounded-lg">
                        {formData.name || "Tidak diatur"}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  {isEditing ? (
                    <FormInput
                      type="text"
                      value={classroomData?.name}
                      disabled
                      className="w-full"
                      id={classroomData?.name || ""}
                      label={"Kelas"}
                    />
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">
                        Kelas
                      </label>
                      <div className="p-2 pl-4 bg-gray-100 border border-gray-200 rounded-lg">
                        {classroomData?.name || "Tidak diatur"}
                      </div>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <FormInput
                        type="text"
                        value={formData.place_of_birth}
                        onChange={(e) =>
                          handleInputChange("place_of_birth", e.target.value)
                        }
                        className="w-full"
                        id={formData.place_of_birth}
                        label={"Tempat Lahir"}
                      />
                    </div>
                    <div>
                      <FormInput
                        type="date"
                        value={formData.birth_date}
                        onChange={(e) =>
                          handleInputChange("birth_date", e.target.value)
                        }
                        className="w-full"
                        id={formData.birth_date}
                        label={"Tanggal Lahir"}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Tempat, Tanggal Lahir
                    </label>
                    <div className="p-2 pl-4 bg-gray-100 border border-gray-200 rounded-lg">
                      {formData.place_of_birth && formData.birth_date
                        ? `${formData.place_of_birth}, ${formData.birth_date}`
                        : "Tidak diatur"}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    {isEditing ? (
                      <FormInput
                        type="text"
                        value={formData.gender}
                        onChange={(e) =>
                          handleInputChange("gender", e.target.value)
                        }
                        className="w-full"
                        id={formData.gender}
                        label={"Jenis Kelamin"}
                      />
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Jenis Kelamin
                        </label>
                        <div className="p-2 pl-4 bg-gray-100 border border-gray-200 rounded-lg">
                          {formData.gender === "L"
                            ? "Laki-laki"
                            : formData.gender === "P"
                            ? "Perempuan"
                            : formData.gender || "Tidak diatur"}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    {isEditing ? (
                      <FormInput
                        type="text"
                        value={formData.religion}
                        onChange={(e) =>
                          handleInputChange("religion", e.target.value)
                        }
                        className="w-full"
                        id={formData.religion}
                        label={"Jenis Kelamin"}
                      />
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Agama
                        </label>
                        <div className="p-2 pl-4 bg-gray-100 border border-gray-200 rounded-lg">
                          {formData.religion || "Tidak diatur"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                      <FormInput
                        type="text"
                        value={formData.address ?? ""}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        className="w-full"
                        id={formData.address || ""}
                        label={"Alamat"}
                      />
                      <FormInput
                        type="text"
                        value={formData.sub_district ?? ""}
                        onChange={(e) =>
                          handleInputChange("sub_district", e.target.value)
                        }
                        className="w-full"
                        id={formData.sub_district || ""}
                        label={"Kecamatan"}
                      />
                      <FormInput
                        type="text"
                        value={formData.district ?? ""}
                        onChange={(e) =>
                          handleInputChange("district", e.target.value)
                        }
                        className="w-full"
                        id={formData.district || ""}
                        label={"Kabupaten"}
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">
                        Alamat
                      </label>
                      <div className="p-2 pl-4 bg-gray-100 border border-gray-200 rounded-lg">
                        {formData.address ||
                        formData.sub_district ||
                        formData.district
                          ? [
                              formData.address,
                              formData.sub_district,
                              formData.district,
                            ]
                              .filter((item) => item && item.trim() !== "")
                              .join(", ")
                          : "Tidak diatur"}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    {isEditing ? (
                      <FormInput
                        type="number"
                        value={formData.phone_number}
                        onChange={(e) =>
                          handleInputChange("phone_number", e.target.value)
                        }
                        className="w-full"
                        id={formData.phone_number}
                        label={"Nomor Telepon"}
                      />
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Nomor Telepon
                        </label>
                        <div className="p-2 pl-4 bg-gray-100 border border-gray-200 rounded-lg">
                          {formData.phone_number || "Tidak diatur"}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <FormInput
                          type="number"
                          value={formData.height}
                          onChange={(e) =>
                            handleInputChange("height", e.target.value)
                          }
                          className="w-full"
                          id={formData.height}
                          label={"Tinggi Badan (cm)"}
                        />
                        <FormInput
                          type="number"
                          value={formData.weight || ""}
                          onChange={(e) =>
                            handleInputChange("weight", e.target.value)
                          }
                          className="w-full"
                          id={formData.weight}
                          label={"Berat Badan (kg)"}
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Tinggi / Berat Badan
                        </label>
                        <div className="p-2 pl-4 bg-gray-100 border border-gray-200 rounded-lg">
                          {formData.height && formData.weight
                            ? `${formData.height} cm / ${formData.weight} kg`
                            : "Tidak diatur"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parent Information Card */}
          <Card className="shadow-sm border border-gray-200 bg-white rounded-lg overflow-hidden">
            <CardHeader className="bg-white py-3 px-4">
              <CardTitle className="text-black flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Informasi Orang Tua
              </CardTitle>
              <div className="relative flex justify-center mt-5">
                <div className="absolute w-full h-0.5 bg-green-400 rounded-full shadow-sm mt-1"></div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    {isEditing ? (
                      <FormInput
                        type="text"
                        value={formData.father_name}
                        onChange={(e) =>
                          handleInputChange("father_name", e.target.value)
                        }
                        className="w-full"
                        id={formData.father_name || ""}
                        label={"Nama Ayah"}
                      />
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Nama Ayah
                        </label>
                        <div className="p-2 pl-4 bg-gray-100 border border-gray-200 rounded-lg">
                          {formData.father_name || "Tidak diatur"}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    {isEditing ? (
                      <FormInput
                        type="text"
                        value={formData.father_job}
                        onChange={(e) =>
                          handleInputChange("father_job", e.target.value)
                        }
                        className="w-full"
                        id={formData.father_job || ""}
                        label={"Pekerjaan Ayah"}
                      />
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Pekerjaan Ayah
                        </label>
                        <div className="p-2 pl-4 bg-gray-100 border border-gray-200 rounded-lg">
                          {formData.father_job || "Tidak diatur"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    {isEditing ? (
                      <FormInput
                        type="text"
                        value={formData.mother_name}
                        onChange={(e) =>
                          handleInputChange("mother_name", e.target.value)
                        }
                        className="w-full"
                        id={formData.mother_name || ""}
                        label={"Nama Ibu"}
                      />
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Nama Ibu
                        </label>
                        <div className="p-2 pl-4 bg-gray-100 border border-gray-200 rounded-lg">
                          {formData.mother_name || "Tidak diatur"}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    {isEditing ? (
                      <FormInput
                        type="text"
                        value={formData.mother_job}
                        onChange={(e) =>
                          handleInputChange("mother_job", e.target.value)
                        }
                        className="w-full"
                        id={formData.mother_job || ""}
                        label={"Pekerjaan Ibu"}
                      />
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Pekerjaan Ibu
                        </label>
                        <div className="p-2 pl-4 bg-gray-100 border border-gray-200 rounded-lg">
                          {formData.mother_job || "Tidak diatur"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guardian Information Card */}
          <Card className="shadow-sm border border-gray-200 bg-white rounded-lg overflow-hidden">
            <CardHeader className="bg-white py-3 px-4">
              <CardTitle className="text-black flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Informasi Wali
              </CardTitle>
              <div className="relative flex justify-center mt-5">
                <div className="absolute w-full h-0.5 bg-green-400 rounded-full shadow-sm mt-1"></div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    {isEditing ? (
                      <FormInput
                        type="text"
                        value={formData.guardian_name || ""}
                        onChange={(e) =>
                          handleInputChange("guardian_name", e.target.value)
                        }
                        className="w-full"
                        id={formData.guardian_name || ""}
                        label={"Nama Wali"}
                      />
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Nama Wali
                        </label>
                        <div className="p-2 pl-4 bg-gray-100 border border-gray-200 rounded-lg">
                          {formData.guardian_name || "Tidak diatur"}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    {isEditing ? (
                      <FormInput
                        type="text"
                        value={formData.guardian_job || ""}
                        onChange={(e) =>
                          handleInputChange("guardian_job", e.target.value)
                        }
                        className="w-full"
                        id={formData.guardian_job || ""}
                        label={"Pekerjaan Wali"}
                      />
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Pekerjaan Wali
                        </label>
                        <div className="p-2 pl-4 bg-gray-100 border border-gray-200 rounded-lg">
                          {formData.guardian_job || "Tidak diatur"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        items="foto profil ini?"
        type="delete"
      />
    </div>
  );
};

export default ViewStudentBio;
