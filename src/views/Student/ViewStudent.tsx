import { Search, Download, Upload, FileSpreadsheet, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
import { useClassroomByTeacherId } from "@/config/Api/useClasroom";
import { Link } from "react-router-dom";
import { IClassroom } from "@/config/Models/Classroom";

const StudentSkeleton = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start gap-2 lg:flex-row lg:justify-between lg:items-center">
        <div>
          <div className="h-8 w-56 bg-gray-200 rounded-md animate-pulse mb-2"></div>
          <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
          <div className="w-full sm:w-32">
            <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="relative w-full sm:w-48">
            <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="relative w-full sm:w-72">
            <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="my-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-8 mt-10">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="w-2 h-full absolute left-0 top-0 bg-green-100 rounded-l-lg"></div>
            <div className="py-8 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-200"></div>
              <div className="mt-4 h-6 w-32 bg-gray-200 rounded-md"></div>
              <div className="mt-2 h-4 w-16 bg-gray-200 rounded-md"></div>
              <div className="mt-2 flex items-center px-4">
                <div className="w-6 h-6 rounded-full bg-gray-200 mr-2"></div>
                <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ViewStudent = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [programFilter, setProgramFilter] = useState<string>("all");
  const [availablePrograms, setAvailablePrograms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [uploadError, setUploadError] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef<number>(0);
  
  const { data: classrooms, isLoading: classroomsLoading, error } = useClassroomByTeacherId();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (classrooms?.length) {
      const programs = new Set<string>();
      classrooms.forEach((classroom: IClassroom) => {
        const code = getProgramCode(classroom.name);
        if (code) programs.add(code);
      });
      setAvailablePrograms(Array.from(programs));
    }
  }, [classrooms]);

  const validateAndSetFile = (file: File) => {
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    // Also check file extension as a fallback
    const validExtensions = ['.xls', '.xlsx'];
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      setUploadError("Please select a valid Excel file (.xls or .xlsx)");
      setSelectedFile(null);
      return false;
    }

    // Check file size (10MB limit)
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
      formData.append('file', selectedFile);
      
      // Replace with your actual upload endpoint
      // const response = await fetch('/api/import-students', {
      //   method: 'POST',
      //   body: formData,
      //   headers: {
      //     'Authorization': `Bearer ${yourAuthToken}` // Add auth if needed
      //   }
      // });

      // Simulating upload with progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // if (!response.ok) {
      //   throw new Error('Upload failed');
      // }
      
      // const result = await response.json();
      // console.log('Upload result:', result);
      
      setUploadStatus("success");
      
      // Reset modal after success
      setTimeout(() => {
        setIsImportModalOpen(false);
        resetUploadState();
      }, 1500);
      
    } catch (error) {
      setUploadStatus("error");
      setUploadError(error instanceof Error ? error.message : "Failed to upload file. Please try again.");
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
    // Replace with your actual template download endpoint
    const templateUrl = '/api/download/student-import-template.xlsx';
    const link = document.createElement('a');
    link.href = templateUrl;
    link.download = 'student_import_template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredClassrooms = classrooms?.filter((classroom: IClassroom) => {
    const matchesSearch = classroom.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesProgram = 
      programFilter === "all" || 
      getProgramCode(classroom.name) === programFilter;
    
    return matchesSearch && matchesProgram;
  });

  const teacherName =
    classrooms?.[0]?.teacher?.name || "Teacher name not available";

  if (isLoading || classroomsLoading) {
    return <StudentSkeleton />;
  }

  return (
    <>
      <div className="flex flex-col items-start gap-2 lg:flex-row lg:justify-between lg:items-center">
        <div>
          <h1 className="text-3xl font-bold text-green-500">{teacherName}</h1>
          <p className="text-xl ">Kelas yang diampu :</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
          <Dialog open={isImportModalOpen} onOpenChange={(open) => {
            setIsImportModalOpen(open);
            if (!open) {
              resetUploadState();
            }
          }}>
            <DialogTrigger asChild>
              <Button
                variant="default"
                className="hover:bg-[#009616] hover:text-white transition-all"
              >
                <Download className="mr-2 h-4 w-4"/>
                Import Excel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]" onDragOver={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>Import Student Data</DialogTitle>
                <DialogDescription>
                  Upload an Excel file (.xls or .xlsx) containing student information
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-4">
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
                      className={`relative transition-all duration-200 ${
                        isDragging ? 'scale-100' : ''
                      }`}
                    >
                      <label
                        htmlFor="excel-upload"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                          isDragging 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-300 bg-gray-50 hover:border-green-500 hover:bg-gray-100'
                        }`}
                      >
                        <Upload className={`w-8 h-8 mb-2 transition-all duration-200 ${
                          isDragging ? 'text-green-600 scale-100' : 'text-gray-400'
                        }`} />
                        <span className={`text-sm transition-colors duration-200 ${
                          isDragging ? 'text-green-600 font-medium' : 'text-gray-600'
                        }`}>
                          {isDragging ? 'Drop your Excel file here' : 'Click to upload or drag & drop'}
                        </span>
                        <span className="text-xs text-gray-400 mt-1">.xls or .xlsx (max 10MB)</span>
                      </label>
                      {isDragging && (
                        <div className="absolute inset-0 rounded-lg bg-green-500 bg-opacity-10 pointer-events-none animate-pulse" />
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3">
                        <FileSpreadsheet className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                          <p className="text-xs text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveFile}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        disabled={uploadStatus === "uploading"}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  
                  {uploadError && (
                    <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                      <X className="w-4 h-4 flex-shrink-0" />
                      <span>{uploadError}</span>
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

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium mb-2">File Requirements:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li className="flex items-start">
                      <span className="mr-1">•</span>
                      <span>Excel format (.xls or .xlsx)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1">•</span>
                      <span>Required columns: Name, NIS, Email, Class</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1">•</span>
                      <span>Maximum file size: 5MB</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1">•</span>
                      <span>No duplicate student IDs (NIS)</span>
                    </li>
                  </ul>
                </div>

                <div className="flex justify-between">
                  <div className="flex items-center justify-center space-x-2 pt-2">
                    <Button
                      variant="outline"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={downloadTemplate}
                    >
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Download Template
                    </Button>
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsImportModalOpen(false)}
                    disabled={uploadStatus === "uploading"}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleFileUpload}
                    disabled={!selectedFile || uploadStatus === "uploading"}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    {uploadStatus === "uploading" ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading... {uploadProgress}%
                      </>
                    ) : uploadStatus === "success" ? (
                      <>
                        <div className="w-4 h-4 mr-2">✓</div>
                        Uploaded Successfully!
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload File
                      </>
                    )}
                  </Button>
                </div>
                </div> 
              </div>
            </DialogContent>
          </Dialog>

          <div className="w-full sm:w-48">
            <Select
              value={programFilter}
              onValueChange={setProgramFilter}
            >
              <SelectTrigger className="border-green-500 focus:ring-green-400 rounded-lg h-10">
                <SelectValue placeholder="Program Studi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Program</SelectItem>
                {availablePrograms.map((program) => (
                  <SelectItem key={program} value={program}>
                    {program} - {getProgramShortName(program)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="searchName"
              placeholder="Search by students name"
              className="pl-9 bg-white border border-gray-300 w-full rounded-lg h-10 text-sm outline-none placeholder:text-xs focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="my-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-8 mt-10">
        {error ? (
          <p className="col-span-full text-center text-red-500">Error loading data. Please try again.</p>
        ) : filteredClassrooms?.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No classes found matching your filters</p>
        ) : (
          filteredClassrooms?.map((classroom: IClassroom) => (
          <Link
            key={classroom.id}
            to={`/class/${classroom.id}`}
            className="group"
          >
            <Card className="bg-white shadow-md py-8 flex flex-col items-center group-hover:shadow-lg hover:border-green-500 hover:border transition-all duration-200 relative rounded-lg">
              <div className="w-2 h-full absolute left-0 top-0 bg-green-500 rounded-l-lg"></div>
              <CardHeader className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center p-0">
                <span className="text-3xl font-bold text-gray-400">
                  {getProgramInitial(classroom.name)}
                </span>
              </CardHeader>
              <CardTitle className="mt-4 text-2xl font-semibold">
                <span className="group-hover:text-green-500 transition-all duration-200">
                  {classroom.name}
                </span>
              </CardTitle>
              <CardContent className="text-gray-400 text-base pt-0">
                {classroom.total_student || 0} SISWA
              </CardContent>
              <div className="mt-2 flex items-center px-4">
                <div className="w-6 h-6 rounded-full bg-green-100 border border-green-500 flex items-center justify-center mr-2">
                  <span className="text-green-500 text-xs font-bold">
                    {getProgramInitial(classroom.name)}
                  </span>
                </div>
                <span className="text-gray-500 text-sm">
                  {getProgramFullName(classroom.name)}
                </span>
              </div>
            </Card>
          </Link>
          ))
        )}
      </div>
    </>
  );
};

const getProgramCode = (className: string): string => {
  const match = className.match(/\s([A-Z]{2,3})\s?\d/);
  if (match && match[1]) {
    return match[1];
  }
  return "X";
};

const getProgramInitial = (className: string): string => {
  const code = getProgramCode(className);
  return code.charAt(0);
};

const getProgramShortName = (code: string): string => {
  const programNames: Record<string, string> = {
    'TKR': 'Teknik Kendaraan Ringan',
    'TKP': 'Teknik Konstruksi Properti',
    'RPL': 'Rekayasa Perangkat Lunak',
    'BKP': 'Bisnis Konstruksi Properti'
  };
  
  return programNames[code] || 'Program Studi';
};

const getProgramFullName = (className: string): string => {
  const code = getProgramCode(className);
  return getProgramShortName(code);
};

export default ViewStudent;