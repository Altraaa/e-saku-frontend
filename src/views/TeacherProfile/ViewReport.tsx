import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  AlertTriangle,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  SquarePen,
  Trash2,
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
import { Link, useNavigate } from "react-router-dom";
import { useReportDelete, useReports } from "@/config/Api/useTeacherReport";
import toast from "react-hot-toast";
import ConfirmationModal from "@/components/ui/confirmation";
import { ITeacherReport } from "@/config/Models/TeacherReport";

const ViewReport = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [isViolationDetailModalOpen, setIsViolationDetailModalOpen] =
    useState(false);
  const [violationDetails, setViolationDetails] = useState<
    ITeacherReport | undefined
  >(undefined);
  const [filters, setFilters] = useState({
    selectedDate: "",
    searchTerm: "",
  });
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const navigate = useNavigate();

  // Fetch reports data using useReports hook
  const { data: reports, isLoading: isReportsLoading } = useReports();
  const { mutate: deleteReport } = useReportDelete();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<
    ITeacherReport | undefined
  >(undefined);

  // Get logged-in teacher ID from localStorage
  const teacherId = Number(localStorage.getItem("teacher_id"));

  useEffect(() => {
    if (isReportsLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isReportsLoading]);

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<HTMLDivElement>(null);
  const allTabRef = useRef<HTMLButtonElement>(null);
  const myTabRef = useRef<HTMLButtonElement>(null);

  const handleTabChange = (tab: "all" | "my") => {
    setActiveTab(tab);
    
    const tabRef = tab === "all" ? allTabRef : myTabRef;
    if (tabRef.current && tabsRef.current) {
      const tabRect = tabRef.current.getBoundingClientRect();
      const containerRect = tabsRef.current.getBoundingClientRect();
      
      setIndicatorStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width
      });
    }
  };

  useEffect(() => {
  if (!isLoading) {
    const timer = setTimeout(() => {
      const initialTabElement = allTabRef.current;
      
      if (initialTabElement && tabsRef.current) {
        const tabRect = initialTabElement.getBoundingClientRect();
        const navRect = tabsRef.current.getBoundingClientRect();
        
        setIndicatorStyle({
          left: tabRect.left - navRect.left,
          width: tabRect.width
        });
      }
    }, 50); 
    
    return () => clearTimeout(timer);
  }
}, [isLoading]);

useEffect(() => {
  const updateIndicator = () => {
    let activeTabElement;
    if (activeTab === "all") {
      activeTabElement = allTabRef.current;
    } else {
      activeTabElement = myTabRef.current;
    }
    
    if (activeTabElement && tabsRef.current) {
      const tabRect = activeTabElement.getBoundingClientRect();
      const navRect = tabsRef.current.getBoundingClientRect();
      
      setIndicatorStyle({
        left: tabRect.left - navRect.left,
        width: tabRect.width
      });
    }
  };
  
  if (tabsRef.current) {
    updateIndicator();
  }
  
  window.addEventListener('resize', updateIndicator);
  return () => {
    window.removeEventListener('resize', updateIndicator);
  };
}, [activeTab]);

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

  const handleShowViolationDetails = (violation: ITeacherReport) => {
    setViolationDetails(violation);
    setIsViolationDetailModalOpen(true);
  };

  const hasActiveFilters = Object.values(filters).some(
    (filter) => filter !== ""
  );

  // Filter reports based on active tab and other filters
  const filteredReports = useMemo(() => {
    if (!reports) return [];

    // Apply tab filter first
    let tabFilteredReports;

    if (activeTab === "all") {
      // Laporan Masuk: show reports where teacher_id matches logged-in teacher
      tabFilteredReports = reports.filter(
        (report) => report.teacher_id === teacherId
      );
    } else {
      // Laporan Keluar: show reports where reported_by matches logged-in teacher
      tabFilteredReports = reports.filter(
        (report) => report.reported_by === teacherId
      );
    }

    // Then apply other filters (search and date)
    return tabFilteredReports.filter((report) => {
      if (
        filters.searchTerm &&
        !report.violation_details
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase())
      ) {
        return false;
      }

      if (filters.selectedDate) {
        const reportDate = new Date(report.violation_date);
        const selectedDate = new Date(filters.selectedDate);

        if (reportDate.toDateString() !== selectedDate.toDateString()) {
          return false;
        }
      }

      return true;
    });
  }, [filters, reports, teacherId, activeTab]);

  const totalPages = Math.ceil(filteredReports.length / parseInt(rowsPerPage));
  const startIndex = (currentPage - 1) * parseInt(rowsPerPage);
  const endIndex = startIndex + parseInt(rowsPerPage);
  const paginatedReports = filteredReports.slice(startIndex, endIndex);

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

  const handleDeleteClick = (report: ITeacherReport) => {
    setReportToDelete(report);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (reportToDelete) {
      deleteReport(reportToDelete.id, {
        onSuccess: () => {
          toast.success("Laporan berhasil dihapus");
          setIsDeleteModalOpen(false);
        },
        onError: (error) => {
          toast.error("Gagal menghapus laporan");
          console.error("Gagal menghapus laporan:", error);
        },
      });
    }
  };

  const HistorySkeleton = () => {
    return (
      <div className="animate-pulse bg-gray-200 rounded-xl p-6 h-64 w-full"></div>
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

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="relative">
          <nav className="flex border-b border-gray-200" ref={tabsRef}>
            <button
              ref={allTabRef}
              className={`py-4 px-6 font-medium text-sm sm:text-base transition-all duration-300 ease-in-out ${
                activeTab === "all"
                  ? "text-red-600 bg-red-50/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => handleTabChange("all")}
            >
              Laporan Masuk
            </button>
            <button
              ref={myTabRef}
              className={`py-4 px-6 font-medium text-sm sm:text-base transition-all duration-300 ease-in-out ${
                activeTab === "my"
                  ? "text-red-600 bg-red-50/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => handleTabChange("my")}
            >
              Laporan Keluar
            </button>

            <div 
              className="absolute bottom-0 h-0.5 bg-red-600 rounded-full transition-all duration-300 ease-in-out"
              style={{ 
                left: `${indicatorStyle.left}px`, 
                width: `${indicatorStyle.width}px` 
              }}
            />
          </nav>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 sm:px-6 pt-4 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h2 className="text-xl font-bold text-gray-900">
                {activeTab === "all"
                  ? "Laporan Pelanggaran Masuk"
                  : "Laporan Pelanggaran Keluar"}
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="flex items-center space-x-2">
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
            </div>
          </div>
        </div>

        <div className="overflow-x-auto pt-3 relative scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {/* Desktop Table */}
          <div className="hidden md:block">
            {activeTab === "all" ? (
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
                      Pelapor
                    </TableHead>
                    <TableHead className="text-center font-medium text-black hidden lg:table-cell">
                      Tanggal
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
                  {paginatedReports.length > 0 ? (
                    paginatedReports.map((report, index) => (
                      <TableRow
                        key={report.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <TableCell className="text-center px-6 font-normal">
                          {startIndex + index + 1}
                        </TableCell>
                        <TableCell className="text-center font-normal">
                          {report.student?.nis || "N/A"}
                        </TableCell>
                        <TableCell className="text-left font-normal">
                          <Link
                            to={`/studentbio/${report.student?.id}`}
                            className="hover:text-green-500 transition-colors"
                          >
                            {report.student?.name || "N/A"}
                          </Link>
                        </TableCell>
                        <TableCell className="text-center font-normal hidden lg:table-cell">
                          {report.reporter?.name || "N/A"}
                        </TableCell>
                        <TableCell className="text-center font-normal hidden lg:table-cell">
                          {formatDisplayDate(report.violation_date)}
                        </TableCell>
                        <TableCell className="text-center font-normal hidden lg:table-cell">
                          <Button
                            variant="link"
                            onClick={() => handleShowViolationDetails(report)}
                            className="text-gray-500 hover:text-gray-600"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </TableCell>
                        <TableCell className="text-center font-normal">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="outline"
                              onClick={() =>
                                navigate("/esakuform", {
                                  state: { editData: report },
                                })
                              }
                              className="text-blue-500 hover:text-blue-600 transition-colors p-2 rounded-lg"
                            >
                              <SquarePen className="h-6 w-6" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteClick(report)}
                              className="text-red-500 hover:text-red-600 transition-colors p-2 rounded-lg"
                            >
                              <Trash2 className="h-6 w-6" />
                            </Button>
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
            ) : (
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
                    <TableHead className="text-center font-medium text-black">
                      Tujuan Laporan
                    </TableHead>
                    <TableHead className="text-center font-medium text-black hidden lg:table-cell">
                      Tanggal
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
                  {paginatedReports.length > 0 ? (
                    paginatedReports.map((report, index) => (
                      <TableRow
                        key={report.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <TableCell className="text-center px-6 font-normal">
                          {startIndex + index + 1}
                        </TableCell>
                        <TableCell className="text-center font-normal">
                          {report.student?.nis || "N/A"}
                        </TableCell>
                        <TableCell className="text-left font-normal">
                          <Link
                            to={`/studentbio/${report.student?.id}`}
                            className="hover:text-green-500 transition-colors"
                          >
                            {report.student?.name || "N/A"}
                          </Link>
                        </TableCell>
                        <TableCell className="text-center font-normal">
                          {report.teacher?.name || "N/A"}
                        </TableCell>
                        <TableCell className="text-center font-normal hidden lg:table-cell">
                          {formatDisplayDate(report.violation_date)}
                        </TableCell>
                        <TableCell className="text-center font-normal hidden lg:table-cell">
                          <Button
                            variant="link"
                            onClick={() => handleShowViolationDetails(report)}
                            className="text-gray-500 hover:text-gray-600"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </TableCell>
                        <TableCell className="text-center font-normal">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteClick(report)}
                            className="text-red-500 hover:text-red-600 transition-colors p-2 rounded-lg"
                          >
                            <Trash2 className="h-6 w-6" />
                          </Button>
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
            )}
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden space-y-4 px-4">
            {paginatedReports.length > 0 ? (
              paginatedReports.map((report, index) => (
                <div
                  key={report.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {startIndex + index + 1}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                          {report.student?.nis || "N/A"}
                        </span>
                        {report.reported_by === teacherId && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                            Laporan Saya
                          </span>
                        )}
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        <Link
                          to={`/studentbio/${report.student?.id}`}
                          className="hover:text-green-500 transition-colors"
                        >
                          {report.student?.name || "N/A"}
                        </Link>
                      </div>
                      <div className="text-sm text-gray-500">
                        {activeTab === "all" ? "Pelapor" : "Tujuan Laporan"}:{" "}
                        {activeTab === "all"
                          ? report.reporter?.name || "-"
                          : report.teacher?.name || "-"}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        <span className="font-medium">Pelanggaran:</span>{" "}
                        {report.violation_details || "-"}
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Tindak Lanjut:</span>{" "}
                        {report.action || "-"}
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Tanggal:</span>{" "}
                        {formatDisplayDate(report.violation_date)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleShowViolationDetails(report)}
                        className="text-gray-500 hover:text-gray-600"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          navigate("/esakuform", {
                            state: { editData: report },
                          })
                        }
                        className="text-blue-500 hover:text-blue-600 transition-colors p-2 rounded-lg"
                      >
                        <SquarePen className="h-6 w-6" />
                      </Button>
                      {report.reported_by === teacherId && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteClick(report)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
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
              Menampilkan {startIndex + 1} -{" "}
              {Math.min(endIndex, filteredReports.length)} dari{" "}
              {filteredReports.length} data
            </div>
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="text-sm text-gray-600">Baris:</span>
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
              Halaman {currentPage} dari {totalPages}
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
          {violationDetails && (
            <div className="space-y-4 text-sm text-gray-700">
              <p>
                <strong>NIS:</strong> {violationDetails.student?.nis || "N/A"}
              </p>
              <p>
                <strong>Nama:</strong> {violationDetails.student?.name || "N/A"}
              </p>
              <p>
                <strong>
                  {activeTab === "all" ? "Pelapor" : "Guru yang Dilaporkan"}:
                </strong>{" "}
                {activeTab === "all"
                  ? violationDetails.reporter?.name || "N/A"
                  : violationDetails.teacher?.name || "N/A"}
              </p>
              <p>
                <strong>Tanggal:</strong>{" "}
                {formatDisplayDate(violationDetails.violation_date)}
              </p>
              <p>
                <strong>Jenis Pelanggaran :</strong>{" "}
                {violationDetails.rules_of_conduct.name}
              </p>
              <p>
                <strong>Deskripsi Pelanggaran:</strong>{" "}
                {violationDetails.violation_details}
              </p>
              <p>
                <strong>Tindak Lanjut:</strong> {violationDetails.action}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Laporan?"
        description="Apakah anda yakin ingin menghapus laporan ini? Data yang dihapus tidak dapat dikembalikan."
        confirmText="Hapus"
        cancelText="Batal"
        type="delete"
      />
    </div>
  );
};

export default ViewReport;
