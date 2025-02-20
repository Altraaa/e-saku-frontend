import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Search, SquarePen, Trash2 } from "lucide-react";

const ViewHistory = () => {
  return (
    <>
      <h1 className="text-lg font-semibold mb-2 ml-2">Urut Berdasarkan</h1>
      {/* Filter Section */}
      <div className="flex sm:flex-col sm:gap-y-3 lg:flex-row w-full justify-between items-center">
        <div className="flex sm:w-full lg:w-1/2 justify-start ml-2 gap-3 items-center">
          <Button className="bg-[#009616] text-white">Terbaru</Button>
          <select className="py-2 px-4 border rounded focus:outline-none focus:ring-1 focus:ring-[#009616] hover:border-[#009616]">
            <option value="" disabled selected>
              Kelas
            </option>
            <option value="XII RPL 3">XII RPL 3</option>
          </select>
          <Input
            type="date"
            className="border rounded focus:ring-1 focus:ring-[#009616]"
          />
          <Button
            variant="outline"
            className="hover:bg-[#009616] hover:text-white transition-all"
          >
            Import Excel
          </Button>
        </div>

        <div className="flex sm:w-full sm:justify-start lg:w-1/2 lg:justify-end gap-2">
          <Button variant="ghost">
            <Search className="text-gray-600" />
          </Button>
          <Input
            placeholder="Search student"
            className="hidden sm:block w-3/4"
          />
        </div>
      </div>

      <Separator className="mt-5 mb-5" />

      {/* Table Section */}
      <Card className="bg-white mt-4 mx-2">
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-black text-sm">No</TableHead>
                <TableHead className="font-bold text-black text-sm">Nama</TableHead>
                <TableHead className="font-bold text-black text-sm">Kelas</TableHead>
                <TableHead className="font-bold text-black text-sm">Jenis Pelanggaran</TableHead>
                <TableHead className="font-bold text-black text-sm">Deskripsi</TableHead>
                <TableHead className="font-bold text-black text-sm">Waktu</TableHead>
                <TableHead className="font-bold text-black text-sm">Aksi</TableHead>
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


