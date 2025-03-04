import { MoveLeft, Edit } from "lucide-react";
import { Form, FormInput, FormTextarea } from "@/components/ui/form";
import { useParams, Link } from "react-router-dom";
import { useStudentById } from "@/config/Api/useStudent";

const ViewStudentBio = () => {
  const { id } = useParams();
  const studentId = parseInt(id || "0");
  const { data: student, isLoading } = useStudentById(studentId);

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!student) {
    return <div className="p-6 text-red-500">Student not found</div>;
  }

  return (
    <>
      <div className="m-1">
        <Link to={`/class/${student.class_id}`}>
          <div className="flex gap-2">
            <MoveLeft />
            <h1>Back</h1>
          </div>
        </Link>

        <Form>
          <div className="text-3xl font-bold mt-8 px-8">Biodata Siswa</div>
          <div className="w-full flex px-8">
            <div className="w-[25%] max-w-[25%] ">
              <div className="flex flex-col gap-3 justify-center items-center">
                {student.profile_image ? (
                  <img
                    src={student.profile_image}
                    alt={student.name}
                    className="aspect-[3/4] w-full object-cover bg-gray-300"
                  />
                ) : (
                  <div className="aspect-[3/4] w-full bg-gray-300"></div>
                )}
                <Link
                  to={`/studentbio/edit/${student.id}`}
                  className="w-full bg-blue-600 p-3 font-semibold text-white rounded-md hover:bg-blue-500 transition-all duration-200 text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Edit size={18} />
                    <span>Edit Student Data</span>
                  </div>
                </Link>
                <Link
                  to={`/studentbio/accomplishments/${student.nis}`}
                  className="w-full bg-green-600 p-3 font-semibold text-white rounded-md hover:bg-green-500 transition-all duration-200 text-center"
                >
                  Student Accomplishments
                </Link>
                <Link
                  to={`/studentbio/violations/${student.nis}`}
                  className="w-full bg-red-600 p-3 font-semibold text-white rounded-md hover:bg-red-500 transition-all duration-200 text-center"
                >
                  Student Violations
                </Link>
              </div>
            </div>

            <div className="w-[75%] max-w-[75%] pl-10">
              <div className="shadow-md border p-8 flex flex-col gap-4 max-h-full overflow-y-auto">
                <h1 className="text-3xl font-bold mb-1">
                  Personal Information
                </h1>
                <FormInput
                  id="studentname"
                  label="Student Name"
                  type="text"
                  value={student.name}
                  disabled
                />
                <div className="flex gap-12">
                  <FormInput
                    id="nisn"
                    label="NISN"
                    type="text"
                    value={student.nisn}
                    disabled
                  />
                  <FormInput
                    id="nis"
                    label="NIS"
                    type="text"
                    value={student.nis}
                    disabled
                  />
                </div>
                <FormInput
                  id="placedatebirth"
                  label="Place, Date of Birth"
                  type="text"
                  value={`${student.place_of_birth}, ${student.birth_date}`}
                  disabled
                />
                <div className="flex gap-12">
                  <FormInput
                    id="gender"
                    label="Gender"
                    type="text"
                    value={student.gender === "L" ? "Laki-Laki" : "Perempuan"}
                    disabled
                  />
                  <FormInput
                    id="religion"
                    label="Religion"
                    type="text"
                    value={student.religion}
                    disabled
                  />
                  <FormInput
                    id="phone_number"
                    label="Phone Number"
                    type="text"
                    value={student.phone_number || "-"}
                    disabled
                  />
                </div>
                <FormTextarea
                  id="address"
                  label="Address"
                  value={`${student.address}, ${student.sub_district}, ${student.district}`}
                  disabled
                />
                <div className="flex gap-12">
                  <FormInput
                    id="height"
                    label="Height (cm)"
                    type="text"
                    value={student.height}
                    disabled
                  />
                  <FormInput
                    id="weight"
                    label="Weight (kg)"
                    type="text"
                    value={student.weight}
                    disabled
                  />
                </div>

                <div className="h-[1px] bg-black w-full my-1"></div>

                <h1 className="text-3xl font-bold mb-1">Student's Parents</h1>
                <FormInput
                  id="fathername"
                  label="Father's Name"
                  type="text"
                  value={student.father_name}
                  disabled
                />
                <FormInput
                  id="fatherjob"
                  label="Father's Job"
                  type="text"
                  value={student.father_job}
                  disabled
                />
                <FormInput
                  id="mothername"
                  label="Mother's Name"
                  type="text"
                  value={student.mother_name}
                  disabled
                />
                <FormInput
                  id="motherjob"
                  label="Mother's Job"
                  type="text"
                  value={student.mother_job}
                  disabled
                />
                <FormInput
                  id="parentphonenumber"
                  label="Parent's Phone Number"
                  type="text"
                  value={student.phone_number || "-"}
                  disabled
                />

                <div className="h-[1px] bg-black w-full my-1"></div>

                <h1 className="text-3xl font-bold mb-1">Student's Guardian</h1>
                <FormInput
                  id="guardianname"
                  label="Guardian's Name"
                  type="text"
                  value={student.guardian_name || "-"}
                  disabled
                />
                <FormInput
                  id="guardianjob"
                  label="Guardian's Job"
                  type="text"
                  value={student.guardian_job || "-"}
                  disabled
                />
              </div>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ViewStudentBio;
