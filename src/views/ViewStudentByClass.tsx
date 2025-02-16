import MainLayout from "@/components/layouts/MainLayout";
import { Search, MoveLeft, SquarePen, Trash2} from "lucide-react";
import {
      Table,
      TableBody,
      TableCell,
      TableHeader,
      TableRow,
    } from "@/components/ui/table";

const ViewStudentByClass = () => {
      return(
            <MainLayout>
                  <div className="m-3">
                        <div className="flex gap-2">
                              <MoveLeft/>
                              <h1>Back</h1>
                        </div>

                        <div className="flex flex-col items-start gap-2 lg:flex-row lg:justify-between lg:items-center px-6 py-4 mt-2">
                              <div>
                                    <h1 className="text-3xl font-bold text-green-500">Elisabet Ni Nyoman Rusmiati, S.Pd</h1>
                                    <p className="text-xl ">Kelas yang diampu :</p>
                              </div>
                              <div className="flex gap-4 items-center p-3 bg-white rounded-md">
                                    <label htmlFor="searchName"><Search className="size-6" /></label>
                                    <input type="text" id="searchName" placeholder="Search by students name" className="w-72 text-sm outline-none placeholder:text-xs"/>
                              </div>
                        </div>

                        <div className="h-[2px] bg-black w-full my-2"></div>
                        <div>
                              <Table className="p-2">
                                    <TableHeader>
                                          <TableRow>
                                                <TableCell className="text-center">No</TableCell>
                                                <TableCell className="text-center">NIS</TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell className="text-center">Violation Points</TableCell>
                                                <TableCell className="text-center">Accomplishment Points</TableCell>
                                                <TableCell className="text-center">Total Points</TableCell>
                                                <TableCell className="text-center">Actions</TableCell>
                                          </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                          <TableRow>
                                                <TableCell className="text-center">1</TableCell>
                                                <TableCell className="text-center">30688</TableCell>
                                                <TableCell>I Made Gerrald Wahyu Darmawan</TableCell>
                                                <TableCell className="text-center">20</TableCell>
                                                <TableCell className="text-center">20</TableCell>
                                                <TableCell className="text-center">0</TableCell>
                                                <TableCell className="justify-center flex gap-3">
                                                      <button className="text-blue-500"><SquarePen/></button>
                                                      <button className="text-red-600"><Trash2/></button>
                                                </TableCell>
                                          </TableRow>
                                    </TableBody>
                              </Table>
                        </div>
                  </div>
            </MainLayout>
      );
}
export default ViewStudentByClass;