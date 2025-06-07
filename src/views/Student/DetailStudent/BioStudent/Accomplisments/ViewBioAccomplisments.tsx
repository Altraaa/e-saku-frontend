import { useState } from "react";
import { MoveLeft, SquarePen, Trash2, Trophy, Calendar, Clock, Award } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ViewBioAccomplishments = () => {
    const [rowsPerPage, setRowsPerPage] = useState("10");
    const [, setCurrentPage] = useState(1);

    const handleRowsPerPageChange = (value) => {
        setRowsPerPage(value);
        setCurrentPage(1); 
    };

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <div className="flex items-center">
                <a href="/studentbio?nis" className="group">
                    <div className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 group-hover:border-green-500 group-hover:bg-green-50 transition-all">
                            <MoveLeft className="h-4 w-4" />
                        </div>
                        <span className="font-medium">Back to Student Profile</span>
                    </div>
                </a>
            </div>

            {/* Header Section with Gradient Background */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 mb-6 shadow-md">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center">
                        <div className="bg-green-600/40 p-2 rounded-lg mr-3">
                            <Trophy className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Riwayat Prestasi</h1>
                            <p className="text-gray-600 mt-1">
                                <span className="font-semibold">I Made Gerrald Wahyu Darmawan</span>
                            </p>
                        </div>
                    </div>
                    
                    {/* Total Points Card */}
                    <div className="bg-green-500 rounded-xl p-4 text-white shadow-sm min-w-[140px]">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-600/40 p-2 rounded-lg">
                                <Trophy className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">20</p>
                                <p className="text-sm text-green-100">Total Poin</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card className="rounded-xl overflow-hidden shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <Trophy className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">1</p>
                                <p className="text-sm text-gray-600">Total Prestasi</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-xl overflow-hidden shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">Jan 2025</p>
                                <p className="text-sm text-gray-600">Prestasi Terakhir</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Accomplishments Table */}
            <Card className="rounded-xl overflow-hidden shadow-sm">
                <CardHeader className="px-6 pt-4 pb-4 border-b-2 border-green-500">
                    <div className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-green-500" />
                            Riwayat Prestasi Siswa
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto p-4">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 hover:bg-gray-50 border-b-2 border-gray-200">
                                    <TableHead className="text-center font-semibold text-gray-900 py-4">No</TableHead>
                                    <TableHead className="font-semibold text-gray-900 py-4">Nama Prestasi</TableHead>
                                    <TableHead className="text-center font-semibold text-gray-900 py-4">Peringkat</TableHead>
                                    <TableHead className="text-center font-semibold text-gray-900 py-4">Tanggal Acara</TableHead>
                                    <TableHead className="text-center font-semibold text-gray-900 py-4">Penyelenggara</TableHead>
                                    <TableHead className="text-center font-semibold text-gray-900 py-4">Level Kompetisi</TableHead>
                                    <TableHead className="text-center font-semibold text-gray-900 py-4">Poin</TableHead>
                                    <TableHead className="text-center font-semibold text-gray-900 py-4">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow className="hover:bg-gray-50/50 transition-colors">
                                    <TableCell className="text-center font-medium py-4">1</TableCell>
                                    <TableCell className="font-medium py-4">
                                        Kompetisi Web Design DevFest Community Denpasar 2025
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                            Peserta
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="flex items-center gap-1 text-sm">
                                                <Calendar className="h-3 w-3 text-gray-400" />
                                                <span>20/01/2025</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <span>sampai</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm">
                                                <Calendar className="h-3 w-3 text-gray-400" />
                                                <span>23/01/2025</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                        <span className="text-gray-600">Dev Community Denpasar</span>
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                            Kota
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                                            +20
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                        <div className="flex justify-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 w-8 p-0 border-blue-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
                                                asChild
                                            >
                                                <a href="/studentbio?nis">
                                                    <SquarePen className="h-4 w-4" />
                                                </a>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                
                                {/* Empty state */}
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-12">
                                        <div className="flex flex-col items-center gap-2 text-gray-500">
                                            <Award className="h-8 w-8 text-gray-300" />
                                            <p>Tidak ada prestasi tambahan ditemukan</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                    
                    <div className="pl-6 pt-4 pb-4 flex justify-between items-center border-t">
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-500">
                                Menampilkan 1 dari 1 prestasi
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
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ViewBioAccomplishments;