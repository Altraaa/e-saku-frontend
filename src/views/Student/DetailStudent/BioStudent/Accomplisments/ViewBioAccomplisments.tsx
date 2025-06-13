import { useState } from "react";
import {
  MoveLeft,
  SquarePen,
  Trash2,
  Trophy,
  Calendar,
  Award,
  Search,
  X,
  Loader2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { useStudentById } from "@/config/Api/useStudent";
import {
  useAccomplishmentDelete,
  useAccomplishmentsByStudentId,
} from "@/config/Api/useAccomplishments";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/shared/component/DatePicker";
import ConfirmationModal from "@/components/ui/confirmation";

const ViewBioAccomplishments = () => {
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: "",
    selectedDate: "",
  });
  const [accomplishmentsDelete, setaccomplishmentsDelete] = useState<
    number | null
  >(null);
  const { id } = useParams();
  const studentId = id ?? "";
  const { data: student, isLoading: studentLoading } =
    useStudentById(studentId);

  const studentName = student ? student.name : "Loading...";

  const {
    data: studentAccomplishments = [],
  } = useAccomplishmentsByStudentId(studentId);
  const deleteAccomplishment = useAccomplishmentDelete();

  if (studentLoading) return <div>Loading...</div>;

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const handleDeleteAccomplishment = (id: number) => {
    setaccomplishmentsDelete(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (accomplishmentsDelete) {
      try {
        await deleteAccomplishment.mutateAsync(accomplishmentsDelete);
        setIsModalOpen(false);
        setaccomplishmentsDelete(null);
      } catch (error) {
        console.error("Failed to delete violation:", error);
      }
    }
  };

  const formattedAccomplishments = studentAccomplishments.map(
    (accomplishment) => ({
      id: accomplishment.id,
      type: accomplishment.accomplishment_type,
      description: accomplishment.description,
      date: accomplishment.accomplishment_date,
      level: accomplishment.level,
      points: accomplishment.points,
      created_at: accomplishment.created_at,
      updated_at: accomplishment.updated_at,
    })
  );

  const totalPoints = studentAccomplishments.reduce(
    (sum, accomplishment) => sum + accomplishment.points,
    0
  );

  //   const formatDisplayDate = (dateString: string) => {
  //     const date = new Date(dateString);
  //     return date.toLocaleDateString("id-ID", {
  //       day: "2-digit",
  //       month: "2-digit",
  //       year: "numeric",
  //     });
  //   };

  const lastAccomplishmentDate =
    studentAccomplishments.length > 0
      ? studentAccomplishments.reduce((latest, accomplishment) => {
          const currentDate = new Date(accomplishment.accomplishment_date);
          return currentDate > latest ? currentDate : latest;
        }, new Date(studentAccomplishments[0].accomplishment_date))
      : null;

  const formatStatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy");
  };

  const clearFilters = () => {
    setFilters({
      selectedDate: "",
      searchTerm: "",
    });
  };

  const parseApiDate = (dateString: string) => {
    return new Date(dateString);
  };

  const hasActiveFilters = Object.values(filters).some(
    (filter) => filter !== ""
  );

  const filteredAccomplishments = formattedAccomplishments.filter(
    (accomplishment) => {
      if (
        filters.searchTerm &&
        !accomplishment.type
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) &&
        !accomplishment.description
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase())
      ) {
        return false;
      }

      if (filters.selectedDate) {
        const accomplishmentDate = parseApiDate(accomplishment.date);
        const selectedDate = parseApiDate(filters.selectedDate);

        if (accomplishmentDate.toDateString() !== selectedDate.toDateString()) {
          return false;
        }
      }
      return true;
    }
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      searchTerm: e.target.value,
    }));
    setCurrentPage(1);
  };

  const handleDateChange = (date?: Date) => {
    setFilters((prev) => ({
      ...prev,
      selectedDate: date ? format(date, "yyyy-MM-dd") : "",
    }));
  };

  const itemsPerPage = parseInt(rowsPerPage);
  const totalPages = Math.ceil(filteredAccomplishments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAccomplishments = filteredAccomplishments.slice(
    startIndex,
    endIndex
  );

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center">
        <Link to={`/studentbio/${student?.id}`} className="group">
          <div className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 group-hover:border-green-500 group-hover:bg-green-50 transition-all">
              <MoveLeft className="h-4 w-4" />
            </div>
            <span className="font-medium">Back to Student Profile</span>
          </div>
        </Link>
      </div>

      {/* Header Section with Gradient Background */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 mb-6 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center">
            <div className="bg-green-600/40 p-2 rounded-lg mr-3">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Riwayat Prestasi
              </h1>
              <p className="text-gray-600 mt-1">
                <span className="font-semibold">{studentName}</span>
              </p>
            </div>
          </div>

          {/* Total Points Card */}
          <div className="bg-green-500 rounded-xl p-4 text-white shadow-sm min-w-[140px]">
            <div className="flex items-center gap-3">
              <div className="bg-green-600/40 p-2 rounded-lg">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalPoints}</p>
                <p className="text-sm text-green-100">Total Poin</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="rounded-xl overflow-hidden shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Trophy className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {studentAccomplishments.length}
                </p>
                <p className="text-sm text-gray-600">Total Prestasi</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl overflow-hidden shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {lastAccomplishmentDate
                    ? formatStatDate(lastAccomplishmentDate.toString())
                    : "tidak ada data"}
                </p>
                <p className="text-sm text-gray-600">Prestasi Terakhir</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accomplishments Table */}
      <Card className="rounded-xl overflow-hidden shadow-sm">
        <CardHeader className="px-6 pt-4 pb-4 border-b-2 border-green-500">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-green-500" />
                Riwayat Prestasi Siswa
              </CardTitle>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  className="pl-10 pr-4 py-2"
                  placeholder="Cari pelanggaran..."
                  value={filters.searchTerm}
                  onChange={handleSearchChange}
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="w-36">
                  <DatePicker
                    value={
                      filters.selectedDate
                        ? new Date(filters.selectedDate)
                        : undefined
                    }
                    onChange={handleDateChange}
                    isForm={false}
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-gray-800 h-8"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto p-4">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50 border-b-2 border-gray-200">
                  <TableHead className="text-center font-semibold text-gray-900 py-4">
                    No
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4">
                    Tipe Prestasi
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-900 py-4">
                    Peringkat
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-900 py-4">
                    Deskripsi
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-900 py-4">
                    Tanggal
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-900 py-4">
                    Level Kompetisi
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-900 py-4">
                    Poin
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-900 py-4">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAccomplishments.length > 0 ? (
                  paginatedAccomplishments.map((accomplishment, index) => (
                    <TableRow
                      key={accomplishment.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <TableCell className="text-center font-medium py-4">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="font-medium py-4">
                        {accomplishment.type}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {accomplishment.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {accomplishment.description}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {accomplishment.date}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-700 border-purple-200"
                        >
                          {accomplishment.level}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-700 border-green-200"
                        >
                          {accomplishment.points}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-blue-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
                            asChild
                          >
                            <a href="/studentbio?nis">
                              <SquarePen className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
                            onClick={() => handleDeleteAccomplishment(accomplishment.id)}
                            disabled={deleteAccomplishment.isPending}
                          >
                            {deleteAccomplishment.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <Award className="h-8 w-8 text-gray-300" />
                        <p>Tidak ada prestasi tambahan ditemukan</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="pl-6 pt-4 pb-4 flex justify-between items-center border-t">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Menampilkan{" "}
                {Math.min(startIndex + 1, filteredAccomplishments.length)} -{" "}
                {Math.min(endIndex, filteredAccomplishments.length)} dari{" "}
                {filteredAccomplishments.length} prestasi
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

            {totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="h-8"
                >
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="h-8 w-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="h-8"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        description="Are you sure you want to delete this accomplishment?"
        confirmText="Delete"
        cancelText="Cancel"
        type="delete"
      />
    </div>
  );
};

export default ViewBioAccomplishments;