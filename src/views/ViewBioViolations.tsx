import { MoveLeft, SquarePen, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

const ViewBioViolations = () => {
    return (
      <>
        <div className="m-1">
                <a href="/studentbio?nis">
                    <div className="flex gap-2">
                        <MoveLeft />
                        <h1>Back</h1>
                    </div>
                </a>
                <div className="mt-8 flex flex-col lg:flex-row gap-2 justify-between mb-6">
                    <div className="text-3xl font-bold">
                        <h1>Pelanggaran <span className="text-red-500">I Made Gerrald Wahyu Darmawan</span></h1>
                    </div>
                    <div>
                        <h1 className="px-5 py-1.5 bg-red-500 text-white font-semibold rounded-md w-fit text-2xl mr-5">20 Poin</h1>
                    </div>
                </div>

                <Table >
                    <TableHeader>
                        <TableRow>
                            <TableCell className="text-center">No</TableCell>
                            <TableCell>Type of Violation</TableCell>
                            <TableCell className="text-center">Description</TableCell>
                            <TableCell className="text-center">Follow-up</TableCell>
                            <TableCell className="text-center">Date and Time</TableCell>
                            <TableCell className="text-center">Points</TableCell>
                            <TableCell className="text-center">Actions</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="text-center">1</TableCell>
                            <TableCell>Cukuran rambut tidak sesuai</TableCell>
                            <TableCell className="text-center">Siswa berambut panjang dan tidak rapi</TableCell>
                            <TableCell className="text-center">Peringatan</TableCell>
                            <TableCell className="text-center">02/02/2025 07:15</TableCell>
                            <TableCell className="text-center">20</TableCell>
                            <TableCell className="text-center">
                                <div className="flex justify-center gap-3 items-center align-middle">
                                    <a href="/studentbio?nis" className="text-blue-500"><SquarePen/></a>
                                    <button className="text-red-600"><Trash2/></button>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

            </div>
      </>
    );
  };
  
  export default ViewBioViolations;
  