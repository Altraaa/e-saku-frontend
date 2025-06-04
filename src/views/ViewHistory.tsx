import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ChevronLeft, ChevronRight, Download, Search, SquarePen, Trash2, History } from "lucide-react";
import { DatePicker } from "@/components/shared/component/DatePicker";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

const violationData = [
  {
    id: 1,
    nis: "30688",
    name: "I Made Gerrald Wahyu Darmawan",
    class: "XII RPL 3",
    violationType: "Rambut Panjang",
    violationDateAndTime: "07/02/2025  07:31",
  },
  {
    id: 2,
    nis: "30890",
    name: "Putu Berliana Suardana Putri",
    class: "XII MM 1",
    violationType: "Mencuri hatiku",
    violationDateAndTime: "07/02/2025  07:38",
  },
  {
    id: 3,
    nis: "30686",
    name: "I Made Dio Kartiana Putra",
    class: "XII RPL 3",
    violationType: "Suka sama Shandy",
    violationDateAndTime: "07/02/2025  08:31",
  }
];

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
  
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedViolationData, setDisplayedViolationData] = useState(violationData);

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const timeoutId = setTimeout(() => {
      setSearchText(value);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, []); 

  const filteredViolationData = useMemo(() => {
    return violationData.filter(student => 
      searchText === "" || 
      student.name.toLowerCase().includes(searchText.toLowerCase()) ||
      student.nis.includes(searchText) ||
      student.class.toLowerCase().includes(searchText.toLowerCase()) ||
      student.violationType.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText]);

  useEffect(() => {
    const totalPages = Math.ceil(filteredViolationData.length / parseInt(rowsPerPage));
    
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
    
    const startIndex = (currentPage - 1) * parseInt(rowsPerPage);
    const endIndex = startIndex + parseInt(rowsPerPage);
    setDisplayedViolationData(filteredViolationData.slice(startIndex, endIndex));
  }, [filteredViolationData, currentPage, rowsPerPage]);
    
  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return <HistorySkeleton />;
  }

  return (
    <>
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 mb-6 shadow-md">
        <div className="flex items-center mb-2">
          <div className="bg-green-600/40 p-2 rounded-lg mr-3">
            <History className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Histori</h1>
        </div>
        <p className="text-gray-600 max-w-3xl">
          Lihat dan kelola riwayat pelanggaran siswa
        </p>
      </div>

      <div className="flex sm:flex-col sm:gap-y-3 lg:flex-row w-full justify-between items-center">
        <div className="flex sm:w-full lg:w-full justify-between ml-2 mb-5 gap-3 items-center">
          <div className="flex gap-5">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Urut Berdasarkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>All Class</SelectLabel>
                  <SelectItem value="terbaru">Terbaru</SelectItem>
                  <SelectItem value="terlama">Terlama</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>All Class</SelectLabel>
                  <SelectItem value="xiirpl3">XII RPL 3</SelectItem>
                  <SelectItem value="xiirpl2">XII RPL 2</SelectItem>
                  <SelectItem value="xiirpl1">XII RPL 1</SelectItem>
                </SelectGroup>
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
        <Card className="rounded-xl overflow-hidden">
          <div className="px-6 pt-4 pb-4 border-b-2 border-green-500">
            <div className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xl w-full font-bold text-gray-900">
                Data Pelanggaran
              </CardTitle>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={searchText}
                  onChange={handleSearchChange}
                  placeholder="Cari siswa..."
                  className="pl-9 bg-white border-gray-200 w-auto rounded-lg"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="w-12 text-center px-6 font-medium text-black">No</TableHead>
                  <TableHead className="text-center font-medium text-black">NIS</TableHead>
                  <TableHead className="text-center font-medium text-black">Nama</TableHead>
                  <TableHead className="text-center font-medium text-black">Kelas</TableHead>
                  <TableHead className="text-center hidden sm:table-cell font-medium text-black">Jenis Pelanggaran</TableHead>
                  <TableHead className="text-center font-medium text-black">Tanggal dan Waktu</TableHead>
                  <TableHead className="text-center font-medium text-black">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredViolationData.map((student) => (
                  <TableRow 
                    key={student.id} 
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell className="text-center px-6 font-normal">{student.id}</TableCell>
                    <TableCell className="text-center font-normal">{student.nis}</TableCell>
                    <TableCell className="text-center font-normal">{student.name}</TableCell>
                    <TableCell className="text-center font-normal">{student.class}</TableCell>
                    <TableCell className="text-center hidden sm:table-cell font-normal">{student.violationType}</TableCell>
                    <TableCell className="text-center font-normal">{student.violationDateAndTime}</TableCell>
                    <TableCell className="flex justify-center gap-3">
                      <a href=""><SquarePen className="text-green-500 size-5"/></a>
                      <a href=""><Trash2 className="text-[#FF0000] size-5"/></a>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredViolationData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Tidak ada data yang sesuai dengan pencarian
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="pl-6 pt-4 pb-4 flex justify-between items-center border-t">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Menampilkan {displayedViolationData.length} dari {filteredViolationData.length} siswa
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Rows:</span>
                <Select
                  value={rowsPerPage}
                  onValueChange={handleRowsPerPageChange}
                >
                  <SelectTrigger className="w-16 h-8 border-gray-200 focus:ring-green-400 rounded-lg">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent className="w-16 min-w-[4rem]">
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="pr-6 flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                className="text-gray-700 rounded-lg h-8 w-8 hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="text-sm text-gray-600">
                Page {currentPage} of {Math.max(1, Math.ceil(filteredViolationData.length / parseInt(rowsPerPage)))}
              </div>
              
              <Button 
                variant="outline" 
                size="icon"
                className="text-gray-700 rounded-lg h-8 w-8 hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredViolationData.length / parseInt(rowsPerPage))))}
                disabled={currentPage >= Math.ceil(filteredViolationData.length / parseInt(rowsPerPage))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default ViewHistory;