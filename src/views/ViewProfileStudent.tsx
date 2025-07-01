import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Award, AlertTriangle, SquarePen } from "lucide-react";
import { useState, useEffect } from "react";
import { useStudentById } from "@/config/Api/useStudent";
import { useClassroomById } from "@/config/Api/useClasroom";
import { IStudent } from "@/config/Models/Student";
import { IClassroom } from "@/config/Models/Classroom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ViewProfileStudent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [studentData, setStudentData] = useState<IStudent | null>(null);
  const [classroomData, setClassroomData] = useState<IClassroom | null>(null);

  // Get student ID from localStorage
  const studentId = localStorage.getItem("student_id") || "";

  // Fetch student data
  const { data: student, isLoading: studentLoading } =
    useStudentById(studentId);

  // Fetch classroom data if student has class_id
  const classId = student?.class_id || 0;
  const { data: classroom, isLoading: classLoading } =
    useClassroomById(classId);

  useEffect(() => {
    if (student) {
      setStudentData(student);
    }

    if (classroom) {
      setClassroomData(classroom);
    }

    // Set overall loading state
    if (!studentLoading && !classLoading) {
      setIsLoading(false);
    }
  }, [student, classroom, studentLoading, classLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-14 h-14 border-4 border-gray-300 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="m-1">
      <div className="w-full flex flex-col px-8 mt-8">
        <h1 className="text-3xl font-bold mb-8">Biodata Siswa</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Photo Section */}
          <div className="w-full lg:w-1/3 flex flex-col items-center">
            <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center mb-6 border-4 border-green-100 overflow-hidden">
              <User className="w-24 h-24 text-gray-400" strokeWidth={1} />
            </div>

            <div className="flex flex-col gap-4 w-full max-w-xs">
              <Button
                asChild
                className="w-full flex items-center gap-2 py-6 text-base bg-green-500 hover:bg-green-600 text-white rounded-lg"
              >
                <Link to={`/studentbio/accomplishments/${student?.id}`}>
                  <Award className="w-5 h-5 text-white" />
                  <span>My Accomplishments</span>
                </Link>
              </Button>

              <Button
                asChild
                className="w-full flex items-center gap-2 py-6 text-base bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                <Link to={`/studentbio/accomplishments/${student?.id}`}>
                  <AlertTriangle className="w-5 h-5 text-white" />
                  <span>My Violations</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Information Card */}
          <div className="w-full lg:w-2/3">
            <Card className="shadow-sm border border-gray-200 bg-white rounded-lg overflow-hidden">
              <CardHeader className="bg-white py-4 border-b-2 border-green-400">
                <CardTitle className="text-xl font-bold text-black text-center">
                  Profil Siswa
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-500">
                      Nama Lengkap
                    </label>
                    <div className="text-lg font-medium">
                      {studentData?.name || "N/A"}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-500">
                      NIS
                    </label>
                    <div className="text-lg font-medium">
                      {studentData?.nis || "N/A"}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-500">
                      NISN
                    </label>
                    <div className="text-lg font-medium">
                      {studentData?.nisn || "N/A"}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-500">
                      Kelas
                    </label>
                    <div className="text-lg font-medium">
                      {classroomData?.name || "N/A"}
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="block text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <div className="text-lg font-medium">
                      {studentData?.email || "N/A"}
                    </div>
                  </div>
                </div>

                {/* Edit Button at the Bottom */}
                <div className="mt-8 flex justify-center">
                  <Button
                    asChild
                    className="flex items-center gap-2 px-8 py-6 text-base bg-green-500 hover:bg-green-600 text-white rounded-lg"
                  >
                    <Link to="/profile/edit">
                      <SquarePen className="w-5 h-5" />
                      <span>Edit Profile</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfileStudent;
