interface LevelLabelProps {
    level: number;
  }
  
export const LevelLabel = ({ level }: LevelLabelProps) => {
    const levelMap: Record<string, string> = {
      "1": "Se-Kota",
      "2": "Se-Provinsi",
      "3": "Nasional",
      "4": "Internasional",
    };
  
    return <>{levelMap[level] || "-"}</>;
};