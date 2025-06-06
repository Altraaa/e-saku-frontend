import { Card, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select"
import { ChevronLeft, ChevronRight, Search, SquarePen, Trash2 } from "lucide-react"
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button";

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

export const ViolationHistoryTable = () => {
    const [rowsPerPage, setRowsPerPage] = useState("10");
    const [currentPage, setCurrentPage] = useState(1);
    const [displayedViolationData, setDisplayedViolationData] = useState(violationData);
    const [searchText, setSearchText] = useState("");

    

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

    return (
        <Card className="rounded-xl overflow-hidden">
          <div className="px-6 pt-4 pb-4 border-b-2 border-green-500">
            <div className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xl w-full font-bold text-gray-900">
                Histori Pelanggaran
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
            <Table className="">
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
    )
};