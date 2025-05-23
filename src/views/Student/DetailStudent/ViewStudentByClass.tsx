import { Search, SquarePen, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useStudentsByClassId } from "@/config/Api/useStudent";
import { useClassroomById } from "@/config/Api/useClasroom";
import { useStudentDelete } from "@/config/Api/useStudent";
import { useTeacherById } from "@/config/Api/useTeacher";

interface IStudent {
  id: number;
  nis: string;
  name: string;
  violation_points?: number;
  accomplishment_points?: number;
  point_total?: number;
}

interface ClassHeaderProps {
  className: string;
  teacherName: string;
}

const ClassHeader: React.FC<ClassHeaderProps> = ({ className, teacherName }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div className="px-6 py-5">
        <h1 className="text-3xl font-bold text-green-500">
          {className}
        </h1>
        
        <div className="mt-1 flex items-center">
          <span className="text-gray-600">Diampu oleh:</span>
          <span className="ml-2 font-semibold text-gray-700">{teacherName}</span>
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-green-400 to-green-500"></div>
    </div>
  );
};

const LoadingSpinner: React.FC = () => {
  return (
    <div className="p-6 flex justify-center items-center h-64">
      <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

const ViewStudentByClass: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const classId = parseInt(id || "0");
  const [searchText, setSearchText] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState<string>("10");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [displayedStudents, setDisplayedStudents] = useState<IStudent[]>([]);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const { data: classroom, isLoading: classLoading } = useClassroomById(classId);
  const { data: students, isLoading: studentsLoading } = useStudentsByClassId(classId);
  const teacherId = classroom?.teacher_id ?? 0;
  const { data: teacher } = useTeacherById(teacherId);
  const deleteStudent = useStudentDelete();
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const newTimeout = setTimeout(() => {
      setSearchText(value);
      setCurrentPage(1); 
    }, 300);
    
    setSearchTimeout(newTimeout);
  }, [searchTimeout]);

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const filteredStudents = useMemo(() => {
    if (!students || !Array.isArray(students)) return [] as IStudent[];
    
    if (searchText === "") return students;
    
    return students.filter((student: IStudent) => 
      student.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      student.nis?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, students]);
  
  useEffect(() => {
    if (filteredStudents && filteredStudents.length >= 0) {
      const rowsPerPageNum = parseInt(rowsPerPage);
      const totalPages = Math.ceil(filteredStudents.length / rowsPerPageNum);

      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      } else if (currentPage < 1) {
        setCurrentPage(1);
      }

      const startIndex = (currentPage - 1) * rowsPerPageNum;
      const endIndex = startIndex + rowsPerPageNum;
      setDisplayedStudents(filteredStudents.slice(startIndex, endIndex));
    } else {
      setDisplayedStudents([]);
    }
  }, [filteredStudents, currentPage, rowsPerPage]);
  
  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(value);
    setCurrentPage(1); 
  };

  const handleDelete = async (studentId: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus siswa ini?")) {
      try {
        await deleteStudent.mutateAsync(studentId);
        console.log("Student deleted successfully");
      } catch (error) {
        console.error("Failed to delete student:", error);
        alert("Gagal menghapus siswa. Silakan coba lagi.");
      }
    }
  };

  if (classLoading || studentsLoading) {
    return <LoadingSpinner />;
  }

  if (!classroom) {
    return (
      <div className="px-6 py-8 text-center">
        <p className="text-gray-500">Kelas tidak ditemukan</p>
      </div>
    );
  }

  const teacherName = teacher?.name || "Nama guru tidak tersedia";
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / parseInt(rowsPerPage)));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);

  return (
    <div className="px-6 space-y-4 sm:space-y-6">
      <ClassHeader 
        className={classroom?.name || ""} 
        teacherName={teacherName}
      />

      <Card className="rounded-xl overflow-hidden shadow-sm border-gray-200">
        <div className="px-6 pt-4 pb-4 border-b-2 border-green-500">
          <div className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-bold text-gray-900">
              Daftar Siswa Kelas {classroom?.name}
            </CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                defaultValue={searchText}
                onChange={handleSearchChange}
                placeholder="Cari nama siswa atau NIS..."
                className="pl-9 bg-white border-gray-200 w-full rounded-lg"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto pt-3">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-12 text-center px-6 font-medium text-black">No</TableHead>
                <TableHead className="text-center font-medium text-black">NIS</TableHead>
                <TableHead className="text-left font-medium text-black">Nama</TableHead>
                <TableHead className="text-center font-medium text-black">Poin Pelanggaran</TableHead>
                <TableHead className="text-center font-medium text-black">Poin Prestasi</TableHead>
                <TableHead className="text-center font-medium text-black">Total Poin</TableHead>
                <TableHead className="text-center font-medium text-black">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedStudents && displayedStudents.length > 0 ? (
                displayedStudents.map((student, index) => {
                  const actualIndex = ((safePage - 1) * parseInt(rowsPerPage)) + index + 1;
                  return (
                    <TableRow key={student.id} className="border-b hover:bg-gray-50">
                      <TableCell className="text-center px-6 font-normal">{actualIndex}</TableCell>
                      <TableCell className="text-center font-normal">{student.nis || 'N/A'}</TableCell>
                      <TableCell className="text-left font-normal">
                        <Link 
                          to={`/studentbio/${student.id}`} 
                          className="hover:text-green-500 transition-colors"
                        >
                          {student.name || 'Nama tidak tersedia'}
                        </Link>
                      </TableCell>
                      <TableCell className="text-center font-normal">
                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                          {student.violation_points || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-normal">
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                          {student.accomplishment_points || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-normal">
                        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                          {student.point_total || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-normal">
                        <div className="flex justify-center gap-3 items-center">
                          <Link 
                            to={`/studentbio/edit/${student.id}`} 
                            className="text-blue-500 hover:text-blue-600 transition-colors"
                          >
                            <SquarePen className="h-4 w-4" />
                          </Link>
                          <button 
                            className="text-red-500 hover:text-red-600 transition-colors" 
                            onClick={() => handleDelete(student.id)}
                            disabled={deleteStudent.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {searchText ? "Tidak ada data siswa yang sesuai dengan pencarian" : "Tidak ada data siswa"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="pl-6 pt-4 pb-4 flex justify-between items-center border-t">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Menampilkan {displayedStudents.length} dari {filteredStudents.length} siswa
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Rows:</span>
              <Select
                value={rowsPerPage}
                onValueChange={handleRowsPerPageChange}
              >
                <SelectTrigger className="w-16 h-8 border-gray-200 focus:ring-green-400 rounded-lg">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent className="w-16 min-w-[4rem]">
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="pr-6 flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              className="text-gray-700 rounded-lg h-8 w-8 hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={safePage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-sm text-gray-600">
              Page {safePage} of {totalPages}
            </div>
            
            <Button 
              variant="outline" 
              size="icon"
              className="text-gray-700 rounded-lg h-8 w-8 hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={safePage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ViewStudentByClass;