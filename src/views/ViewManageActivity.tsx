import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  GraduationCap,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  SquarePen,
  Trash2,
  Plus,
  Users,
  UserCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmationModal from "@/components/ui/confirmation";
import { Label } from "@/components/ui/label";
import {
  useExtracurriculars,
  useExtracurricularDelete,
  useExtracurricularCreate,
  useExtracurricularUpdate,
} from "@/config/Api/useExtracurriculars";
import { IExtracurricular } from "@/config/Models/Extracurriculars";
import { Textarea } from "@/components/ui/textarea";

interface IStudentExtracurricular {
  id: number;
  student_id: number;
  extracurricular_id: number;
  student?: {
    id: number;
    name: string;
    nis: string;
    class: string;
  };
  extracurricular?: {
    id: number;
    name: string;
    teacher?: {
      name: string;
    };
  };
  enrollment_date: string;
  status: "active" | "inactive";
}

const ViewManageActivity = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<IExtracurricular>({
    name: "",
    status: "active",
    trainer: "",
    description: "",
  });
  const [filters, setFilters] = useState({
    searchTerm: "",
    statusFilter: "",
  });
  const [activeTab, setActiveTab] = useState<"extracurricular" | "students">(
    "extracurricular"
  );
  const [extracurriculars, setExtracurriculars] = useState<IExtracurricular[]>(
    []
  );
  const [studentExtracurriculars, setStudentExtracurriculars] = useState<
    IStudentExtracurricular[]
  >([]);
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<
    IExtracurricular | IStudentExtracurricular | undefined
  >(undefined);

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<HTMLDivElement>(null);
  const extracurricularTabRef = useRef<HTMLButtonElement>(null);
  const studentsTabRef = useRef<HTMLButtonElement>(null);

  const { data: extracurricularsData, isLoading: extracurricularsLoading } =
    useExtracurriculars();
  const deleteMutation = useExtracurricularDelete();
  const createExtracurricular = useExtracurricularCreate();
  const updateExtracurricular = useExtracurricularUpdate();

  useEffect(() => {
    if (extracurricularsData) {
      setExtracurriculars(extracurricularsData);
    }
  }, [extracurricularsData]);

  const handleFormChange = (field: keyof IExtracurricular, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      trainer: "",
      status: "active",
      description: "",
    });
  };

  const handleEditClick = (item: IExtracurricular) => {
    setFormData({
      id: item.id,
      name: item.name,
      trainer: item.trainer,
      description: item.description,
      status: item.status,
    });
    setIsAddDialogOpen(true); // Open the dialog to edit the item
  };

  // Handle form submission for creating a new extracurricular
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { name, trainer, description } = formData;

      await createExtracurricular.mutateAsync({
        name,
        trainer,
        description,
        status: "active",
      });

      const loadingToastId = toast.loading("Menambahkan data...");
      toast.success("Ekstrakurikuler berhasil ditambahkan", {
        id: loadingToastId,
      });
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Gagal menambahkan ekstrakurikuler");
      console.error("Gagal menambahkan ekstrakurikuler:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { id, name, trainer, description } = formData;

      if(!id) throw new Error("ID ekstrakurikuler tidak ditemukan");

      await updateExtracurricular.mutateAsync({
        id,
        data: { name, trainer, description },
      });

      const loadingToastId = toast.loading("Memperbarui data...");
      toast.success("Ekstrakurikuler berhasil diperbarui", {
        id: loadingToastId,
      });
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Gagal memperbarui ekstrakurikuler");
      console.error("Gagal memperbarui ekstrakurikuler:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (tab: "extracurricular" | "students") => {
    setActiveTab(tab);
    setCurrentPage(1);

    const tabRef =
      tab === "extracurricular" ? extracurricularTabRef : studentsTabRef;
    if (tabRef.current && tabsRef.current) {
      const tabRect = tabRef.current.getBoundingClientRect();
      const containerRect = tabsRef.current.getBoundingClientRect();

      setIndicatorStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      });
    }
  };

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        const initialTabElement = extracurricularTabRef.current;

        if (initialTabElement && tabsRef.current) {
          const tabRect = initialTabElement.getBoundingClientRect();
          const navRect = tabsRef.current.getBoundingClientRect();

          setIndicatorStyle({
            left: tabRect.left - navRect.left,
            width: tabRect.width,
          });
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    const updateIndicator = () => {
      let activeTabElement;
      if (activeTab === "extracurricular") {
        activeTabElement = extracurricularTabRef.current;
      } else {
        activeTabElement = studentsTabRef.current;
      }

      if (activeTabElement && tabsRef.current) {
        const tabRect = activeTabElement.getBoundingClientRect();
        const navRect = tabsRef.current.getBoundingClientRect();

        setIndicatorStyle({
          left: tabRect.left - navRect.left,
          width: tabRect.width,
        });
      }
    };

    if (tabsRef.current) {
      updateIndicator();
    }

    window.addEventListener("resize", updateIndicator);
    return () => {
      window.removeEventListener("resize", updateIndicator);
    };
  }, [activeTab]);

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      statusFilter: "",
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

  const hasActiveFilters = Object.values(filters).some(
    (filter) => filter !== ""
  );

  // Filter data based on active tab and other filters
  const filteredData = useMemo(() => {
    if (activeTab === "extracurricular") {
      return extracurriculars.filter((item) => {
        if (
          filters.searchTerm &&
          !item.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
          !item.trainer.toLowerCase().includes(filters.searchTerm.toLowerCase())
        ) {
          return false;
        }

        if (filters.statusFilter && item.status !== filters.statusFilter) {
          return false;
        }

        return true;
      });
    } else {
      return studentExtracurriculars.filter((item) => {
        if (
          filters.searchTerm &&
          !item.student?.name
            .toLowerCase()
            .includes(filters.searchTerm.toLowerCase()) &&
          !item.student?.nis.includes(filters.searchTerm) &&
          !item.extracurricular?.name
            .toLowerCase()
            .includes(filters.searchTerm.toLowerCase())
        ) {
          return false;
        }

        if (filters.statusFilter && item.status !== filters.statusFilter) {
          return false;
        }

        return true;
      });
    }
  }, [filters, extracurriculars, studentExtracurriculars, activeTab]);

  const totalPages = Math.ceil(filteredData.length / parseInt(rowsPerPage));
  const startIndex = (currentPage - 1) * parseInt(rowsPerPage);
  const endIndex = startIndex + parseInt(rowsPerPage);
  const paginatedData = filteredData.slice(startIndex, endIndex);

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

  const handleStatusFilterChange = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      statusFilter: value === "all" ? "" : value,
    }));
    setCurrentPage(1);
  }, []);

  const handleDeleteClick = (
    item: IExtracurricular | IStudentExtracurricular
  ) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      setIsDeleteModalOpen(false);

      const loadingToastId = toast.loading("Menghapus data...");
      try {
        if (activeTab === "extracurricular" && itemToDelete.id) {
          await deleteMutation.mutateAsync(itemToDelete.id);
          toast.success("Ekstrakurikuler berhasil dihapus", {
            id: loadingToastId,
          });
        }
      } catch (error) {
        toast.error("Gagal menghapus data", {
          id: loadingToastId,
        });
        console.error("Gagal menghapus data:", error);
      }
    }
  };

  const HistorySkeleton = () => {
    return (
      <div className="animate-pulse bg-gray-200 rounded-xl p-6 h-64 w-full"></div>
    );
  };

  if (extracurricularsLoading) {
    return <HistorySkeleton />;
  }

  return (
    <div className="space-y-6 min-h-screen md:max-w-screen-xl mx-auto text-sm sm:text-base md:text-base">
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 sm:p-6 shadow-md mb-6">
        <div className="flex items-center mb-2">
          <div className="bg-green-600/40 p-2 rounded-lg mr-3">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black leading-tight">
            Manajemen Ekstrakurikuler
          </h1>
        </div>
        <p className="text-gray-600 max-w-3xl leading-relaxed">
          Kelola ekstrakurikuler sekolah dan pantau partisipasi siswa.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="relative">
          <nav className="flex border-b border-gray-200" ref={tabsRef}>
            <button
              ref={extracurricularTabRef}
              className={`py-4 px-6 font-medium text-sm sm:text-base transition-all duration-300 ease-in-out ${
                activeTab === "extracurricular"
                  ? "text-green-500 bg-green-50/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => handleTabChange("extracurricular")}
            >
              Ekstrakurikuler
            </button>
            <button
              ref={studentsTabRef}
              className={`py-4 px-6 font-medium text-sm sm:text-base transition-all duration-300 ease-in-out ${
                activeTab === "students"
                  ? "text-green-500 bg-green-50/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => handleTabChange("students")}
            >
              Siswa Terdaftar
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

      {/* Filters and Search */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 sm:px-6 pt-4 pb-4 border-b-2 border-green-500">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              {activeTab === "extracurricular" ? (
                <GraduationCap className="h-5 w-5 text-green-500" />
              ) : (
                <Users className="h-5 w-5 text-green-500" />
              )}
              <h2 className="text-xl font-bold text-gray-900">
                {activeTab === "extracurricular"
                  ? "Daftar Ekstrakurikuler"
                  : "Siswa Terdaftar Ekstrakurikuler"}
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="flex items-center space-x-2">
                <Select
                  value={filters.statusFilter || "all"}
                  onValueChange={handleStatusFilterChange}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
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
                  placeholder={
                    activeTab === "extracurricular"
                      ? "Cari ekstrakurikuler..."
                      : "Cari siswa..."
                  }
                  value={filters.searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              {activeTab === "extracurricular" && (
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Ekstrakurikuler
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto pt-3 relative scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {/* Desktop Table */}
          <div className="hidden md:block">
            {activeTab === "extracurricular" ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="text-center font-medium text-black">
                      No
                    </TableHead>
                    <TableHead className="text-left font-medium text-black">
                      Nama Ekstrakurikuler
                    </TableHead>
                    <TableHead className="text-center font-medium text-black">
                      Pembina
                    </TableHead>
                    <TableHead className="text-center font-medium text-black">
                      Peserta
                    </TableHead>
                    <TableHead className="text-center font-medium text-black">
                      Status
                    </TableHead>
                    <TableHead className="text-center font-medium text-black">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length > 0 ? (
                    (paginatedData as IExtracurricular[]).map((item, index) => (
                      <TableRow
                        key={item.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <TableCell className="text-center px-6 font-normal">
                          {startIndex + index + 1}
                        </TableCell>
                        <TableCell className="text-left font-normal">
                          <div>
                            <div className="font-medium">{item.name}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-normal">
                          {item.trainer || "N/A"}
                        </TableCell>
                        <TableCell className="text-center font-normal">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              item.students_count
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {item.students_count}
                          </span>
                        </TableCell>
                        <TableCell className="text-center font-normal">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              item.status === "active"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {item.status === "active" ? "Aktif" : "Tidak Aktif"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center font-normal">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditClick(item)}
                              className="text-green-500 hover:text-green-600"
                            >
                              <SquarePen className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteClick(item)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 px-4">
                        <div className="flex flex-col items-center gap-2 text-gray-500">
                          <GraduationCap className="h-8 w-8 text-gray-300" />
                          <p>Tidak ada ekstrakurikuler ditemukan</p>
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
                      Nama Siswa
                    </TableHead>
                    <TableHead className="text-center font-medium text-black">
                      Kelas
                    </TableHead>
                    <TableHead className="text-left font-medium text-black">
                      Ekstrakurikuler
                    </TableHead>
                    <TableHead className="text-center font-medium text-black">
                      Tanggal Daftar
                    </TableHead>
                    <TableHead className="text-center font-medium text-black">
                      Status
                    </TableHead>
                    <TableHead className="text-center font-medium text-black">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length > 0 ? (
                    (paginatedData as IStudentExtracurricular[]).map(
                      (item, index) => (
                        <TableRow
                          key={item.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <TableCell className="text-center px-6 font-normal">
                            {startIndex + index + 1}
                          </TableCell>
                          <TableCell className="text-center font-normal">
                            {item.student?.nis || "N/A"}
                          </TableCell>
                          <TableCell className="text-left font-normal">
                            <Link
                              to={`/studentbio/${item.student?.id}`}
                              className="hover:text-green-500 transition-colors"
                            >
                              {item.student?.name || "N/A"}
                            </Link>
                          </TableCell>
                          <TableCell className="text-center font-normal">
                            {item.student?.class || "N/A"}
                          </TableCell>
                          <TableCell className="text-left font-normal">
                            <div>
                              <div className="font-medium">
                                {item.extracurricular?.name || "N/A"}
                              </div>
                              <div className="text-sm text-gray-500">
                                Pembina:{" "}
                                {item.extracurricular?.teacher?.name || "N/A"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-normal">
                            {formatDisplayDate(item.enrollment_date)}
                          </TableCell>
                          <TableCell className="text-center font-normal">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                item.status === "active"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {item.status === "active"
                                ? "Aktif"
                                : "Tidak Aktif"}
                            </span>
                          </TableCell>
                          <TableCell className="text-center font-normal">
                            <div className="flex justify-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleDeleteClick(item)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    )
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 px-4">
                        <div className="flex flex-col items-center gap-2 text-gray-500">
                          <Users className="h-8 w-8 text-gray-300" />
                          <p>Tidak ada siswa terdaftar ditemukan</p>
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
            {paginatedData.length > 0 ? (
              activeTab === "extracurricular" ? (
                (paginatedData as IExtracurricular[]).map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {startIndex + index + 1}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              item.status === "active"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {item.status === "active" ? "Aktif" : "Tidak Aktif"}
                          </span>
                        </div>
                        <div className="text-lg font-semibold text-gray-900 mb-1">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500 space-y-1">
                          <div>
                            <span className="font-medium">Pembina:</span>{" "}
                            {item.trainer || "N/A"}
                          </div>
                          <div>
                            <span className="font-medium">Peserta:</span>{" "}
                            {item.students_count}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            navigate(`/edit-extracurricular/${item.id}`)
                          }
                          className="text-green-500 hover:text-green-600"
                        >
                          <SquarePen className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteClick(item)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                (paginatedData as IStudentExtracurricular[]).map(
                  (item, index) => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {startIndex + index + 1}
                            </span>
                            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                              {item.student?.nis || "N/A"}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                item.status === "active"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {item.status === "active"
                                ? "Aktif"
                                : "Tidak Aktif"}
                            </span>
                          </div>
                          <div className="text-lg font-semibold text-gray-900 mb-1">
                            <Link
                              to={`/studentbio/${item.student?.id}`}
                              className="hover:text-green-500 transition-colors"
                            >
                              {item.student?.name || "N/A"}
                            </Link>
                          </div>
                          <div className="text-sm text-gray-500 space-y-1">
                            <div>
                              <span className="font-medium">Kelas:</span>{" "}
                              {item.student?.class || "N/A"}
                            </div>
                            <div>
                              <span className="font-medium">
                                Ekstrakurikuler:
                              </span>{" "}
                              {item.extracurricular?.name || "N/A"}
                            </div>
                            <div>
                              <span className="font-medium">Pembina:</span>{" "}
                              {item.extracurricular?.teacher?.name || "N/A"}
                            </div>
                            <div>
                              <span className="font-medium">
                                Tanggal Daftar:
                              </span>{" "}
                              {formatDisplayDate(item.enrollment_date)}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteClick(item)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                )
              )
            ) : (
              <div className="text-center py-12 text-gray-500">
                {activeTab === "extracurricular"
                  ? "Tidak ada ekstrakurikuler ditemukan"
                  : "Tidak ada siswa terdaftar ditemukan"}
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="pl-6 pt-4 pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center border-t gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="text-sm text-gray-500 text-center sm:text-left">
              Menampilkan {startIndex + 1} -{" "}
              {Math.min(endIndex, filteredData.length)} dari{" "}
              {filteredData.length} data
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

      {/* Add Extracurricular Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-full sm:max-w-2xl sm:w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-green-600" />
              {formData.id
                ? "Edit Ekstrakurikuler"
                : "Tambah Ekstrakurikuler Baru"}
            </DialogTitle>
            <DialogDescription>
              {formData.id
                ? "Edit detail ekstrakurikuler di bawah ini."
                : "Isi form di bawah ini untuk menambahkan ekstrakurikuler baru ke dalam sistem."}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={formData.id ? handleUpdate : handleCreate}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Nama Ekstrakurikuler */}
              <div className="space-y-4 sm:col-span-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Nama Ekstrakurikuler <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Masukkan nama ekstrakurikuler"
                  value={formData.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  className="w-full"
                  required
                />
                {/* Pembina */}
                <div className="space-y-2">
                  <Label
                    htmlFor="trainer"
                    className="text-sm font-medium text-gray-700 flex items-center gap-1"
                  >
                    <UserCheck className="w-4 h-4" /> Pembina{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="trainer"
                    type="text"
                    placeholder="Masukkan nama pembina"
                    value={formData.trainer}
                    onChange={(e) =>
                      handleFormChange("trainer", e.target.value)
                    }
                    className="w-full"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 sm:col-span-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700"
                >
                  Deskripsi <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Masukkan deskripsi ekstrakurikuler"
                  value={formData.description}
                  onChange={(e) =>
                    handleFormChange("description", e.target.value)
                  }
                  className="w-full min-h-24"
                  required
                />
              </div>
            </div>

            <DialogFooter className="flex gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
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
                    <Plus className="h-4 w-4 mr-2" />
                    {formData.id
                      ? "Perbarui Ekstrakurikuler"
                      : "Tambah Ekstrakurikuler"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={
          activeTab === "extracurricular"
            ? "Hapus Ekstrakurikuler?"
            : "Hapus Siswa dari Ekstrakurikuler?"
        }
        description={
          activeTab === "extracurricular"
            ? "Apakah anda yakin ingin menghapus ekstrakurikuler ini? Semua siswa yang terdaftar akan ikut terhapus. Data yang dihapus tidak dapat dikembalikan."
            : "Apakah anda yakin ingin menghapus siswa dari ekstrakurikuler ini? Data yang dihapus tidak dapat dikembalikan."
        }
        confirmText="Hapus"
        cancelText="Batal"
        type="delete"
      />
    </div>
  );
};

export default ViewManageActivity;
