import React, { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react";
import { 
  AlertTriangle,
  Award,
  Calendar,
  User,
  School,
  FileText,
  MessageSquare,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Info,
  Send
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Import the validation types from existing Models directory
import { 
  ESakuFormErrorState, 
  InputTypeOptions, 
  FollowUpTypeOptions, 
  ViolationTypeOptions, 
  AchievementTypeOptions} from "@/config/Models/FormTypes";

const ESakuForm: React.FC = () => {
  // Common styles for consistency
  const labelClass = "text-gray-700 font-medium flex items-center gap-2";
  const inputClass = "border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg h-10";
  const errorClass = "text-red-500 text-xs mt-1";
  const iconClass = "h-4 w-4";
  const greenIconClass = `${iconClass} text-green-600`;
  const inputErrorClass = "border-red-500";
  const btnPrimaryClass = "bg-green-600 hover:bg-green-700 text-white flex items-center gap-1.5";
  const btnSecondaryClass = "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 flex items-center gap-1.5";
  const btnDarkClass = "bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-1.5";
  
  // Form state
  const [inputType, setInputType] = useState<InputTypeOptions>("violation");
  const [classType, setClassType] = useState<string>("");
  const [violationType, setViolationType] = useState<ViolationTypeOptions>("");
  const [achievementType, setAchievementType] = useState<AchievementTypeOptions>("");
  const [point, setPoint] = useState<string>("0");
  const [followUpType, setFollowUpType] = useState<FollowUpTypeOptions>("follow-up");
  const [customViolation, setCustomViolation] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [followUpDescription, setFollowUpDescription] = useState<string>("");
  const [studentName, setStudentName] = useState<string>("");
  const [date, setDate] = useState<string>(() => {
    // Set default date to today
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD format
  });
  
  // UI state
  const [formStep, setFormStep] = useState<number>(0); // For mobile step-by-step wizard
  const [errors, setErrors] = useState<ESakuFormErrorState>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  
  // Refs
  const dateInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Handle date picker click
  const handleDateFieldClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  // Reset form
  const resetForm = () => {
    // Reset all form fields
    setInputType("violation");
    setClassType("");
    setViolationType("");
    setAchievementType("");
    setPoint("0");
    setFollowUpType("follow-up");
    setCustomViolation("");
    setDescription("");
    setFollowUpDescription("");
    setStudentName("");
    
    // Reset to today's date
    const today = new Date();
    setDate(today.toISOString().split('T')[0]);
    
    // Reset UI state
    setFormStep(0);
    setErrors({});
    
    // Scroll to top of form
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calculate points based on violation/achievement type
  useEffect(() => {
    if (inputType === "violation") {
      // Points for violations
      switch (violationType) {
        case "rambut-panjang": setPoint("5"); break;
        case "terlambat": setPoint("2"); break;
        case "tidak-seragam": setPoint("8"); break;
        case "lainnya": setPoint("10"); break;
        default: setPoint("0");
      }
    } else {
      // Points for achievements
      switch (achievementType) {
        case "akademik": setPoint("15"); break;
        case "olahraga": setPoint("20"); break;
        case "kesenian": setPoint("10"); break;
        case "lainnya": setPoint("5"); break;
        default: setPoint("0");
      }
    }
  }, [inputType, violationType, achievementType]);

  // Format date to Indonesian format
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: ESakuFormErrorState = {};
    
    // Step 1: Student Info
    if (!studentName.trim()) newErrors.studentName = "Nama siswa diperlukan";
    if (!classType) newErrors.classType = "Kelas harus dipilih";
    if (!date) newErrors.date = "Tanggal diperlukan";
    
    // Step 2: Violation/Achievement Details
    if (inputType === "violation" && !violationType) {
      newErrors.violationType = "Jenis pelanggaran harus dipilih";
    } else if (inputType === "achievement" && !achievementType) {
      newErrors.achievementType = "Jenis prestasi harus dipilih";
    }
    
    // Validate custom field when "lainnya" is selected
    if ((violationType === "lainnya" || achievementType === "lainnya") && !customViolation.trim()) {
      newErrors.customViolation = `Jenis ${inputType === "violation" ? "pelanggaran" : "prestasi"} lainnya diperlukan`;
    }
    
    if (!description.trim()) newErrors.description = "Deskripsi diperlukan";
    
    // Step 3: Follow Up (only for violations)
    if (inputType === "violation" && !followUpDescription.trim()) {
      newErrors.followUpDescription = "Deskripsi tindak lanjut diperlukan";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate specific step for mobile wizard
  const validateStep = (step: number): boolean => {
    const newErrors: ESakuFormErrorState = {};
    
    if (step === 0) {
      // Validate student info
      if (!studentName.trim()) newErrors.studentName = "Nama siswa diperlukan";
      if (!classType) newErrors.classType = "Kelas harus dipilih";
      if (!date) newErrors.date = "Tanggal diperlukan";
    } else if (step === 1) {
      // Validate violation/achievement details
      if (inputType === "violation" && !violationType) {
        newErrors.violationType = "Jenis pelanggaran harus dipilih";
      } else if (inputType === "achievement" && !achievementType) {
        newErrors.achievementType = "Jenis prestasi harus dipilih";
      }
      
      // Validate custom field when "lainnya" is selected
      if ((violationType === "lainnya" || achievementType === "lainnya") && !customViolation.trim()) {
        newErrors.customViolation = `Jenis ${inputType === "violation" ? "pelanggaran" : "prestasi"} lainnya diperlukan`;
      }
      
      if (!description.trim()) newErrors.description = "Deskripsi diperlukan";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submit handler
  const handleSubmit = (e?: FormEvent): void => {
    if (e) e.preventDefault();
    
    const isValid = validateForm();
    
    if (isValid) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        console.log("Form submitted:", {
          studentName,
          classType,
          date,
          inputType,
          violationType: violationType === "lainnya" ? customViolation : violationType,
          achievementType: achievementType === "lainnya" ? customViolation : achievementType,
          point,
          description,
          followUpType,
          followUpDescription
        });
        
        setIsSubmitting(false);
        setShowSuccess(true);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Hide success message after 3 seconds and reset form
        setTimeout(() => {
          setShowSuccess(false);
          resetForm();
        }, 3000);
      }, 1000);
    }
  };

  // Handle next step in wizard
  const handleNextStep = (): void => {
    if (validateStep(formStep)) {
      setFormStep((prev) => Math.min(prev + 1, 2));
      // Scroll to top of form on step change
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Handle previous step in wizard
  const handlePrevStep = (): void => {
    setFormStep((prev) => Math.max(prev - 1, 0));
    // Scroll to top of form on step change
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Step titles for mobile view
  const stepTitles = [
    "Data Siswa",
    `Detail ${inputType === "violation" ? "Pelanggaran" : "Prestasi"}`,
    "Tindak Lanjut"
  ];

  // Helper function to get human-readable violation type
  function getViolationLabel(type: ViolationTypeOptions): string {
    switch(type) {
      case "rambut-panjang": return "Rambut Panjang";
      case "terlambat": return "Terlambat";
      case "tidak-seragam": return "Tidak Berseragam";
      case "lainnya": return customViolation || "Lainnya";
      default: return "-";
    }
  }

  // Helper function to get human-readable achievement type
  function getAchievementLabel(type: AchievementTypeOptions): string {
    switch(type) {
      case "akademik": return "Akademik";
      case "olahraga": return "Olahraga";
      case "kesenian": return "Kesenian";
      case "lainnya": return customViolation || "Lainnya";
      default: return "-";
    }
  }

  // Update summary data for mobile preview
  const summaryData = {
    name: studentName || '-',
    class: classType || '-',
    type: inputType === "violation" ? "Pelanggaran" : "Prestasi",
    detail: inputType === "violation" 
      ? (violationType === "lainnya" ? customViolation : getViolationLabel(violationType)) 
      : (achievementType === "lainnya" ? customViolation : getAchievementLabel(achievementType)),
    point: inputType === "violation" ? `-${point}` : `+${point}`,
  };

  // Check if mobile view is active
  const isMobileView = typeof window !== 'undefined' && window.innerWidth < 640;

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6" ref={formRef}>
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-green-800">
          Form E-Saku Siswa
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Masukkan data pelanggaran atau prestasi siswa
        </p>
      </div>

      {/* Success message */}
      {showSuccess && (
        <Alert className="bg-green-50 border border-green-200 text-green-800">
          <CheckCircle className={greenIconClass} />
          <AlertDescription>Data berhasil disimpan!</AlertDescription>
        </Alert>
      )}

      <Card className="rounded-xl overflow-hidden border-green-100 shadow-md">
        <CardHeader className="border-b bg-green-600 text-white p-4">
          <div className="flex items-center gap-2">
            {inputType === "violation" ? (
              <AlertTriangle className={iconClass} />
            ) : (
              <Award className={iconClass} />
            )}
            <CardTitle>
              {isMobileView 
                ? `${stepTitles[formStep]} (${formStep + 1}/3)` 
                : (inputType === "violation" ? "Input Data Pelanggaran" : "Input Data Prestasi")}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Mobile view progress indicator */}
            {isMobileView && (
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  {[0, 1, 2].map((step) => (
                    <div 
                      key={step} 
                      className={`h-2 flex-1 mx-1 rounded ${
                        step < formStep ? 'bg-green-500' : 
                        step === formStep ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs">
                  {[0, 1, 2].map((step) => (
                    <span 
                      key={step}
                      className={step === formStep ? 'font-semibold text-green-600' : 'text-gray-500'}
                    >
                      {stepTitles[step]}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Student Info */}
            {(!isMobileView || formStep === 0) && (
              <>
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="studentName" className={labelClass}>
                      <User className={greenIconClass} />
                      Nama Siswa <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="studentName"
                      value={studentName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setStudentName(e.target.value)}
                      placeholder="Masukkan nama siswa"
                      className={`${inputClass} ${errors.studentName ? inputErrorClass : ''}`}
                    />
                    {errors.studentName && (
                      <p className={errorClass}>{errors.studentName}</p>
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    <Label htmlFor="class" className={labelClass}>
                      <School className={greenIconClass} />
                      Pilih Kelas <span className="text-red-500">*</span>
                    </Label>
                    <Select value={classType} onValueChange={setClassType}>
                      <SelectTrigger 
                        className={`${inputClass} ${errors.classType ? inputErrorClass : ''}`}
                      >
                        <SelectValue placeholder="Pilih Kelas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="X-RPL-1">X RPL 1</SelectItem>
                        <SelectItem value="X-RPL-2">X RPL 2</SelectItem>
                        <SelectItem value="XI-RPL-1">XI RPL 1</SelectItem>
                        <SelectItem value="XI-RPL-2">XI RPL 2</SelectItem>
                        <SelectItem value="XII-RPL-3">XII RPL 3</SelectItem>
                        <SelectItem value="XII-MM-1">XII MM 1</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.classType && (
                      <p className={errorClass}>{errors.classType}</p>
                    )}
                  </div>
                </div>

                {/* Date and Input Type Fields - Side by Side with 50/50 Split */}
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="space-y-2 w-full sm:w-1/2">
                    <Label htmlFor="date" className={labelClass}>
                      <Calendar className={greenIconClass} />
                      Tanggal {inputType === "violation" ? "Pelanggaran" : "Prestasi"} <span className="text-red-500">*</span>
                    </Label>
                    <div 
                      className={`relative cursor-pointer rounded-lg border ${
                        errors.date ? inputErrorClass : 'border-gray-300'
                      } hover:border-green-500 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 h-10`}
                      onClick={handleDateFieldClick}
                    >
                      <div className="flex items-center h-full">
                        <input
                          ref={dateInputRef}
                          id="date"
                          type="date"
                          value={date}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                          className="w-full px-3 py-2 border-none focus:outline-none bg-transparent rounded-lg h-full"
                        />
                        <Calendar className={`${iconClass} text-gray-500 absolute right-3`} />
                      </div>
                    </div>
                    {date && (
                      <p className="text-xs text-gray-500 mt-1">Format: {formatDate(date)}</p>
                    )}
                    {errors.date && (
                      <p className={errorClass}>{errors.date}</p>
                    )}
                  </div>

                  <div className="space-y-2 w-full sm:w-1/2">
                    <Label htmlFor="inputType" className={labelClass}>
                      {inputType === "violation" ? (
                        <AlertTriangle className={greenIconClass} />
                      ) : (
                        <Award className={greenIconClass} />
                      )}
                      Jenis Input
                    </Label>
                    <Select 
                      value={inputType} 
                      onValueChange={(value: string) => {
                        setInputType(value as InputTypeOptions);
                        
                        // Reset type-specific fields when switching input type
                        if (value === "violation") {
                          setViolationType("");
                          setAchievementType("");
                          setCustomViolation("");
                        } else {
                          setViolationType("");
                          setAchievementType("");
                          setCustomViolation("");
                        }
                      }}
                    >
                      <SelectTrigger className={inputClass}>
                        <SelectValue placeholder="Pilih Jenis Input" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="violation">Pelanggaran</SelectItem>
                        <SelectItem value="achievement">Prestasi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Detail Violation/Achievement */}
            {(!isMobileView || formStep === 1) && (
              <>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="space-y-2 flex-grow">
                      <Label 
                        htmlFor={inputType === "violation" ? "violationType" : "achievementType"} 
                        className={labelClass}
                      >
                        <FileText className={greenIconClass} />
                        {inputType === "violation" ? "Jenis Pelanggaran" : "Jenis Prestasi"} <span className="text-red-500">*</span>
                      </Label>
                      
                      {inputType === "violation" ? (
                        <Select 
                          value={violationType} 
                          onValueChange={(value: string) => {
                            setViolationType(value as ViolationTypeOptions);
                            if (value !== "lainnya") {
                              setCustomViolation("");
                            }
                          }}
                        >
                          <SelectTrigger 
                            className={`${inputClass} ${errors.violationType ? inputErrorClass : ''}`}
                          >
                            <SelectValue placeholder="Pilih Jenis Pelanggaran" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rambut-panjang">Rambut Panjang</SelectItem>
                            <SelectItem value="terlambat">Terlambat</SelectItem>
                            <SelectItem value="tidak-seragam">Tidak Berseragam</SelectItem>
                            <SelectItem value="lainnya">Lainnya</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Select 
                          value={achievementType}
                          onValueChange={(value: string) => {
                            setAchievementType(value as AchievementTypeOptions);
                            if (value !== "lainnya") {
                              setCustomViolation("");
                            }
                          }}
                        >
                          <SelectTrigger 
                            className={`${inputClass} ${errors.achievementType ? inputErrorClass : ''}`}
                          >
                            <SelectValue placeholder="Pilih Jenis Prestasi" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="akademik">Akademik</SelectItem>
                            <SelectItem value="olahraga">Olahraga</SelectItem>
                            <SelectItem value="kesenian">Kesenian</SelectItem>
                            <SelectItem value="lainnya">Lainnya</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      
                      {errors.violationType && inputType === "violation" && (
                        <p className={errorClass}>{errors.violationType}</p>
                      )}
                      
                      {errors.achievementType && inputType === "achievement" && (
                        <p className={errorClass}>{errors.achievementType}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2 w-48">
                      <Label htmlFor="point" className={labelClass}>
                        Poin
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className={`${iconClass} text-gray-400 ml-1`} />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Poin dihitung otomatis berdasarkan jenis {inputType === "violation" ? "pelanggaran" : "prestasi"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <div className="relative w-full">
                        <div className="flex-1 h-10 px-3 py-2 border border-gray-300 bg-gray-50 text-gray-500 rounded-lg">
                          Poin {inputType === "violation" ? "Pelanggaran" : "Prestasi"}
                        </div>
                        <div 
                          className={`absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-2 py-0.5 text-xs font-medium ${
                            inputType === "violation" 
                              ? "bg-red-100 text-red-600" 
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {inputType === "violation" ? "-" : "+"}{point}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Custom Type Input */}
                  {((inputType === "violation" && violationType === "lainnya") || 
                    (inputType === "achievement" && achievementType === "lainnya")) && (
                    <div className="space-y-2">
                      <Label 
                        htmlFor="customViolation" 
                        className={labelClass}
                      >
                        {inputType === "violation" ? "Pelanggaran Lainnya" : "Prestasi Lainnya"} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="customViolation"
                        type="text"
                        value={customViolation}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomViolation(e.target.value)}
                        placeholder={inputType === "violation" 
                          ? "Masukkan jenis pelanggaran lain" 
                          : "Masukkan jenis prestasi lain"
                        }
                        className={`${inputClass} ${errors.customViolation ? inputErrorClass : ''}`}
                      />
                      {errors.customViolation && (
                        <p className={errorClass}>{errors.customViolation}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className={labelClass}>
                    <MessageSquare className={greenIconClass} />
                    Deskripsi {inputType === "violation" ? "Pelanggaran" : "Prestasi"} <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                    placeholder={`Tambahkan deskripsi ${inputType === "violation" ? "pelanggaran" : "prestasi"}...`}
                    className={`${inputClass.replace('h-10', 'min-h-32')} ${errors.description ? inputErrorClass : ''}`}
                  />
                  {errors.description && (
                    <p className={errorClass}>{errors.description}</p>
                  )}
                </div>
              </>
            )}

            {/* Step 3: Follow Up Section */}
            {(!isMobileView || formStep === 2) && (
              <>
                {inputType === "violation" ? (
                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-green-800">Tindak Lanjut</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="followUp" className="text-gray-700 font-medium">
                          Pilih Tindak Lanjut <span className="text-red-500">*</span>
                        </Label>
                        <Select 
                          value={followUpType} 
                          onValueChange={(value: string) => setFollowUpType(value as FollowUpTypeOptions)}
                        >
                          <SelectTrigger className="border-green-200 focus:border-green-500 focus:ring-green-500 rounded-lg bg-white w-full h-10">
                            <SelectValue placeholder="Pilih Tindak Lanjut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="follow-up">Tindak Lanjut</SelectItem>
                            <SelectItem value="meeting">Pertemuan dengan Orang Tua</SelectItem>
                            <SelectItem value="warning">Surat Peringatan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="followUpDescription" className="text-gray-700 font-medium">
                          Deskripsi Tindak Lanjut <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="followUpDescription"
                          value={followUpDescription}
                          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFollowUpDescription(e.target.value)}
                          placeholder="Tambahkan deskripsi tindak lanjut..."
                          className={`border-green-200 focus:border-green-500 focus:ring-green-500 rounded-lg min-h-24 bg-white w-full ${
                            errors.followUpDescription ? inputErrorClass : ''
                          }`}
                        />
                        {errors.followUpDescription && (
                          <p className={errorClass}>{errors.followUpDescription}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-green-800">Dokumentasi Prestasi</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Prestasi telah tercatat di sistem dengan penambahan poin +{point}. 
                      Prestasi ini akan muncul di laporan bulanan dan rekap semester.
                    </p>
                  </div>
                )}

                {/* Mobile summary view */}
                {isMobileView && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold mb-3 text-gray-700 flex items-center gap-1.5">
                      <FileText className={iconClass + " text-gray-600"} />
                      Ringkasan Data
                    </h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">Nama</span>
                          <span className="font-medium">{summaryData.name}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">Kelas</span>
                          <span className="font-medium">{summaryData.class}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">Jenis</span>
                          <span className="font-medium">{summaryData.type}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">Detail</span>
                          <span className="font-medium">{summaryData.detail || '-'}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Poin</span>
                        <span className={`font-medium ${inputType === "violation" ? "text-red-600" : "text-green-600"}`}>
                          {summaryData.point}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Mobile navigation */}
            {isMobileView && (
              <div className="flex justify-between mt-6">
                {formStep > 0 ? (
                  <Button 
                    type="button" 
                    variant="outline"
                    className={btnSecondaryClass}
                    onClick={handlePrevStep}
                  >
                    <ArrowLeft className={iconClass} />
                    Kembali
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    variant="outline"
                    className={btnSecondaryClass}
                    onClick={resetForm}
                  >
                    <RefreshCw className={iconClass} />
                    Reset
                  </Button>
                )}
                
                {formStep < 2 ? (
                  <Button 
                    type="button" 
                    className={btnPrimaryClass}
                    onClick={handleNextStep}
                  >
                    Lanjut
                    <ArrowRight className={iconClass} />
                  </Button>
                ) : (
                  <Button 
                    type="button"
                    className={btnPrimaryClass}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <CheckCircle className={iconClass} />
                        Simpan
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>

        {/* Footer buttons - desktop only */}
        {!isMobileView && (
          <CardFooter className="flex justify-between gap-3 pb-6 px-6">
            <Button 
              type="button"
              variant="outline"
              className={btnSecondaryClass}
              onClick={resetForm}
            >
              <RefreshCw className={iconClass} />
              Reset Form
            </Button>
            
            <div className="flex gap-3">
              <Button 
                type="button"
                className={btnPrimaryClass}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyimpan...
                  </span>
                ) : (
                  <>
                    <CheckCircle className={iconClass} />
                    Simpan Data
                  </>
                )}
              </Button>
              <Button 
                type="button"
                className={btnDarkClass}
              >
                <Send className={iconClass} />
                Kirim sebagai Laporan
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ESakuForm;