import { MoveLeft, SquarePen, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

const ViewBioAccomplisments = () => {
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
                        <h1>Prestasi <span className="text-green-500">I Made Gerrald Wahyu Darmawan</span></h1>
                    </div>
                    <div>
                        <h1 className="px-5 py-1.5 bg-green-500 font-semibold text-white rounded-md w-fit text-2xl mr-5">20 Poin</h1>
                    </div>
                </div>

                <Table >
                    <TableHeader>
                        <TableRow>
                            <TableCell className="text-center">No</TableCell>
                            <TableCell>Achievments Name</TableCell>
                            <TableCell className="text-center">Rank</TableCell>
                            <TableCell className="text-center">Event Date</TableCell>
                            <TableCell className="text-center">Orginazers</TableCell>
                            <TableCell className="text-center">Competition Level</TableCell>
                            <TableCell className="text-center">Points</TableCell>
                            <TableCell className="text-center">Actions</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="text-center">1</TableCell>
                            <TableCell>Kompetisi Web Design DevFest Community Denpasar 2025</TableCell>
                            <TableCell className="text-center">Peserta</TableCell>
                            <TableCell className="text-center">20/01/2025 - 23/01/2025</TableCell>
                            <TableCell className="text-center">Dev Community Denpasar</TableCell>
                            <TableCell className="text-center">Kota</TableCell>
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

export default ViewBioAccomplisments;
