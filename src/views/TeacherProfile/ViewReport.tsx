import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  AlertTriangle,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  SquarePen,
} from "lucide-react";
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
import { DatePicker } from "@/components/shared/component/DatePicker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom"; // For navigation
import { useReports } from "@/config/Api/useTeacherReport";

const ViewReport = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [isViolationDetailModalOpen, setIsViolationDetailModalOpen] =
    useState(false);
  const [violationDetails, setViolationDetails] = useState<any>(null);
  const [filters, setFilters] = useState({
    selectedDate: "",
    searchTerm: "",
  });

  // Fetch reports data using useReports hook
  const { data: reports, isLoading: isReportsLoading } = useReports();

  useEffect(() => {
    if (isReportsLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isReportsLoading]);

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

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleShowViolationDetails = (violation: any) => {
    setViolationDetails(violation);
    setIsViolationDetailModalOpen(true);
  };

  const hasActiveFilters = Object.values(filters).some(
    (filter) => filter !== ""
  );

  const filteredViolations = useMemo(() => {
    if (!reports) return [];

    return reports.filter((violation) => {
      if (
        filters.searchTerm &&
        !violation.violation_details
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase())
      ) {
        return false;
      }

      if (filters.selectedDate) {
        const violationDate = new Date(violation.report_date);
        const selectedDate = new Date(filters.selectedDate);

        if (violationDate.toDateString() !== selectedDate.toDateString()) {
          return false;
        }
      }
      return true;
    });
  }, [filters, reports]);

  const totalPages = Math.ceil(
    filteredViolations.length / parseInt(rowsPerPage)
  );
  const startIndex = (currentPage - 1) * parseInt(rowsPerPage);
  const endIndex = startIndex + parseInt(rowsPerPage);
  const paginatedViolations = filteredViolations.slice(startIndex, endIndex);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilters((prev) => ({
        ...prev,
        searchTerm: e.target.value,
      }));
      setCurrentPage(1);
    },
    []
  );

  const handleDateChange = useCallback((date?: Date) => {
    setFilters((prev) => ({
      ...prev,
      selectedDate: date ? date.toISOString().split("T")[0] : "",
    }));
  }, []);

  const HistorySkeleton = () => {
    return (
      <div className="animate-pulse">{/* Add skeleton loading UI here */}</div>
    );
  };

  if (isLoading) {
    return <HistorySkeleton />;
  }

  return (
    <div className="space-y-6 py-4 min-h-screen md:px-8 max-w-screen-xl mx-auto text-sm sm:text-base md:text-base">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 sm:p-6 shadow-md mb-6">
        <div className="flex items-center mb-2">
          <div className="bg-red-600/40 p-2 rounded-lg mr-3">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black leading-tight">
            Laporan Tindak Lanjut
          </h1>
        </div>
        <p className="text-gray-600 max-w-3xl leading-relaxed">
          Laporan tindak lanjut pelanggaran siswa.
        </p>
      </div>

      {/* Filters and Search */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 sm:px-6 pt-4 pb-4 border-b-2 border-red-500">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h2 className="text-xl font-bold text-gray-900">
                  Laporan Pelanggaran Siswa
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Cari pelanggaran..."
                    value={filters.searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>

              <DatePicker
                value={
                  filters.selectedDate
                    ? new Date(filters.selectedDate)
                    : undefined
                }
                onChange={handleDateChange}
                isForm={false}
              />
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-gray-800 h-8"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

          <div className="overflow-x-auto pt-3 relative scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="text-center font-medium text-black">
                    No
                  </TableHead>
                  <TableHead className="text-center font-medium text-black">
                    NIS
                  </TableHead>
                  <TableHead className="text-left font-medium text-black">
                    Nama
                  </TableHead>
                  <TableHead className="text-center font-medium text-black hidden lg:table-cell">
                    Kelas
                  </TableHead>
                  <TableHead className="text-center font-medium text-black hidden lg:table-cell">
                    Pelapor
                  </TableHead>
                  <TableHead className="text-center font-medium text-black hidden lg:table-cell">
                    Detail Pelanggaran
                  </TableHead>
                  <TableHead className="text-center font-medium text-black">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedViolations.length > 0 ? (
                  paginatedViolations.map((violation, index) => (
                    <TableRow
                      key={violation.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <TableCell className="text-center px-6 font-normal">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="text-center font-normal">
                        {violation.student?.nis}
                      </TableCell>
                      <TableCell className="text-left font-normal">
                        {violation.student?.name}
                      </TableCell>
                      <TableCell className="text-center font-normal hidden lg:table-cell">
                        {violation.student?.classroom?.name}
                      </TableCell>
                      <TableCell className="text-center font-normal hidden lg:table-cell">
                        {violation.reporter?.name}
                      </TableCell>
                      <TableCell className="text-center font-normal hidden lg:table-cell">
                        <Button
                          variant="link"
                          onClick={() => handleShowViolationDetails(violation)}
                          className="text-gray-500 hover:text-gray-600"
                          aria-label={`Show details for violation ${violation.id}`}
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </TableCell>
                      <TableCell className="text-center font-normal">
                        <div className="flex justify-center gap-2">
                          <Link
                            to={`/violation-details/${violation.id}`}
                            className="text-blue-500 hover:text-blue-600 transition-colors p-2 rounded-lg"
                            aria-label={`Edit violation ${violation.id}`}
                          >
                            <SquarePen className="h-6 w-6" />
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 px-4">
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <AlertTriangle className="h-8 w-8 text-gray-300" />
                        <p>Tidak ada pelanggaran ditemukan</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden space-y-4 px-4">
            {paginatedViolations.length > 0 ? (
              paginatedViolations.map((violation, index) => (
                <div
                  key={violation.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          #{startIndex + index + 1}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                          {violation.student?.nis || "N/A"}
                        </span>
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {violation.student?.name || "Nama tidak tersedia"}
                      </div>
                      <div className="text-sm text-gray-500">
                        Kelas: {violation.student?.classroom?.name || "-"}
                      </div>
                      <div className="text-sm text-gray-500">
                        Pelapor: {violation.reporter?.name || "-"}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        Detail Pelanggaran: {violation.violation_details || "-"}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/violation-details/${violation.id}`}
                        className="text-blue-500 hover:text-blue-600 transition-colors p-2"
                      >
                        <SquarePen className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                Tidak ada pelanggaran ditemukan
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="pl-6 pt-4 pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center border-t gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="text-sm text-gray-500 text-center sm:text-left">
              Menampilkan {paginatedViolations.length} dari{" "}
              {filteredViolations.length} pelanggaran
            </div>
            <div className="flex items-center justify-center sm:justify-start space-x-2">
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
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pr-6 flex items-center justify-center sm:justify-end space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isViolationDetailModalOpen && (
        <Dialog
          open={isViolationDetailModalOpen}
          onOpenChange={setIsViolationDetailModalOpen}
        >
          <DialogContent className="sm:max-w-[480px] max-w-full max-h-[90vh] overflow-y-auto p-6 rounded-lg shadow-md border border-gray-300 bg-white">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Detail Pelanggaran Siswa
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mb-4">
                Informasi lengkap pelanggaran
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-sm text-gray-700">
              <p>
                <strong>Jenis Pelanggaran:</strong>{" "}
                {violationDetails?.violation_details}
              </p>
              <p>
                <strong>Nama:</strong> {violationDetails?.student?.name}
              </p>
              <p>
                <strong>Kelas:</strong> {violationDetails?.student?.classroom?.name}
              </p>
              <p>
                <strong>Tanggal:</strong>{" "}
                {formatDisplayDate(violationDetails?.report_date)}
              </p>
              <p>
                <strong>Deskripsi:</strong>{" "}
                {violationDetails?.violation_details}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ViewReport;
