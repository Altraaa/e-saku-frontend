interface LevelLabelProps {
  level: number;
  levelName?: string;
}

export const LevelLabel = ({ level, levelName }: LevelLabelProps) => {
  // Jika levelName tersedia, gunakan itu
  if (levelName) {
    return <>{levelName}</>;
  }
  
  // Fallback ke pemetaan lama jika levelName tidak tersedia
  const levelMap: Record<string, string> = {
    "1": "Se-Kota",
    "2": "Se-Provinsi",
    "3": "Nasional",
    "4": "Internasional",
  };

  return <>{levelMap[level] || "-"}</>;
};