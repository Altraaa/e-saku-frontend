import { useState, useEffect, useCallback, useMemo, ChangeEvent } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Layers,
  School,
  Search,
  Users,
  AlertTriangle,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTeacherById } from "@/config/Api/useTeacher";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const chartData = [
  { day: "Monday", violations: 20, achievements: 13 },
  { day: "Tuesday", violations: 30, achievements: 22 },
  { day: "Wednesday", violations: 25, achievements: 10 },
  { day: "Thursday", violations: 10, achievements: 7 },
  { day: "Friday", violations: 40, achievements: 20 },
];

const violationData = [
  {
    id: 1,
    nis: "30688",
    name: "I Made Gerrald Wahyu Darmawan",
    class: "XII RPL 3",
    violationType: "Rambut Panjang",
    violationPoint: 2,
    totalPoint: 14,
  },
  {
    id: 2,
    nis: "30890",
    name: "Putu Berliana Suardana Putri",
    class: "XII MM 1",
    violationType: "Mencuri hatiku",
    violationPoint: 10,
    totalPoint: 69,
  },
  {
    id: 3,
    nis: "30686",
    name: "I Made Dio Kartiana Putra",
    class: "XII RPL 3",
    violationType: "Suka sama Shandy",
    violationPoint: 10,
    totalPoint: 20,
  },
];

const leaderboardData = [
  { rank: 1, name: "Tomas Ibrahim", points: 60 },
  { rank: 2, name: "I Wayan Purnayasa", points: 50 },
  { rank: 3, name: "Cristiyan Mikha Adi Putra", points: 48 },
];

interface PayloadItem {
  value: number;
  name: string;
  color: string;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: PayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-lg">
        <p className="font-bold text-gray-800 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }}></div>
            <p className="text-sm">
              <span className="font-medium">{entry.name}:</span> {entry.value}
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="rounded-xl overflow-hidden">
            <CardHeader className="p-4">
              <div className="flex justify-between items-start mb-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-12 h-6 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-40" />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2">
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    </div>
  );
};

const ViewDashboard = () => {
  const [teacherName, setTeacherName] = useState("");
  const [timeRange, setTimeRange] = useState("weekly");
  const [activityType, setActivityType] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedViolationData, setDisplayedViolationData] = useState(violationData);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setCurrentBreakpoint('xs');
      else if (width < 768) setCurrentBreakpoint('sm');
      else if (width < 1024) setCurrentBreakpoint('md');
      else if (width < 1280) setCurrentBreakpoint('lg');
      else setCurrentBreakpoint('xl');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const teacherId = localStorage.getItem('teacher_id');
  const { data: teacher, isLoading: teacherLoading } = useTeacherById(teacherId ? Number(teacherId) : 0);

  useEffect(() => {
    if (teacher) {
      setTeacherName(teacher.name);
    }
  }, [teacher]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const timeoutId = setTimeout(() => {
      setSearchText(value);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, []);

  const filteredViolationData = useMemo(() => {
    return violationData.filter(student =>
      searchText === "" ||
      student.name.toLowerCase().includes(searchText.toLowerCase()) ||
      student.nis.includes(searchText) ||
      student.class.toLowerCase().includes(searchText.toLowerCase()) ||
      student.violationType.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText]);

  useEffect(() => {
    const totalPages = Math.ceil(filteredViolationData.length / parseInt(rowsPerPage));

    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }

    const startIndex = (currentPage - 1) * parseInt(rowsPerPage);
    const endIndex = startIndex + parseInt(rowsPerPage);
    setDisplayedViolationData(filteredViolationData.slice(startIndex, endIndex));
  }, [filteredViolationData, currentPage, rowsPerPage]);

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(value);
    setCurrentPage(1); 
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-2 mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight">
          Hi🙌, <span className='text-green-500'>{teacherName}</span>
        </h1>
        <p className="text-sm text-bold sm:text-xl lg:text-2xl sm:leading-tight">
          Selamat datang di website E-Saku Siswa😊
        </p>
      </div>

      {/* Grid for Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-green-500 p-5 text-white">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-green-600/40 p-2 rounded-lg">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <Badge variant="secondary" className="bg-white text-red-500 rounded-full">
                  <ArrowDown className="h-3 w-3 mr-1"/>
                  <span>5%</span>
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold">800</p>
                <p className="text-sm text-white/80">Total Poin Pelanggaran</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-green-500 p-5 text-white">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-green-600/40 p-2 rounded-lg">
                  <Users className="h-6 w-6" />
                </div>
                <Badge variant="secondary" className="bg-white text-green-600 rounded-full">
                  <ArrowUp className="h-3 w-3 mr-1"/>
                  <span>10%</span>
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold">40</p>
                <p className="text-sm text-white/80">Total Siswa Melanggar</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-green-500 p-5 text-white">
              <div className="flex items-start mb-4">
                <div className="bg-green-600/40 p-2 rounded-lg">
                  <School className="h-6 w-6" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold">XII RPL 3</p>
                <p className="text-sm text-white/80">Kelas Pelanggar Terbanyak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-green-500 p-5 text-white">
              <div className="flex items-start mb-4">
                <div className="bg-green-600/40 p-2 rounded-lg">
                  <Layers className="h-6 w-6" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold">XII</p>
                <p className="text-sm text-white/80">Tingkat Pelanggar Terbanyak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid for Main Content (Comparisons & Leaderboard) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart Card */}
        <div className="col-span-1 lg:col-span-2">
          <Card className="rounded-xl overflow-hidden">
            <CardHeader className="border-b">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">
                  Perbandingan Aktivitas Siswa
                </CardTitle>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
                  <Select value={activityType} onValueChange={setActivityType}>
                    <SelectTrigger className="border-green-500 focus:ring-green-400 w-full xs:w-auto xs:min-w-[140px] rounded-lg">
                      <SelectValue placeholder="Jenis Aktivitas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="violations">Pelanggaran</SelectItem>
                      <SelectItem value="achievements">Prestasi</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="border-green-500 focus:ring-green-400 w-full xs:w-auto xs:min-w-[120px] rounded-lg">
                      <SelectValue placeholder="Rentang Waktu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Minggu</SelectItem>
                      <SelectItem value="monthly">Bulan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6">
              <div className="w-full h-48 sm:h-64 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={chartData} 
                    barGap={currentBreakpoint === 'xs' ? 5 : 10} 
                    margin={{ 
                      top: 10, 
                      right: currentBreakpoint === 'xs' ? 5 : 10, 
                      left: currentBreakpoint === 'xs' ? -10 : 0, 
                      bottom: 10 
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: currentBreakpoint === 'xs' ? 9 : currentBreakpoint === 'sm' ? 10 : 12 }}
                      interval={currentBreakpoint === 'xs' ? 1 : 0}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: currentBreakpoint === 'xs' ? 9 : currentBreakpoint === 'sm' ? 10 : 12 }}
                      width={currentBreakpoint === 'xs' ? 30 : 40}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} wrapperStyle={{ outline: 'none' }} />
                    <Bar dataKey="violations" name="Pelanggaran" fill="#14532d" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="achievements" name="Prestasi" fill="#00BB1C" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4 sm:gap-6 py-4 border-t">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 block bg-[#14532d] rounded"></span>
                <span className="text-xs sm:text-sm">Pelanggaran</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 block bg-[#00BB1C] rounded"></span>
                <span className="text-xs sm:text-sm">Prestasi</span>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Leaderboard Card */}
        <div className="order-2 xl:order-none">
          <Card className="rounded-xl overflow-hidden">
            <CardHeader className="text-center bg-green-500 text-white p-4">
              <CardTitle>Peringkat Pelanggaran</CardTitle>
            </CardHeader>
            <CardContent className="p-0 min-h-[300px] flex flex-col justify-between">
              <div>
                {leaderboardData.map((student, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 border-b hover:bg-green-50 transition-colors"
                  >
                    <div
                      className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full mr-3 text-lg font-bold ${
                        index === 0
                          ? "bg-yellow-100 text-yellow-600 ring-1 ring-yellow-200"
                          : index === 1
                          ? "bg-gray-100 text-gray-500 ring-1 ring-gray-200"
                          : "bg-orange-100 text-orange-600 ring-1 ring-orange-200"
                      }`}
                    >
                      {student.rank}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <div className="flex items-center">
                        <p className="text-sm text-gray-500">Poin Pelanggaran:</p>
                        <Badge variant="outline" className="ml-2 rounded-full">
                          {student.points}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Award
                        className={`h-5 w-5 ${index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-500" : "text-orange-500"}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      
        <div>
          <Card className="rounded-xl overflow-hidden">
            <div className="px-4 sm:px-6 pt-4 pb-4 border-b-2 border-green-500">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">
                  Daftar Siswa Melanggar Hari Ini
                </CardTitle>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    value={searchText}
                    onChange={handleSearchChange}
                    placeholder="Cari siswa..."
                    className="pl-9 bg-white border-gray-200 w-full rounded-lg"
                  />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto pt-3">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="w-12 text-center px-2 sm:px-6 font-medium text-black text-xs sm:text-sm">No</TableHead>
                    <TableHead className="text-center font-medium text-black text-xs sm:text-sm">NIS</TableHead>
                    <TableHead className="text-center font-medium text-black text-xs sm:text-sm">Nama</TableHead>
                    <TableHead className="text-center font-medium text-black text-xs sm:text-sm hidden md:table-cell">Kelas</TableHead>
                    <TableHead className="text-center font-medium text-black text-xs sm:text-sm hidden lg:table-cell">Jenis Pelanggaran</TableHead>
                    <TableHead className="text-center font-medium text-black text-xs sm:text-sm">Poin</TableHead>
                    <TableHead className="text-center font-medium text-black text-xs sm:text-sm hidden sm:table-cell">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedViolationData.map((student) => (
                    <TableRow key={student.id} className="border-b hover:bg-gray-50">
                      <TableCell className="text-center px-2 sm:px-6 font-normal text-xs sm:text-sm">{student.id}</TableCell>
                      <TableCell className="text-center font-normal text-xs sm:text-sm">{student.nis}</TableCell>
                      <TableCell className="text-left font-normal text-xs sm:text-sm">
                        <div className="min-w-0">
                          <div className="truncate">{student.name}</div>
                          {/* Show class and violation type on mobile as secondary info */}
                          <div className="text-xs text-gray-500 md:hidden">
                            {student.class} • {student.violationType}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-normal text-xs sm:text-sm hidden md:table-cell">{student.class}</TableCell>
                      <TableCell className="text-center font-normal text-xs sm:text-sm hidden lg:table-cell">{student.violationType}</TableCell>
                      <TableCell className="text-center font-normal text-xs sm:text-sm">
                        <Badge variant="outline" className="text-xs">
                          {student.violationPoint}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-normal text-xs sm:text-sm hidden sm:table-cell">
                        <Badge variant="secondary" className="text-xs">
                          {student.totalPoint}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {displayedViolationData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500 text-sm">
                        Tidak ada data yang sesuai dengan pencarian
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="px-4 sm:px-6 py-4 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center border-t">
              <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4">
                <div className="text-xs sm:text-sm text-gray-500">
                    Menampilkan {displayedViolationData.length} dari {filteredViolationData.length} siswa
                  </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600">Rows:</span>
                    <Select value={rowsPerPage} onValueChange={handleRowsPerPageChange}>
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

              <div className="flex items-center justify-center sm:justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-gray-700 rounded-lg h-8 w-8 hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                <div className="text-xs sm:text-sm text-gray-600 px-2">
                  {currentPage} / {Math.max(1, Math.ceil(filteredViolationData.length / parseInt(rowsPerPage)))}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    className="text-gray-700 rounded-lg h-8 w-8 hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredViolationData.length / parseInt(rowsPerPage))))}
                    disabled={currentPage >= Math.ceil(filteredViolationData.length / parseInt(rowsPerPage))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
              </div>
            </div>
          </Card>
        </div>
    </div>
  );
};

export default ViewDashboard;
