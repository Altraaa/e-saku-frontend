import { useState } from "react";
import {
  MoveLeft,
  SquarePen,
  Trash2,
  AlertTriangle,
  Calendar,
  X,
  Loader2,
  Search,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useViolationDelete, useViolationsByStudentId } from "@/config/Api/useViolation";
import { DatePicker } from "@/components/shared/component/DatePicker";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { useStudentById } from "@/config/Api/useStudent";
import { Link, useParams } from "react-router-dom";
import ConfirmationModal from "@/components/ui/confirmation";

const ViewBioViolations = () => {
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [violationToDelete, setViolationToDelete] = useState<number | null>(
    null
  );
  const { id } = useParams();
  const studentId = id ?? "";
  const { data: student, isLoading: studentLoading } = useStudentById(studentId);

  const studentName = student ? student.name : "Loading...";

  const [filters, setFilters] = useState({
    selectedDate: "",
    searchTerm: "",
  });

  const {
    data: studentViolations = [],
    isLoading,
    error,
  } = useViolationsByStudentId(studentId);
  const deleteViolation = useViolationDelete();

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      selectedDate: "",
      searchTerm: "",
    });
  };

  const handleDeleteViolation = (id: number) => {
    setViolationToDelete(id); 
    setIsModalOpen(true); 
  };

  const handleConfirmDelete = async () => {
    if (violationToDelete) {
      try {
        await deleteViolation.mutateAsync(violationToDelete);
        setIsModalOpen(false); 
        setViolationToDelete(null);
      } catch (error) {
        console.error("Failed to delete violation:", error);
      }
    }
  };

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatStatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy");
  };

  const lastViolationDate =
    studentViolations.length > 0
      ? studentViolations.reduce((latest, violation) => {
          const currentDate = new Date(violation.violation_date);
          return currentDate > latest ? currentDate : latest;
        }, new Date(studentViolations[0].violation_date))
      : null;

  const parseApiDate = (dateString: string) => {
    return new Date(dateString);
  };

  const hasActiveFilters = Object.values(filters).some(
    (filter) => filter !== ""
  );

  const mappedViolations = studentViolations.map((violation) => ({
    id: violation.id,
    type: violation.rules_of_conduct.name,
    description: violation.description,
    followUp: violation.action,
    date: violation.violation_date,
    points: violation.points,
    created_at: violation.created_at,
    updated_at: violation.updated_at,
  }));

  const filteredViolations = mappedViolations.filter((violation) => {
    if (
      filters.searchTerm &&
      !violation.type
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase()) &&
      !violation.description
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase())
    ) {
      return false;
    }

    if (filters.selectedDate) {
      const violationDate = parseApiDate(violation.date);
      const selectedDate = parseApiDate(filters.selectedDate);

      if (violationDate.toDateString() !== selectedDate.toDateString()) {
        return false;
      }
    }
    return true;
  });

  const totalPoints = studentViolations.reduce(
    (sum, violation) => sum + violation.points,
    0
  );

  const itemsPerPage = parseInt(rowsPerPage);
  const totalPages = Math.ceil(filteredViolations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedViolations = filteredViolations.slice(startIndex, endIndex);

  const handleDateChange = (date?: Date) => {
    setFilters((prev) => ({
      ...prev,
      selectedDate: date ? format(date, "yyyy-MM-dd") : "",
    }));
  };

  const LoadingSpinner: React.FC = () => {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      searchTerm: e.target.value,
    }));
    setCurrentPage(1);
  };

  if (studentLoading || isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 sm:h-12 sm:w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            Error Loading Data
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Gagal memuat data pelanggaran. Silakan coba lagi.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-full">
      {/* Back Button */}
      <div className="flex items-center">
        <Link to={`/studentbio/${student?.id}`} className="group">
          <div className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 group-hover:border-green-500 group-hover:bg-green-50 transition-all">
              <MoveLeft className="h-4 w-4" />
            </div>
            <span className="font-medium text-sm sm:text-base">Back to Student Profile</span>
          </div>
        </Link>
      </div>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 sm:p-6 shadow-md">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="bg-red-600/40 p-2 rounded-lg flex-shrink-0">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 break-words">
                  Riwayat Pelanggaran
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1 break-words">
                  <span className="font-semibold">{studentName}</span>
                </p>
              </div>
            </div>

            <div className="bg-red-500 rounded-xl p-3 sm:p-4 text-white shadow-sm w-full sm:w-auto sm:min-w-[140px]">
              <div className="flex items-center gap-3">
                <div className="bg-red-600/40 p-2 rounded-lg flex-shrink-0">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">{totalPoints}</p>
                  <p className="text-xs sm:text-sm text-red-100">Total Poin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Pelanggaran */}
        <div className="p-4 rounded-xl border-2 bg-white">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-red-500/40 p-2 text-red-800 rounded-lg flex-shrink-0">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {studentViolations.length}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Total Pelanggaran</p>
            </div>
          </div>
        </div>
        
        {/* Pelanggaran Terakhir */}
        <div className="p-4 rounded-xl border-2 bg-white">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-orange-400/40 p-2 text-orange-600 rounded-lg flex-shrink-0">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base sm:text-xl font-bold text-gray-900 break-words">
                {lastViolationDate
                  ? formatStatDate(lastViolationDate.toString())
                  : "tidak ada data"}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Pelanggaran Terakhir</p>
            </div>
          </div>
        </div>
      </div>

      {/* Violations Table */}
      <Card className="rounded-xl overflow-hidden shadow-sm">
        <CardHeader className="px-4 sm:px-6 pt-4 pb-4 border-b-2 border-red-500">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
              <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 break-words">
                Riwayat Pelanggaran Siswa
              </CardTitle>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  className="pl-10 pr-4 py-2 text-sm"
                  placeholder="Cari pelanggaran..."
                  value={filters.searchTerm}
                  onChange={handleSearchChange}
                />
              </div>

              {/* Date Picker and Clear Button */}
              <div className="flex gap-2">
                <div className="w-full sm:w-36">
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

                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="text-gray-600 hover:text-gray-800 h-8 px-3 flex-shrink-0"
                  >
                    <X className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Clear</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto p-4">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 hover:bg-gray-50 border-b-2 border-gray-200">
                  <th className="text-center font-semibold text-gray-900 py-4 px-4">No</th>
                  <th className="font-semibold text-gray-900 py-4 px-4 text-left">Jenis Pelanggaran</th>
                  <th className="text-center font-semibold text-gray-900 py-4 px-4">Deskripsi</th>
                  <th className="text-center font-semibold text-gray-900 py-4 px-4">Tindak Lanjut</th>
                  <th className="text-center font-semibold text-gray-900 py-4 px-4">Tanggal & Waktu</th>
                  <th className="text-center font-semibold text-gray-900 py-4 px-4">Poin</th>
                  <th className="text-center font-semibold text-gray-900 py-4 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedViolations.length > 0 ? (
                  paginatedViolations.map((violation, index) => (
                    <tr
                      key={violation.id}
                      className="hover:bg-gray-50/50 transition-colors border-b"
                    >
                      <td className="text-center py-4 px-4">{startIndex + index + 1}</td>
                      <td className="py-4 px-4">{violation.type}</td>
                      <td className="text-center py-4 px-4">
                        <span className="text-gray-600">{violation.description}</span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <Badge
                          variant="outline"
                          className={
                            violation.followUp === "Peringatan"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-orange-50 text-orange-700 border-orange-200"
                          }
                        >
                          {violation.followUp}
                        </Badge>
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span>{formatDisplayDate(violation.date)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <Badge
                          variant="destructive"
                          className="bg-red-100 text-red-700 border-red-200"
                        >
                          {violation.points}
                        </Badge>
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-blue-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
                            asChild
                          >
                            <a href={`/violation/edit/${violation.id}`}>
                              <SquarePen className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
                            onClick={() => handleDeleteViolation(violation.id)}
                            disabled={deleteViolation.isPending}
                          >
                            {deleteViolation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-12 px-4">
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <AlertTriangle className="h-8 w-8 text-gray-300" />
                        <p>
                          {hasActiveFilters
                            ? "Tidak ada pelanggaran yang sesuai dengan filter"
                            : "Tidak ada pelanggaran ditemukan"}
                        </p>
                        {hasActiveFilters && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearFilters}
                            className="mt-2"
                          >
                            Reset Filter
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden p-4 space-y-4">
            {paginatedViolations.length > 0 ? (
              paginatedViolations.map((violation, index) => (
                <Card key={violation.id} className="border border-gray-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">
                          #{startIndex + index + 1}
                        </span>
                        <Badge
                          variant="destructive"
                          className="bg-red-100 text-red-700 border-red-200 text-xs"
                        >
                          {violation.points} poin
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0 border-blue-200 hover:bg-blue-50"
                          asChild
                        >
                          <a href={`/violation/edit/${violation.id}`}>
                            <SquarePen className="h-3 w-3" />
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0 border-red-200 hover:bg-red-50"
                          onClick={() => handleDeleteViolation(violation.id)}
                          disabled={deleteViolation.isPending}
                        >
                          {deleteViolation.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">
                          {violation.type}
                        </h4>
                        <p className="text-gray-600 text-sm">{violation.description}</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDisplayDate(violation.date)}</span>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            violation.followUp === "Peringatan"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200 text-xs"
                              : "bg-orange-50 text-orange-700 border-orange-200 text-xs"
                          }
                        >
                          {violation.followUp}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <AlertTriangle className="h-8 w-8 text-gray-300" />
                  <p className="text-sm">
                    {hasActiveFilters
                      ? "Tidak ada pelanggaran yang sesuai dengan filter"
                      : "Tidak ada pelanggaran ditemukan"}
                  </p>
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="mt-2"
                    >
                      Reset Filter
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="px-4 sm:px-6 pt-4 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="text-xs sm:text-sm text-gray-500">
                Menampilkan{" "}
                {Math.min(startIndex + 1, filteredViolations.length)} -{" "}
                {Math.min(endIndex, filteredViolations.length)} dari{" "}
                {filteredViolations.length} pelanggaran
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-600">Rows:</span>
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
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="h-8 text-xs sm:text-sm px-2 sm:px-3"
                >
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </Button>

                <div className="flex items-center gap-1">
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
                        className="h-8 w-8 p-0 text-xs"
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
                  className="h-8 text-xs sm:text-sm px-2 sm:px-3"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:inline">Next</span>
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
        description="Are you sure you want to delete this violation?"
        confirmText="Delete"
        cancelText="Cancel"
        type="delete"
      />
    </div>
  );
};

export default ViewBioViolations;