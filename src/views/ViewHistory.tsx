import { Button } from "@/components/ui/button";
import { Card, CardContent,  } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileSpreadsheet, Search } from "lucide-react";
// import { TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";

const ViewHistory = () => {
  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold pl-2 pb-5">History</h1>
        <p className="text-xl font-semibold pl-2 pb-2">Urut Berdasarkan</p>
      </div>

      <div className="flex sm:flex-col sm:gap-y-3 lg:flex-row w-full justify-between items-center">
        <div className="flex sm:w-full lg:w-1/2 justify-start ml-2 gap-3 items-center">
          <div className="bg-[#009616] py-2 px-4 rounded text-white">
            <p>Terbaru</p>
          </div>
          <div className="">
            <select className="flex justify-center items-center py-2 px-4 border-2 rounded focus:outline-none focus:ring-1 focus:ring-[#009616] hover:border-[#009616]" name="" id="">
              <option value="" disabled selected>Kelas</option>
              <option value="">XII RPL 3</option>
              <option value="">XII RPL 3</option>
              <option value="">XII RPL 3</option>
            </select>
          </div>
          <div className="border-2 rounded hover:border-[#009616]">
              <input className="rounded py-1.5 px-4 focus:outline-none focus:ring-1 focus:ring-[#009616]" type="date" name="" id="" />
          </div>
          <div className="flex gap-3 border-2 hover:bg-[#009616] hover:border-[#009616] hover:text-white hover:transition-all py-2 px-5 rounded text-black">
            <FileSpreadsheet/>
            <button>Import Excel</button>
          </div>
        </div>

      <div className="flex sm:w-full sm:justify-start lg:w-1/2 lg:justify-end">
        <Button variant="ghost" className="text-gray-600" onClick={() => {}}>
          <Search />
        </Button>
        <Input placeholder="Search student" className="hidden sm:block w-3/4" />
        </div>
      </div>

      <div>
      <Card className="bg-white mt-8 mx-2">
          <CardContent className="pt-4">
            <table className="w-full overflow-x-scroll">
              <thead className="text-left gap-10">
                <th className="px-3 py-3">No</th>
                <th>Nama</th>
                <th>Kelas</th>
                <th>Jenis Pelanggaran</th>
                <th>Deskripsi</th>
                <th>Waktu</th>
                <th>Aksi</th>
              </thead>
              <tr className="">
                <td className="text-center">1</td>
                <td>I Made Gerrald Wahyu Darmawan</td>
                <td>XII RPL 3</td>
                <td>Terlambat</td>
                <td>Anak ini terlambat tapi dia ganteng, jadi poin pelanggaran 0</td>
                <td>16/02/2025 07.45</td>
                <div>
                <td>Edit</td>
                <td>Hapus</td>
                </div>
              </tr>
            </table>
          </CardContent>
        </Card>
      </div>


    </>
  );
};

export default ViewHistory;