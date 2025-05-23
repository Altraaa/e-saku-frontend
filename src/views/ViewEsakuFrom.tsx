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
  Send,
  Globe,
  CalendarIcon
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { id } from "date-fns/locale";

import { 
  ESakuFormErrorState, 
  InputTypeOptions, 
  FollowUpTypeOptions, 
  ViolationTypeOptions, 
  AchievementTypeOptions} from "@/config/Models/FormTypes";

type AchievementLevelOptions = "kota" | "provinsi" | "nasional" | "internasional" | "";

const ESakuFormSkeleton = () => {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-64 bg-gray-200 rounded-md"></div>
        <div className="h-4 w-72 bg-gray-200 rounded-md mt-2"></div>
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-200 shadow-md">
        <div className="border-b bg-gray-200 p-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-gray-300 rounded-md"></div>
            <div className="h-6 w-40 bg-gray-300 rounded-md"></div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="space-y-2 flex-1">
                <div className="h-5 w-24 bg-gray-200 rounded-md"></div>
                <div className="h-10 w-full bg-gray-200 rounded-md"></div>
              </div>

              <div className="space-y-2 flex-1">
                <div className="h-5 w-24 bg-gray-200 rounded-md"></div>
                <div className="h-10 w-full bg-gray-200 rounded-md"></div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="space-y-2 flex-1">
                <div className="h-5 w-32 bg-gray-200 rounded-md"></div>
                <div className="h-10 w-full bg-gray-200 rounded-md"></div>
              </div>

              <div className="space-y-2 flex-1">
                <div className="h-5 w-24 bg-gray-200 rounded-md"></div>
                <div className="h-10 w-full bg-gray-200 rounded-md"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-5 w-32 bg-gray-200 rounded-md"></div>
              <div className="h-32 w-full bg-gray-200 rounded-md"></div>
            </div>

            <div className="space-y-2">
              <div className="h-5 w-40 bg-gray-200 rounded-md"></div>
              <div className="h-24 w-full bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-3 pb-6 px-6 border-t pt-4">
          <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
            <div className="h-10 w-44 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ESakuForm: React.FC = () => {
  const labelClass = "text-gray-700 font-medium flex items-center gap-2";
  const inputClass = "border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg h-10";
  const errorClass = "text-red-500 text-xs mt-1";
  const iconClass = "h-4 w-4";
  const greenIconClass = `${iconClass} text-green-600`;
  const inputErrorClass = "border-red-500";
  const btnPrimaryClass = "bg-green-600 hover:bg-green-700 text-white flex items-center gap-1.5";
  const btnSecondaryClass = "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 flex items-center gap-1.5";
  const btnDarkClass = "bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-1.5";

  const [isLoading, setIsLoading] = useState(true);
  
  const [inputType, setInputType] = useState<InputTypeOptions>("violation");
  const [classType, setClassType] = useState<string>("");
  const [violationType, setViolationType] = useState<ViolationTypeOptions>("");
  const [achievementType, setAchievementType] = useState<AchievementTypeOptions>("");
  const [achievementLevel, setAchievementLevel] = useState<AchievementLevelOptions>("");
  const [point, setPoint] = useState<string>("0");
  const [followUpType, setFollowUpType] = useState<FollowUpTypeOptions>("follow-up");
  const [customViolation, setCustomViolation] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [followUpDescription, setFollowUpDescription] = useState<string>("");
  const [studentName, setStudentName] = useState<string>("");
  const [date, setDate] = useState<Date>(() => {
    return new Date();
  });
  
  const [formStep, setFormStep] = useState<number>(0);
  const [errors, setErrors] = useState<ESakuFormErrorState>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [isDateOpen, setIsDateOpen] = useState<boolean>(false);
  
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); 
    
    return () => clearTimeout(timer);
  }, []);

  const resetForm = () => {
    setInputType("violation");
    setClassType("");
    setViolationType("");
    setAchievementType("");
    setAchievementLevel("");
    setPoint("0");
    setFollowUpType("follow-up");
    setCustomViolation("");
    setDescription("");
    setFollowUpDescription("");
    setStudentName("");
    
    setDate(new Date());
    
    setFormStep(0);
    setErrors({});
    
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (inputType === "violation") {
      switch (violationType) {
        case "rambut-panjang": setPoint("5"); break;
        case "terlambat": setPoint("2"); break;
        case "tidak-seragam": setPoint("8"); break;
        case "lainnya": setPoint("10"); break;
        default: setPoint("0");
      }
    } else {
      if (!achievementLevel) {
        setPoint("0");
        return;
      }
      
      const basePoints = 5;
      
      let multiplier = 1;
      switch (achievementLevel) {
        case "kota": multiplier = 1; break;
        case "provinsi": multiplier = 2; break;
        case "nasional": multiplier = 3; break;
        case "internasional": multiplier = 4; break;
        default: multiplier = 1;
      }
      
      setPoint(Math.round(basePoints * multiplier).toString());
    }
  }, [inputType, violationType, achievementLevel]);

  const formatDate = (date: Date): string => {
    if (!date) return "";
    return format(date, "d MMMM yyyy", { locale: id });
  };

  const validateForm = (): boolean => {
    const newErrors: ESakuFormErrorState = {};
    
    if (!studentName.trim()) newErrors.studentName = "Nama siswa diperlukan";
    if (!classType) newErrors.classType = "Kelas harus dipilih";
    if (!date) newErrors.date = "Tanggal diperlukan";
    
    if (inputType === "violation" && !violationType) {
      newErrors.violationType = "Jenis pelanggaran harus dipilih";
    } else if (inputType === "achievement" && !achievementLevel) {
      newErrors.achievementLevel = "Tingkatan prestasi harus dipilih";
    }
    
    if ((violationType === "lainnya" || achievementType === "lainnya") && !customViolation.trim()) {
      newErrors.customViolation = `Jenis ${inputType === "violation" ? "pelanggaran" : "prestasi"} lainnya diperlukan`;
    }
    
    if (!description.trim()) newErrors.description = "Deskripsi diperlukan";
    
    if (inputType === "violation" && !followUpDescription.trim()) {
      newErrors.followUpDescription = "Deskripsi tindak lanjut diperlukan";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep = (step: number): boolean => {
    const newErrors: ESakuFormErrorState = {};
    
    if (step === 0) {
      if (!studentName.trim()) newErrors.studentName = "Nama siswa diperlukan";
      if (!classType) newErrors.classType = "Kelas harus dipilih";
      if (!date) newErrors.date = "Tanggal diperlukan";
    } else if (step === 1) {
      if (inputType === "violation" && !violationType) {
        newErrors.violationType = "Jenis pelanggaran harus dipilih";
      } else if (inputType === "achievement" && !achievementLevel) {
        newErrors.achievementLevel = "Tingkatan prestasi harus dipilih";
      }
      
      if ((violationType === "lainnya" || achievementType === "lainnya") && !customViolation.trim()) {
        newErrors.customViolation = `Jenis ${inputType === "violation" ? "pelanggaran" : "prestasi"} lainnya diperlukan`;
      }
      
      if (!description.trim()) newErrors.description = "Deskripsi diperlukan";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e?: FormEvent): void => {
    if (e) e.preventDefault();
    
    const isValid = validateForm();
    
    if (isValid) {
      setIsSubmitting(true);
      
      setTimeout(() => {
        console.log("Form submitted:", {
          studentName,
          classType,
          date: format(date, "yyyy-MM-dd"),
          inputType,
          violationType: violationType === "lainnya" ? customViolation : violationType,
          achievementType: achievementType === "lainnya" ? customViolation : achievementType,
          achievementLevel,
          point,
          description,
          followUpType,
          followUpDescription
        });
        
        setIsSubmitting(false);
        setShowSuccess(true);
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        setTimeout(() => {
          setShowSuccess(false);
          resetForm();
        }, 3000);
      }, 1000);
    }
  };

  const handleNextStep = (): void => {
    if (validateStep(formStep)) {
      setFormStep((prev) => Math.min(prev + 1, 2));
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handlePrevStep = (): void => {
    setFormStep((prev) => Math.max(prev - 1, 0));
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const stepTitles = [
    "Data Siswa",
    `Detail ${inputType === "violation" ? "Pelanggaran" : "Prestasi"}`,
    "Tindak Lanjut"
  ];

  function getViolationLabel(type: ViolationTypeOptions): string {
    switch(type) {
      case "rambut-panjang": return "Rambut Panjang";
      case "terlambat": return "Terlambat";
      case "tidak-seragam": return "Tidak Berseragam";
      case "lainnya": return customViolation || "Lainnya";
      default: return "-";
    }
  }

  function getAchievementLevelLabel(level: AchievementLevelOptions): string {
    switch(level) {
      case "kota": return "Se-Kota";
      case "provinsi": return "Se-Provinsi";
      case "nasional": return "Nasional";
      case "internasional": return "Internasional";
      default: return "-";
    }
  }

  const summaryData = {
    name: studentName || '-',
    class: classType || '-',
    type: inputType === "violation" ? "Pelanggaran" : "Prestasi",
    detail: inputType === "violation" 
      ? (violationType === "lainnya" ? customViolation : getViolationLabel(violationType)) 
      : "Prestasi",
    level: inputType === "achievement" && achievementLevel ? getAchievementLevelLabel(achievementLevel) : "-",
    point: inputType === "violation" ? `-${point}` : `+${point}`,
  };

  const isMobileView = typeof window !== 'undefined' && window.innerWidth < 640;

  if (isLoading) {
    return <ESakuFormSkeleton />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6" ref={formRef}>
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center mb-2">
          <div className="bg-green-600/40 p-2 rounded-lg mr-3">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Form E-Saku Siswa</h1>
        </div>
        <p className="text-gray-600 max-w-3xl">
          Masukkan data pelanggaran atau prestasi siswa
        </p>
      </div>

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

            {(!isMobileView || formStep === 0) && (
              <>
                <div className="flex flex-col sm:flex-row gap-6">
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
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="space-y-2 w-full sm:w-1/2">
                    <Label htmlFor="date" className={labelClass}>
                      <Calendar className={greenIconClass} />
                      Tanggal {inputType === "violation" ? "Pelanggaran" : "Prestasi"} <span className="text-red-500">*</span>
                    </Label>
                    <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground",
                            errors.date ? "border-red-500" : "",
                            "h-10 px-3 py-2"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? formatDate(date) : <span>Pilih tanggal</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={date}
                          onSelect={(newDate) => {
                            setDate(newDate || new Date());
                            setIsDateOpen(false);
                          }}
                          locale={id}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                        
                        if (value === "violation") {
                          setViolationType("");
                          setAchievementType("");
                          setAchievementLevel("");
                          setCustomViolation("");
                        } else {
                          setViolationType("");
                          setAchievementType("");
                          setAchievementLevel("");
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

            {(!isMobileView || formStep === 1) && (
              <>
                <div className="space-y-4">
                  {inputType === "violation" && (
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="space-y-2 flex-grow">
                        <Label 
                          htmlFor="violationType" 
                          className={labelClass}
                        >
                          <FileText className={greenIconClass} />
                          Jenis Pelanggaran <span className="text-red-500">*</span>
                        </Label>
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
                        {errors.violationType && (
                          <p className={errorClass}>{errors.violationType}</p>
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
                                <p className="text-xs">Poin dihitung otomatis berdasarkan jenis pelanggaran</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <div className="relative w-full">
                          <div className="flex-1 h-10 px-3 py-2 border border-gray-300 bg-gray-50 text-gray-500 rounded-lg">
                            Poin Pelanggaran
                          </div>
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600">
                            -{point}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {inputType === "achievement" && (
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="space-y-2 flex-grow">
                        <Label 
                          htmlFor="achievementLevel" 
                          className={labelClass}
                        >
                          <Globe className={greenIconClass} />
                          Tingkatan Prestasi <span className="text-red-500">*</span>
                        </Label>
                        <Select 
                          value={achievementLevel} 
                          onValueChange={(value: string) => setAchievementLevel(value as AchievementLevelOptions)}
                        >
                          <SelectTrigger 
                            className={`${inputClass} ${errors.achievementLevel ? inputErrorClass : ''}`}
                          >
                            <SelectValue placeholder="Pilih Tingkatan Prestasi" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kota">Se-Kota</SelectItem>
                            <SelectItem value="provinsi">Se-Provinsi</SelectItem>
                            <SelectItem value="nasional">Nasional</SelectItem>
                            <SelectItem value="internasional">Internasional</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.achievementLevel && (
                          <p className={errorClass}>{errors.achievementLevel}</p>
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
                                <p className="text-xs">Poin dihitung otomatis berdasarkan tingkatan prestasi</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <div className="relative w-full">
                          <div className="flex-1 h-10 px-3 py-2 border border-gray-300 bg-gray-50 text-gray-500 rounded-lg">
                            Poin Prestasi
                          </div>
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-600">
                            +{point}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {(inputType === "violation" && violationType === "lainnya") && (
                    <div className="space-y-2">
                      <Label 
                        htmlFor="customViolation" 
                        className={labelClass}
                      >
                        Pelanggaran Lainnya <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="customViolation"
                        type="text"
                        value={customViolation}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomViolation(e.target.value)}
                        placeholder="Masukkan jenis pelanggaran lain"
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
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="h-4 w-4 text-green-600" />
                      <span>Tingkatan: {getAchievementLevelLabel(achievementLevel) || "-"}</span>
                    </div>
                  </div>
                )}

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
                        {inputType === "violation" && (
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Detail</span>
                            <span className="font-medium">{summaryData.detail || '-'}</span>
                          </div>
                        )}
                        {inputType === "achievement" && (
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Tingkatan</span>
                            <span className="font-medium">{summaryData.level}</span>
                          </div>
                        )}
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