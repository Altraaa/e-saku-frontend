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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/shared/component/DatePicker";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom"; // For navigation
import { Card } from "@/components/ui/card";

const dummyViolations = [
  {
    id: 1,
    nis: "30688",
    studentName: "I Made Gerrald Wahyu Darmawan",
    className: "XII RPL 3",
    type: "Rambut Panjang",
    description: "Siswa tidak memotong rambut sesuai peraturan.",
    followUp: "Peringatan",
    date: "02/07/2025",
    points: 3,
    teacherSender: "Pak Agus Setiawan",
  },
  {
    id: 2,
    nis: "30890",
    studentName: "Putu Berliana Suardana Putri",
    className: "XII MM 1",
    type: "Mencuri hatiku",
    description: "Pelanggaran ringan, harusnya fokus pada pelajaran.",
    followUp: "Bimbingan",
    date: "02/07/2025",
    points: 2,
    teacherSender: "Bu Sari Dewi",
  },
  {
    id: 3,
    nis: "30686",
    studentName: "I Made Dio Kartiana Putra",
    className: "XII RPL 3",
    type: "Suka sama Shandy",
    description: "Mungkin perlu diberi nasihat terkait perasaan terhadap teman.",
    followUp: "Observasi",
    date: "02/07/2025",
    points: 1,
    teacherSender: "Pak Wayan Sudarta",
  },
];

const ViewReport = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [isViolationDetailModalOpen, setIsViolationDetailModalOpen] = useState(false);
  const [violationDetails, setViolationDetails] = useState<any>(null);
  const [filters, setFilters] = useState({
    selectedDate: "",
    searchTerm: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

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
    return dummyViolations.filter((violation) => {
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
        const violationDate = new Date(violation.date);
        const selectedDate = new Date(filters.selectedDate);

        if (violationDate.toDateString() !== selectedDate.toDateString()) {
          return false;
        }
      }
      return true;
    });
  }, [filters]);

  const totalPages = Math.ceil(filteredViolations.length / parseInt(rowsPerPage));
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
      <div className="animate-pulse">
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-center mb-2">
            <div className="bg-gray-200 p-2 rounded-lg mr-3 w-10 h-10"></div>
            <div className="w-48 h-8 bg-gray-200 rounded-md"></div>
          </div>
          <div className="w-64 h-4 bg-gray-200 rounded-md"></div>
        </div>

        <Card className="rounded-xl overflow-hidden">
          <div className="px-6 pt-4 pb-4 border-b-2 border">
            <div className="flex flex-row items-center justify-between space-y-0">
              <div className="w-72 h-8 bg-gray-200 rounded-md"></div>
              <div className="flex items-center gap-3">
                <div className="w-64 h-10 bg-gray-200 rounded-lg"></div>
                <div className="w-36 h-10 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto p-4">
            <div className="h-10 w-full bg-gray-200 rounded-md mb-4"></div>
            
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 w-full bg-gray-200 rounded-md mb-3"></div>
            ))}
          </div>
          
          <div className="px-6 py-4 flex justify-between items-center border-t">
            <div className="flex items-center space-x-4">
              <div className="w-40 h-6 bg-gray-200 rounded-md"></div>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-8 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              <div className="w-32 h-6 bg-gray-200 rounded-md"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return <HistorySkeleton />;
  }


  return (
    <div className="space-y-6 p-6 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 shadow-md mb-6">
        <div className="flex items-center mb-2">
          <div className="bg-red-600/40 p-2 rounded-lg mr-3">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-black">Follow Up Report</h1>
        </div>
        <div className="mt-1 flex items-center">
          <span className="text-gray-600">Diampu oleh:</span>
          <span className="ml-2 font-semibold text-gray-700">Mr. Teacher</span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 pt-4 pb-4 border-b-2 border-red-500">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h2 className="text-xl font-bold text-gray-900">
                Laporan Pelanggaran Siswa
              </h2>
            </div>
            <div className="flex items-center gap-3">
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
                value={filters.selectedDate ? new Date(filters.selectedDate) : undefined}
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

        <div className="overflow-x-auto pt-3">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-center font-medium text-black">No</TableHead>
                <TableHead className="text-center font-medium text-black">NIS</TableHead>
                <TableHead className="text-left font-medium text-black">Nama</TableHead>
                <TableHead className="text-center font-medium text-black">Kelas</TableHead>
                <TableHead className="text-center font-medium text-black">Detail Pelanggaran</TableHead>
                <TableHead className="text-center font-medium text-black">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedViolations.length > 0 ? (
                paginatedViolations.map((violation, index) => (
                  <TableRow key={violation.id} className="border-b hover:bg-gray-50">
                    <TableCell className="text-center px-6 font-normal">{startIndex + index + 1}</TableCell>
                    <TableCell className="text-center font-normal">{violation.nis}</TableCell>
                    <TableCell className="text-left font-normal">{violation.studentName}</TableCell>
                    <TableCell className="text-center font-normal">{violation.className}</TableCell>
                    <TableCell className="text-center font-normal">
                      <Button
                        variant="link"
                        onClick={() => handleShowViolationDetails(violation)}
                        className="text-gray-500 hover:text-gray-600"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center font-normal">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/violation-details/${violation.id}`}
                          className="text-blue-500 hover:text-blue-600 transition-colors"
                        >
                          <SquarePen className="h-4 w-4" />
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 px-4">
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

        {/* Pagination */}
        <div className="pl-6 pt-4 pb-4 flex justify-between items-center border-t">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Menampilkan {paginatedViolations.length} dari {filteredViolations.length} pelanggaran
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
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pr-6 flex items-center space-x-2">
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
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isViolationDetailModalOpen && (
        <Dialog open={isViolationDetailModalOpen} onOpenChange={setIsViolationDetailModalOpen}>
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
              <p><strong>Jenis Pelanggaran:</strong> {violationDetails?.type}</p>
              <p><strong>Nama:</strong> {violationDetails?.studentName}</p>
              <p><strong>Kelas:</strong> {violationDetails?.className}</p>
              <p><strong>Tanggal:</strong> {formatDisplayDate(violationDetails?.date)}</p>
              <p><strong>Deskripsi:</strong> {violationDetails?.description}</p>
              <p><strong>Tindak Lanjut:</strong> {violationDetails?.followUp}</p>
              <p><strong>Guru Pengirim:</strong> {violationDetails?.teacherSender}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ViewReport;
