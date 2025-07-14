import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useRef,
} from "react";
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
  PenTool,
  Paperclip,
  Upload,
  File,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ESakuFormErrorState,
  InputTypeOptions,
  FollowUpTypeOptions,
  ViolationTypeOptions,
  AchievementTypeOptions,
  AchievementLevelOptions,
} from "@/config/Models/FormTypes";
import { useClassroom } from "@/config/Api/useClasroom";
import { IClassroom } from "@/config/Models/Classroom";
import { useStudentsByClassId } from "@/config/Api/useStudent";
import { useRules } from "@/config/Api/useRules";
import { IRules } from "@/config/Models/Rules";
import FormSekeleton from "@/components/shared/component/FormSekeleton";
import DatePickerForm from "@/components/shared/component/DatePickerForm";
import MobileSummaryCard from "@/components/shared/component/MobileSummaryCard";
import FormFieldGroup from "@/components/shared/component/FormField";
import LoadingSpinnerButton from "@/components/shared/component/LoadingSpinnerButton";
import {
  useViolationCreate,
  useViolationsDocumentationUpload,
} from "@/config/Api/useViolation";
import {
  useAccomplishmentCreate,
  useAccomplishmentsDocumentationUpload,
} from "@/config/Api/useAccomplishments";
import { useAccomplishmentsLevel } from "@/config/Api/useAccomplishmentsLevel";
import { useAccomplishmentsRanks } from "@/config/Api/useAccomplishmentsRanks";
import { useAccomplishmentsType } from "@/config/Api/useAccomplismentsType";
import { useReportCreate } from "@/config/Api/useTeacherReport";
import ConfirmationModal from "@/components/ui/confirmation";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

// Rank options will be fetched from API
export type RankOptions = string;
const followUpOptions = [
  "tidak-perlu",
  "pemanggilan",
  "peringatan",
  "lainnya",
] as const;
type FollowUpType = (typeof followUpOptions)[number];

const ESakuForm: React.FC = () => {
  const teacherId = Number(localStorage.getItem("teacher_id"));
  const inputClass =
    "border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg h-10";
  const inputErrorClass = "border-red-500";
  const btnPrimaryClass =
    "bg-green-600 hover:bg-green-700 text-white cursor-pointer flex items-center gap-1.5";
  const btnSecondaryClass =
    "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 flex items-center gap-1.5";
  const btnDarkClass =
    "bg-gray-900 hover:bg-gray-800 cursor-pointer text-white flex items-center gap-1.5";
  const [isLoading, setIsLoading] = useState(true);
  const [inputType, setInputType] = useState<InputTypeOptions>("violation");
  const [classType, setClassType] = useState<string>("");
  const [violationType, setViolationType] = useState<ViolationTypeOptions>("");
  const [achievementTypeOptions, setAchievementTypeOptions] =
    useState<AchievementTypeOptions>("");
  const [achievementLevel, setAchievementLevel] =
    useState<AchievementLevelOptions>("");
  const [customAchievement, setCustomAchievement] = useState<string>("");
  const [followUpType, setFollowUpType] =
    useState<FollowUpTypeOptions>("tidak-perlu");
  const [customFollowUp, setCustomFollowUp] = useState<string>("");
  const [customViolation, setCustomViolation] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [studentName, setStudentName] = useState<string>("");
  const [date, setDate] = useState<Date>(() => {
    return new Date();
  });
  const [selectedRule, setSelectedRule] = useState<IRules | null>(null);
  const [rank, setRank] = useState<string>("");
  const [customRank, setCustomRank] = useState<string>("");
  const [selectedRuleId, setSelectedRuleId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<"report" | "save" | null>(
    null
  );
  const [point, setPoint] = useState<string>("0");
  const [formStep, setFormStep] = useState<number>(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState<ESakuFormErrorState>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [, setShowSuccess] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [, setPhotoUrl] = useState<string | undefined>(undefined);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [isClassTaughtByTeacher, setIsClassTaughtByTeacher] = useState<
    boolean | null
  >(null);
  const [showOnlyTeacherClass, setShowOnlyTeacherClass] =
    useState<boolean>(true);

  const { data: rulesData } = useRules();
  const { data: classrooms } = useClassroom();
  const { data: students = [] } = useStudentsByClassId(selectedClassId ?? 0);
  const { mutate: createViolation } = useViolationCreate();
  const { mutate: createAccomplishment } = useAccomplishmentCreate();
  const { mutate: createReport } = useReportCreate();
  const uploadViolationDocumentation = useViolationsDocumentationUpload();
  const uploadAccomplishmentDocumentation =
    useAccomplishmentsDocumentationUpload();

  // Fetch accomplishment types, levels, and ranks from API
  const { data: accomplishmentTypes = [] } = useAccomplishmentsType();
  const { data: accomplishmentLevels = [] } = useAccomplishmentsLevel();
  const { data: accomplishmentRanks = [] } = useAccomplishmentsRanks();

  const formRef = useRef<HTMLDivElement>(null);
  const dragCounter = useRef<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

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
        // Optionally handle error for multiple files
        return;
      }
      const file = files[0];
      setSelectedFile(file);
      const localUrl = URL.createObjectURL(file);
      setPhotoUrl(localUrl);
    }
  };

  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.editData as any;

  useEffect(() => {
    if (editData && classrooms && classrooms.length > 0) {
      // Isi form dengan data dari report
      setStudentName(editData.student?.name || "");
      setDescription(editData.violation_details || "");
      setIsEditMode(true);

      // Set tanggal dari report
      if (editData.violation_date) {
        setDate(new Date(editData.violation_date));
      }

      // Set jenis input berdasarkan data
      if (editData.accomplishment_type) {
        setInputType("achievement");
        setAchievementTypeOptions(editData.accomplishment_type);
        setAchievementLevel(editData.level || "");
        setPoint(editData.points?.toString() || "0");
        setRank(editData.rank || "");
      } else {
        setInputType("violation");
        setViolationType(editData.rules_of_conduct?.name || "");

        // Handle follow-up type dengan array yang baru
        if (editData.action && !followUpOptions.includes(editData.action)) {
          setFollowUpType("lainnya");
          setCustomFollowUp(editData.action);
        } else {
          setFollowUpType((editData.action as FollowUpType) || "tidak-perlu");
        }
      }

      // Set kelas berdasarkan data siswa
      if (editData.student?.class) {
        setClassType(editData.student.class.name);
      } else if (editData.student?.class_id && classrooms) {
        const studentClass = classrooms.find(
          (c: IClassroom) => c.id === editData.student.class_id
        );
        if (studentClass) {
          setClassType(studentClass.name);
        }
      }

      // Set rule jika tersedia
      if (editData.rules_of_conduct) {
        setSelectedRuleId(editData.rules_of_conduct.id.toString());
        setSelectedRule(editData.rules_of_conduct);
        setPoint(editData.rules_of_conduct.points.toString());
      }
    }
  }, [editData, classrooms]);

  useEffect(() => {
    // Jika tidak ada editData, pastikan mode edit dimatikan
    if (!location.state?.editData) {
      setIsEditMode(false);
    }
  }, [location.state]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (inputType === "achievement") {
      let totalPoints = 0;

      const typePoint =
        accomplishmentTypes.find((t) => t.type === achievementTypeOptions)
          ?.point || 0;
      const levelPoint =
        accomplishmentLevels.find((l) => l.level === achievementLevel)?.point ||
        0;
      const rankPoint =
        accomplishmentRanks.find((r) => r.rank === rank)?.point || 0;
      totalPoints = typePoint + levelPoint + rankPoint;
      setPoint(String(totalPoints));
    }
  }, [
    achievementTypeOptions,
    achievementLevel,
    rank,
    accomplishmentTypes,
    accomplishmentLevels,
    accomplishmentRanks,
    inputType,
  ]);

  // Handler untuk perubahan jenis prestasi
  const handleAchievementTypeChange = (value: string) => {
    setAchievementTypeOptions(value as AchievementTypeOptions);

    // Update poin berdasarkan jenis prestasi
    const selectedType = accomplishmentTypes.find(
      (type) => type.type === value
    );
    if (selectedType) {
      setPoint(selectedType.point.toString());
    }
  };

   const handleAchievementLevelChange = (value: string) => {
     setAchievementLevel(value as AchievementLevelOptions);

     // Update poin berdasarkan tingkatan
     const selectedType = accomplishmentTypes.find(
       (type) => type.type === achievementTypeOptions
     );
     const selectedLevel = accomplishmentLevels.find(
       (level) => level.level === value
     );

     if (selectedType && selectedLevel) {
       const totalPoints = selectedType.point + selectedLevel.point;
       setPoint(totalPoints.toString());
     }
   };

    const handleRankChange = (value: string) => {
      setRank(value);

      // Update poin berdasarkan peringkat
      const selectedType = accomplishmentTypes.find(
        (type) => type.type === achievementTypeOptions
      );
      const selectedLevel = accomplishmentLevels.find(
        (level) => level.level === achievementLevel
      );
      const selectedRank = accomplishmentRanks.find((r) => r.rank === value);

      if (selectedType && selectedLevel && selectedRank) {
        const totalPoints =
          selectedType.point + selectedLevel.point + selectedRank.point;
        setPoint(totalPoints.toString());
      }
    };


  useEffect(() => {
    const dynamicFieldChecks: Partial<
      Record<keyof ESakuFormErrorState, boolean>
    > = {
      studentName: !!studentName.trim(),
      classType: !!classType,
      date: !!date,
      violationType: inputType === "violation" ? !!violationType : true,
      achievementTypeOptions:
        inputType === "achievement" ? !!achievementTypeOptions : true,
      achievementLevel: inputType === "achievement" ? !!achievementLevel : true,
      customViolation:
        violationType === "lainnya" || achievementTypeOptions === "lainnya"
          ? !!customViolation.trim()
          : true,
      description: !!description.trim(),
      point:
        inputType === "achievement"
          ? !isNaN(parseInt(point)) && parseInt(point) > 0
          : true,
    };

    const fieldsToClear = Object.entries(dynamicFieldChecks).filter(
      ([key, isValid]) => isValid && errors[key as keyof ESakuFormErrorState]
    );

    if (fieldsToClear.length > 0) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        for (const [key] of fieldsToClear) {
          delete newErrors[key as keyof ESakuFormErrorState];
        }
        return newErrors;
      });
    }
  }, [
    studentName,
    classType,
    date,
    violationType,
    achievementTypeOptions,
    achievementLevel,
    customViolation,
    description,
    point,
    inputType,
    errors,
  ]);

  // Di dalam handleSubmit dan handleSendAsReport, setelah berhasil

  const resetForm = () => {
    setInputType("violation");
    setClassType("");
    setViolationType("");
    setAchievementTypeOptions("");
    setAchievementLevel("");
    setSelectedRule(null);
    setSelectedRuleId("");
    setPoint("0");
    setFollowUpType("tidak-perlu");
    setCustomFollowUp("");
    setCustomViolation("");
    setDescription("");
    setRank("");
    setCustomRank("");
    setStudentName("");
    setDate(new Date());
    setFormStep(0);
    setErrors({});
    setIsEditMode(false);

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ESakuFormErrorState = {};

    if (!studentName.trim()) newErrors.studentName = "Nama siswa diperlukan";
    if (!classType) newErrors.classType = "Kelas harus dipilih";
    if (!date) newErrors.date = "Tanggal diperlukan";

    if (inputType === "violation" && !violationType) {
      newErrors.violationType = "Jenis pelanggaran harus dipilih";
    } else if (inputType === "achievement") {
      if (!achievementLevel) {
        newErrors.achievementLevel = "Tingkatan prestasi harus dipilih";
      }
      if (!achievementTypeOptions) {
        newErrors.achievementTypeOptions = "Jenis prestasi harus dipilih";
      }
    }

    if (
      inputType === "violation" &&
      violationType === "lainnya" &&
      !customViolation.trim()
    ) {
      newErrors.customViolation = "Jenis pelanggaran lainnya diperlukan";
    }

    if (
      inputType === "achievement" &&
      achievementTypeOptions === "lainnya" &&
      !customAchievement.trim()
    ) {
      newErrors.customAchievement = "Jenis prestasi lainnya diperlukan";
    }

    if (!description.trim()) newErrors.description = "Deskripsi diperlukan";

    if (inputType === "achievement") {
      if (!point.trim()) {
        newErrors.point = "Poin prestasi diperlukan";
      } else if (isNaN(parseInt(point))) {
        newErrors.point = "Poin harus berupa angka";
      } else if (parseInt(point) <= 0) {
        newErrors.point = "Poin harus lebih besar dari 0";
      }

      if (!rank) {
        newErrors.rank = "Peringkat diperlukan";
      } else if (rank === "lainnya" && !customRank.trim()) {
        newErrors.customRank = "Peringkat lainnya diperlukan";
      }
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
      } else if (inputType === "achievement") {
        if (!achievementTypeOptions) {
          newErrors.achievementTypeOptions = "Jenis prestasi harus dipilih";
        }
        if (!achievementLevel) {
          newErrors.achievementLevel = "Tingkatan prestasi harus dipilih";
        }
      }

      if (
        (violationType === "lainnya" || achievementTypeOptions === "lainnya") &&
        !customViolation.trim()
      ) {
        newErrors.customViolation = `Jenis ${
          inputType === "violation" ? "pelanggaran" : "prestasi"
        } lainnya diperlukan`;
      }

      if (!description.trim()) newErrors.description = "Deskripsi diperlukan";

      if (step === 1 && inputType === "achievement") {
        if (!point.trim()) {
          newErrors.point = "Poin prestasi diperlukan";
        } else if (isNaN(parseInt(point))) {
          newErrors.point = "Poin harus berupa angka";
        } else if (parseInt(point) <= 0) {
          newErrors.point = "Poin harus lebih besar dari 0";
        }

        if (!rank) {
          newErrors.rank = "Peringkat diperlukan";
        } else if (rank === "lainnya" && !customRank.trim()) {
          newErrors.customRank = "Peringkat lainnya diperlukan";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangeDocumentation = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const localUrl = URL.createObjectURL(file);
        setPhotoUrl(localUrl);
        setSelectedFile(file);
        console.log("File selected:", file);
      } else {
        console.log("No file selected");
      }
    };

    fileInput.click();
  };

  const handleSubmit = (e?: FormEvent): void => {
    if (e) e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;
    setIsSubmitting(true);

    let studentObj;
    if (isEditMode) {
      if (!editData || !editData.student) {
        toast.error("Data siswa tidak valid");
        setIsSubmitting(false);
        return;
      }
      studentObj = {
        id: editData.student.id,
        name: editData.student.name,
      };
    } else {
      studentObj = students.find((s) => s.name === studentName);
    }

    if (!studentObj) {
      toast.error("Data siswa tidak ditemukan");
      setIsSubmitting(false);
      return;
    }

    if (inputType === "violation") {
      createViolation(
        {
          student_id: studentObj.id.toString(),
          description,
          violation_date: date.toISOString().split("T")[0],
          teacher_id: teacherId,
          action: followUpType === "lainnya" ? customFollowUp : followUpType,
          points: selectedRule?.points ?? 0,
          rulesofconduct_id: selectedRule?.id ?? 0,
        },
        {
          onSuccess: (data) => {
            if (selectedFile) {
              uploadViolationDocumentation.mutate(
                { id: data.id, file: selectedFile },
                {
                  onSuccess: () => {
                    toast.success("Dokumentasi berhasil diupload");
                    setSelectedFile(null);
                  },
                  onError: () => {
                    toast.error("Upload dokumentasi gagal");
                  },
                }
              );
            }
            setShowSuccess(true);
            resetForm();
            setIsEditMode(false);
            navigate(location.pathname, { replace: true });
            window.scrollTo({ top: 0, behavior: "smooth" });
            toast.success(
              isEditMode
                ? "Data berhasil diperbarui"
                : inputType === "violation"
                ? "Data pelanggaran berhasil disimpan"
                : "Data prestasi berhasil disimpan"
            );
            setTimeout(() => setShowSuccess(false), 3000);
          },
          onError: (err) => {
            toast.error("Data pelanggaran gagal disimpan");
            console.error("Gagal kirim pelanggaran:", err);
          },
          onSettled: () => setIsSubmitting(false),
        }
      );
    } else {
      // Dapatkan ID dari data yang dipilih
      const selectedType = accomplishmentTypes.find(
        (type) => type.type === achievementTypeOptions
      );
      const selectedLevel = accomplishmentLevels.find(
        (level) => level.level === achievementLevel
      );
      const selectedRank = accomplishmentRanks.find((r) => r.rank === rank);

      createAccomplishment(
        {
          student_id: studentObj.id.toString(),
          description,
          type_id: selectedType?.id || 0,
          accomplishment_date: date.toISOString().split("T")[0],
          level_id: selectedLevel?.id || 0,
          points: parseInt(point),
          rank_id: rank === "lainnya" ? 0 : selectedRank?.id || 0,
          rank: rank === "lainnya" ? customRank : rank,
        },
        {
          onSuccess: (data) => {
            if (selectedFile) {
              uploadAccomplishmentDocumentation.mutate(
                { id: data.id, file: selectedFile },
                {
                  onSuccess: () => {
                    toast.success("Dokumentasi berhasil diupload");
                    setSelectedFile(null);
                  },
                  onError: (err) => {
                    console.error("Gagal upload dokumentasi:", err);
                    toast.error("Upload dokumentasi gagal");
                  },
                }
              );
            }

            setShowSuccess(true);
            resetForm();
            window.scrollTo({ top: 0, behavior: "smooth" });
            toast.success("Data prestasi berhasil disimpan");
            setTimeout(() => setShowSuccess(false), 3000);
          },
          onError: (err) => {
            toast.error("Data prestasi gagal disimpan");
            console.error("Gagal kirim prestasi:", err);
          },
          onSettled: () => setIsSubmitting(false),
        }
      );
    }
  };

  const handleSendAsReport = (): void => {
    let studentObj;
    let classroomObj;

    if (isEditMode) {
      // Gunakan data langsung dari editData
      if (!editData || !editData.student) {
        toast.error("Data siswa tidak valid");
        return;
      }

      studentObj = editData.student;
      classroomObj = editData.student.class;
    } else {
      // Mode normal
      studentObj = students.find((s) => s.name === studentName);
      classroomObj = classrooms?.find((c) => c.name === classType);
    }

    if (!studentObj || !classroomObj) {
      toast.error("Data siswa atau kelas tidak ditemukan");
      return;
    }

    setIsSubmitting(true);

    // Prepare the data based on input type (violation or achievement)
    let reportData: any = {
      student_id: studentObj.id,
      teacher_id: teacherId, // Automatically using the logged-in teacher's ID
      violation_date: date.toISOString().split("T")[0],
      violation_details: description,
      action: followUpType === "lainnya" ? customFollowUp : followUpType,
      rulesofconduct_id: selectedRule?.id ?? 0, // Selected from rules
      points: selectedRule?.points ?? 0,
    };

    // Dapatkan ID dari data yang dipilih
    const selectedType = accomplishmentTypes.find(
      (type) => type.type === achievementTypeOptions
    );
    const selectedLevel = accomplishmentLevels.find(
      (level) => level.level === achievementLevel
    );
    const selectedRank = accomplishmentRanks.find((r) => r.rank === rank);

    if (inputType === "achievement") {
      // For achievements, include the rank and points
      reportData = {
        ...reportData,
        type_id: selectedType?.id || 0,
        level_id: selectedLevel?.id || 0,
        rank_id: rank === "lainnya" ? 0 : selectedRank?.id || 0,
        points: parseInt(point),
        rank: rank === "lainnya" ? customRank : rank,
      };
    }

    createReport(reportData, {
      onSuccess: () => {
        setShowSuccess(true);
        resetForm();
        window.scrollTo({ top: 0, behavior: "smooth" });
        toast.success("Laporan berhasil dikirim");
        setTimeout(() => setShowSuccess(false), 3000);
      },
      onError: (error) => {
        toast.error("Gagal mengirim laporan");
        console.error("Gagal mengirim laporan:", error);
      },
      onSettled: () => setIsSubmitting(false),
    });
  };

  const handleNextStep = (): void => {
    if (validateStep(formStep)) {
      setFormStep((prev) => Math.min(prev + 1, 2));
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handlePrevStep = (): void => {
    setFormStep((prev) => Math.max(prev - 1, 0));
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const stepTitles = [
    "Data Siswa",
    `Detail ${inputType === "violation" ? "Pelanggaran" : "Prestasi"}`,
    inputType === "violation" ? "Tindak Lanjut" : "Ringkasan",
  ];

  function getAchievementLevelLabel(level: AchievementLevelOptions): string {
    switch (level) {
      case "kota":
        return "Se-Kota";
      case "provinsi":
        return "Se-Provinsi";
      case "nasional":
        return "Nasional";
      case "internasional":
        return "Internasional";
      default:
        return "-";
    }
  }

  const summaryData = {
    name: studentName,
    class: classType,
    type: inputType === "violation" ? "Pelanggaran" : "Prestasi",
    detail: inputType === "violation" ? selectedRule?.name : description,
    level:
      inputType === "achievement" && achievementLevel
        ? getAchievementLevelLabel(achievementLevel)
        : "-",
    point: inputType === "violation" ? `-${point}` : `+${point}`,
    rank: rank === "lainnya" ? customRank : rank,
  };

  const isMobileView = typeof window !== "undefined" && window.innerWidth < 640;

  if (isLoading) {
    return <FormSekeleton />;
  }

  const handleViolationTypeChange = (value: string) => {
    setSelectedRuleId(value);

    const selectedRule = rulesData?.find(
      (rule) => rule.id.toString() === value
    );

    if (selectedRule) {
      setSelectedRule(selectedRule);
      setPoint(selectedRule.points.toString() ?? "");
      setViolationType(selectedRule.name as ViolationTypeOptions);
    } else {
      setPoint("");
      setViolationType("");
      setSelectedRule(null);
    }
  };

  const handleOpenConfirm = (type: "report" | "save") => {
    // Validasi khusus untuk laporan
    if (type === "report") {
      const reportErrors: ESakuFormErrorState = {};
      if (!studentName.trim())
        reportErrors.studentName = "Nama siswa diperlukan";
      if (!classType) reportErrors.classType = "Kelas harus dipilih";
      if (!date) reportErrors.date = "Tanggal diperlukan";
      if (!description.trim())
        reportErrors.description = "Deskripsi diperlukan";

      // Hanya validasi pelanggaran jika tipe input adalah violation
      if (inputType === "violation" && !violationType) {
        reportErrors.violationType = "Pelanggaran harus dipilih";
      }

      setErrors(reportErrors);

      if (Object.keys(reportErrors).length === 0) {
        setConfirmType(type);
        setIsModalOpen(true);
      }
      return;
    }

    // Validasi untuk simpan biasa
    const isValid = validateForm();
    if (isValid) {
      setConfirmType(type);
      setIsModalOpen(true);
    }
  };

  const filteredClassrooms = classrooms?.filter((classroom) => {
    if (inputType === "achievement") {
      return classroom.teacher_id === teacherId;
    }
    return showOnlyTeacherClass ? classroom.teacher_id === teacherId : true;
  });

  const handleConfirm = () => {
    setIsModalOpen(false);

    // Beri jeda sebelum eksekusi untuk memastikan state sudah update
    setTimeout(() => {
      if (confirmType === "report") {
        handleSendAsReport();
      } else if (confirmType === "save") {
        handleSubmit();
      }
    }, 100);
  };

  return (
    <div className="space-y-4 sm:space-y-6" ref={formRef}>
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 mb-6 shadow-md">
        <div className="flex items-center mb-2">
          <div className="bg-green-600/40 p-2 rounded-lg mr-3">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Form E-Saku Siswa
          </h1>
        </div>
        <p className="text-gray-600 max-w-3xl">
          Masukkan data pelanggaran atau prestasi siswa
        </p>
      </div>
      <Card className="rounded-xl overflow-hidden border-green-100 shadow-md">
        <CardHeader className="border-b bg-green-600 text-white p-4">
          <div className="flex items-center gap-2">
            {inputType === "violation" ? (
              <AlertTriangle className="h-4 w-4 text-green-600" />
            ) : (
              <Award className="h-4 w-4 text-green-600" />
            )}
            <CardTitle>
              {isMobileView
                ? `${stepTitles[formStep]} (${formStep + 1}/3)`
                : inputType === "violation"
                ? "Input Data Pelanggaran"
                : "Input Data Prestasi"}
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
                        step < formStep
                          ? "bg-green-500"
                          : step === formStep
                          ? "bg-green-600"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs">
                  {[0, 1, 2].map((step) => (
                    <span
                      key={step}
                      className={
                        step === formStep
                          ? "font-semibold text-green-600"
                          : "text-gray-500"
                      }
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
                  <div className="space-y-2 w-full sm:w-1/2">
                    <FormFieldGroup
                      label={
                        <>
                          {inputType === "violation" ? (
                            <AlertTriangle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Award className="h-4 w-4 text-green-600" />
                          )}
                          Jenis Input
                        </>
                      }
                      error={errors.inputType}
                    >
                      <Select
                        value={inputType}
                        onValueChange={(value: string) => {
                          setInputType(value as InputTypeOptions);

                          if (
                            value === "violation" ||
                            value === "achievement"
                          ) {
                            setViolationType("");
                            setAchievementTypeOptions("");
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
                    </FormFieldGroup>
                  </div>

                  <div className="space-y-2 flex-1">
                    <FormFieldGroup
                      label="Pilih Kelas"
                      icon={<School className="h-4 w-4 text-green-600" />}
                      error={errors.classType}
                    >
                      {isEditMode ? (
                        // Display class name directly for edit mode
                        <Input
                          value={classType}
                          readOnly
                          className="bg-gray-100"
                        />
                      ) : (
                        <Select
                          value={classType}
                          onValueChange={(value) => {
                            setClassType(value);
                            const selectedClass = classrooms?.find(
                              (c: IClassroom) => c.name === value
                            );
                            setSelectedClassId(selectedClass?.id || null);
                            setStudentName("");

                            const teacherIdNum = Number(teacherId);
                            setIsClassTaughtByTeacher(
                              selectedClass?.teacher_id === teacherIdNum
                            );
                          }}
                        >
                          <SelectTrigger
                            className={`${inputClass} ${
                              errors.classType ? inputErrorClass : ""
                            }`}
                          >
                            <SelectValue placeholder="Pilih Kelas" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredClassrooms?.map(
                              (classroom: IClassroom) => (
                                <SelectItem
                                  key={classroom.id}
                                  value={classroom.name}
                                >
                                  {classroom.name}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                          {inputType === "violation" && (
                            <div className="flex items-center gap-2 mt-2">
                              <Checkbox
                                id="filter-my-classes"
                                checked={showOnlyTeacherClass}
                                onCheckedChange={(checked) =>
                                  setShowOnlyTeacherClass(!!checked)
                                }
                                className="text-green-600"
                              />
                              <label
                                htmlFor="filter-my-classes"
                                className="text-sm text-gray-600 select-none"
                              >
                                Tampilkan hanya kelas yang diampu
                              </label>
                            </div>
                          )}
                        </Select>
                      )}
                    </FormFieldGroup>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="space-y-2 w-full sm:w-1/2">
                    <FormFieldGroup
                      label="Pilih Siswa"
                      icon={<User className="h-4 w-4 text-green-600" />}
                      error={errors.studentName}
                      required
                    >
                      {isEditMode ? (
                        // Display student name directly for edit mode
                        <Input
                          value={studentName}
                          readOnly
                          className="bg-gray-100"
                        />
                      ) : (
                        <Select
                          value={studentName}
                          onValueChange={setStudentName}
                          disabled={!selectedClassId}
                        >
                          <SelectTrigger
                            className={`${inputClass} ${
                              errors.studentName ? inputErrorClass : ""
                            }`}
                          >
                            <SelectValue
                              placeholder={
                                selectedClassId
                                  ? "Pilih Siswa"
                                  : "Pilih kelas terlebih dahulu"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedClassId ? (
                              students.length > 0 ? (
                                students.map((student) => (
                                  <SelectItem
                                    key={student.id}
                                    value={
                                      student.name || `student-${student.id}`
                                    }
                                  >
                                    {student.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-data" disabled>
                                  Tidak ada siswa di kelas ini
                                </SelectItem>
                              )
                            ) : (
                              <SelectItem value="select-class-first" disabled>
                                Pilih kelas terlebih dahulu
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    </FormFieldGroup>
                  </div>

                  <div className="space-y-2 flex-1">
                    <FormFieldGroup
                      label="Tanggal"
                      icon={<Calendar className="h-4 w-4 text-green-600" />}
                      required
                    >
                      <DatePickerForm
                        value={date}
                        onChange={setDate}
                        error={errors.date}
                      />
                    </FormFieldGroup>
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
                        <FormFieldGroup
                          label="Jenis Pelanggaran"
                          icon={<FileText className="h-4 w-4 text-green-600" />}
                          error={errors.violationType}
                          required
                        >
                          <Select
                            value={selectedRuleId}
                            onValueChange={(value) => {
                              handleViolationTypeChange(value);
                            }}
                          >
                            <SelectTrigger
                              className={`${inputClass} ${
                                errors.violationType ? inputErrorClass : ""
                              }`}
                            >
                              <SelectValue placeholder="Pilih Jenis Pelanggaran" />
                            </SelectTrigger>
                            <SelectContent>
                              {rulesData?.map((rule) => (
                                <SelectItem
                                  key={rule.id}
                                  value={rule.id.toString()}
                                >
                                  {rule.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormFieldGroup>
                      </div>

                      <div className="space-y-2 w-48">
                        <FormFieldGroup
                          label={
                            <>
                              Poin
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-4 w-4 text-gray-400 ml-1" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">
                                      Poin dihitung otomatis berdasarkan jenis
                                      pelanggaran
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </>
                          }
                          error={errors.points}
                        >
                          <div className="relative w-full">
                            <div className="flex-1 h-10 px-3 py-2 text-sm border border-gray-300 bg-gray-50 text-gray-500 rounded-lg">
                              {selectedRule
                                ? `${selectedRule.points}`
                                : "Pilih jenis pelanggaran"}
                            </div>

                            {selectedRule?.points && (
                              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600">
                                -{selectedRule.points}
                              </div>
                            )}
                          </div>
                        </FormFieldGroup>
                      </div>
                    </div>
                  )}

                  {inputType === "achievement" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <FormFieldGroup
                          label="Jenis Prestasi"
                          icon={<Award className="h-4 w-4 text-green-600" />}
                          error={errors.achievementTypeOptions}
                          required
                        >
                          <Select
                            value={achievementTypeOptions}
                            onValueChange={handleAchievementTypeChange}
                          >
                            <SelectTrigger
                              className={`${inputClass} ${
                                errors.achievementTypeOptions
                                  ? inputErrorClass
                                  : ""
                              }`}
                            >
                              <SelectValue placeholder="Pilih Jenis Prestasi" />
                            </SelectTrigger>
                            <SelectContent>
                              {accomplishmentTypes.length > 0 ? (
                                accomplishmentTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.type}>
                                    {type.type}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-data" disabled>
                                  Tidak ada data jenis prestasi
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </FormFieldGroup>
                      </div>

                      {achievementTypeOptions === "lainnya" && (
                        <div className="space-y-2">
                          <FormFieldGroup
                            label="Prestasi Lainnya"
                            icon={<Award className="h-4 w-4 text-green-600" />}
                            required
                            error={errors.customAchievement}
                          >
                            <Input
                              id="customViolation"
                              type="text"
                              value={customAchievement}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setCustomAchievement(e.target.value)
                              }
                              placeholder="Masukkan jenis prestasi lain"
                              className={`${inputClass} ${
                                errors.achievementType ? inputErrorClass : ""
                              }`}
                            />
                          </FormFieldGroup>
                        </div>
                      )}

                      <div className="space-y-2">
                        <FormFieldGroup
                          label="Peringkat"
                          icon={<Award className="h-4 w-4 text-green-600" />}
                          required
                          error={errors.rank}
                        >
                          <Select value={rank} onValueChange={handleRankChange}>
                            <SelectTrigger
                              className={`${inputClass} ${
                                errors.rank ? inputErrorClass : ""
                              }`}
                            >
                              <SelectValue placeholder="Pilih Peringkat" />
                            </SelectTrigger>
                            <SelectContent>
                              {accomplishmentRanks.length > 0 ? (
                                accomplishmentRanks.map((rankItem) => (
                                  <SelectItem
                                    key={rankItem.id}
                                    value={rankItem.rank}
                                  >
                                    {rankItem.rank}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-data" disabled>
                                  Tidak ada data peringkat
                                </SelectItem>
                              )}
                              <SelectItem value="lainnya">Lainnya</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormFieldGroup>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="space-y-2 flex-grow">
                          <FormFieldGroup
                            label="Tingkatan Prestasi"
                            icon={<Globe className="h-4 w-4 text-green-600" />}
                            required
                            error={errors.achievementLevel}
                          >
                            <Select
                              value={achievementLevel}
                              onValueChange={handleAchievementLevelChange}
                            >
                              <SelectTrigger
                                className={`${inputClass} ${
                                  errors.achievementLevel ? inputErrorClass : ""
                                }`}
                              >
                                <SelectValue placeholder="Pilih Tingkatan Prestasi" />
                              </SelectTrigger>
                              <SelectContent>
                                {accomplishmentLevels.length > 0 ? (
                                  accomplishmentLevels.map((level) => (
                                    <SelectItem
                                      key={level.id}
                                      value={level.level}
                                    >
                                      {level.level}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="no-data" disabled>
                                    Tidak ada data tingkatan prestasi
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </FormFieldGroup>
                        </div>
                        <div className="space-y-2 flex-grow">
                          <FormFieldGroup
                            label={
                              <>
                                Poin Prestasi{""}
                                <span className="text-red-500">*</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info
                                        className={`h-4 w-4 text-gray-400 ml-1`}
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs">
                                        Masukkan poin untuk prestasi ini
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </>
                            }
                            error={errors.point}
                          >
                            <Input
                              type="number"
                              value={point}
                              className={`${inputClass} bg-gray-100`}
                              readOnly
                            />
                          </FormFieldGroup>
                        </div>
                      </div>
                      {rank === "lainnya" && (
                        <div className="space-y-2">
                          <FormFieldGroup
                            label="Peringkat Lainnya"
                            icon={<Award className="h-4 w-4 text-green-600" />}
                            required
                            error={errors.customRank}
                          >
                            <Input
                              type="text"
                              value={customRank}
                              onChange={(e) => setCustomRank(e.target.value)}
                              placeholder="Masukkan peringkat lainnya"
                              className={`${inputClass} ${
                                errors.customRank ? inputErrorClass : ""
                              }`}
                            />
                          </FormFieldGroup>
                        </div>
                      )}
                    </div>
                  )}

                  {inputType === "violation" && violationType === "lainnya" && (
                    <div className="space-y-2">
                      <FormFieldGroup
                        label="Pelanggaran Lainnya"
                        icon={<PenTool className="h-4 w-4 text-green-600" />}
                        required
                        error={errors.customViolation}
                      >
                        <Input
                          id="customViolation"
                          type="text"
                          value={customViolation}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setCustomViolation(e.target.value)
                          }
                          placeholder="Masukkan jenis pelanggaran lain"
                          className={`${inputClass} ${
                            errors.customViolation ? inputErrorClass : ""
                          }`}
                        />
                      </FormFieldGroup>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <FormFieldGroup
                    label={
                      <>
                        <MessageSquare className="h-4 w-4 text-green-600" />
                        Deskripsi{" "}
                        {inputType === "violation" ? "Pelanggaran" : "Prestasi"}
                      </>
                    }
                    error={errors.description}
                    required
                  >
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={`Tambahkan deskripsi ${
                        inputType === "violation" ? "pelanggaran" : "prestasi"
                      }...`}
                      className={`${inputClass.replace("h-10", "min-h-32")} ${
                        errors.description ? inputErrorClass : ""
                      }`}
                    />
                  </FormFieldGroup>
                </div>

                <div className="space-y-2">
                  <FormFieldGroup
                    label={
                      <>
                        <Paperclip className="h-4 w-4 text-green-600" />
                        Lampiran{" "}
                        {inputType === "violation" ? "Pelanggaran" : "Prestasi"}
                      </>
                    }
                  >
                    {!selectedFile ? (
                      <div
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className={`relative transition-all duration-200 ${
                          isDragging ? "scale-100" : ""
                        }`}
                      >
                        <label
                          htmlFor="file-upload"
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
                              ? "Drop your file here"
                              : "Click to upload or drag & drop"}
                          </span>
                          <span className="text-xs text-gray-400 mt-0.5 sm:mt-1 px-2 text-center">
                            .jpg, .jpeg, .png, .gif (max 10MB)
                          </span>
                        </label>
                        {isDragging && (
                          <div className="absolute inset-0 rounded-lg bg-green-500 bg-opacity-10 pointer-events-none animate-pulse" />
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 mt-2 rounded-md border border-green-300 bg-green-50 px-3 py-2 shadow-sm">
                        <File className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="truncate font-medium text-green-700">
                          {selectedFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="text-red-500 hover:text-red-600 transition-colors ml-auto"
                          aria-label="Remove file"
                        >
                          &times;
                        </button>
                      </div>
                    )}
                    <input
                      id="file-upload"
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif,image/*"
                      onChange={handleChangeDocumentation}
                      className="hidden"
                    />
                  </FormFieldGroup>
                </div>
              </>
            )}

            {(!isMobileView || formStep === 2) && (
              <>
                {inputType === "violation" ? (
                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-green-800">
                        Tindak Lanjut
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <FormFieldGroup label="Tindak Lanjut" required>
                          <Select
                            value={followUpType}
                            onValueChange={(value: string) =>
                              setFollowUpType(value as FollowUpTypeOptions)
                            }
                          >
                            <SelectTrigger className="border-green-200 focus:border-green-500 focus:ring-green-500 rounded-lg bg-white w-full h-10">
                              <SelectValue placeholder="Pilih Tindak Lanjut" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tidak-perlu">
                                Tidak Diperlukan
                              </SelectItem>
                              <SelectItem value="pemanggilan">
                                Pertemuan dengan Orang Tua
                              </SelectItem>
                              <SelectItem value="peringatan">
                                Surat Peringatan
                              </SelectItem>
                              <SelectItem value="lainnya">Lainnya</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormFieldGroup>
                      </div>
                      {followUpType === "lainnya" && (
                        <FormFieldGroup
                          label="Tindak Lanjut Lainnya"
                          required
                          error={errors.followUpType}
                        >
                          <Textarea
                            value={customFollowUp}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                              setCustomFollowUp(e.target.value)
                            }
                            placeholder="Tambahkan jenis tindak lanjut..."
                            className={`border-green-200 focus:border-green-500 focus:ring-green-500 rounded-lg min-h-24 bg-white w-full ${
                              errors.followUpType ? inputErrorClass : ""
                            }`}
                          />
                        </FormFieldGroup>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-green-800">
                        Dokumentasi Prestasi
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Prestasi telah tercatat di sistem dengan penambahan poin +
                      {point}. Prestasi ini akan muncul di laporan bulanan dan
                      rekap semester.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="h-4 w-4 text-green-600" />
                      <span>
                        Tingkatan:{" "}
                        {getAchievementLevelLabel(achievementLevel) || "-"}
                      </span>
                    </div>
                  </div>
                )}

                {isMobileView && (
                  <MobileSummaryCard data={summaryData} inputType={inputType} />
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
                    <ArrowLeft className="h-4 w-4" />
                    Kembali
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className={btnSecondaryClass}
                    onClick={resetForm}
                  >
                    <RefreshCw className="h-4 w-4" />
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
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <LoadingSpinnerButton
                    isLoading={isSubmitting}
                    onClick={handleSubmit}
                    icon={<CheckCircle className="h-4 w-4" />}
                    className={btnPrimaryClass}
                  >
                    Simpan
                  </LoadingSpinnerButton>
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
              <RefreshCw className="h-4 w-4" />
              Reset Form
            </Button>

            <div className="flex gap-3">
              {inputType === "violation" && !isEditMode && (
                <Button
                  type="button"
                  className={btnDarkClass}
                  onClick={() => handleOpenConfirm("report")}
                  disabled={isSubmitting || isClassTaughtByTeacher === true}
                >
                  <Send className="h-4 w-4" />
                  Kirim sebagai Laporan
                </Button>
              )}

              <LoadingSpinnerButton
                isLoading={isSubmitting}
                onClick={() => handleOpenConfirm("save")}
                icon={<CheckCircle className="h-4 w-4" />}
                className={btnPrimaryClass}
                disabled={
                  isSubmitting ||
                  (inputType === "violation" &&
                    !isEditMode &&
                    isClassTaughtByTeacher !== true)
                }
              >
                {isEditMode ? "Perbarui Data" : "Simpan"}
              </LoadingSpinnerButton>
            </div>
          </CardFooter>
        )}
      </Card>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setConfirmType(null);
        }}
        onConfirm={handleConfirm}
        title={confirmType === "report" ? "Kirim Laporan?" : "Simpan Data?"}
        description={
          confirmType === "report"
            ? "Apakah anda yakin ingin mengirim sebagai laporan ke guru pengampu kelas?"
            : "Apakah anda yakin ingin menyimpan data ini?"
        }
        confirmText={confirmType === "report" ? "Kirim" : "Simpan"}
        cancelText="Batal"
        type={confirmType === "report" ? "report" : "add"}
      />
    </div>
  );
};

export default ESakuForm;
