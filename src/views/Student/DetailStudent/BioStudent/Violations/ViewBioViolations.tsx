import { useState } from "react";
import { MoveLeft, SquarePen, Trash2, AlertTriangle, Calendar, Filter, X, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/shared/component/DatePicker";
import { Button } from "@/components/ui/button";

const ViewBioViolations = () => {
    const [rowsPerPage, setRowsPerPage] = useState("10");
    const [, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    
    // Filter states
    const [filters, setFilters] = useState({
        violationType: "",
        followUpAction: "",
        dateFrom: "",
        dateTo: "",
        pointsMin: "",
        pointsMax: "",
        searchTerm: ""
    });

    // Sample violations data for filtering demonstration
    const [violations] = useState([
        {
            id: 1,
            type: "Cukuran rambut tidak sesuai",
            description: "Siswa berambut panjang dan tidak rapi",
            followUp: "Peringatan",
            date: "02/02/2025",
            time: "07:15",
            points: 20
        },
        {
            id: 2,
            type: "Terlambat masuk kelas",
            description: "Siswa terlambat 15 menit masuk kelas",
            followUp: "Teguran",
            date: "28/01/2025",
            time: "08:15",
            points: 10
        },
        {
            id: 3,
            type: "Seragam tidak lengkap",
            description: "Tidak memakai dasi sekolah",
            followUp: "Peringatan",
            date: "25/01/2025",
            time: "07:30",
            points: 15
        }
    ]);

    const handleRowsPerPageChange = (value: string) => {
        setRowsPerPage(value);
        setCurrentPage(1); 
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            violationType: "",
            followUpAction: "",
            dateFrom: "",
            dateTo: "",
            pointsMin: "",
            pointsMax: "",
            searchTerm: ""
        });
    };

    // Helper function to convert DD/MM/YYYY to Date object
    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return new Date(year, month - 1, day);
    };

    // Helper function to convert YYYY-MM-DD to Date object
    const parseFilterDate = (dateString) => {
        return new Date(dateString);
    };

    const hasActiveFilters = Object.values(filters).some(filter => filter !== "");

    // Filter violations based on current filters
    const filteredViolations = violations.filter(violation => {
        // Search term filter
        if (filters.searchTerm && !violation.type.toLowerCase().includes(filters.searchTerm.toLowerCase()) && 
            !violation.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
            return false;
        }
        
        // Violation type filter
        if (filters.violationType && violation.type !== filters.violationType) {
            return false;
        }
        
        // Follow-up action filter
        if (filters.followUpAction && violation.followUp !== filters.followUpAction) {
            return false;
        }
        
        // Date range filter
        if (filters.dateFrom || filters.dateTo) {
            const violationDate = parseDate(violation.date);
            
            if (filters.dateFrom) {
                const fromDate = parseFilterDate(filters.dateFrom);
                if (violationDate < fromDate) {
                    return false;
                }
            }
            
            if (filters.dateTo) {
                const toDate = parseFilterDate(filters.dateTo);
                if (violationDate > toDate) {
                    return false;
                }
            }
        }
        
        // Points range filter
        if (filters.pointsMin && violation.points < parseInt(filters.pointsMin)) {
            return false;
        }
        
        if (filters.pointsMax && violation.points > parseInt(filters.pointsMax)) {
            return false;
        }
        
        return true;
    });

    const violationTypes = [...new Set(violations.map(v => v.type))];
    const followUpActions = [...new Set(violations.map(v => v.followUp))];

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
            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 mb-6 shadow-md">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center">
                        <div className="bg-red-600/40 p-2 rounded-lg mr-3">
                            <AlertTriangle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Riwayat Pelanggaran</h1>
                            <p className="text-gray-600 mt-1">
                                <span className="font-semibold">I Made Gerrald Wahyu Darmawan</span>
                            </p>
                        </div>
                    </div>
                    
                    {/* Total Points Card */}
                    <div className="bg-red-500 rounded-xl p-4 text-white shadow-sm min-w-[140px]">
                        <div className="flex items-center gap-3">
                            <div className="bg-red-600/40 p-2 rounded-lg">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">45</p>
                                <p className="text-sm text-red-100">Total Poin</p>
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
                            <div className="bg-red-100 p-2 rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{filteredViolations.length}</p>
                                <p className="text-sm text-gray-600">Total Pelanggaran</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-xl overflow-hidden shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <Calendar className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">Feb 2025</p>
                                <p className="text-sm text-gray-600">Pelanggaran Terakhir</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Violations Table */}
            <Card className="rounded-xl overflow-hidden shadow-sm">
                <CardHeader className="px-6 pt-4 pb-4 border-b-2 border-red-500">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            <CardTitle className="text-xl font-bold text-gray-900">
                                Riwayat Pelanggaran Siswa
                            </CardTitle>
                            {hasActiveFilters && (
                                <span className="text-sm font-normal text-gray-600">
                                    ({filteredViolations.length} dari {violations.length} data)
                                </span>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                {hasActiveFilters && (
                                    <>
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                            {Object.values(filters).filter(f => f !== "").length} filter aktif
                                        </Badge>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={clearFilters}
                                            className="text-gray-600 hover:text-gray-800 h-8"
                                        >
                                            <X className="h-3 w-3 mr-1" />
                                            Clear
                                        </Button>
                                    </>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`h-8 ${showFilters ? "bg-blue-50 text-blue-600 border-blue-200" : ""}`}
                                >
                                    <Filter className="h-3 w-3 mr-1" />
                                    Filter
                                </Button>
                            </div>
                            
                            <div className="border-gray-200 pl-3">
                                <DatePicker/>
                            </div>
                        </div>
                    </div>
                    
                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-200 bg-gray-50/50 -mx-6 px-6 pb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Search */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Pencarian</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <input
                                            type="text"
                                            placeholder="Cari jenis atau deskripsi..."
                                            value={filters.searchTerm}
                                            onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Violation Type */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Jenis Pelanggaran</label>
                                    <Select
                                        value={filters.violationType}
                                        onValueChange={(value) => handleFilterChange("violationType", value)}
                                    >
                                        <SelectTrigger className="h-9">
                                            <SelectValue placeholder="Semua jenis" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Semua jenis</SelectItem>
                                            {violationTypes.map((type) => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Follow-up Action */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Tindak Lanjut</label>
                                    <Select
                                        value={filters.followUpAction}
                                        onValueChange={(value) => handleFilterChange("followUpAction", value)}
                                    >
                                        <SelectTrigger className="h-9">
                                            <SelectValue placeholder="Semua tindakan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Semua tindakan</SelectItem>
                                            {followUpActions.map((action) => (
                                                <SelectItem key={action} value={action}>{action}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Date From */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Tanggal Dari</label>
                                    <input
                                        type="date"
                                        value={filters.dateFrom}
                                        onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
                                    />
                                </div>

                                {/* Date To */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Tanggal Sampai</label>
                                    <input
                                        type="date"
                                        value={filters.dateTo}
                                        onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
                                    />
                                </div>

                                {/* Points Range */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Rentang Poin</label>
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={filters.pointsMin}
                                            onChange={(e) => handleFilterChange("pointsMin", e.target.value)}
                                            className="w-20 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
                                        />
                                        <span className="text-gray-500">-</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={filters.pointsMax}
                                            onChange={(e) => handleFilterChange("pointsMax", e.target.value)}
                                            className="w-20 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto p-4">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 hover:bg-gray-50 border-b-2 border-gray-200">
                                    <th className="text-center font-semibold text-gray-900 py-4 px-4">No</th>
                                    <th className="font-semibold text-gray-900 py-4 px-4 text-left">Jenis Pelanggaran</th>
                                    <th className="text-center font-semibold text-gray-900 py-4 px-4">Deskripsi</th>
                                    <th className="text-center font-semibold text-gray-900 py-4 px-4">Tindak Lanjut</th>
                                    <th className="text-center font-semibold text-gray-900 py-4 px-4">Tanggal & Waktu</th>
                                    <th className="text-center font-semibold text-gray-900 py-4 px-4">Poin</th>
                                    <th className="text-center font-semibold text-gray-900 py-4 px-4">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredViolations.length > 0 ? (
                                    filteredViolations.map((violation, index) => (
                                        <tr key={violation.id} className="hover:bg-gray-50/50 transition-colors border-b">
                                            <td className="text-center font-medium py-4 px-4">{index + 1}</td>
                                            <td className="font-medium py-4 px-4">
                                                {violation.type}
                                            </td>
                                            <td className="text-center py-4 px-4">
                                                <span className="text-gray-600">{violation.description}</span>
                                            </td>
                                            <td className="text-center py-4 px-4">
                                                <Badge variant="outline" className={violation.followUp === "Peringatan" 
                                                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                                    : "bg-orange-50 text-orange-700 border-orange-200"}>
                                                    {violation.followUp}
                                                </Badge>
                                            </td>
                                            <td className="text-center py-4 px-4">
                                                <div className="flex flex-col items-center gap-1">
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Calendar className="h-3 w-3 text-gray-400" />
                                                        <span>{violation.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-center py-4 px-4">
                                                <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">
                                                    {violation.points}
                                                </Badge>
                                            </td>
                                            <td className="text-center py-4 px-4">
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
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12 px-4">
                                            <div className="flex flex-col items-center gap-2 text-gray-500">
                                                <AlertTriangle className="h-8 w-8 text-gray-300" />
                                                <p>
                                                    {hasActiveFilters 
                                                        ? "Tidak ada pelanggaran yang sesuai dengan filter"
                                                        : "Tidak ada pelanggaran ditemukan"
                                                    }
                                                </p>
                                                {hasActiveFilters && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={clearFilters}
                                                        className="mt-2"
                                                    >
                                                        Reset Filter
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="pl-6 pt-4 pb-4 flex justify-between items-center border-t">
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-500">
                                Menampilkan {filteredViolations.length} dari {violations.length} siswa
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

export default ViewBioViolations;
