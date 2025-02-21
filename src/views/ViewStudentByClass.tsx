import { Search, MoveLeft, SquarePen, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

const ViewStudentByClass = () => {
    return (
        <>
            <div className="m-1">
                <a href="/student">
                    <div className="flex gap-2">
                        <MoveLeft />
                        <h1>Back</h1>
                    </div>
                </a>

                <div className="flex flex-col items-start gap-2 lg:flex-row lg:justify-between lg:items-center px-6 py-4 mt-2">
                    <div>
                        <h1 className="text-3xl font-bold text-green-500">
                            XII RPL 3
                        </h1>
                        <p className="text-xl ">
                            Diampu oleh :{" "}
                            <span className="font-semibold">
                                Elisabet Ni Nyoman Rusmiati, S.Pd.
                            </span>
                        </p>
                    </div>
                    <div className="flex gap-4 items-center p-3 bg-white rounded-md">
                        <label htmlFor="searchName">
                            <Search className="size-6" />
                        </label>
                        <input
                            type="text"
                            id="searchName"
                            placeholder="Search"
                            className="w-72 text-sm outline-none placeholder:text-xs"
                        />
                    </div>
                </div>

                <Separator className="mt-5 mb-5" />

                <Card className="bg-white mt-4 mx-2">
                    <CardContent className="pt-4">

                        <Table className="p-2 overflow-x-auto">
                            <TableHeader>
                                <TableRow>
                                    <TableCell className="text-center font-bold">No</TableCell>
                                    <TableCell className="text-center font-bold">NIS</TableCell>
                                    <TableCell className=" font-bold">Name</TableCell>
                                    <TableCell className="text-center font-bold">
                                        Violation Points
                                    </TableCell>
                                    <TableCell className="text-center font-bold">
                                        Accomplishment Points
                                    </TableCell>
                                    <TableCell className="text-center font-bold">
                                        Total Points
                                    </TableCell>
                                    <TableCell className="text-center font-bold">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="text-center">1</TableCell>
                                    <TableCell className="text-center">30688</TableCell>
                                    <TableCell>
                                        <a
                                            href="/studentbio?nis"
                                            className="hover:underline transition-all duration-300"
                                        >
                                            I Made Gerrald Wahyu Darmawan
                                        </a>
                                    </TableCell>
                                    <TableCell className="text-center">20</TableCell>
                                    <TableCell className="text-center">20</TableCell>
                                    <TableCell className="text-center">0</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center gap-3 items-center align-middle">
                                            <a
                                                href="/studentbio/edit?nis"
                                                className="text-blue-500"
                                            >
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
            </div>
        </>
    );
};
export default ViewStudentByClass;
