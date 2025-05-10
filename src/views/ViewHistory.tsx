import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
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

import { Separator } from "@/components/ui/separator";
import {  Download, Search, SquarePen, Trash2 } from "lucide-react";
import { DatePicker } from "@/components/shared/component/DatePicker";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

const ViewHistory = () => {
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

  return (
    <>
      {/* <h1 className="text-lg font-semibold mb-2 ml-2">Urut Berdasarkan</h1> */}
      {/* Filter Section */}
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
            variant="outline"
            className="hover:bg-[#009616] hover:text-white transition-all"
          ><Download/>
            Import Excel
          </Button>
        </div>
      </div>

      {/* <Separator className="mt-5 mb-5" /> */}

      {/* Table Section */}
      <div>
        <Card className="rounded-xl overflow-hidden">
          <div className="px-6 pt-4 pb-2">
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
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="w-12 text-center px-6 font-medium text-black">No</TableHead>
                  <TableHead className="text-center font-medium text-black">NIS</TableHead>
                  <TableHead className="text-center font-medium text-black">Nama</TableHead>
                  <TableHead className="text-center ffont-medium text-black">Kelas</TableHead>
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
            <div className="text-sm text-gray-500">
              Menampilkan <span className="text-green-500 font-medium">{filteredViolationData.length}</span> dari <span className="text-green-500 font-normal">{violationData.length}</span> siswa
            </div>
            <div className="pr-6 flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="text-gray-700 rounded-lg"
              >
                Sebelumnya
              </Button>
              <Button 
                variant="default" 
                size="sm"
                className="bg-green-500 hover:bg-green-600 h-8 w-8 p-0 rounded-full"
              >
                1
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-gray-700 rounded-lg"
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default ViewHistory;
