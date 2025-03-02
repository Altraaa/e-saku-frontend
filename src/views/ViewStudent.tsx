import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useClassroomByTeacherId } from "@/config/Api/useClasroom";
import { Link } from "react-router-dom";
import { IClassroom } from "@/config/Models/Classroom";

const ViewStudent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: classrooms, isLoading, error } = useClassroomByTeacherId();

  // Filter kelas berdasarkan pencarian (simulasi)
  const filteredClassrooms = classrooms?.filter((classroom: IClassroom) =>
    classroom.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const teacherName =
    classrooms?.[0]?.teacher?.name || "Teacher name not available";

  return (
    <>
      <div className="flex flex-col items-start gap-2 lg:flex-row lg:justify-between lg:items-center">
        <div>
          <h1 className="text-3xl font-bold text-green-500">{teacherName}</h1>
          <p className="text-xl ">Kelas yang diampu :</p>
        </div>
        <div className="flex gap-4 items-center p-3 bg-white rounded-md">
          <label htmlFor="searchName">
            <Search className="size-6" />
          </label>
          <input
            type="text"
            id="searchName"
            placeholder="Search by students name"
            className="w-72 text-sm outline-none placeholder:text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="my-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-8 mt-10">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error loading data</p>
        ) : (
          filteredClassrooms?.map((classroom: IClassroom) => (
            <Link
              key={classroom.id}
              to={`/class/${classroom.id}`}
              className="group"
            >
              <Card className="bg-white shadow-md py-12 flex flex-col items-center group-hover:shadow-green-500 transition-all duration-200">
                <CardHeader className="w-32 h-32 rounded-full bg-gray-400" />
                <CardTitle className="mt-8 text-3xl font-semibold">
                  <span className="group-hover:text-green-500 transition-all duration-200">
                    {classroom.name}
                  </span>
                </CardTitle>
                <CardContent className="text-gray-400 text-lg">
                  SISWA
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </>
  );
};

export default ViewStudent;
