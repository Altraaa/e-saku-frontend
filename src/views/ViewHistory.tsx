import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Download, History } from "lucide-react";
import { DatePicker } from "@/components/shared/component/DatePicker";
import { useEffect, useState } from "react";
import { ViolationHistoryTable } from "@/views/ViolationHistoryTable";
import { AccomplishmentHistoryTable } from "@/views/AccomplishmentHistoryTable";
import { useClassroomByTeacherId } from "@/config/Api/useClasroom";
import { IClassroom } from "@/config/Models/Classroom";

const HistorySkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center mb-2">
          <div className="bg-gray-200 p-2 rounded-lg mr-3 w-10 h-10"></div>
          <div className="w-48 h-8 bg-gray-200 rounded-md"></div>
        </div>
        <div className="w-64 h-4 bg-gray-200 rounded-md"></div>
      </div>

      <div className="flex sm:flex-col sm:gap-y-3 lg:flex-row w-full justify-between items-center mb-6">
        <div className="flex sm:w-full lg:w-full justify-between ml-2 mb-5 gap-3 items-center">
          <div className="flex gap-5">
            <div className="w-[180px] h-10 bg-gray-200 rounded-lg"></div>
            <div className="w-[180px] h-10 bg-gray-200 rounded-lg"></div>
            <div className="w-[180px] h-10 bg-gray-200 rounded-lg"></div>
          </div>

          <div className="w-36 h-10 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      <Card className="rounded-xl overflow-hidden">
        <div className="px-6 pt-4 pb-4 border-b-2 border-green-500">
          <div className="flex flex-row items-center justify-between space-y-0">
            <div className="w-48 h-8 bg-gray-200 rounded-md"></div>
            <div className="w-72 h-10 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
        <div className="overflow-x-auto p-4">
          <div className="h-10 w-full bg-gray-200 rounded-md mb-4"></div>
          
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 w-full bg-gray-200 rounded-md mb-3"></div>
          ))}
        </div>
        
        <div className="px-6 py-4 flex justify-between items-center border-t">
          <div className="flex items-center space-x-4">
            <div className="w-40 h-6 bg-gray-200 rounded-md"></div>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-8 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
            <div className="w-32 h-6 bg-gray-200 rounded-md"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const ViewHistory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHistory, setSelectedHistory] = useState("violationhistory");
  const [classType, setClassType] = useState<string>("");
  const { data: classrooms } = useClassroomByTeacherId();
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [studentName, setStudentName] = useState<string>("");
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleHistoryChange = (value : string) => {
        setSelectedHistory(value);
  };

  if (isLoading) {
    return <HistorySkeleton />;
  }

  return (
    <>
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center mb-2">
          <div className="bg-green-600/40 p-2 rounded-lg mr-3">
            <History className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Histori</h1>
        </div>
        <p className="text-gray-600 max-w-3xl">
          Lihat dan kelola riwayat aktivitas siswa
        </p>
      </div>

      <div className="flex sm:flex-col sm:gap-y-3 lg:flex-row w-full justify-between items-center">
        <div className="flex sm:w-full w-full justify-between mb-5 gap-3 items-center">
          <div className="flex gap-5">
            <Select onValueChange={handleHistoryChange} value={selectedHistory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih Histori" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="violationhistory">Histori Pelanggaran</SelectItem>
                  <SelectItem value="accomplishmenthistory">Histori Prestasi</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          
            <Select
              value={classType}
              onValueChange={(value) => {
                setClassType(value);
                const selectedClass = classrooms?.find(
                  (c: IClassroom) => c.name === value
                );
                setSelectedClassId(selectedClass?.id || null);
                setStudentName("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Kelas" />
              </SelectTrigger>
              <SelectContent>
                {classrooms?.map((classroom: IClassroom) => (
                  <SelectItem key={classroom.id} value={classroom.name}>
                        {classroom.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DatePicker/>
          </div>

          <Button
            variant="default"
            className="hover:bg-[#009616] hover:text-white transition-all"
          ><Download/>
            Import Excel
          </Button>
        </div>
      </div>
      <div>
        {selectedHistory === "violationhistory" && (
          <ViolationHistoryTable />
        )}

        {selectedHistory === "accomplishmenthistory" && (
          <AccomplishmentHistoryTable />
        )}
      </div>
    </>
  );
};

export default ViewHistory;