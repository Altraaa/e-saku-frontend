import { useState, useEffect } from "react";
import { MoveLeft, SaveAll, User } from "lucide-react";
import {
  Form,
  FormInput,
  FormButton,
  FormTextarea,
  FormSelect,
} from "@/components/ui/form";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useStudentById,
  useStudentDeleteProfile,
  useStudentUpdate,
  useStudentUpload,
} from "@/config/Api/useStudent";
import { IStudent } from "@/config/Models/Student";
import ConfirmationModal from "@/components/ui/confirmation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

const ViewEditStudentBio = () => {
  const { id } = useParams();
  const studentId = id ?? "";
  const navigate = useNavigate();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data: studentData, isLoading } = useStudentById(studentId);

  const updateMutation = useStudentUpdate();
  const uploadMutation = useStudentUpload();
  const deleteProfileMutation = useStudentDeleteProfile();

  const [formData, setFormData] = useState<IStudent>({
    id: 0,
    name: "",
    nisn: "",
    nis: "",
    email: "",
    place_of_birth: "",
    birth_date: "",
    gender: "",
    religion: "",
    height: "",
    weight: "",
    phone_number: null,
    address: "",
    sub_district: "",
    district: "",
    father_name: "",
    father_job: "",
    mother_name: "",
    mother_job: "",
    guardian_name: null,
    guardian_job: null,
    profile_image: null,
    point_total: 0,
    created_at: "",
    updated_at: "",
    class_id: 0,
    violations_sum_points: 0,
    accomplishments_sum_points: 0,
  });

  useEffect(() => {
    if (studentData) {
      if (studentData.profile_image) {
        setPhotoUrl(
          `${import.meta.env.VITE_API_URL?.replace("/api", "/public")}${
            studentData.profile_image
          }`
        );
      }
      setFormData((prev) => ({
        ...prev,
        ...studentData,
        address: studentData.address || "",
        profile_image: studentData.profile_image || null,
        phone_number: studentData.phone_number || null,
        guardian_name: studentData.guardian_name || null,
        guardian_job: studentData.guardian_job || null,
        email: studentData.email || "", // Tambahkan ini agar tidak undefined
      }));
    }
  }, [studentData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Nama siswa harus diisi";
    if (!formData.nisn) newErrors.nisn = "NISN harus diisi";
    if (!formData.nis) newErrors.nis = "NIS harus diisi";
    if (!formData.place_of_birth)
      newErrors.place_of_birth = "Tempat lahir harus diisi";
    if (!formData.birth_date)
      newErrors.birth_date = "Tanggal lahir harus diisi";
    if (!formData.gender) newErrors.gender = "Jenis kelamin harus dipilih";
    if (!formData.religion) newErrors.religion = "Agama harus diisi";
    if (!formData.address) newErrors.address = "Alamat harus diisi";
    if (!formData.sub_district)
      newErrors.sub_district = "Kecamatan harus diisi";
    if (!formData.district) newErrors.district = "Kabupaten harus diisi";
    if (!formData.height) newErrors.height = "Tinggi badan harus diisi";
    if (!formData.weight) newErrors.weight = "Berat badan harus diisi";
    if (!formData.father_name) newErrors.father_name = "Nama ayah harus diisi";
    if (!formData.father_job)
      newErrors.father_job = "Pekerjaan ayah harus diisi";
    if (!formData.mother_name) newErrors.mother_name = "Nama ibu harus diisi";
    if (!formData.mother_job)
      newErrors.mother_job = "Pekerjaan ibu harus diisi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e:
      | Date
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | undefined
  ) => {
    if (!e) return;

    if (e instanceof Date) {
      setFormData((prev) => ({
        ...prev,
        birth_date: e.toISOString().split("T")[0],
      }));
    } else {
      const { id, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }

    const updatedData: IStudent = { ...formData, id: Number(studentId) };

    if (!updatedData.email) {
      delete updatedData.email;
    }

    updateMutation.mutate(
      { id: Number(studentId), data: updatedData },
      {
        onSuccess: () => {
          toast.success("Data siswa berhasil diperbarui");
          navigate(`/studentbio/${studentId}`);
        },
        onError: (error) => {
          toast.error("Data siswa gagal diperbarui");
          console.error("Error updating student:", error);
        },
      }
    );
  };

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

  const imageSrc = photoUrl
    ? photoUrl
    : studentData?.profile_image
    ? `${import.meta.env.VITE_API_URL?.replace("/api", "/public")}${
        studentData.profile_image
      }`
    : "";

  const handleSaveClick = () => {
    if (validateForm()) {
      setEditModalOpen(true);
    }
  };

  const confirmEdit = () => {
    setEditModalOpen(false);
    handleSubmit();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 md:w-14 md:h-14 border-4 border-gray-300 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!studentData) {
    return <div className="p-4 md:p-6 text-red-500">Student not found</div>;
  }
  return (
    <>
      <div className="m-1">
        <div className="flex flex-col px-3 mt-4 gap-4 sm:px-4 md:px-8 md:mt-8 md:gap-6 lg:flex-row lg:items-start">
          {/* Left Sidebar */}
          <div className="w-full lg:w-[25%] lg:max-w-[25%]">
            {/* Back Button */}
            <Link to={`/studentbio/${studentId}`} className="group">
              <div className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors cursor-pointer mb-4 md:mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 group-hover:border-green-500 group-hover:bg-green-50 transition-all">
                  <MoveLeft className="h-4 w-4" />
                </div>
                <span className="font-medium text-sm md:text-base">
                  Back to Student
                </span>
              </div>
            </Link>

            {/* Title */}
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
              Edit Biodata Siswa
            </div>

            {/* Profile Section */}
            <div className="flex flex-col gap-3 justify-center items-center">
              {/* Profile Image */}
              <div className="w-full max-w-xs mx-auto lg:max-w-none">
                {photoUrl ? (
                  <img
                    src={imageSrc}
                    alt={formData.name}
                    className="aspect-[3/4] w-full object-cover bg-gray-300 rounded-lg"
                  />
                ) : (
                  <div className="aspect-[3/4] w-full bg-gray-300 rounded-lg flex items-center justify-center">
                    <User className="h-16 w-16 text-gray-500" />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="w-full max-w-xs mx-auto lg:max-w-none space-y-2 mt-4">
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
                  type="button"
                  className="w-full bg-red-600 p-3 font-semibold text-white rounded-md hover:bg-red-500 transition-all duration-200 text-sm md:text-base"
                >
                  Delete Profile Picture
                </Button>
                <div className="w-full">
                  <FormButton
                    disabled={updateMutation.isPending}
                    type="button"
                    onClick={handleSaveClick}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <SaveAll className="h-4 w-4 md:h-5 md:w-5" />
                      <span>
                        {updateMutation.isPending
                          ? "Saving..."
                          : "Save Changes"}
                      </span>
                    </div>
                  </FormButton>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-[75%] lg:max-w-[75%]">
            <Form onSubmit={(e) => handleSubmit(e)}>
              <div className="flex flex-col gap-4 md:gap-6">
                {/* Personal Information Card */}
                <Card className="shadow-sm border border-gray-200 bg-white rounded-lg overflow-hidden">
                  <CardHeader className="bg-white flex justify-start items-center py-3 md:py-4 border-b-2 border-green-400 pb-2">
                    <CardTitle className="text-lg md:text-xl font-bold text-black flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="py-3 md:py-4 flex flex-col gap-3 md:gap-4 max-h-full overflow-y-auto">
                      <FormInput
                        id="name"
                        label="Student Name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                      />

                      {/* NISN and NIS Row */}
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-12">
                        <div className="flex flex-col gap-1 w-full sm:w-1/2">
                          <FormInput
                            id="nisn"
                            label="NISN"
                            type="text"
                            value={formData.nisn}
                            onChange={handleChange}
                            error={errors.nisn}
                          />
                        </div>
                        <div className="flex flex-col gap-1 w-full sm:w-1/2">
                          <FormInput
                            id="nis"
                            label="NIS"
                            type="text"
                            value={formData.nis}
                            onChange={handleChange}
                            error={errors.nis}
                          />
                        </div>
                      </div>

                      {/* Place and Date of Birth Row */}
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-12">
                        <div className="flex flex-col gap-1 w-full sm:w-1/2">
                          <FormInput
                            id="place_of_birth"
                            label="Place of Birth"
                            type="text"
                            value={formData.place_of_birth}
                            onChange={handleChange}
                            error={errors.place_of_birth}
                          />
                        </div>
                        <div className="flex flex-col gap-1 w-full sm:w-1/2">
                          <FormInput
                            id="birth_date"
                            label="Date of Birth"
                            type="date"
                            value={formData.birth_date}
                            onChange={(e) => handleChange(e)}
                            error={errors.birth_date}
                          />
                        </div>
                      </div>

                      {/* Gender and Religion Row */}
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-12">
                        <div className="flex flex-col gap-1 w-full sm:w-1/2">
                          <FormSelect
                            id="gender"
                            label="Gender"
                            placeholder="Select Gender"
                            value={formData.gender}
                            options={[
                              { value: "L", label: "Laki-laki" },
                              { value: "P", label: "Perempuan" },
                            ]}
                            onChange={(value) => {
                              setFormData((prev) => ({
                                ...prev,
                                gender: value,
                              }));
                            }}
                            error={errors.gender}
                          />
                        </div>
                        <div className="flex flex-col gap-1 w-full sm:w-1/2">
                          <FormInput
                            id="religion"
                            label="Religion"
                            type="text"
                            value={formData.religion}
                            onChange={handleChange}
                            error={errors.religion}
                          />
                        </div>
                      </div>

                      <FormTextarea
                        id="address"
                        label="Address"
                        value={formData.address}
                        onChange={handleChange}
                        error={errors.address}
                      />

                      {/* Sub District and District Row */}
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-12">
                        <div className="flex flex-col gap-1 w-full sm:w-1/2">
                          <FormInput
                            id="sub_district"
                            label="Sub District"
                            type="text"
                            value={formData.sub_district}
                            onChange={handleChange}
                            error={errors.sub_district}
                          />
                        </div>
                        <div className="flex flex-col gap-1 w-full sm:w-1/2">
                          <FormInput
                            id="district"
                            label="District"
                            type="text"
                            value={formData.district}
                            onChange={handleChange}
                            error={errors.district}
                          />
                        </div>
                      </div>

                      {/* Height and Weight Row */}
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-12">
                        <div className="flex flex-col gap-1 w-full sm:w-1/2">
                          <FormInput
                            id="height"
                            label="Height (cm)"
                            type="text"
                            value={formData.height}
                            onChange={handleChange}
                            error={errors.height}
                          />
                        </div>
                        <div className="flex flex-col gap-1 w-full sm:w-1/2">
                          <FormInput
                            id="weight"
                            label="Weight (kg)"
                            type="text"
                            value={formData.weight}
                            onChange={handleChange}
                            error={errors.weight}
                          />
                        </div>
                      </div>

                      <FormInput
                        id="phone_number"
                        label="Phone Number"
                        type="text"
                        value={formData.phone_number}
                        onChange={handleChange}
                        error={errors.phone_number}
                        required={false}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Student's Parent Card */}
                <Card className="shadow-sm border border-gray-200 bg-white rounded-lg overflow-hidden">
                  <CardHeader className="bg-white flex justify-start items-center py-3 md:py-4 border-b-2 border-green-400 pb-2">
                    <CardTitle className="text-lg md:text-xl font-bold text-black flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Student's Parent
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="py-3 md:py-4 flex flex-col gap-3 md:gap-4 max-h-full overflow-y-auto">
                      {/* Father's Information */}
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-12">
                        <div className="flex flex-col gap-1 w-full sm:w-1/2">
                          <FormInput
                            id="father_name"
                            label="Father's Name"
                            type="text"
                            value={formData.father_name}
                            onChange={handleChange}
                            error={errors.father_name}
                          />
                        </div>
                        <div className="flex flex-col gap-1 w-full sm:w-1/2">
                          <FormInput
                            id="father_job"
                            label="Father's Job"
                            type="text"
                            value={formData.father_job}
                            onChange={handleChange}
                            error={errors.father_job}
                          />
                        </div>
                      </div>

                      {/* Mother's Information */}
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-12">
                        <div className="flex flex-col gap-1 w-full sm:w-1/2">
                          <FormInput
                            id="mother_name"
                            label="Mother's Name"
                            type="text"
                            value={formData.mother_name}
                            onChange={handleChange}
                            error={errors.mother_name}
                          />
                        </div>
                        <div className="flex flex-col gap-1 w-full sm:w-1/2">
                          <FormInput
                            id="mother_job"
                            label="Mother's Job"
                            type="text"
                            value={formData.mother_job}
                            onChange={handleChange}
                            error={errors.mother_job}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Student's Guardian Card */}
                <Card className="shadow-sm border border-gray-200 bg-white rounded-lg overflow-hidden">
                  <CardHeader className="bg-white flex justify-start items-center py-3 md:py-4 border-b-2 border-green-400 pb-2">
                    <CardTitle className="text-lg md:text-xl font-bold text-black flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Student's Guardian
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="py-3 md:py-4 flex flex-col gap-3 md:gap-4 max-h-full overflow-y-auto">
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-12">
                        <div className="flex flex-col gap-1 w-full sm:w-1/2">
                          <FormInput
                            id="guardian_name"
                            label="Guardian's Name"
                            type="text"
                            value={formData.guardian_name}
                            onChange={handleChange}
                            required={false}
                          />
                        </div>
                        <div className="flex flex-col gap-1 w-full sm:w-1/2">
                          <FormInput
                            id="guardian_job"
                            label="Guardian's Job"
                            type="text"
                            value={formData.guardian_job}
                            onChange={handleChange}
                            required={false}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Form>
          </div>
        </div>
        <ConfirmationModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          onConfirm={confirmEdit}
          title="Confirm Edit"
          description="Are you sure you want to save changes?"
          confirmText="Save"
          type="update"
        />
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          description="Apa kamu yakin untuk menghapus foto profile ini?"
          title="Hapus Foto Profil"
          confirmText="Hapus"
          type="delete"
        />
      </div>
    </>
  );
};

export default ViewEditStudentBio;
