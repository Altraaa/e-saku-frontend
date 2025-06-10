import { useState } from "react";
import { MoveLeft, SquarePen, Trash2, Trophy, Calendar, Award, Filter, X, Search } from "lucide-react";
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
import { DatePicker } from "@/components/shared/component/DatePicker";

const ViewBioAccomplishments = () => {
    const [rowsPerPage, setRowsPerPage] = useState("10");
    const [, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    
    const [filters, setFilters] = useState({
        accomplishmentType: "",
        rank: "",
        competitionLevel: "",
        organizer: "",
        dateFrom: "",
        dateTo: "",
        pointsMin: "",
        pointsMax: "",
        searchTerm: ""
    });

    // Sample 
    const [accomplishments] = useState([
        {
            id: 1,
            name: "Kompetisi Web Design DevFest Community Denpasar 2025",
            rank: "Peserta",
            dateStart: "20/01/2025",
            dateEnd: "23/01/2025",
            organizer: "Dev Community Denpasar",
            level: "Kota",
            points: 20
        },
        {
            id: 2,
            name: "Olimpiade Matematika Nasional 2024",
            rank: "Juara 3",
            dateStart: "15/12/2024",
            dateEnd: "18/12/2024",
            organizer: "Kemendikbud",
            level: "Nasional",
            points: 100
        },
        {
            id: 3,
            name: "Lomba Karya Tulis Ilmiah Remaja",
            rank: "Juara 1",
            dateStart: "10/11/2024",
            dateEnd: "12/11/2024",
            organizer: "Universitas Udayana",
            level: "Provinsi",
            points: 75
        }
    ]);

    const handleRowsPerPageChange = (value) => {
        setRowsPerPage(value);
        setCurrentPage(1); 
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            accomplishmentType: "",
            rank: "",
            competitionLevel: "",
            organizer: "",
            dateFrom: "",
            dateTo: "",
            pointsMin: "",
            pointsMax: "",
            searchTerm: ""
        });
    };

    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return new Date(year, month - 1, day);
    };

    const parseFilterDate = (dateString) => {
        return new Date(dateString);
    };

    const hasActiveFilters = Object.values(filters).some(filter => filter !== "");

    const filteredAccomplishments = accomplishments.filter(accomplishment => {
        if (filters.searchTerm && !accomplishment.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) && 
            !accomplishment.organizer.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
            return false;
        }
        
        if (filters.rank && accomplishment.rank !== filters.rank) {
            return false;
        }
        
        if (filters.competitionLevel && accomplishment.level !== filters.competitionLevel) {
            return false;
        }
        
        if (filters.organizer && accomplishment.organizer !== filters.organizer) {
            return false;
        }
        
        if (filters.dateFrom || filters.dateTo) {
            const accomplishmentDate = parseDate(accomplishment.dateStart);
            
            if (filters.dateFrom) {
                const fromDate = parseFilterDate(filters.dateFrom);
                if (accomplishmentDate < fromDate) {
                    return false;
                }
            }
            
            if (filters.dateTo) {
                const toDate = parseFilterDate(filters.dateTo);
                if (accomplishmentDate > toDate) {
                    return false;
                }
            }
        }
        
        if (filters.pointsMin && accomplishment.points < parseInt(filters.pointsMin)) {
            return false;
        }
        
        if (filters.pointsMax && accomplishment.points > parseInt(filters.pointsMax)) {
            return false;
        }
        
        return true;
    });

    const ranks = [...new Set(accomplishments.map(a => a.rank))];
    const competitionLevels = [...new Set(accomplishments.map(a => a.level))];
    const organizers = [...new Set(accomplishments.map(a => a.organizer))];

    return (
        <div className="space-y-6">
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
                    
                    <div className="bg-green-500 rounded-xl p-4 text-white shadow-sm min-w-[140px]">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-600/40 p-2 rounded-lg">
                                <Trophy className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">195</p>
                                <p className="text-sm text-green-100">Total Poin</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card className="rounded-xl overflow-hidden shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <Trophy className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{filteredAccomplishments.length}</p>
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
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-green-500" />
                            <CardTitle className="text-xl font-bold text-gray-900">
                                Riwayat Prestasi Siswa
                            </CardTitle>
                            {hasActiveFilters && (
                                <span className="text-sm font-normal text-gray-600">
                                    ({filteredAccomplishments.length} dari {accomplishments.length} data)
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

                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-200 bg-gray-50/50 -mx-6 px-6 pb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Pencarian</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <input
                                            type="text"
                                            placeholder="Cari nama prestasi atau penyelenggara..."
                                            value={filters.searchTerm}
                                            onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Peringkat</label>
                                    <Select
                                        value={filters.rank}
                                        onValueChange={(value) => handleFilterChange("rank", value)}
                                    >
                                        <SelectTrigger className="h-9">
                                            <SelectValue placeholder="Semua peringkat" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Semua peringkat</SelectItem>
                                            {ranks.map((rank) => (
                                                <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Level Kompetisi</label>
                                    <Select
                                        value={filters.competitionLevel}
                                        onValueChange={(value) => handleFilterChange("competitionLevel", value)}
                                    >
                                        <SelectTrigger className="h-9">
                                            <SelectValue placeholder="Semua level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Semua level</SelectItem>
                                            {competitionLevels.map((level) => (
                                                <SelectItem key={level} value={level}>{level}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Penyelenggara</label>
                                    <Select
                                        value={filters.organizer}
                                        onValueChange={(value) => handleFilterChange("organizer", value)}
                                    >
                                        <SelectTrigger className="h-9">
                                            <SelectValue placeholder="Semua penyelenggara" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Semua penyelenggara</SelectItem>
                                            {organizers.map((organizer) => (
                                                <SelectItem key={organizer} value={organizer}>{organizer}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Tanggal Dari</label>
                                    <input
                                        type="date"
                                        value={filters.dateFrom}
                                        onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Tanggal Sampai</label>
                                    <input
                                        type="date"
                                        value={filters.dateTo}
                                        onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
                                    />
                                </div>

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
                                {filteredAccomplishments.length > 0 ? (
                                    filteredAccomplishments.map((accomplishment, index) => (
                                        <TableRow key={accomplishment.id} className="hover:bg-gray-50/50 transition-colors">
                                            <TableCell className="text-center font-medium py-4">{index + 1}</TableCell>
                                            <TableCell className="font-medium py-4">
                                                {accomplishment.name}
                                            </TableCell>
                                            <TableCell className="text-center py-4">
                                                <Badge variant="outline" className={
                                                    accomplishment.rank.includes("Juara") 
                                                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                                        : "bg-blue-50 text-blue-700 border-blue-200"
                                                }>
                                                    {accomplishment.rank}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center py-4">
                                                <div className="flex flex-col items-center gap-1">
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Calendar className="h-3 w-3 text-gray-400" />
                                                        <span>{accomplishment.dateStart}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                                        <span>sampai</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Calendar className="h-3 w-3 text-gray-400" />
                                                        <span>{accomplishment.dateEnd}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center py-4">
                                                <span className="text-gray-600">{accomplishment.organizer}</span>
                                            </TableCell>
                                            <TableCell className="text-center py-4">
                                                <Badge variant="outline" className={
                                                    accomplishment.level === "Nasional" 
                                                        ? "bg-red-50 text-red-700 border-red-200"
                                                        : accomplishment.level === "Provinsi"
                                                        ? "bg-orange-50 text-orange-700 border-orange-200"
                                                        : "bg-purple-50 text-purple-700 border-purple-200"
                                                }>
                                                    {accomplishment.level}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center py-4">
                                                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                                                    +{accomplishment.points}
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
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-12">
                                            <div className="flex flex-col items-center gap-2 text-gray-500">
                                                <Award className="h-8 w-8 text-gray-300" />
                                                <p>
                                                    {hasActiveFilters 
                                                        ? "Tidak ada prestasi yang sesuai dengan filter"
                                                        : "Tidak ada prestasi ditemukan"
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
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    
                    <div className="pl-6 pt-4 pb-4 flex justify-between items-center border-t">
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-500">
                                Menampilkan {filteredAccomplishments.length} dari {accomplishments.length} prestasi
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