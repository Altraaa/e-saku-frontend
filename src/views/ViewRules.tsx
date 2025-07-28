import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Search, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight,
  Award,
  Filter,
  X,
  Shield,
  Book,
  Info,
  MessageSquare,
  School,
  HelpCircle
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardFooter, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";

type ViolationRuleData = {
  id: number;
  category: string;
  rule: string;
  point: number;
};

type SanctionRuleData = {
  id: number;
  level: string;
  pointRange: string;
  action: string;
};

type RewardRuleData = {
  id: number;
  achievement: string;
  level: string;
  points: number;
};

type ProcessStepData = {
  id: number;
  step: string;
  process: string;
};

type BenefitTypeData = {
  id: number;
  type: string;
  description: string;
};

const RulesSkeleton = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-center mb-2">
          <div className="bg-gray-300 p-2 rounded-lg mr-3 h-10 w-10"></div>
          <div className="h-8 w-64 bg-gray-300 rounded-md"></div>
        </div>
        <div className="h-4 w-full bg-gray-300 rounded-md mt-2"></div>
        <div className="h-4 w-3/4 bg-gray-300 rounded-md mt-2"></div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <nav className="flex border-b border-gray-200">
            {[1, 2, 3].map((tab) => (
              <div key={tab} className="py-4 px-6">
                <div className="h-6 w-24 bg-gray-300 rounded-md"></div>
              </div>
            ))}
          </nav>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-5 mb-6">
        <div className="flex items-start md:items-center gap-4 mb-3">
          <div className="bg-gray-300 p-3 rounded-lg h-12 w-12"></div>
          <div>
            <div className="h-6 w-48 bg-gray-300 rounded-md"></div>
            <div className="h-4 w-full bg-gray-300 rounded-md mt-2"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
        <div className="bg-white rounded-lg shadow-sm md:col-span-1 p-4">
          <div className="h-6 w-32 bg-gray-300 rounded-md mb-3"></div>
          <div className="h-4 w-full bg-gray-300 rounded-md mb-2"></div>
          <div className="h-4 w-5/6 bg-gray-300 rounded-md mb-2"></div>
          <div className="space-y-2 mt-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                <div className="h-4 w-28 bg-gray-300 rounded-md"></div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm md:col-span-3 p-4">
          <div className="h-6 w-64 bg-gray-300 rounded-md mb-4"></div>
          <div className="h-60 w-full bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

const ViewSchoolRules = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState("violations");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0
  });

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const tabsRef = useRef<HTMLDivElement | null>(null);
  const violationsTabRef = useRef<HTMLButtonElement | null>(null);
  const sanctionsTabRef = useRef<HTMLButtonElement | null>(null);
  const rewardsTabRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
  
    return () => clearTimeout(timer);
  }, []);

  const violationRules: ViolationRuleData[] = [
    { id: 1, category: "Behavior", rule: "Tidak membawa buku pelajaran sesuai jadwal", point: 5 },
    { id: 2, category: "Behavior", rule: "Mengganggu kegiatan belajar mengajar", point: 5 },
    { id: 3, category: "Behavior", rule: "Menaiki sepeda/kendaraan bermotor di lingkungan sekolah pada jam pelajaran", point: 5 },
    { id: 4, category: "Respect", rule: "Mencemarkan nama baik teman", point: 5 },
    { id: 5, category: "Attendance", rule: "Terlambat mengikuti KBM", point: 5 },
    { id: 6, category: "Attendance", rule: "Tidak mengerjakan tugas dari Guru", point: 5 },
    { id: 7, category: "Cleanliness", rule: "Membuang sampah tidak pada tempatnya", point: 5 },
    { id: 8, category: "Appearance", rule: "Memelihara kuku panjang", point: 5 },
    { id: 9, category: "Attendance", rule: "Tidak mengikuti upacara/apel bendera", point: 10 },
    { id: 10, category: "Attendance", rule: "Meninggalkan jam pelajaran tanpa ijin", point: 10 },
    { id: 11, category: "Attendance", rule: "Pulang sebelum waktunya", point: 10 },
    { id: 12, category: "Attendance", rule: "Tidak mengikuti kegiatan peringatan Hari Besar Nasional", point: 10 },
    { id: 13, category: "Attendance", rule: "Tidak mendukung kegiatan nonkurikuler", point: 10 },
    { id: 14, category: "Attendance", rule: "Tidak mengikuti KBM tanpa surat keterangan (alpha)", point: 10 },
    { id: 15, category: "Appearance", rule: "Menggunakan pewarna rambut", point: 10 },
    { id: 16, category: "Cleanliness", rule: "Tidak melaksanakan tugas piket kelas", point: 10 },
    { id: 17, category: "Appearance", rule: "Berhias/memakai perhiasan berlebihan", point: 10 },
    { id: 18, category: "Appearance", rule: "Memakai aksesoris berlebihan", point: 10 },
    { id: 19, category: "Appearance", rule: "Rambut gondrong (pria) / rambut tidak rapi (wanita) / alis bercodet", point: 15 },
    { id: 20, category: "Appearance", rule: "Tidak memakai pakaian dan atribut sesuai dengan ketentuan", point: 15 },
    { id: 21, category: "Behavior", rule: "Menerobos/melompat pagar sekolah", point: 20 },
    { id: 22, category: "Behavior", rule: "Masuk/keluar kelas lewat jendela", point: 20 },
    { id: 23, category: "Behavior", rule: "Merusak/mencoret-coret sarana/prasarana sekolah", point: 20 },
    { id: 24, category: "Behavior", rule: "Mengubah/memalsu dokumen tertulis", point: 30 },
    { id: 25, category: "Behavior", rule: "Membawa/menyembunyikan petasan di lingkungan sekolah", point: 30 },
    { id: 26, category: "Behavior", rule: "Bermesraan di lingkungan sekolah", point: 30 },
    { id: 27, category: "Behavior", rule: "Menyalahgunakan uang kas kelas/ sekolah", point: 40 },
    { id: 28, category: "Behavior", rule: "Melakukan pelecehan seksual", point: 40 },
    { id: 29, category: "Behavior", rule: "Melakukan bulying di lingkungan sekolah", point: 50 },
    { id: 30, category: "Behavior", rule: "Membawa / merokok di lingkungan sekolah", point: 50 }
  ];

  const sanctionRules: SanctionRuleData[] = [
    { id: 1, level: "Pelanggaran Ringan", pointRange: "5 - 20 points", action: "Peringatan Lisan (Verbal Warning)" },
    { id: 2, level: "Pelanggaran Sedang", pointRange: "25 - 60 points", action: "Panggilan Orang Tua (SP1) - Parent Notification (First Warning)" },
    { id: 3, level: "Pelanggaran Berat", pointRange: "65 - 80 points", action: "Panggilan Orang Tua (SP2) - Parent Conference (Second Warning)" },
    { id: 4, level: "Pelanggaran Berat", pointRange: "85 - 95 points", action: "Panggilan Orang Tua (SP3) dan diberi tugas tambahan - Parent Conference (Third Warning) with additional assignments" },
    { id: 5, level: "Pelanggaran Berat", pointRange: "≥ 100 points", action: "Dikembalikan kepada orang tua/wali peserta didik selamanya - Return to parent/guardian (permanent)" }
  ];

  const processSteps: ProcessStepData[] = [
    { id: 1, step: "Langkah 1", process: "Apabila ditemukan peserta didik yang melanggar peraturan dan tata tertib sekolah maka dilakukan teguran dan pembinaan" },
    { id: 2, step: "Langkah 2", process: "Apabila peserta didik yang mendapat teguran dan pembinaan tetapi tidak mentaatinya, maka akan dilakukan pemanggilan orang tua" },
    { id: 3, step: "Langkah 3", process: "Peserta didik laki-laki yang rambutnya tidak sesuai dengan ketentuan akan dipotong rambutnya disekolah oleh tukang cukur dan biaya pemotongan rambut akan ditanggung oleh siswa yang melanggar" },
    { id: 4, step: "Langkah 4", process: "Apabila setelah dilakukan pertemuan dengan orang tua tidak ada perubahan maka dilakukan pertemuan antara peserta didik, orang tua, wali kelas, guru BK, Kepala Konsentrasi Keahlian, Wakasek, dan Kepala Sekolah" },
    { id: 5, step: "Langkah 5", process: "Apabila sanksi pertama, kedua, dan ketiga tidak menunjukkan adanya perubahan pada diri peserta didik, maka pihak sekolah bersama-sama dengan orang tua/wali peserta didik mengambil keputusan" }
  ];

  const rewardRules: RewardRuleData[] = [
    { id: 1, achievement: "Prestasi akademis (beregu/perorangan)", level: "Tingkat Nasional", points: 100 },
    { id: 2, achievement: "Prestasi akademis (beregu/perorangan)", level: "Tingkat Propinsi", points: 75 },
    { id: 3, achievement: "Prestasi akademis (beregu/perorangan)", level: "Tingkat Kabupaten", points: 50 },
    { id: 4, achievement: "Prestasi non akademis (beregu/perorangan)", level: "Tingkat Nasional", points: 100 },
    { id: 5, achievement: "Pengurus OSIS / Pengurus Kegiatan Ekstra / Pramuka", level: "Tingkat Sekolah", points: 25 },
    { id: 6, achievement: "Duta sekolah", level: "Tingkat Sekolah", points: 30 }
  ];

  const benefitTypes: BenefitTypeData[] = [
    { id: 1, type: "Sertifikat Pengakuan", description: "Siswa menerima sertifikat resmi yang mendokumentasikan pencapaian dan kontribusi mereka" },
    { id: 2, type: "Pengakuan Publik", description: "Pengakuan selama pertemuan dan acara sekolah untuk merayakan prestasi" },
    { id: 3, type: "Portofolio Siswa", description: "Pencapaian dicatat dalam portofolio permanen siswa untuk referensi di masa mendatang" },
    { id: 4, type: "Kesempatan Kepemimpinan", description: "Pertimbangan untuk posisi kepemimpinan dalam organisasi dan acara sekolah" }
  ];

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        const initialTabElement = violationsTabRef.current;
        
        if (initialTabElement && tabsRef.current) {
          const tabRect = initialTabElement.getBoundingClientRect();
          const navRect = tabsRef.current.getBoundingClientRect();
          
          setIndicatorStyle({
            left: tabRect.left - navRect.left,
            width: tabRect.width
          });
        }
      }, 50); 
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    const updateIndicator = () => {
      let activeTabElement;
      if (activeTab === "violations") {
        activeTabElement = violationsTabRef.current;
      } else if (activeTab === "sanctions") {
        activeTabElement = sanctionsTabRef.current;
      } else {
        activeTabElement = rewardsTabRef.current;
      }
      
      if (activeTabElement && tabsRef.current) {
        const tabRect = activeTabElement.getBoundingClientRect();
        const navRect = tabsRef.current.getBoundingClientRect();
        
        setIndicatorStyle({
          left: tabRect.left - navRect.left,
          width: tabRect.width
        });
      }
    };
    
    if (tabsRef.current) {
      updateIndicator();
    }
    
    window.addEventListener('resize', updateIndicator);
    return () => {
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activeTab]);

  const uniqueCategories = [...new Set(violationRules.map(rule => rule.category))];
  
  const filteredViolations = violationRules.filter(rule => 
    (selectedFilters.length === 0 || selectedFilters.includes(rule.category)) &&
    (searchText === "" || 
    rule.rule.toLowerCase().includes(searchText.toLowerCase()) || 
    rule.category.toLowerCase().includes(searchText.toLowerCase()))
  );
  
  const filteredSanctions = sanctionRules.filter(rule =>
    searchText === "" ||
    rule.level.toLowerCase().includes(searchText.toLowerCase()) ||
    rule.action.toLowerCase().includes(searchText.toLowerCase())
  );
  
  const filteredRewards = rewardRules.filter(rule =>
    searchText === "" ||
    rule.achievement.toLowerCase().includes(searchText.toLowerCase()) ||
    rule.level.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredViolations.length / parseInt(rowsPerPage));
  const startIndex = (currentPage - 1) * parseInt(rowsPerPage);
  const paginatedViolations = filteredViolations.slice(startIndex, startIndex + parseInt(rowsPerPage));

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const timeoutId = setTimeout(() => {
      setSearchText(value);
      setCurrentPage(1); 
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, []);

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(value);
    setCurrentPage(1); 
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedFilters([]); 
    setSearchText(""); 
  };
  
  const handleCategoryFilterChange = (category: string) => {
    if (selectedFilters.includes(category)) {
      setSelectedFilters(selectedFilters.filter(c => c !== category));
    } else {
      setSelectedFilters([...selectedFilters, category]);
    }
    setCurrentPage(1); 
  };
  
  const clearFilters = () => {
    setSelectedFilters([]);
    setCurrentPage(1);
  };

  const getPointClass = (point: number): string => {
    if (point <= 10) return "bg-blue-500";
    if (point <= 20) return "bg-yellow-500 text-gray-900";
    if (point <= 30) return "bg-orange-500";
    if (point <= 50) return "bg-red-500";
    return "bg-purple-500";
  };

  const getSanctionLevelClass = (level: string): string => {
    if (level === "Pelanggaran Ringan") return "bg-green-100 text-green-800 border-green-200 transition-none";
    if (level === "Pelanggaran Sedang") return "bg-yellow-100 text-yellow-800 border-yellow-200 transition-none";
    return "bg-red-100 text-red-800 border-red-200 transition-none";
  };

  const getCategoryClass = (category: string, isSelected: boolean = false): string => {
    const baseClass = isSelected ? "border" : "";
    
    switch (category) {
      case "Behavior": return `${baseClass} bg-green-100 text-green-800 border-green-300`;
      case "Appearance": return `${baseClass} bg-purple-100 text-purple-800 border-purple-300`;
      case "Attendance": return `${baseClass} bg-blue-100 text-blue-800 border-blue-300`;
      case "Cleanliness": return `${baseClass} bg-cyan-100 text-cyan-800 border-cyan-300`;
      case "Respect": return `${baseClass} bg-yellow-100 text-yellow-800 border-yellow-300`;
      default: return `${baseClass} bg-gray-100 text-gray-800 border-gray-300`;
    }
  };

  const getTabTheme = () => {
    if (activeTab === "violations") return { color: "green", gradient: "from-green-50 to-green-100", icon: "text-green-600", border: "border-green-500", bg: "bg-green-50" };
    if (activeTab === "sanctions") return { color: "amber", gradient: "from-amber-50 to-amber-100", icon: "text-amber-600", border: "border-amber-500", bg: "bg-amber-50" };
    return { color: "emerald", gradient: "from-emerald-50 to-emerald-100", icon: "text-emerald-600", border: "border-emerald-500", bg: "bg-emerald-50" };
  };

  const theme = getTabTheme();

  if (isLoading) {
    return <RulesSkeleton />;
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center mb-2">
          <div className="bg-green-600/40 p-2 rounded-lg mr-3">
            <Book className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Peraturan Sekolah</h1>
        </div>
        <p className="text-gray-600 max-w-3xl">
          Pedoman dan peraturan untuk menjaga lingkungan belajar yang positif di SMK Negeri 1 Denpasar. Peraturan ini dirancang untuk mendorong kedisiplinan, rasa hormat, dan keunggulan akademik.
        </p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <nav className="flex border-b border-gray-200" ref={tabsRef}>
            <button
              ref={violationsTabRef}
              className={`py-4 px-2 md:px-6 font-medium text-xs md:text-sm ${
                activeTab === "violations"
                  ? "text-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleTabChange("violations")}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Pelanggaran
              </div>
            </button>
            <button
              ref={sanctionsTabRef}
              className={`py-4 px-2 md:px-6 font-medium text-xs md:text-sm ${
                activeTab === "sanctions"
                  ? "text-amber-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleTabChange("sanctions")}
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Sanksi
              </div>
            </button>
            <button
              ref={rewardsTabRef}
              className={`py-4 px-2 md:px-6 font-medium text-xs md:text-sm ${
                activeTab === "rewards"
                  ? "text-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleTabChange("rewards")}
            >
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Penghargaan
              </div>
            </button>

            <div 
              className={`absolute bottom-0 h-0.5 transition-all duration-300 ease-in-out ${
                activeTab === "violations" 
                  ? "bg-green-500" 
                  : activeTab === "sanctions" 
                    ? "bg-amber-500"
                    : "bg-emerald-500"
              }`}
              style={{ 
                left: `${indicatorStyle.left}px`, 
                width: `${indicatorStyle.width}px` 
              }}
            />
          </nav>
        </div>
      </div>

      <div className={`bg-gradient-to-r ${theme.gradient} rounded-xl p-5 shadow-sm mb-6`}>
        <div className="flex items-start md:items-center gap-4 mb-3">
          <div className={`bg-${theme.color}-500/20 p-3 rounded-lg`}>
            {activeTab === "violations" && <AlertTriangle className={`h-6 w-6 ${theme.icon}`} />}
            {activeTab === "sanctions" && <Shield className={`h-6 w-6 ${theme.icon}`} />}
            {activeTab === "rewards" && <Award className={`h-6 w-6 ${theme.icon}`} />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {activeTab === "violations" && "Pelanggaran & Sistem Poin"}
              {activeTab === "sanctions" && "Sistem Sanksi"}
              {activeTab === "rewards" && "Sistem Penghargaan"}
            </h2>
            <p className="text-gray-600 max-w-3xl mt-1">
              {activeTab === "violations" && "Peraturan yang harus diikuti oleh siswa untuk menjaga lingkungan belajar yang positif dan nilai poin yang terkait dengan pelanggaran."}
              {activeTab === "sanctions" && "Tindakan disipliner yang dirancang untuk mendorong perubahan perilaku positif dan mempertahankan lingkungan belajar yang produktif."}
              {activeTab === "rewards" && "Pendekatan terstruktur untuk mengenali dan merayakan pencapaian siswa di bidang akademik, ekstrakurikuler, dan kepemimpinan."}
            </p>
          </div>
        </div>
      </div>

      {activeTab === "violations" && (
        <div className="animate-in fade-in duration-300 space-y-6">
          {/* Search & Filter Bar */}
          <Card className="rounded-xl overflow-hidden border-green-100 shadow-sm">
            <CardHeader className="border-b bg-white px-5 py-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Cari dan Filter
                </CardTitle>
                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
                  <div className="relative w-full sm:w-64 md:w-72">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      value={searchText}
                      onChange={handleSearchChange}
                      placeholder="Cari Peraturan ..."
                      className="pl-9 bg-white border-gray-200 w-full rounded-lg"
                    />
                  </div>

                  <Popover open={isCommandOpen} onOpenChange={setIsCommandOpen}>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className={`text-gray-600 rounded-lg ${selectedFilters.length > 0 ? 'bg-green-50 border-green-200' : ''}`}
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                        {selectedFilters.length > 0 && (
                          <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                            {selectedFilters.length}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-64" align="end">
                      <Command>
                        <CommandInput placeholder="Search categories..." />
                        <CommandList className="max-h-[300px]">
                          <CommandEmpty>Kategori tidak ditemukan.</CommandEmpty>
                          <CommandGroup heading="Categories">
                            {uniqueCategories.map(category => (
                              <CommandItem 
                                key={category} 
                                onSelect={() => handleCategoryFilterChange(category)}
                                className="flex items-center justify-between cursor-pointer"
                              >
                                <span>{category}</span>
                                {selectedFilters.includes(category) && (
                                  <Badge variant="outline" className={getCategoryClass(category, true)}>
                                    Dipilih
                                  </Badge>
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                        <div className="border-t p-2">
                          <div className="mb-2 flex flex-wrap gap-1.5">
                            {selectedFilters.map(filter => (
                              <Badge 
                                key={filter} 
                                variant="secondary"
                                className={`${getCategoryClass(filter, true)} cursor-pointer`}
                                onClick={() => handleCategoryFilterChange(filter)}
                              >
                                {filter}
                                <X className="ml-1 h-3 w-3" />
                              </Badge>
                            ))}
                          </div>
                          {selectedFilters.length > 0 && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={clearFilters}
                              className="w-full h-7 text-xs"
                            >
                              <X className="h-3 w-3 mr-1.5" />
                              Hapus Filter
                            </Button>
                          )}
                        </div>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="md:grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
            <Card className="border-green-100 shadow-sm mb-6 lg:mb-0 lg:col-span-1">
              <CardHeader className="bg-green-50 border-b border-green-100 px-5 py-4">
                <CardTitle className="text-md font-medium text-green-800 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-green-600" />
                  Sistem Poin
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <p className="text-gray-600 text-sm">
                  Setiap pelanggaran memiliki nilai poin terkait yang mencerminkan tingkat keparahannya. Poin terakumulasi dan menentukan sanksi yang sesuai.
                </p>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500 w-4 h-4 rounded-full"></div>
                    <span className="text-sm text-gray-700">5-10 poin (Ringan)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-yellow-500 w-4 h-4 rounded-full"></div>
                    <span className="text-sm text-gray-700">11-20 poin (Sedang)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-orange-500 w-4 h-4 rounded-full"></div>
                    <span className="text-sm text-gray-700">21-30 poin (Serius)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-red-500 w-4 h-4 rounded-full"></div>
                    <span className="text-sm text-gray-700">31-50 poin (Berat)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl overflow-hidden border-green-100 shadow-sm md:col-span-3">
              <CardHeader className="border-b-2 border-green-500 bg-white px-5 py-4">
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-green-600" />
                  Pelanggaran & Poin
                </CardTitle>
              </CardHeader>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="hidden md:table-cell w-36 px-5 py-3 text-center font-medium text-gray-700">Kategori</TableHead>
                      <TableHead className="text-left w-full px-5 py-3 font-medium text-gray-700">Peraturan</TableHead>
                      <TableHead className="hidden md:table-cell w-24 px-5 py-3 text-center font-medium text-gray-700">Poin</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedViolations.length > 0 ? (
                      paginatedViolations.map((rule) => (
                        <TableRow key={rule.id} className="border-b">
                          <TableCell className="hidden md:table-cell text-center px-5 py-3">
                            <Badge variant="outline" className={getCategoryClass(rule.category)}>
                              {rule.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-left flex flex-col gap-2 md:gap-0 md:justify-center  px-5 py-3">
                            <div className='flex justify-between items-center md:hidden'>
                              <Badge variant="outline" className={getCategoryClass(rule.category)}>
                                {rule.category}
                              </Badge>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div className={`${getPointClass(rule.point)} inline-flex items-center justify-center h-7 w-7 md:w-10 md:h-10 rounded-full text-white text-sm font-semibold mx-auto`}>
                                      {rule.point}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">{rule.point} poin</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <div className='items-center'>
                              {rule.rule}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-center px-5 py-3">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <div className={`${getPointClass(rule.point)} inline-flex items-center justify-center w-10 h-10 rounded-full text-white text-sm font-semibold mx-auto`}>
                                    {rule.point}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">{rule.point} poin</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={3} className="text-center py-12 text-gray-500">
                          <div className="flex flex-col items-center space-y-3">
                            <Search className="w-12 h-12 text-gray-300" />
                            <h3 className="font-medium text-gray-700 text-lg">Peraturan tidak ditemukan.</h3>
                            <p className="text-sm text-gray-500 max-w-md">
                              Cobalah perbaiki kata kunci pencarian atau filter.
                            </p>
                            <Button 
                              variant="outline" 
                              className="mt-2 text-green-600"
                              onClick={clearFilters}
                            >
                              Hapus Filter
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {filteredViolations.length > 0 && (
                <CardFooter className="flex flex-col gap-2 md:gap-0 md:flex-row justify-between items-center border-t p-4">
                  <div className="flex flex-col md:flex-row items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      Menampilkan {paginatedViolations.length} dari {filteredViolations.length} pelanggaran
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Baris:</span>
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
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="text-gray-700 rounded-lg h-8 w-8 hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="text-sm text-gray-600">
                      Halaman {currentPage} dari {Math.max(1, totalPages)}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="text-gray-700 rounded-lg h-8 w-8 hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage >= totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      )}

      {activeTab === "sanctions" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
            <Card className="border-amber-100 shadow-sm md:col-span-1">
              <CardHeader className="bg-amber-50 border-b border-amber-100 px-5 py-4">
                <CardTitle className="text-md font-medium text-amber-800 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-amber-600" />
                  Tingkatan Sanksi
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <p className="text-gray-600 text-sm">
                  Sistem disipliner progresif dirancang untuk memperbaiki perilaku dan memberikan kesempatan untuk perbaikan.
                </p>
                
                <div className="space-y-3 mt-2">
                  <div className="border border-green-100 bg-green-50 rounded-md p-3">
                    <div className="flex items-center mb-1">
                      <span className="bg-green-200 h-3 w-3 rounded-full mr-2"></span>
                      <span className="text-green-800 font-medium text-sm">Pelanggaran Ringan</span>
                    </div>
                    <p className="text-green-700 text-xs pl-5">5-20 poin - Peringatan Verbal</p>
                  </div>
                  
                  <div className="border border-yellow-100 bg-yellow-50 rounded-md p-3">
                    <div className="flex items-center mb-1">
                      <span className="bg-yellow-300 h-3 w-3 rounded-full mr-2"></span>
                      <span className="text-yellow-800 font-medium text-sm">Pelanggaran Sedang</span>
                    </div>
                    <p className="text-yellow-700 text-xs pl-5">25-60 poin - Pemberitahuan Orang Tua</p>
                  </div>
                  
                  <div className="border border-red-100 bg-red-50 rounded-md p-3">
                    <div className="flex items-center mb-1">
                      <span className="bg-red-300 h-3 w-3 rounded-full mr-2"></span>
                      <span className="text-red-800 font-medium text-sm">Pelanggaran Berat</span>
                    </div>
                    <p className="text-red-700 text-xs pl-5">65+ poin - Konsekuensi Serius</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-100 shadow-sm md:col-span-3">
              <CardHeader className="border-b-2 border-amber-500 bg-white px-5 py-4">
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-amber-600" />
                  Tingkatan Sanksi & Konsekuensi
                </CardTitle>
              </CardHeader>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-44 px-5 py-3 text-center font-medium text-gray-700">Tingkatan</TableHead>
                      <TableHead className="w-36 px-5 py-3 text-center font-medium text-gray-700">Rentang Poin</TableHead>
                      <TableHead className="px-5 py-3 text-left font-medium text-gray-700">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSanctions.map((rule) => (
                      <TableRow key={rule.id} className="border-b">
                        <TableCell className="text-center px-5 py-3">
                          <Badge 
                            variant="outline" 
                            className={getSanctionLevelClass(rule.level)}
                          >
                            {rule.level}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center px-5 py-3 font-medium">{rule.pointRange}</TableCell>
                        <TableCell className="text-left px-5 py-3">{rule.action}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>

          <Card className="border-amber-100 shadow-sm">
            <CardHeader className="border-b-2 border-amber-500 bg-white px-5 py-4">
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-amber-600" />
                Langkah Pendisiplinan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="space-y-4">
                {processSteps.map((step, index) => (
                  <div key={step.id} className="flex items-start">
                    <div className="flex-shrink-0 bg-amber-100 rounded-full h-8 w-8 flex items-center justify-center mr-4 mt-1 border border-amber-200">
                      <span className="text-amber-800 font-medium">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-1">{step.step}</h4>
                      <p className="text-gray-600 text-sm">{step.process}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "rewards" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
            <Card className="border-emerald-100 shadow-sm md:col-span-1">
              <CardHeader className="bg-emerald-50 border-b border-emerald-100 px-5 py-4">
                <CardTitle className="text-md font-medium text-emerald-800 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-emerald-600" />
                  Sistem Pengakuan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <p className="text-gray-600 text-sm">
                  SMK Negeri 1 Denpasar mengakui dan memberikan penghargaan atas kontribusi positif dan prestasi di berbagai tingkatan.
                </p>
                
                <div className="mt-3">
                  <h4 className="text-emerald-700 font-medium mb-2 text-sm">Manfaat dari Pengakuan:</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-emerald-200 mr-2 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      </div>
                      <span className="text-gray-600 text-sm">Poin penghargaan menutupi poin pelanggaran</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-emerald-200 mr-2 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      </div>
                      <span className="text-gray-600 text-sm">Pengakuan resmi di catatan sekolah</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-emerald-200 mr-2 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      </div>
                      <span className="text-gray-600 text-sm">Meningkatkan peluang menjadi pemimpin</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-emerald-200 mr-2 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      </div>
                      <span className="text-gray-600 text-sm">Membangun portofolio siswa</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-100 shadow-sm md:col-span-3">
              <CardHeader className="border-b-2 border-emerald-500 bg-white px-5 py-4">
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Award className="h-5 w-5 text-emerald-600" />
                  Sistem Pengakuan Penghargaan
                </CardTitle>
              </CardHeader>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="px-5 py-3 text-left font-medium text-gray-700">Jenis Prestasi</TableHead>
                      <TableHead className="w-36 px-5 py-3 text-center font-medium text-gray-700">Tingkat Prestasi</TableHead>
                      <TableHead className="w-24 px-5 py-3 text-center font-medium text-gray-700">Poin</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRewards.map((rule) => (
                      <TableRow key={rule.id} className="border-b">
                        <TableCell className="text-left px-5 py-3 font-medium">{rule.achievement}</TableCell>
                        <TableCell className="text-center px-5 py-3">
                          <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800">
                            {rule.level}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center px-5 py-3">
                          <div className="flex justify-center">
                            <div className="bg-emerald-500 inline-flex items-center justify-center w-10 h-10 rounded-full text-white text-sm font-semibold">
                              {rule.points}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>

          <Card className="border-emerald-100 shadow-sm">
            <CardHeader className="border-b-2 border-emerald-500 bg-white px-5 py-4">
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <School className="h-5 w-5 text-emerald-600" />
                Benefits & Recognition Types
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefitTypes.map((benefit) => (
                  <div key={benefit.id} className="border border-emerald-100 rounded-lg p-4 bg-white">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-emerald-100 rounded-full p-2">
                        <Info className="h-4 w-4 text-emerald-600" />
                      </div>
                      <h3 className="font-medium text-gray-800">{benefit.type}</h3>
                    </div>
                    <p className="text-gray-600 text-sm pl-9">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ViewSchoolRules;