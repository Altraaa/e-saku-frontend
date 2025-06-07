export interface ErrorState {
  [key: string]: string | undefined;
}

export interface StudentFormErrorState extends ErrorState {
  studentName?: string;
  classType?: string;
  date?: string;
}

export interface ESakuFormErrorState extends StudentFormErrorState {
  violationType?: string;
  achievementType?: string;
  description?: string;
  followUpDescription?: string;
  customAchievement?: string;
}

export type InputTypeOptions = "violation" | "achievement";
export type FollowUpTypeOptions =
  | "tidak-perlu"
  | "pemanggilan"
  | "peringatan"
  | "lainnya";
export type ViolationTypeOptions =
  | "rambut-panjang"
  | "terlambat"
  | "tidak-seragam"
  | "lainnya"
  | "";
export type AchievementTypeOptions =
  | "akademik"
  | "olahraga"
  | "kesenian"
  | "lainnya"
  | "";
export type AchievementLevelOptions =
  | "kota"
  | "provinsi"
  | "nasional"
  | "internasional"
  | "";

export type FormValidator = (value: string) => string | undefined;
