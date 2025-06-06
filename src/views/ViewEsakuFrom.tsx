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
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import {
  useClassroom
} from "@/config/Api/useClasroom";
import { IClassroom } from "@/config/Models/Classroom";
import { useStudentsByClassId } from "@/config/Api/useStudent";
import { useRules } from "@/config/Api/useRules";
import { IRules } from "@/config/Models/Rules";
import FormSekeleton from "@/components/shared/component/FormSekeleton";
import DatePickerForm from "@/components/shared/component/DatePickerForm";
import MobileSummaryCard from "@/components/shared/component/MobileSummaryCard";
import FormFieldGroup from "@/components/shared/component/FormField";
import LoadingSpinnerButton from "@/components/shared/component/LoadingSpinnerButton";
import { useViolationCreate } from "@/config/Api/useViolation";
import { useAccomplishmentCreate } from "@/config/Api/useAccomplishments";
import { useReportCreate } from "@/config/Api/useTeacherReport";

const ESakuForm: React.FC = () => {
  const teacherId = Number(localStorage.getItem("teacher_id"));
  const inputClass =
    "border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg h-10";
  const inputErrorClass = "border-red-500";
  const btnPrimaryClass =
    "bg-green-600 hover:bg-green-700 text-white flex items-center gap-1.5";
  const btnSecondaryClass =
    "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 flex items-center gap-1.5";
  const btnDarkClass =
    "bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-1.5";
  const [isLoading, setIsLoading] = useState(true);
  const [inputType, setInputType] = useState<InputTypeOptions>("violation");
  const [classType, setClassType] = useState<string>("");
  const [violationType, setViolationType] = useState<ViolationTypeOptions>("");
  const [achievementType, setAchievementType] =
    useState<AchievementTypeOptions>("");
  const [achievementLevel, setAchievementLevel] =
    useState<AchievementLevelOptions>("");
  const [followUpType, setFollowUpType] =
    useState<FollowUpTypeOptions>("follow-up");
  const [customViolation, setCustomViolation] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [studentName, setStudentName] = useState<string>("");
  const [date, setDate] = useState<Date>(() => {
    return new Date();
  });
  const [selectedRule, setSelectedRule] = useState<IRules | null>(null);
  const [selectedRuleId, setSelectedRuleId] = useState<string>("");
  const [point, setPoint] = useState<string>("0");
  const [formStep, setFormStep] = useState<number>(0);
  const [errors, setErrors] = useState<ESakuFormErrorState>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  const { data: rulesData } = useRules();
  const { data: classrooms } = useClassroom();
  const { data: students = [] } = useStudentsByClassId(selectedClassId ?? 0);
  const { mutate: createViolation } = useViolationCreate();
  const { mutate: createAccomplishment } = useAccomplishmentCreate();
  const { mutate: createReport } = useReportCreate();

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
    setSelectedRule(null);
    setPoint("0");
    setFollowUpType("follow-up");
    setCustomViolation("");
    setDescription("");
    setStudentName("");
    setDate(new Date());
    setFormStep(0);
    setErrors({});

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
    } else if (inputType === "achievement" && !achievementLevel) {
      newErrors.achievementLevel = "Tingkatan prestasi harus dipilih";
    }

    if (
      (violationType === "lainnya" || achievementType === "lainnya") &&
      !customViolation.trim()
    ) {
      newErrors.customViolation = `Jenis ${
        inputType === "violation" ? "pelanggaran" : "prestasi"
      } lainnya diperlukan`;
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
        if (!achievementLevel) {
          newErrors.achievementLevel = "Tingkatan prestasi harus dipilih";
        }
        if (!achievementType) {
          newErrors.achievementType = "Jenis prestasi harus dipilih";
        }
      }

      if (
        (violationType === "lainnya" || achievementType === "lainnya") &&
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
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e?: FormEvent): void => {
    if (e) e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;

    setIsSubmitting(true);

    const studentObj = students.find((s) => s.name === studentName);
    if (!studentObj) {
      alert("Siswa tidak ditemukan");
      setIsSubmitting(false);
      return;
    }

    if (inputType === "violation") {
      createViolation(
        {
          student_id: studentObj.id,
          description,
          violation_date: date.toISOString().split("T")[0],
          teacher_id: teacherId,
          action: followUpType,
          points: selectedRule?.points ?? 0,
          rulesofconduct_id: selectedRule?.id ?? 0,
        },
        {
          onSuccess: () => {
            setShowSuccess(true);
            resetForm();
            window.scrollTo({ top: 0, behavior: "smooth" });
            setTimeout(() => setShowSuccess(false), 3000);
          },
          onError: (err) => {
            console.error("Gagal kirim pelanggaran:", err);
            alert("Gagal menyimpan data pelanggaran.");
          },
          onSettled: () => setIsSubmitting(false),
        }
      );
    } else {
      const levelMap: Record<string, number> = {
        kota: 1,
        provinsi: 2,
        nasional: 3,
        internasional: 4,
      };

      createAccomplishment(
        {
          student_id: studentObj.id,
          description,
          accomplishment_date: date.toISOString().split("T")[0],
          level: levelMap[achievementLevel] ?? 0,
          points: parseInt(point),
        },
        {
          onSuccess: () => {
            setShowSuccess(true);
            resetForm();
            window.scrollTo({ top: 0, behavior: "smooth" });
            setTimeout(() => setShowSuccess(false), 3000);
          },
          onError: (err) => {
            console.error("Gagal kirim prestasi:", err);
            alert("Gagal menyimpan data prestasi.");
          },
          onSettled: () => setIsSubmitting(false),
        }
      );
    }
  };

  const handleSendAsReport = (): void => {
    const studentObj = students.find((s) => s.name === studentName);
    const classroomObj = classrooms?.find((c) => c.name === classType);

    if (!studentObj || !classroomObj) {
      alert("Data siswa atau kelas tidak valid.");
      return;
    }

    setIsSubmitting(true);

    createReport(
      {
        student_id: studentObj.id,
        reported_by: teacherId,
        teacher_id: classroomObj.teacher_id,
        violation_details: description,
        report_date: date.toISOString().split("T")[0],
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          resetForm();
          window.scrollTo({ top: 0, behavior: "smooth" });
          setTimeout(() => setShowSuccess(false), 3000);
        },
        onError: (error) => {
          console.error("Gagal mengirim laporan:", error);
          alert("Gagal mengirim laporan ke guru pengampu.");
        },
        onSettled: () => setIsSubmitting(false),
      }
    );
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
    "Tindak Lanjut",
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

  return (
    <div className="space-y-4 sm:space-y-6" ref={formRef}>
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 mb-6 shadow-sm">
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

      {showSuccess && (
        <Alert className="bg-green-50 border border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>Data berhasil disimpan!</AlertDescription>
        </Alert>
      )}

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
                  <div className="space-y-2 flex-1">
                    <FormFieldGroup
                      label="Pilih Kelas"
                      icon={<School className="h-4 w-4 text-green-600" />}
                      error={errors.classType}
                    >
                      <Select
                        value={classType}
                        onValueChange={(value) => {
                          setClassType(value);
                          const selectedClass = classrooms?.find(
                            (c: IClassroom) => c.name === value
                          );
                          setSelectedClassId(selectedClass?.id || null);
                          setStudentName("");
                          console.log(selectedClass);
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
                          {classrooms?.map((classroom: IClassroom) => (
                            <SelectItem
                              key={classroom.id}
                              value={classroom.name}
                            >
                              {classroom.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormFieldGroup>
                  </div>

                  <div className="space-y-2 flex-1">
                    <FormFieldGroup
                      label="Pilih Siswa"
                      icon={<User className="h-4 w-4 text-green-600" />}
                      error={errors.studentName}
                      required
                    >
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
                    </FormFieldGroup>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="space-y-2 w-full sm:w-1/2">
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
                          error={errors.achievementType}
                          required
                        >
                          <Select
                            value={achievementType}
                            onValueChange={(value: string) =>
                              setAchievementType(
                                value as AchievementTypeOptions
                              )
                            }
                          >
                            <SelectTrigger
                              className={`${inputClass} ${
                                errors.achievementType ? inputErrorClass : ""
                              }`}
                            >
                              <SelectValue placeholder="Pilih Jenis Prestasi" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="akademik">Akademik</SelectItem>
                              <SelectItem value="non-akademik">
                                Non Akademik
                              </SelectItem>
                              <SelectItem value="olahraga">Olahraga</SelectItem>
                              <SelectItem value="seni">Seni</SelectItem>
                              <SelectItem value="lainnya">Lainnya</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormFieldGroup>
                      </div>

                      {achievementType === "lainnya" && (
                        <div className="space-y-2">
                          <FormFieldGroup
                            label="Prestasi Lainnya"
                            icon={<Award className="h-4 w-4 text-green-600" />}
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
                              placeholder="Masukkan jenis prestasi lain"
                              className={`${inputClass} ${
                                errors.customViolation ? inputErrorClass : ""
                              }`}
                            />
                          </FormFieldGroup>
                        </div>
                      )}

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
                              onValueChange={(value: string) =>
                                setAchievementLevel(
                                  value as AchievementLevelOptions
                                )
                              }
                            >
                              <SelectTrigger
                                className={`${inputClass} ${
                                  errors.achievementLevel ? inputErrorClass : ""
                                }`}
                              >
                                <SelectValue placeholder="Pilih Tingkatan Prestasi" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="kota">Se-Kota</SelectItem>
                                <SelectItem value="provinsi">
                                  Se-Provinsi
                                </SelectItem>
                                <SelectItem value="nasional">
                                  Nasional
                                </SelectItem>
                                <SelectItem value="internasional">
                                  Internasional
                                </SelectItem>
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
                              id="point"
                              type="number"
                              min="1"
                              value={point}
                              onChange={(e) => setPoint(e.target.value)}
                              placeholder="Masukkan poin prestasi"
                              className={`${inputClass} ${
                                errors.point ? inputErrorClass : ""
                              }`}
                            />
                          </FormFieldGroup>
                        </div>
                      </div>
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
                              <SelectItem value="follow-up">
                                Tindak Lanjut
                              </SelectItem>
                              <SelectItem value="meeting">
                                Pertemuan dengan Orang Tua
                              </SelectItem>
                              <SelectItem value="warning">
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
                            id="otherFollowUp"
                            value={
                              followUpType === "lainnya" ? "" : followUpType
                            }
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                              setFollowUpType(
                                e.target.value as FollowUpTypeOptions
                              )
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
              <LoadingSpinnerButton
                isLoading={isSubmitting}
                onClick={handleSubmit}
                icon={<CheckCircle className="h-4 w-4" />}
                className={btnPrimaryClass}
              >
                Simpan
              </LoadingSpinnerButton>

              <Button
                type="button"
                className={btnDarkClass}
                onClick={handleSendAsReport}
                disabled={isSubmitting}
              >
                <Send className="h-4 w-4 " />
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
