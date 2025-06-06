import React from "react";
import { FileText } from "lucide-react";

interface SummaryData {
  name: string;
  class: string;
  type: string;
  detail?: string;
  level: string;
  point: string;
}

const MobileSummaryCard: React.FC<{ data: SummaryData; inputType: string }> = ({ data, inputType }) => {
  const iconClass = "h-4 w-4 text-gray-600";
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="font-semibold mb-3 text-gray-700 flex items-center gap-1.5">
        <FileText className={iconClass} />
        Ringkasan Data
      </h4>
      <div className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div><span className="text-xs text-gray-500">Nama</span><br />{data.name}</div>
          <div><span className="text-xs text-gray-500">Kelas</span><br />{data.class}</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div><span className="text-xs text-gray-500">Jenis</span><br />{data.type}</div>
          <div><span className="text-xs text-gray-500">{inputType === "violation" ? "Detail" : "Tingkatan"}</span><br />{inputType === "violation" ? data.detail : data.level}</div>
        </div>
        <div><span className="text-xs text-gray-500">Poin</span><br /><span className={`font-medium ${inputType === "violation" ? "text-red-600" : "text-green-600"}`}>{data.point}</span></div>
      </div>
    </div>
  );
};

export default MobileSummaryCard;