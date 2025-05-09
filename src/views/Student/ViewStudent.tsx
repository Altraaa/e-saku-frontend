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
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            id="searchName"
            placeholder="Search by students name"
            className="pl-9 bg-white border border-gray-300 w-full rounded-lg h-10 text-sm outline-none placeholder:text-xs focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-200"
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
            <Card className="bg-white shadow-md py-8 flex flex-col items-center group-hover:shadow-lg hover:border-green-500 hover:border transition-all duration-200 relative rounded-lg">
              <div className="w-2 h-full absolute left-0 top-0 bg-green-500 rounded-l-lg"></div>
              <CardHeader className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center p-0">
                {/* Empty grey circle - TKR text removed */}
              </CardHeader>
              <CardTitle className="mt-4 text-2xl font-semibold">
                <span className="group-hover:text-green-500 transition-all duration-200">
                  {classroom.name}
                </span>
              </CardTitle>
              <CardContent className="text-gray-400 text-base pt-0">
                {classroom.students?.length || 0} SISWA
              </CardContent>
              <div className="mt-2 flex items-center px-4">
                <div className="w-6 h-6 rounded-full bg-green-100 border border-green-500 flex items-center justify-center mr-2">
                  <span className="text-green-500 text-xs font-bold">
                    {getProgramInitial(classroom.name)}
                  </span>
                </div>
                <span className="text-gray-500 text-sm">
                  {getProgramFullName(classroom.name)}
                </span>
              </div>
            </Card>
          </Link>
          ))
        )}
      </div>
    </>
  );
};

const getProgramCode = (className) => {
  const match = className.match(/\s([A-Z]{2,3})\s?\d/);
  if (match && match[1]) {
    return match[1];
  }
  return "X";
};

const getProgramInitial = (className) => {
  const code = getProgramCode(className);
  return code.charAt(0);
};

const getProgramFullName = (className) => {
  const code = getProgramCode(className);
  
  const programNames = {
    'TKR': 'Teknik Kendaraan Ringan',
    'TKP': 'Teknik Konstruksi Properti',
    'RPL': 'Rekayasa Perangkat Lunak',
    'BKP': 'Bisnis Konstruksi Properti'
  };
  
  return programNames[code] || 'Program Studi';
};

export default ViewStudent;