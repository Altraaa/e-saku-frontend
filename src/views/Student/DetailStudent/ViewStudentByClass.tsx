import { Search, MoveLeft, SquarePen, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useStudentsByClassId } from "@/config/Api/useStudent";
import { useClassroomById } from "@/config/Api/useClasroom";
import { useStudentDelete } from "@/config/Api/useStudent";
import { useTeacherById } from "@/config/Api/useTeacher";

const ViewStudentByClass = () => {
  const { id } = useParams();
  const classId = parseInt(id || "0");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch classroom details
  const { data: classroom, isLoading: classLoading } =
    useClassroomById(classId);

  // Fetch students in this classroom
  const { data: students, isLoading: studentsLoading } =
    useStudentsByClassId(classId);

  // Fetch teacher by teacher id
  const teacherId = classroom?.teacher_id ?? 0;
  const { data: teacher } = useTeacherById(teacherId);

  // Delete mutation
  const deleteStudent = useStudentDelete();

  // Filter students based on search term
  const filteredStudents = students?.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (studentId: number) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      deleteStudent.mutate(studentId);
    }
  };

  if (classLoading || studentsLoading) {
    return <div className="p-6">Loading...</div>;
  }
  
  const teacherName = teacher?.name || "Teacher name not available";

  return (
    <>
      <div className="m-1">
        <Link to="/student">
          <div className="flex gap-2">
            <MoveLeft />
            <h1>Back</h1>
          </div>
        </Link>

        <div className="flex flex-col items-start gap-2 lg:flex-row lg:justify-between lg:items-center px-6 py-4 mt-2">
          <div>
            <h1 className="text-3xl font-bold text-green-500">
              {classroom?.name}
            </h1>
            <p className="text-xl">
              Diampu oleh: <span className="font-semibold">{teacherName}</span>
            </p>
          </div>
          <div className="flex gap-4 items-center p-3 bg-white rounded-md">
            <label htmlFor="searchName">
              <Search className="size-6" />
            </label>
            <input
              type="text"
              id="searchName"
              placeholder="Search by name or NIS"
              className="w-72 text-sm outline-none placeholder:text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Separator className="mt-5 mb-5" />

        <Card className="bg-white mt-4 mx-2">
          <CardContent className="pt-4">
            <Table className="p-2 overflow-x-auto">
              <TableHeader>
                <TableRow>
                  <TableCell className="text-center font-bold">No</TableCell>
                  <TableCell className="text-center font-bold">NIS</TableCell>
                  <TableCell className="font-bold">Name</TableCell>
                  <TableCell className="text-center font-bold">
                    Violation Points
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    Accomplishment Points
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    Total Points
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents && filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-center">
                        {student.nis}
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/studentbio/${student.id}`}
                          className="hover:underline transition-all duration-300"
                        >
                          {student.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-center">
                        {student.violation_points || 0}
                      </TableCell>
                      <TableCell className="text-center">
                        {student.accomplishment_points || 0}
                      </TableCell>
                      <TableCell className="text-center">
                        {student.point_total || 0}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-3 items-center align-middle">
                          <Link
                            to={`/studentbio/edit/${student.id}`}
                            className="text-blue-500"
                          >
                            <SquarePen />
                          </Link>
                          <button
                            className="text-red-600"
                            onClick={() => handleDelete(student.id)}
                          >
                            <Trash2 />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No students found for this class
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ViewStudentByClass;
