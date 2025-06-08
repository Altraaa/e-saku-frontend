import { MoveLeft, Edit, User, Users, ShieldCheck } from "lucide-react";
import { Form, FormInput } from "@/components/ui/form";
import { useParams, Link } from "react-router-dom";
import { useStudentById } from "@/config/Api/useStudent";
import { Card, CardContent } from "@/components/ui/card";

const ViewStudentBio = () => {
  const { id } = useParams();
  const studentId = id ?? "";
  const { data: student, isLoading } = useStudentById(studentId);

  if (!id) {
    return <div className="p-6 text-red-500">Invalid student ID</div>;
  }

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!student) {
    return <div className="p-6 text-red-500">Student not found</div>;
  }

  return (
    <>
      <div className="m-1">
        <Link to={`/student/class/${student.class_id}`}>
          <div className="flex gap-2">
            <MoveLeft />
            <h1>Back</h1>
          </div>
        </Link>

        <Form>
          <div className="text-3xl font-bold mt-8">Biodata Siswa</div>
          <div className="w-full flex gap-10">
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
                  to={`/studentbio/accomplishments/${student.id}`}
                  className="w-full bg-green-600 p-3 font-semibold text-white rounded-md hover:bg-green-500 transition-all duration-200 text-center"
                >
                  Student Accomplishments
                </Link>
                <Link
                  to={`/studentbio/violations/${student.id}`}
                  className="w-full bg-red-600 p-3 font-semibold text-white rounded-md hover:bg-red-500 transition-all duration-200 text-center"
                >
                  Student Violations
                </Link>
              </div>
            </div>

            <div className="w-[75%] max-w-[75%] flex flex-col gap-6">
              <Card>
                  <CardContent>
                    <div className="py-4 flex flex-col gap-4 max-h-full overflow-y-auto">
                        <div className="flex justify-start items-center gap-3 border-b-2 border-green-500 pb-2">
                            <User/>
                            <h1 className="text-xl font-bold">Personal Information</h1>
                        </div>
                        <FormInput
                            id="studentname"
                            label="Student Name"
                            type="text"
                            placeholder=""
                            value={student.name}
                            disabled
                            className="bg-gray-300"
                        />
                        <div className="flex gap-12">
                            <div className="flex flex-col gap-1 w-1/2">
                                <FormInput
                                    id="nisn"
                                    label="NISN"
                                    type="text"
                                    placeholder=""
                                    value={student.nisn}
                                    disabled
                                    className="bg-gray-300"
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-1/2">
                                <FormInput
                                    id="nis"
                                    label="NIS"
                                    type="text"
                                    placeholder=""
                                    value={student.nis}
                                    disabled
                                    className="bg-gray-300"
                                />
                            </div>
                        </div>
                        <FormInput
                            id="placedatebirth"
                            label="Place, Date of Birth"
                            type="text"
                            placeholder=""
                            value={`${student.place_of_birth}, ${student.birth_date}`}
                            disabled
                            className="bg-gray-300"
                        />
                        <div className="flex gap-12">
                            <div className="flex flex-col gap-1 w-1/2">
                                <FormInput
                                    id="gender"
                                    label="Gender"
                                    type="text"
                                    placeholder=""
                                    value={student.gender}
                                    disabled
                                    className="bg-gray-300"
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-1/2">
                                <FormInput
                                    id="religion"
                                    label="Religion"
                                    type="text"
                                    placeholder=""
                                    value={student.religion}
                                    disabled
                                    className="bg-gray-300"
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-2/3">
                                <FormInput
                                    id="studentphonenumber"
                                    label="Student Phone Number"
                                    type="text"
                                    placeholder=""
                                    value={student.phone_number || "-"}
                                    disabled
                                    className="bg-gray-300"
                                />
                            </div>
                        </div>
                        <FormInput
                            id="address"
                            label="Address"
                            type="text"
                            placeholder=""
                            value={`${student.address}, ${student.sub_district}, ${student.district}`}
                            disabled
                            className="bg-gray-300"
                        />
                        
                        <div className="flex gap-12">
                            <div className="flex flex-col gap-1 w-1/2">
                                <FormInput
                                    id="height"
                                    label="Height (cm)"
                                    type="text"
                                    placeholder=""
                                    value={student.height}
                                    disabled
                                    className="bg-gray-300"
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-1/2">
                                <FormInput
                                    id="weight"
                                    label="Weight (kg)"
                                    type="text"
                                    placeholder=""
                                    value={student.weight}
                                    disabled
                                    className="bg-gray-300"
                                />
                            </div>
                        </div>
                    </div>
                  </CardContent>
              </Card>

              <Card>
                  <CardContent>
                      <div className="py-4 flex flex-col gap-4 max-h-full overflow-y-auto">
                          <div className="flex justify-start items-center gap-3 border-b-2 border-green-500 pb-2">
                              <Users/>
                              <h1 className="text-xl font-bold">Student's Parent</h1>
                          </div>
                          <div className="flex flex-col gap-3">
                            <FormInput
                              id="father_name"
                              label="Father's Name"
                              type="text"
                              value={student.father_name}
                              disabled
                              className="bg-gray-300"
                            />
                            <FormInput
                              id="father_job"
                              label="Father's Job"
                              type="text"
                              value={student.father_job}
                              disabled
                              className="bg-gray-300"
                            />
                            <FormInput
                              id="mother_name"
                              label="Mother's Name"
                              type="text"
                              value={student.mother_name}
                              disabled
                              className="bg-gray-300"
                            />
                            <FormInput
                              id="mother_job"
                              label="Mother's Job"
                              type="text"
                              value={student.mother_job}
                              disabled
                              className="bg-gray-300"
                            />
                            {/* <FormInput
                              id="parentphonenumber"
                              label="Parent's Phone Number"
                              type="text"
                              value={student.phone_number || "-"}
                            /> */}
                          </div>
                      </div>
                  </CardContent>
              </Card>

              <Card>
                <CardContent>
                        <div className="py-4 flex flex-col gap-4 max-h-full overflow-y-auto">
                            <div className="flex justify-start items-center gap-3 border-b-2 border-green-500 pb-2">
                                <ShieldCheck/>
                                <h1 className="text-xl font-bold">Student's Guardian</h1>
                            </div>
                            <FormInput
                                id="guardian_name"
                                label="Guardian's Name"
                                type="text"
                                placeholder=""
                                value={student.guardian_name || "-"}
                                disabled
                                className="bg-gray-300"
                            />
                            <FormInput
                                id="guardian_job"
                                label="Guardian's Job"
                                type="text"
                                placeholder=""
                                value={student.guardian_job || "-"}
                                disabled
                                className="bg-gray-300"
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

export default ViewStudentBio;
