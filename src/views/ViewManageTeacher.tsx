import React, { useState, useEffect, useMemo, useRef } from "react";
import { ApiTeachers } from "@/config/Services/Teachers.service";
import { ITeacher, TeacherErrorState  } from "@/config/Models/Teacher";
import { IClassroom, IAssignClass } from "@/config/Models/Classroom";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  User,
  Pencil,
  Trash2,
  Plus,
  AlertCircle,
  GraduationCap,
  School,
  Key,
  Save,
  UserRoundCheck,
  List,
} from "lucide-react";
import FormFieldGroup from "@/components/shared/component/FormField";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Checkbox } from "@/components/ui/checkbox";
import ConfirmationModal from "@/components/ui/confirmation";
import { useClassroom } from "@/config/Api/useClasroom";
import { setServers } from "dns";
import { useTeacherUpdate } from "@/config/Api/useTeacher";

const ViewManageTeacher: React.FC = () => {
  const inputClass =
    "border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg h-10";

  const updateTeacherData = useTeacherUpdate();

  const { data: classroomsList } = useClassroom();
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<ITeacher[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<TeacherErrorState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<HTMLDivElement>(null);
  const teachersTabRef = useRef<HTMLButtonElement>(null);
  const classesTabRef = useRef<HTMLButtonElement>(null);
  const [activeTab, setActiveTab] = useState<"teachers" | "classes">(
    "teachers"
  );
  const [dialogType, setDialogType] = useState<"editTeacher" | "assignTeacher">(
    "editTeacher"
  );

  const [searchClassroom, setSearchClassroom] = useState("");
  const [searchText, setSearchText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [dataClassroom, setDataClassroom] = useState<
      { id: string; name: string }[]
    >([]);
  const [isDeleteAssignedModalOpen, setIsDeletAssignedeModalOpen] = useState(false);

  const [formData, setFormData] = useState<ITeacher>({
    id: "", 
    teacher_code: "",
    name: "",
    nip: "",
  });


  const resetFormEditTeacher = () => {
    setFormData({
      teacher_code: "",
      name: "",
      nip: "",
    });
  };

  const [formAssignedClass, setfromAssignedClass] = useState<{ teacher_id: number, classes: IAssignClass[]}>({
    teacher_id: 0,
    classes: [],
  });

  const resetFormAssignedTeacher = () => {
    setfromAssignedClass({
      teacher_id: 0,
      classes: [],
    });
    setDataClassroom([]);
  }

  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    teacherId: number;
    teacherName: string;
  } | null>(null);

  const { data: teachersData, refetch } = useQuery<ITeacher[]>({
    queryKey: ["teachers"],
    queryFn: () => ApiTeachers.getAll(),
    enabled: true,
  });

  useEffect(() => {
    if (teachersData) {
      setTeachers(teachersData);
      setFilteredTeachers(teachersData);
      setIsLoading(false);
    }
  }, [teachersData]);

  // Effect untuk menangani error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleTabChange = (tab: "teachers" | "classes") => {
    setActiveTab(tab);
    setCurrentPage(1);

    const tabRef =
      tab === "teachers" ? teachersTabRef : classesTabRef;
    if (tabRef.current && tabsRef.current) {
      const tabRect = tabRef.current.getBoundingClientRect();
      const containerRect = tabsRef.current.getBoundingClientRect();

      setIndicatorStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      });
    }
  };

  const filteredClasses = useMemo(() => {
    if (!classroomsList) return [];
    if (!searchClassroom) return classroomsList;

    return classroomsList.filter((classroom) =>
      classroom.display_name
    );
  }, [classroomsList, searchClassroom]);

  const filterTeachers = (data: ITeacher[], searchText: string): ITeacher[] => {
    if (!searchText.trim()) return data;

    const lowerSearchText = searchText.toLowerCase();
    return data.filter((teacher) => {
      // Check each field safely
      const codeMatch = teacher.teacher_code
        .toLowerCase()
        .includes(lowerSearchText);
      const nameMatch = teacher.name.toLowerCase().includes(lowerSearchText);

      // Handle null values for nip and email
      const nipMatch = teacher.nip
        ? teacher.nip.toLowerCase().includes(lowerSearchText)
        : false;

      const emailMatch = teacher.email
        ? teacher.email.toLowerCase().includes(lowerSearchText)
        : false;

      return codeMatch || nameMatch || nipMatch || emailMatch;
    });
  };

  useEffect(() => {
    if (teachers) {
      setFilteredTeachers(filterTeachers(teachers, searchText));
      setCurrentPage(1);
    }
  }, [searchText, teachers]);

  const paginateData = () => {
    const totalPages = Math.ceil(filteredTeachers.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = filteredTeachers.slice(
      startIndex,
      startIndex + rowsPerPage
    );
    return { paginatedData, totalPages };
  };
  console.log(classroomsList);
  const { paginatedData, totalPages } = paginateData();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleClassSelection = (classId: string, name: string) => {
    const existingClass = dataClassroom.find((v) => v.id === classId);

    if (existingClass) {
      setDataClassroom(dataClassroom.filter((v) => v.id !== classId));
    } else {
      setDataClassroom([...dataClassroom, { id: classId, name }]);
    }
  };

  const handleDialogEditTeacherOpen = (item: ITeacher) => {
    setFormData({
      id: item.id,
      teacher_code: item.teacher_code,
      name: item.name,
      nip: item.nip,
      email: item.email,
    });
    setDialogType("editTeacher")
    setIsEditDialogOpen(true);
  }

  const handleDialogAssignedOpen = (item: ITeacher['id']) => {
    setfromAssignedClass({
      teacher_id: item,
      classes: []
    });
    setDialogType("assignTeacher")
    setIsEditDialogOpen(true);
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { id, teacher_code, name, nip  } = formData;

      if (!id) throw new Error("ID guru tidak ditemukan");

      await updateTeacherData.mutateAsync({
        id,
        data: {teacher_code, name, nip},
      })

      const loadingToastId = toast.loading("Memperbarui data ...");
      toast.success("Guru Pengampu berhasil diperbarui", {
        id: loadingToastId,
      })
      setIsEditDialogOpen(false);
      resetFormEditTeacher();
    } catch (error) {
        toast.error("Gagal memperbarui guru pengampu");
        console.error("Gagal memperbarui guru pengampu:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  const handleDeleteTeacher = async (id: number) => {
    try {
      setIsLoading(true);
    await ApiTeachers.delete(id);
      toast.success("Guru berhasil dihapus");
      refetch();
      setConfirmationModal(null);
    } catch (error) {
      console.error("Gagal menghapus guru:", error);
      setError("Gagal menghapus guru. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickDeleteAssignedTeacher = (
    class_id: IClassroom['id'], teacher_id: ITeacher['id']
  ) => {
    setIsDeletAssignedeModalOpen(true);
  }

  const LoadingSpinner = () => (
    <div className="p-6 flex justify-center items-center h-64">
      <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5">
          <h1 className="text-3xl font-bold text-green-500">Manajemen Guru</h1>
          <div className="mt-1 flex items-center">
            <span className="text-gray-600">
              Kelola data guru dan informasi pengajar
            </span>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-green-400 to-green-500"></div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <nav className="flex border-b border-gray-200" ref={tabsRef}>
            <button
              ref={teachersTabRef}
              className={`py-4 px-6 font-medium text-sm sm:text-base transition-all duration-300 ease-in-out ${
                activeTab === "teachers"
                  ? "text-green-500 bg-green-50/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => handleTabChange("teachers")}
            >
              Guru Pengampu
            </button>
            <button
              ref={classesTabRef}
              className={`py-4 px-6 font-medium text-sm sm:text-base transition-all duration-300 ease-in-out ${
                activeTab === "classes"
                  ? "text-green-500 bg-green-50/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => handleTabChange("classes")}
            >
              Daftar Kelas
            </button>

            <div
              className="absolute bottom-0 h-0.5 bg-green-500 rounded-full transition-all duration-300 ease-in-out"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
              }}
            />
          </nav>
        </div>
      </div>

      <Card className="rounded-xl overflow-hidden shadow-sm border-gray-200">
        <div className="px-6 pt-4 pb-4 border-b-2 border-green-500">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <CardTitle className="text-xl flex items-center gap-2 font-bold text-gray-900">
              {activeTab === "teachers" ? (
                <GraduationCap className="h-5 w-5 text-green-500" />
              ) : (
                <School className="h-5 w-5 text-green-500" />
              )}
              {activeTab === "teachers" 
                ? "Daftar Guru Pengampu"
                : "Daftar Kelas"}
            </CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {activeTab === 'teachers' && (
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white transition-all duration-300 w-full sm:w-auto"
                  onClick={() => toast("Fitur tambah guru akan segera tersedia")}
                >
                  <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Tambah Guru</span>
                </Button>     
              )}
              
              <div className="relative flex w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                {activeTab === 'teachers' ? (
                  <Input
                    placeholder="Cari guru..."
                    value={searchText}
                    onChange={handleSearchChange}
                    className="pl-9 bg-white border-gray-200 w-full rounded-lg"
                  />
                ) : (
                  <Input
                    placeholder="Cari kelas..."
                    value={searchText}
                    onChange={handleSearchChange}
                    className="pl-9 bg-white border-gray-200 w-full rounded-lg"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto pt-3">
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="px-6 py-8 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <p className="text-red-600 font-semibold mb-2">{error}</p>
              <Button
                onClick={() => refetch()}
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Coba Lagi
              </Button>
            </div>
          ) : (
            <div>
              {activeTab === 'teachers' ? (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="w-12 text-center px-6 font-medium text-black">
                        No
                      </TableHead>
                      <TableHead className="text-left font-medium text-black">
                        Kode Guru
                      </TableHead>
                      <TableHead className="text-left font-medium text-black">
                        Nama
                      </TableHead>
                      <TableHead className="text-left font-medium text-black">
                        NIP
                      </TableHead>
                      <TableHead className="text-center font-medium text-black">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((teacher, index) => (
                        <TableRow
                          key={teacher.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <TableCell className="text-center px-6 font-normal">
                            {(currentPage - 1) * rowsPerPage + index + 1}
                          </TableCell>
                          <TableCell className="text-left font-medium text-gray-900">
                            {teacher.teacher_code}
                          </TableCell>
                          <TableCell className="text-left">
                            <div className="flex items-center gap-3">
                              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-500" />
                              </div>
                              <span>{teacher.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-left">
                            {teacher.nip || "-"}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center gap-3 items-center">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleDialogAssignedOpen(teacher.id)}
                                className="text-green-500 hover:text-green-600 hover:bg-green-50 border-green-200"
                              >
                                <UserRoundCheck className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleDialogEditTeacherOpen(teacher)}
                                className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 border-blue-200"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  setConfirmationModal({
                                    isOpen: true,
                                    teacherId: teacher.id,
                                    teacherName: teacher.name,
                                  })
                                }
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-12 text-gray-500"
                        >
                          <User className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                          <p className="text-lg font-medium mb-2">
                            {searchText
                              ? "Tidak ada guru yang sesuai dengan pencarian"
                              : "Belum ada data guru"}
                          </p>
                          <p className="text-sm">
                            {searchText
                              ? "Coba sesuaikan kriteria pencarian Anda"
                              : "Tambahkan guru baru untuk memulai"}
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              ) : (
                  <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="w-12 text-center px-6 font-medium text-black">
                        No
                      </TableHead>
                      <TableHead className="text-left font-medium text-black">
                        Tingkat
                      </TableHead>
                      <TableHead className="text-left font-medium text-black">
                        Jurusan
                      </TableHead>
                      <TableHead className="text-left font-medium text-black">
                        Nama Kelas
                      </TableHead>
                      <TableHead className="text-left font-medium text-black">
                        Guru Pengampu
                      </TableHead>
                      <TableHead className="text-center font-medium text-black">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(classroomsList ?? []).length > 0 ? (
                      classroomsList?.map((classroom, index) => (
                        <TableRow
                          key={classroom.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <TableCell className="text-center px-6 font-normal">
                            {(currentPage - 1) * rowsPerPage + index + 1}
                          </TableCell>
                          <TableCell className="text-left font-medium text-gray-900">
                            {classroom.grade?.name}
                          </TableCell>
                          <TableCell className="text-left">
                            {classroom.major?.name}
                          </TableCell>
                          <TableCell className="text-left">
                            <div className="flex items-center gap-3">
                              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 flex items-center justify-center">
                                <School className="w-4 h-4 text-gray-500" />
                              </div>
                              <span>{classroom.display_name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-left">
                            Guru 1
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center gap-3 items-center">

                              {/* ! Ubah ke confirmation delete untuk assigned guru */}
                              <Button
                                variant="outline"
                                onClick={() => handleClickDeleteAssignedTeacher(teacher)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                              >
                                <Trash2 className="w-4 h-4" />
                                Hapus Pengampu
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-12 text-gray-500"
                        >
                          <User className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                          <p className="text-lg font-medium mb-2">
                            {searchText
                              ? "Tidak ada kelas yang sesuai dengan pencarian"
                              : "Belum ada data kelas"}
                          </p>
                          <p className="text-sm">
                            {searchText
                              ? "Coba sesuaikan kriteria pencarian Anda"
                              : "Tambahkan kelas baru untuk memulai"}
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}

              {filteredTeachers.length > 0 && activeTab === 'teachers' ? (
                // Paginate Guru
                <div className="px-4 sm:px-6 pt-4 pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center border-t space-y-4 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="text-sm text-gray-500 text-center sm:text-left">
                      Menampilkan {paginatedData.length} dari{" "}
                      {filteredTeachers.length} guru
                    </div>
                    <div className="flex items-center justify-center sm:justify-start space-x-2">
                      <span className="text-sm text-gray-600">Baris:</span>
                      <Select
                        value={String(rowsPerPage)}
                        onValueChange={(value) => {
                          setRowsPerPage(parseInt(value));
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger className="w-16 h-8 border-gray-200 focus:ring-green-400 rounded-lg">
                          <SelectValue />
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

                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-gray-700 rounded-lg h-8 w-8 hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="text-sm text-gray-600 px-2">
                      Halaman {currentPage} dari {totalPages}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      className="text-gray-700 rounded-lg h-8 w-8 hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage >= totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                // Paginate Kelas
                <div className="px-4 sm:px-6 pt-4 pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center border-t space-y-4 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="text-sm text-gray-500 text-center sm:text-left">
                      Menampilkan {paginatedData.length} dari{" "}
                      {filteredTeachers.length} guru
                    </div>
                    <div className="flex items-center justify-center sm:justify-start space-x-2">
                      <span className="text-sm text-gray-600">Baris:</span>
                      <Select
                        value={String(rowsPerPage)}
                        onValueChange={(value) => {
                          setRowsPerPage(parseInt(value));
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger className="w-16 h-8 border-gray-200 focus:ring-green-400 rounded-lg">
                          <SelectValue />
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

                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-gray-700 rounded-lg h-8 w-8 hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="text-sm text-gray-600 px-2">
                      Halaman {currentPage} dari {totalPages}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      className="text-gray-700 rounded-lg h-8 w-8 hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage >= totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-full sm:max-w-2xl sm:w-full max-h-[90vh] overflow-y-auto">
            {dialogType === 'editTeacher' ? (
              <DialogHeader> 
                <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <School className="h-5 w-5 text-green-600"/>
                  <p>Edit Guru Pengampu</p>
                </DialogTitle>
                <DialogDescription>
                  {/* Edit nama gurunya dinamis */}
                  Edit data guru ....
                </DialogDescription>
              </DialogHeader>
            ) : (
                <DialogHeader> 
                  <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <UserRoundCheck className="h-5 w-5 text-green-600"/>
                    <p>Edit Kelas yang Diampu</p>
                  </DialogTitle>
                  <DialogDescription>
                    {/* Edit nama gurunya dinamis */}
                    Edit kelas yang diampu oleh guru .....
                  </DialogDescription>
                </DialogHeader>
            )}

            {dialogType === 'editTeacher' ? (
              <div className="grid grid-cols-1 gap-6">
                <FormFieldGroup 
                  label="Kode Guru" 
                  icon={<Key className="h-4 w-4 text-green-600"/>}
                  error={errors.teacher_code}
                >
                  <Input 
                    value={formData.teacher_code}
                    onChange={e => setFormData(prev => ({
                        ...prev,
                        teacher_code: e.target.value
                      }))
                    }
                    className="inputClass"
                  />
                </FormFieldGroup>

                <FormFieldGroup 
                  label="Nama Guru" 
                  icon={<User className="h-4 w-4 text-green-600"/>}
                  error={errors.name}
                >
                  <Input 
                    value={formData.name}
                    onChange={e => setFormData(prev => ({
                        ...prev,
                        name: e.target.value
                      }))
                    }
                    className="inputClass"
                  />
                </FormFieldGroup>
                
                <FormFieldGroup 
                  label="NIP" 
                  icon={<User className="h-4 w-4 text-green-600"/>}
                  error={errors.nip}
                >
                  <Input 
                    value={formData.nip ?? '-'}
                    onChange={e => setFormData(prev => ({
                        ...prev,
                        nip: e.target.value
                      }))
                    }
                    className="inputClass"
                  />
                </FormFieldGroup>
              </div>
            ) : (
              <div className="flex gap-2 w-full h-full">
                <div className="w-1/2">
                  <FormFieldGroup
                    label="Daftar Kelas"
                    icon={<School className="h-4 w-4 text-green-600"/>}
                    required
                  >
                    <div className="relative w-full">
                      <div className="mb-2">
                        <Input
                          placeholder="Cari Kelas"
                          value={searchClassroom}
                          onChange={(e) =>
                            setSearchClassroom(e.target.value)
                          }
                          className={`${inputClass}`}
                        />
                      </div>

                      {/* Daftar kelas dengan checkbox */}
                      <div className="max-h-60 overflow-y-auto border rounded-md">
                        {filteredClasses.length > 0 ? (
                          filteredClasses.map((classroom) => (
                            <div
                              key={classroom.id}
                              className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${
                                dataClassroom.some(
                                  (selected) => selected.id === classroom.id.toString()
                                )
                                  ? "bg-green-50"
                                  : ""
                              }`}
                              onClick={() =>
                                handleClassSelection(
                                  classroom.id.toString(),
                                  classroom.display_name
                                )
                              }
                            >
                              <Checkbox
                                checked={dataClassroom.some(
                                  (selected) => selected.id === classroom.id.toString()
                                )}
                                className="mr-3"
                              />
                                <div className="">{classroom.display_name}</div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            Tidak ada kelas yang cocok
                          </div>
                        )}
                      </div>
                    </div>
                  </FormFieldGroup>
                </div>
                <div className="w-1/2 h">
                  <FormFieldGroup
                    label="Daftar Kelas"
                    icon={<List className="h-4 w-4 text-green-600"/>}
                  >
                    <div className="w-full h-full max-h-72 overflow-y-auto border border-gray-200 rounded-lg p-4">
                      {dataClassroom.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {dataClassroom.map((classroom) => (
                              <button
                                type="button"
                                onClick={() =>
                                  setDataClassroom(
                                    dataClassroom.filter(
                                      (c) => c.id !== classroom.id
                                    )
                                  )
                                }
                                className="border border-green-600 px-3 py-1 rounded-md"
                              >
                                {classroom.name}
                              </button>
                          ))}
                        </div>
                      )}

                    </div>
                  </FormFieldGroup>
                </div>
              </div>
            )}
          
          {dialogType === "editTeacher" ? (
            <DialogFooter className="flex gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  resetFormEditTeacher();
                }}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={isSubmitting}
                onClick={handleUpdate}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                      <Save className="h-4 w-4 mr-2" />
                      Perbarui Guru Pengampu
                  </>
                )}
              </Button>
            </DialogFooter>
          ) : (
            <DialogFooter className="flex gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  resetFormAssignedTeacher();
                }}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                      <Save className="h-4 w-4 mr-2" />
                      Perbarui Kelas Ampuan
                  </>
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {confirmationModal && (
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal(null)}
          onConfirm={() => handleDeleteTeacher(confirmationModal.teacherId)}
          title="Hapus Guru"
          description={`Anda yakin ingin menghapus guru "${confirmationModal.teacherName}"? Tindakan ini tidak dapat dibatalkan.`}
          confirmText="Hapus"
          type="delete"
        />
      )}
    </div>
  );
};

export default ViewManageTeacher;
