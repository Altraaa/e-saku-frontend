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
import { useStudentById, useStudentUpdate } from "@/config/Api/useStudent";
import { IStudent } from "@/config/Models/Student";
import ConfirmationModal from "@/components/ui/confirmation";
import { Card, CardContent } from "@/components/ui/card";

const ViewEditStudentBio = () => {
  const { id } = useParams();
  const studentId = id ?? "";
  const navigate = useNavigate();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch student data
  const { data: studentData, isLoading } = useStudentById(studentId);

  // Setup mutation for updating student
  const updateMutation = useStudentUpdate();

const [formData, setFormData] = useState<IStudent>({
  id: 0,
  name: "",
  nisn: "",
  nis: "",
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
});


useEffect(() => {
  if (studentData) {
    setFormData((prev) => ({
      ...prev,
      ...studentData,
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
  if (!formData.birth_date) newErrors.birth_date = "Tanggal lahir harus diisi";
  if (!formData.gender) newErrors.gender = "Jenis kelamin harus dipilih";
  if (!formData.religion) newErrors.religion = "Agama harus diisi";
  if (!formData.address) newErrors.address = "Alamat harus diisi";
  if (!formData.sub_district) newErrors.sub_district = "Kecamatan harus diisi";
  if (!formData.district) newErrors.district = "Kabupaten harus diisi";
  if (!formData.height) newErrors.height = "Tinggi badan harus diisi";
  if (!formData.weight) newErrors.weight = "Berat badan harus diisi";
  if (!formData.father_name) newErrors.father_name = "Nama ayah harus diisi";
  if (!formData.father_job) newErrors.father_job = "Pekerjaan ayah harus diisi";
  if (!formData.mother_name) newErrors.mother_name = "Nama ibu harus diisi";
  if (!formData.mother_job) newErrors.mother_job = "Pekerjaan ibu harus diisi";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleChange = (
  e:
    | Date
    | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    | undefined
) => {
  if (!e) return; // Menghindari undefined

  if (e instanceof Date) {
    // Jika event adalah Date (misalnya dari DatePicker)
    setFormData((prev) => ({
      ...prev,
      birth_date: e.toISOString().split("T")[0], // Simpan format YYYY-MM-DD
    }));
  } else {
    // Jika event berasal dari input biasa
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

  // Buat salinan data yang akan dikirim
  const updatedData: IStudent = { ...formData, id: studentId };

  // Hapus field email jika kosong atau null
  if (!updatedData.email) {
    delete updatedData.email;
  }

  updateMutation.mutate(
    { id: studentId, data: updatedData },
    {
      onSuccess: () => {
        alert("Student data updated successfully!");
        navigate(`/studentbio/${studentId}`);
      },
      onError: (error) => {
        console.error("Error updating student:", error);
        alert("Failed to update student data. Please try again.");
      },
    }
  );
};

const handleSaveClick = () => {
  // Validate form first
  if (validateForm()) {
    // Only open the confirmation modal if validation passes
    setEditModalOpen(true);
  }
  // If validation fails, errors will be displayed but modal won't open
};

const confirmEdit = () => {
  setEditModalOpen(false);
  handleSubmit(); // No event object is passed here
};

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!studentData) {
    return <div className="p-6 text-red-500">Student not found</div>;
  }

  return (
    <>
      <ConfirmationModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onConfirm={confirmEdit}
        title="Confirm Edit"
        description="Are you sure you want to save changes?"
        confirmText="Save"
        type="update"
      />
      <div className="m-1">
        <Link to={`/studentbio/${studentId}`}>
          <div className="flex gap-2">
            <MoveLeft />
            <h1>Back</h1>
          </div>
        </Link>
        <Form onSubmit={(e) => handleSubmit(e)}>
          <div className="text-3xl font-bold mt-8 px-8">Edit Biodata Siswa</div>
          <div className="w-full flex px-8">
            <div className="w-[25%] max-w-[25%]">
              <div className="flex flex-col gap-3 justify-center items-center">
                {formData.profile_image ? (
                  <img
                    src={formData.profile_image}
                    alt={formData.name}
                    className="aspect-[3/4] w-full object-cover bg-gray-300"
                  />
                ) : (
                  <div className="aspect-[3/4] w-full bg-gray-300"></div>
                )}
                <div className="w-full">
                  <button
                    type="button"
                    className="w-full bg-blue-600 p-3 font-semibold text-white rounded-md hover:bg-blue-500 transition-all duration-200"
                  >
                    Update Profile Picture
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-[75%] max-w-[75%] pl-10 gap-6">
              <div className="flex justify-end gap-3">
                <div className="w-32 flex">
                  <FormButton
                    disabled={updateMutation.isPending}
                    type="button"
                    onClick={handleSaveClick}
                  >
                    <SaveAll className="w-7" />
                    {updateMutation.isPending ? "Saving..." : "Save"}{" "}
                  </FormButton>
                </div>
              </div>
              <Card>
                  <CardContent>
                    <div className="py-4 flex flex-col gap-4 max-h-full overflow-y-auto">
                        <div className="flex justify-start items-center gap-3 border-b-2 border-green-500 pb-2">
                            <User/>
                            <h1 className="text-xl font-bold">Personal Information</h1>
                        </div>
                        <FormInput
                          id="name"
                          label="Student Name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          error={errors.name}
                        />
                      <div className="flex gap-12">
                        <FormInput
                          id="nisn"
                          label="NISN"
                          type="text"
                          value={formData.nisn}
                          onChange={handleChange}
                          error={errors.nisn}
                        />
                        <FormInput
                          id="nis"
                          label="NIS"
                          type="text"
                          value={formData.nis}
                          onChange={handleChange}
                          error={errors.nis}
                        />
                      </div>
                      <div className="flex gap-12">
                        <FormInput
                          id="place_of_birth"
                          label="Place of Birth"
                          type="text"
                          value={formData.place_of_birth}
                          onChange={handleChange}
                          error={errors.place_of_birth}
                        />
                        <FormInput
                          id="birth_date"
                          label="Date of Birth"
                          type="date"
                          value={formData.birth_date}
                          onChange={(e) => handleChange(e)}
                          error={errors.birth_date}
                        />
                      </div>
                      <div className="flex gap-12">
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
                        <FormInput
                          id="religion"
                          label="Religion"
                          type="text"
                          value={formData.religion}
                          onChange={handleChange}
                          error={errors.religion}
                        />
                      </div>
                      <FormTextarea
                        id="address"
                        label="Address"
                        value={formData.address}
                        onChange={handleChange}
                        error={errors.address}
                      />
                      <div className="flex gap-12">
                        <FormInput
                          id="sub_district"
                          label="Sub District"
                          type="text"
                          value={formData.sub_district}
                          onChange={handleChange}
                          error={errors.sub_district}
                        />
                        <FormInput
                          id="district"
                          label="District"
                          type="text"
                          value={formData.district}
                          onChange={handleChange}
                          error={errors.district}
                        />
                      </div>
                      <div className="flex gap-12">
                        <FormInput
                          id="height"
                          label="Height (cm)"
                          type="text"
                          value={formData.height}
                          onChange={handleChange}
                          error={errors.height}
                        />
                        <FormInput
                          id="weight"
                          label="Weight (kg)"
                          type="text"
                          value={formData.weight}
                          onChange={handleChange}
                          error={errors.weight}
                        />
                      </div>
                      <FormInput
                        id="phone_number"
                        label="Phone Number"
                        type="text"
                        value={formData.phone_number}
                        onChange={handleChange}
                        error={errors.phone_number}
                      />
                    </div>
                  </CardContent>
              </Card>

              <Card>
                  <CardContent>
                    <div className="py-4 flex flex-col gap-4 max-h-full overflow-y-auto">
                        <div className="flex justify-start items-center gap-3 border-b-2 border-green-500 pb-2">
                            <User/>
                            <h1 className="text-xl font-bold">Student's Parent</h1>
                        </div>
                        <FormInput
                          id="father_name"
                          label="Father's Name"
                          type="text"
                          value={formData.father_name}
                          onChange={handleChange}
                          error={errors.father_name}
                        />
                        <FormInput
                          id="father_job"
                          label="Father's Job"
                          type="text"
                          value={formData.father_job}
                          onChange={handleChange}
                          error={errors.father_job}
                        />
                        <FormInput
                          id="mother_name"
                          label="Mother's Name"
                          type="text"
                          value={formData.mother_name}
                          onChange={handleChange}
                          error={errors.mother_name}
                        />
                        <FormInput
                          id="mother_job"
                          label="Mother's Job"
                          type="text"
                          value={formData.mother_job}
                          onChange={handleChange}
                          error={errors.mother_job}
                        />
                    </div>
                  </CardContent>
              </Card>

              <Card>
                  <CardContent>
                    <div className="py-4 flex flex-col gap-4 max-h-full overflow-y-auto">
                        <div className="flex justify-start items-center gap-3 border-b-2 border-green-500 pb-2">
                            <User/>
                            <h1 className="text-xl font-bold">Student's Guardian</h1>
                        </div>
                        <FormInput
                          id="guardian_name"
                          label="Guardian's Name"
                          type="text"
                          value={formData.guardian_name}
                          onChange={handleChange}
                          required={false}
                        />
                        <FormInput
                          id="guardian_job"
                          label="Guardian's Job"
                          type="text"
                          value={formData.guardian_job}
                          onChange={handleChange}
                          required={false}
                        />
                    </div>
                  </CardContent>
              </Card>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ViewEditStudentBio;
