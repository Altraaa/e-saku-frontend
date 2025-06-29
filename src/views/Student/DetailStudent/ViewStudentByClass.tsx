import {
  Search,
  SquarePen,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  FileSpreadsheet,
  X,
  Check,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useStudentsByClassId } from "@/config/Api/useStudent";
import { useClassroomById } from "@/config/Api/useClasroom";
import { useStudentDelete } from "@/config/Api/useStudent";
import { useTeacherById } from "@/config/Api/useTeacher";
import axios from "axios";
import { IStudent } from "@/config/Models/Student";

interface ClassHeaderProps {
  className: string;
  teacherName: string;
}

const ClassHeader: React.FC<ClassHeaderProps> = ({
  className,
  teacherName,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div className="px-6 py-5">
        <h1 className="text-3xl font-bold text-green-500">{className}</h1>

        <div className="mt-1 flex items-center">
          <span className="text-gray-600">Diampu oleh:</span>
          <span className="ml-2 font-semibold text-gray-700">
            {teacherName}
          </span>
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
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [displayedStudents, setDisplayedStudents] = useState<IStudent[]>([]);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [uploadError, setUploadError] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef<number>(0);

  const { data: classroom, isLoading: classLoading } = useClassroomById(classId);
  const { data: students, isLoading: studentsLoading } = useStudentsByClassId(classId);
  const teacherId = classroom?.teacher_id ?? 0;
  const { data: teacher } = useTeacherById(teacherId);
  const deleteStudent = useStudentDelete();
  const token = localStorage.getItem("token");

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

    return students.filter(
      (student: IStudent) =>
        student.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        student.nis?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, students]);

  useEffect(() => {
    if (filteredStudents && filteredStudents.length >= 0) {
      const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);

      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      } else if (currentPage < 1) {
        setCurrentPage(1);
      }

      const startIndex = (currentPage - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      setDisplayedStudents(filteredStudents.slice(startIndex, endIndex));
    } else {
      setDisplayedStudents([]);
    }
  }, [filteredStudents, currentPage, rowsPerPage]);

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(parseInt(value));
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

  const validateAndSetFile = (file: File) => {
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    const validExtensions = [".xls", ".xlsx"];
    const fileExtension = file.name
      .toLowerCase()
      .slice(file.name.lastIndexOf("."));

    if (
      !validTypes.includes(file.type) &&
      !validExtensions.includes(fileExtension)
    ) {
      setUploadError("Please select a valid Excel file (.xls or .xlsx)");
      setSelectedFile(null);
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size must be less than 10MB");
      setSelectedFile(null);
      return false;
    }

    setSelectedFile(file);
    setUploadError("");
    setUploadStatus("idle");
    setUploadProgress(0);
    return true;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (files.length > 1) {
        setUploadError("Please select only one file at a time");
        return;
      }
      const file = files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus("uploading");
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("classId", classId.toString());

      const response = await axios.post(
        "https://saku.dev.smkn1denpasar.sch.id/api/import/students",
        formData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percent > 90 ? 90 : percent);
            }
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to upload file. Please try again.");
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      setUploadProgress(100);
      setUploadStatus("success");

      // Remove automatic closing of dialog after success
      // User must click Continue button to close
      // setTimeout(() => {
      //   setIsImportModalOpen(false);
      //   resetUploadState();
      // }, 1500);
    } catch (error) {
      setUploadStatus("error");
      setUploadError(
        error instanceof Error
          ? error.message
          : "Failed to upload file. Please try again."
      );
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadError("");
    setUploadStatus("idle");
    setUploadProgress(0);
    setIsDragging(false);
    dragCounter.current = 0;
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetUploadState = () => {
    setSelectedFile(null);
    setUploadStatus("idle");
    setUploadError("");
    setUploadProgress(0);
    setIsDragging(false);
    dragCounter.current = 0;
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadTemplate = () => {
    const templateUrl = "/api/download/student-import-template.xlsx";
    const link = document.createElement("a");
    link.href = templateUrl;
    link.download = "student_import_template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / rowsPerPage)
  );
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);

  return (
    <div className="space-y-4 sm:space-y-6">
      <ClassHeader
        className={classroom?.name || ""}
        teacherName={teacherName}
      />

      <Card className="rounded-xl overflow-hidden shadow-sm border-gray-200">
        <div className="px-6 pt-4 pb-4 border-b-2 border-green-500">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <CardTitle className="text-xl font-bold text-gray-900">
              Daftar Siswa Kelas {classroom?.name}
            </CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Dialog
                open={isImportModalOpen}
                onOpenChange={(open) => {
                  setIsImportModalOpen(open);
                  if (!open) {
                    resetUploadState();
                  } else {
                    resetUploadState();
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    className="hover:bg-[#009616] hover:text-white transition-all w-full sm:w-auto"
                  >
                    <Download className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Import Excel</span>
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="max-w-[95vw] sm:max-w-[500px] lg:max-w-[600px] p-3 sm:p-4 lg:p-6 max-h-[90vh] overflow-y-auto"
                  onDragOver={(e) => e.preventDefault()}
                >
                  <DialogHeader>
                    <DialogTitle className="text-base sm:text-lg lg:text-xl leading-tight">
                      Import Student Data untuk {classroom?.name}
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm leading-relaxed">
                      Upload file Excel (.xls atau .xlsx) yang berisi data siswa
                      untuk kelas ini
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
                    {uploadStatus === "success" ? (
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 sm:p-4 mb-3 sm:mb-4">
                        <div className="text-green-600 flex items-start sm:items-center space-x-3">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
                            <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm sm:text-lg font-semibold">Upload Berhasil!</p>
                            <p className="text-xs sm:text-sm text-gray-600 break-words">
                              Data siswa berhasil diunggah ke kelas {classroom?.name}.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3 sm:space-y-4">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="excel-upload"
                          />
 
                          {!selectedFile ? (
                            <div
                              onDragEnter={handleDragEnter}
                              onDragLeave={handleDragLeave}
                              onDragOver={handleDragOver}
                              onDrop={handleDrop}
                              className={`relative transition-all duration-200 ${isDragging ? "scale-100" : ""}`}
                            >
                              <label
                                htmlFor="excel-upload"
                                className={`flex flex-col items-center justify-center w-full h-24 sm:h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                                  isDragging
                                    ? "border-green-500 bg-green-50"
                                    : "border-gray-300 bg-gray-50 hover:border-green-500 hover:bg-gray-100"
                                }`}
                              >
                                <Upload
                                  className={`w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 transition-all duration-200 ${
                                    isDragging
                                      ? "text-green-600 scale-100"
                                      : "text-gray-400"
                                  }`}
                                />
                                <span
                                  className={`text-xs sm:text-sm text-center px-2 transition-colors duration-200 ${
                                    isDragging
                                      ? "text-green-600 font-medium"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {isDragging
                                    ? "Drop your Excel file here"
                                    : "Click to upload or drag & drop"}
                                </span>
                                <span className="text-xs text-gray-400 mt-0.5 sm:mt-1 px-2 text-center">
                                  .xls or .xlsx (max 10MB)
                                </span>
                              </label>
                              {isDragging && (
                                <div className="absolute inset-0 rounded-lg bg-green-500 bg-opacity-10 pointer-events-none animate-pulse" />
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center justify-between rounded-lg border border-green-200 p-3 sm:p-4 bg-green-50 mb-3 sm:mb-4">
                              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                                <FileSpreadsheet className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
                                <div className="truncate min-w-0">
                                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                    {selectedFile.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={handleRemoveFile}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1 ml-2 flex-shrink-0"
                                disabled={uploadStatus === "uploading"}
                              >
                                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                            </div>
                          )}
 
                          {uploadError && (
                            <div className="flex items-start space-x-2 text-xs sm:text-sm text-red-600 bg-red-50 p-2 sm:p-3 rounded-lg border border-red-200">
                              <X className="w-4 h-4 flex-shrink-0 mt-0.5 sm:mt-0" />
                              <span className="break-words">{uploadError}</span>
                            </div>
                          )}
 
                          {uploadStatus === "uploading" && (
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          )}
                        </div>
 
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 sm:p-4 mb-3 sm:mb-4">
                          <h4 className="text-xs sm:text-sm font-medium mb-2">
                            Persyaratan File:
                          </h4>
                          <ul className="text-xs text-gray-600 space-y-1">
                            <li className="flex items-start">
                              <span className="mr-1 flex-shrink-0">•</span>
                              <span>Format Excel (.xls atau .xlsx)</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-1 flex-shrink-0">•</span>
                              <span>Kolom wajib: Nama, NIS, Email</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-1 flex-shrink-0">•</span>
                              <span>Ukuran file maksimal: 10MB</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-1 flex-shrink-0">•</span>
                              <span>NIS siswa tidak boleh duplikat</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-1 flex-shrink-0">•</span>
                              <span className="break-words">
                                Siswa akan ditambahkan ke kelas {classroom?.name}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </>
                    )}
 
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      {uploadStatus !== "success" && (
                        <Button
                          variant="outline"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 order-3 sm:order-1"
                          onClick={downloadTemplate}
                          disabled={uploadStatus === "uploading"}
                        >
                          <FileSpreadsheet className="w-4 h-4 mr-2" />
                          Download Template
                        </Button>
                      )}
                      
                      <div className="flex gap-2 order-1 sm:order-2">
                        {uploadStatus === "success" ? (
                          <Button
                            onClick={() => setIsImportModalOpen(false)}
                            className="bg-green-500 hover:bg-green-600 text-white flex-1 sm:flex-none"
                          >
                            Continue
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              onClick={() => setIsImportModalOpen(false)}
                              disabled={uploadStatus === "uploading"}
                              className="flex-1 sm:flex-none"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleFileUpload}
                              disabled={!selectedFile || uploadStatus === "uploading"}
                              className="bg-green-500 hover:bg-green-600 text-white flex-1 sm:flex-none"
                            >
                              {uploadStatus === "uploading" ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  <span className="hidden sm:inline">Uploading... {uploadProgress}%</span>
                                  <span className="sm:hidden">{uploadProgress}%</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 mr-2" />
                                  Upload File
                                </>
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="relative w-full sm:w-72">
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
        </div>
        <div className="overflow-x-auto pt-3">
          {/* Desktop Table - Hidden on mobile */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="w-12 text-center px-6 font-medium text-black">
                    No
                  </TableHead>
                  <TableHead className="text-center font-medium text-black">
                    NIS
                  </TableHead>
                  <TableHead className="text-left font-medium text-black">
                    Nama
                  </TableHead>
                  <TableHead className="text-center font-medium text-black">
                    Poin Pelanggaran
                  </TableHead>
                  <TableHead className="text-center font-medium text-black">
                    Poin Prestasi
                  </TableHead>
                  <TableHead className="text-center font-medium text-black">
                    Total Poin
                  </TableHead>
                  <TableHead className="text-center font-medium text-black">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {displayedStudents && displayedStudents.length > 0 ? (
                displayedStudents.map((student, index) => {
                  const actualIndex = (safePage - 1) * rowsPerPage + index + 1;
                  return (
                    <TableRow
                      key={student.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <TableCell className="text-center px-6 font-normal">
                        {actualIndex}
                      </TableCell>
                      <TableCell className="text-center font-normal">
                        {student.nis || "N/A"}
                      </TableCell>
                      <TableCell className="text-left font-normal">
                        <Link
                          to={`/studentbio/${student.id}`}
                          className="hover:text-green-500 transition-colors"
                        >
                          {student.name || "Nama tidak tersedia"}
                        </Link>
                      </TableCell>
                      <TableCell className="text-center font-normal">
                        <Badge
                          variant="outline"
                          className="bg-red-50 text-red-600 border-red-200"
                        >
                          {student.violations_sum_points || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-normal">
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-600 border-green-200"
                        >
                          {student.accomplishments_sum_points || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-normal">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-600 border-blue-200"
                        >
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
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
                    {searchText
                      ? "Tidak ada data siswa yang sesuai dengan pencarian"
                      : "Tidak ada data siswa"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden space-y-4 px-4">
          {displayedStudents && displayedStudents.length > 0 ? (
            displayedStudents.map((student, index) => {
              const actualIndex = (safePage - 1) * rowsPerPage + index + 1;
              return (
                <div
                  key={student.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          #{actualIndex}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                          {student.nis || "N/A"}
                        </span>
                      </div>
                      <Link
                        to={`/studentbio/${student.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-green-500 transition-colors block"
                      >
                        {student.name || "Nama tidak tersedia"}
                      </Link>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/studentbio/edit/${student.id}`}
                        className="text-blue-500 hover:text-blue-600 transition-colors p-2"
                      >
                        <SquarePen className="h-4 w-4" />
                      </Link>
                      <button
                        className="text-red-500 hover:text-red-600 transition-colors p-2"
                        onClick={() => handleDelete(student.id)}
                        disabled={deleteStudent.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Pelanggaran</div>
                      <Badge
                        variant="outline"
                        className="bg-red-50 text-red-600 border-red-200 text-xs"
                      >
                        {student.violations_sum_points || 0}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Prestasi</div>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-600 border-green-200 text-xs"
                      >
                        {student.accomplishments_sum_points || 0}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Total</div>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-600 border-blue-200 text-xs"
                      >
                        {student.point_total || 0}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchText
                ? "Tidak ada data siswa yang sesuai dengan pencarian"
                : "Tidak ada data siswa"}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-6 pt-4 pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center border-t space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="text-sm text-gray-500 text-center sm:text-left">
            Menampilkan {displayedStudents.length} dari{" "}
            {filteredStudents.length} siswa
          </div>
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <span className="text-sm text-gray-600">Rows:</span>
            <Select
              value={String(rowsPerPage)}
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

        <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="text-gray-700 rounded-lg h-8 w-8 hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={safePage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="text-sm text-gray-600 px-2">
              Page {safePage} of {totalPages}
            </div>


            <Button
              variant="outline"
              size="icon"
              className="text-gray-700 rounded-lg h-8 w-8 hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
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
