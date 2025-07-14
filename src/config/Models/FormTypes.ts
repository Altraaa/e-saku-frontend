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
  rank?: string;
  customRank?: string;
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
// AchievementTypeOptions sekarang menggunakan string karena data diambil dari API
export type AchievementTypeOptions = string;
// AchievementLevelOptions sekarang menggunakan string karena data diambil dari API
export type AchievementLevelOptions = string;

export type FormValidator = (value: string) => string | undefined;
