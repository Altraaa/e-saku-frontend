import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import {  SquarePen, Trash2 } from "lucide-react";
import { DatePicker } from "@/components/shared/component/DatePicker";

const ViewHistory = () => {
  return (
    <>
      <h1 className="text-lg font-semibold mb-2 ml-2">Urut Berdasarkan</h1>
      {/* Filter Section */}
      <div className="flex sm:flex-col sm:gap-y-3 lg:flex-row w-full justify-between items-center">
        <div className="flex sm:w-full lg:w-1/2 justify-start ml-2 gap-3 items-center">
          <Button className="bg-[#009616] text-white">Terbaru</Button>
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

          <DatePicker />
          <Button
            variant="outline"
            className="hover:bg-[#009616] hover:text-white transition-all"
          >
            Import Excel
          </Button>
        </div>
      </div>

      <Separator className="mt-5 mb-5" />

      {/* Table Section */}
      <Card className="bg-white mt-4 mx-2">
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-black text-sm">
                  No
                </TableHead>
                <TableHead className="font-bold text-black text-sm">
                  Nama
                </TableHead>
                <TableHead className="font-bold text-black text-sm">
                  Kelas
                </TableHead>
                <TableHead className="font-bold text-black text-sm">
                  Jenis Pelanggaran
                </TableHead>
                <TableHead className="font-bold text-black text-sm">
                  Deskripsi
                </TableHead>
                <TableHead className="font-bold text-black text-sm">
                  Waktu
                </TableHead>
                <TableHead className="font-bold text-black text-sm">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-center">1</TableCell>
                <TableCell>I Made Gerrald Wahyu Darmawan</TableCell>
                <TableCell>XII RPL 3</TableCell>
                <TableCell>Terlambat</TableCell>
                <TableCell>
                  Anak ini terlambat tapi dia ganteng, jadi poin pelanggaran 0
                </TableCell>
                <TableCell>16/02/2025 07.45</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-3 items-center align-middle">
                    <a href="/studentbio?nis" className="text-blue-500">
                      <SquarePen />
                    </a>
                    <button className="text-red-600">
                      <Trash2 />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default ViewHistory;
