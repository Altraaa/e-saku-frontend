import { MoveLeft, Edit } from "lucide-react";
import { FormInput } from "@/components/ui/form";
import { useParams, Link } from "react-router-dom";
import { useStudentById } from "@/config/Api/useStudent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

const ViewStudentBio = () => {
  const { id } = useParams();
  const studentId = id ?? "";
  const { data: student, isLoading } = useStudentById(studentId);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);

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

  if (!student) {
    return <div className="p-4 md:p-6 text-red-500">Student not found</div>;
  }

  return (
    <>
      <div className="m-1">
        <div className="flex flex-col px-3 mt-4 gap-4 sm:px-4 md:px-8 md:mt-8 md:gap-6 lg:flex-row lg:items-start">
          {/* Left Sidebar */}
          <div className="w-full lg:w-[25%] lg:max-w-[25%]">
            {/* Back Button */}
            <Link to={`/student/class/${student.class_id}`} className="group">
              <div className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors cursor-pointer mb-4 md:mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 group-hover:border-green-500 group-hover:bg-green-50 transition-all">
                  <MoveLeft className="h-4 w-4" />
                </div>
                <span className="font-medium text-sm md:text-base">Back to Class</span>
              </div>
            </Link>

            {/* Title */}
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">Biodata Siswa</div>
            
            {/* Profile Section */}
            <div className="flex flex-col gap-3 justify-center items-center">
              {/* Profile Image */}
              <div className="w-full max-w-xs mx-auto lg:max-w-none">
                {student.profile_image ? (
                  <img
                    src={student.profile_image}
                    alt={student.name}
                    className="aspect-[3/4] w-full object-cover bg-gray-300 rounded-lg"
                  />
                ) : (
                  <div className="aspect-[3/4] w-full bg-gray-300 rounded-lg"></div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="w-full max-w-xs mx-auto lg:max-w-none space-y-2 mt-4">
                <Link
                  to={`/studentbio/edit/${student.id}`}
                  className="w-full bg-primary p-3 font-semibold text-white rounded-md hover:bg-primary/90 transition-all duration-200 text-center block text-sm md:text-base"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Edit size={16} className="md:w-[18px] md:h-[18px]" />
                    <span>Edit Student Data</span>
                  </div>
                </Link>
                
                <Link
                  to={`/studentbio/accomplishments/${student.id}`}
                  className="w-full bg-primary p-3 font-semibold text-white rounded-md hover:bg-primary/90 transition-all duration-200 text-center block text-sm md:text-base"
                >
                  Student Accomplishments
                </Link>
                
                <Link
                  to={`/studentbio/violations/${student.id}`}
                  className="w-full bg-destructive p-3 font-semibold text-white rounded-md hover:bg-destructive/90 transition-all duration-200 text-center block text-sm md:text-base"
                >
                  Student Violations
                </Link>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-[75%] lg:max-w-[75%] flex flex-col gap-4 md:gap-6">
            {/* Personal Information Card */}
            <Card className="shadow-sm border border-gray-200 bg-white rounded-lg overflow-hidden">
              <CardHeader className="bg-white flex justify-start items-center py-3 md:py-4 border-b-2 border-green-400 pb-2">
                <CardTitle className="text-lg md:text-xl font-bold text-black">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="py-3 md:py-4 flex flex-col gap-3 md:gap-4 max-h-full overflow-y-auto">
                  <FormInput
                    id="studentname"
                    label="Student Name"
                    type="text"
                    placeholder=""
                    value={student.name}
                    disabled
                    className="bg-gray-300"
                  />
                  
                  {/* NISN and NIS Row */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-12">
                    <div className="flex flex-col gap-1 w-full sm:w-1/2">
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
                    <div className="flex flex-col gap-1 w-full sm:w-1/2">
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
                  
                  {/* Gender, Religion, and Phone Row */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 lg:gap-12">
                    <div className="flex flex-col gap-1 w-full sm:w-1/3">
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
                    <div className="flex flex-col gap-1 w-full sm:w-1/3">
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
                    <div className="flex flex-col gap-1 w-full sm:w-1/3">
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

                  {/* Height and Weight Row */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-12">
                    <div className="flex flex-col gap-1 w-full sm:w-1/2">
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
                    <div className="flex flex-col gap-1 w-full sm:w-1/2">
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

            {/* Student's Parent Card */}
            <Card className="shadow-sm border border-gray-200 bg-white rounded-lg overflow-hidden">
              <CardHeader className="bg-white flex justify-start items-center py-3 md:py-4 border-b-2 border-green-400 pb-2">
                <CardTitle className="text-lg md:text-xl font-bold text-black">
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
                        value={student.father_name}
                        disabled
                        className="bg-gray-300"
                      />
                    </div>
                    <div className="flex flex-col gap-1 w-full sm:w-1/2">
                      <FormInput
                        id="father_job"
                        label="Father's Job"
                        type="text"
                        value={student.father_job}
                        disabled
                        className="bg-gray-300"
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
                        value={student.mother_name}
                        disabled
                        className="bg-gray-300"
                      />
                    </div>
                    <div className="flex flex-col gap-1 w-full sm:w-1/2">
                      <FormInput
                        id="mother_job"
                        label="Mother's Job"
                        type="text"
                        value={student.mother_job}
                        disabled
                        className="bg-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Student's Guardian Card */}
            <Card className="shadow-sm border border-gray-200 bg-white rounded-lg overflow-hidden">
              <CardHeader className="bg-white flex justify-start items-center py-3 md:py-4 border-b-2 border-green-400 pb-2">
                <CardTitle className="text-lg md:text-xl font-bold text-black">
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
                        placeholder=""
                        value={student.guardian_name || "-"}
                        disabled
                        className="bg-gray-300"
                      />
                    </div>
                    <div className="flex flex-col gap-1 w-full sm:w-1/2">
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewStudentBio;