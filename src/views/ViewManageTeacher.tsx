import React, { useState, useEffect } from "react";
import { ApiTeachers } from "@/config/Services/Teachers.service";
import { ITeacher } from "@/config/Models/Teacher";
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
  ChevronLeft,
  ChevronRight,
  Search,
  User,
  Pencil,
  Trash2,
  Plus,
  AlertCircle,
  GraduationCap,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ConfirmationModal from "@/components/ui/confirmation";

const ViewManageTeacher: React.FC = () => {
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<ITeacher[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchText, setSearchText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

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

  const { paginatedData, totalPages } = paginateData();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
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

      <Card className="rounded-xl overflow-hidden shadow-sm border-gray-200">
        <div className="px-6 pt-4 pb-4 border-b-2 border-green-500">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <CardTitle className="text-xl flex items-center gap-2 font-bold text-gray-900">
              <GraduationCap className="h-5 w-5 text-green-500" />
              Daftar Guru Pengampu
            </CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                className="bg-green-500 hover:bg-green-600 text-white transition-all duration-300 w-full sm:w-auto"
                onClick={() => toast("Fitur tambah guru akan segera tersedia")}
              >
                <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">Tambah Guru</span>
              </Button>
              <div className="relative flex w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari guru..."
                  value={searchText}
                  onChange={handleSearchChange}
                  className="pl-9 bg-white border-gray-200 w-full rounded-lg"
                />
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
            <>
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
                    <TableHead className="text-left font-medium text-black">
                      Email
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
                        <TableCell className="text-left">
                          {teacher.email || "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-3 items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                toast("Fitur edit akan segera tersedia")
                              }
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

              {filteredTeachers.length > 0 && (
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
            </>
          )}
        </div>
      </Card>

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
