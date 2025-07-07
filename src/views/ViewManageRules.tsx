import React, { useState, useEffect, useCallback } from "react";
import { ApiRules } from "@/config/Services/Rules.service";
import { IRules } from "@/config/Models/Rules";
import { IAchievement } from "@/config/Models/Achievement";
import { Card, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Trash2, ChevronLeft, ChevronRight, Plus, Search, FileText, AlertCircle, Trophy, Award } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

// Mock achievement data
const mockAchievements: IAchievement[] = [
  { id: 1, achievement: "Prestasi akademis (beregu/perorangan)", level: "Tingkat Nasional", points: 100 },
  { id: 2, achievement: "Prestasi akademis (beregu/perorangan)", level: "Tingkat Propinsi", points: 75 },
  { id: 3, achievement: "Prestasi akademis (beregu/perorangan)", level: "Tingkat Kabupaten", points: 50 },
  { id: 4, achievement: "Prestasi non akademis (beregu/perorangan)", level: "Tingkat Nasional", points: 100 },
  { id: 5, achievement: "Pengurus OSIS / Pengurus Kegiatan Ekstra / Pramuka", level: "Tingkat Sekolah", points: 25 },
  { id: 6, achievement: "Duta sekolah", level: "Tingkat Sekolah", points: 30 },
];

const ViewManageRules: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("rules");
  const [rules, setRules] = useState<IRules[]>([]);
  const [filteredRules, setFilteredRules] = useState<IRules[]>([]);
  const [isLoadingRules, setIsLoadingRules] = useState<boolean>(true);
  const [rulesError, setRulesError] = useState<string | null>(null);
  const [rulesSearchText, setRulesSearchText] = useState<string>("");
  const [rulesCurrentPage, setRulesCurrentPage] = useState<number>(1);
  const [rulesRowsPerPage, setRulesRowsPerPage] = useState<number>(10);

  const [achievements, setAchievements] = useState<IAchievement[]>([]);
  const [filteredAchievements, setFilteredAchievements] = useState<IAchievement[]>([]);
  const [isLoadingAchievements, setIsLoadingAchievements] = useState<boolean>(false);
  const [achievementsSearchText, setAchievementsSearchText] = useState<string>("");
  const [selectedAchievementLevel, setSelectedAchievementLevel] = useState<string>("all");
  const [achievementsCurrentPage, setAchievementsCurrentPage] = useState<number>(1);
  const [achievementsRowsPerPage, setAchievementsRowsPerPage] = useState<number>(10);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<IRules | IAchievement | null>(null);
  const [formData, setFormData] = useState<Partial<IRules & IAchievement>>({});

  const achievementLevels = ["Tingkat Sekolah", "Tingkat Kecamatan", "Tingkat Kabupaten", "Tingkat Provinsi", "Tingkat Nasional"];

  // Fetch rules from API
  const fetchRules = useCallback(async () => {
    return await ApiRules.getAll();
  }, []);

  const LoadingSpinner: React.FC = () => {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingRules(true);
      setRulesError(null);
      try {
        const data = await fetchRules();
        setRules(data);
      } catch (error) {
        console.error("Failed to fetch rules:", error);
        setRulesError("Failed to load rules. Please try again later.");
      } finally {
        setIsLoadingRules(false);
      }
    };
    fetchData();
  }, [fetchRules]);

  // Load mock achievements
  useEffect(() => {
    setIsLoadingAchievements(true);
    setTimeout(() => {
      setAchievements(mockAchievements);
      setIsLoadingAchievements(false);
    }, 500);
  }, []);

  // Handle search with debounce
  const handleSearchChange = (setter: React.Dispatch<React.SetStateAction<string>>, currentPageSetter: React.Dispatch<React.SetStateAction<number>>) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setter(value);
      currentPageSetter(1);
    };
  };

  // Filter rules and achievements
  const filterData = (data: IRules[] | IAchievement[], searchText: string, category: string) => {
    return data.filter(item => {
      const matchesSearch = item.name?.toLowerCase().includes(searchText.toLowerCase()) || item.description?.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = category === "all" || item.category === category;
      return matchesSearch && matchesCategory;
    });
  };

  useEffect(() => {
    setFilteredRules(filterData(rules, rulesSearchText, "all"));
  }, [rules, rulesSearchText]);

  useEffect(() => {
    setFilteredAchievements(filterData(achievements, achievementsSearchText, selectedAchievementLevel));
  }, [achievements, achievementsSearchText, selectedAchievementLevel]);

  // Pagination logic
  const paginateData = (data: IRules[] | IAchievement[], currentPage: number, rowsPerPage: number) => {
    const totalPages = Math.ceil(data.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    return {
      paginatedData: data.slice(startIndex, startIndex + rowsPerPage),
      totalPages,
    };
  };

  const { paginatedData: paginatedRules, totalPages: rulesTotalPages } = paginateData(filteredRules, rulesCurrentPage, rulesRowsPerPage);
  const { paginatedData: paginatedAchievements, totalPages: achievementsTotalPages } = paginateData(filteredAchievements, achievementsCurrentPage, achievementsRowsPerPage);

  // Handle form changes
  const handleFormChange = (field: string, value: string | number) => {
    setFormData((prev : any) => ({ ...prev, [field]: value }));
  };

  // Save function
  const handleSave = async () => {
    const isRule = activeTab === "rules";
    const isValid = isRule
      ? formData.name && formData.description && formData.points > 0
      : formData.achievement && formData.level && formData.points > 0;

    if (!isValid) {
      toast.error("Please fill all fields with valid values.");
      return;
    }

    try {
      if (editingItem) {
        const updated = isRule
          ? await ApiRules.update((editingItem as IRules).id, formData as IRules)
          : { ...editingItem, ...formData } as IAchievement; // Mock update for achievements
        setRules(prev => isRule ? prev.map(r => (r.id === updated.id ? updated : r)) : prev);
        setAchievements(prev => !isRule ? prev.map(a => (a.id === updated.id ? updated : a)) : prev);
        toast.success(`${isRule ? "Rule" : "Achievement"} updated successfully!`);
      } else {
        const added = isRule
          ? await ApiRules.create(formData as IRules)
          : { ...formData, id: Math.max(...achievements.map(a => a.id)) + 1 } as IAchievement; // Mock add for achievements
        setRules(prev => isRule ? [...prev, added] : prev);
        setAchievements(prev => !isRule ? [...prev, added] : prev);
        toast.success(`${isRule ? "Rule" : "Achievement"} added successfully!`);
      }
      setFormData({});
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to save:", error);
      toast.error("Failed to save. Please try again.");
    }
  };

  // Delete function
  const handleDelete = async (id: number, isRule: boolean) => {
    if (!window.confirm(`Are you sure you want to delete this ${isRule ? "rule" : "achievement"}?`)) return;

    try {
      if (isRule) {
        await ApiRules.delete(id);
        setRules(prev => prev.filter(r => r.id !== id));
      } else {
        setAchievements(prev => prev.filter(a => a.id !== id)); // Mock delete for achievements
      }
      toast.success(`${isRule ? "Rule" : "Achievement"} deleted successfully!`);
    } catch (error) {
      console.error("Failed to delete:", error);
      toast.error("Failed to delete. Please try again.");
    }
  };

  // Edit handlers
  const handleEdit = (item: IRules | IAchievement) => {
    setEditingItem(item);
    setFormData(item);
    setIsEditDialogOpen(true);
  };

  // Add handlers
  const handleAdd = () => {
    setEditingItem(null);
    setFormData({});
    setIsAddDialogOpen(true);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingItem(null);
    setFormData({});
    setIsEditDialogOpen(false);
    setIsAddDialogOpen(false);
  };

  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case "Tingkat Sekolah": return "bg-blue-100 text-blue-800 border-blue-300";
      case "Tingkat Kecamatan": return "bg-green-100 text-green-800 border-green-300";
      case "Tingkat Kabupaten": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Tingkat Provinsi": return "bg-orange-100 text-orange-800 border-orange-300";
      case "Tingkat Nasional": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPointBadgeClass = (point: number) => {
    if (point <= 10) return "bg-blue-500";
    if (point <= 20) return "bg-yellow-500 text-gray-900";
    if (point <= 30) return "bg-orange-500";
    if (point <= 50) return "bg-red-500";
    return "bg-purple-500";
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5">
          <h1 className="text-3xl font-bold text-green-500">School Management System</h1>
          <div className="mt-1 flex items-center">
            <span className="text-gray-600">Manage school rules and achievement points</span>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-green-400 to-green-500"></div>
      </div>

      <Card className="rounded-xl overflow-hidden shadow-sm border-gray-200">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-4 pb-4 border-b-2 border-green-500">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100">
              <TabsTrigger value="rules" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Rules Management
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Achievement Management
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Rules Tab */}
          <TabsContent value="rules" className="mt-0">
            <div className="px-6 pt-4 pb-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <CardTitle className="text-xl font-bold text-gray-900">Rules Management</CardTitle>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Button onClick={handleAdd} className="bg-green-500 hover:bg-green-600 text-white transition-all duration-300 w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Add New Rule</span>
                  </Button>
                  <div className="relative flex w-full">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input placeholder="Search rules..." onChange={handleSearchChange(setRulesSearchText, setRulesCurrentPage)} className="pl-9 bg-white border-gray-200 w-full rounded-lg" />
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto pt-3">
              {isLoadingRules ? (
                <LoadingSpinner />
              ) : rulesError ? (
                <div className="px-6 py-8 text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                  <p className="text-red-600 font-semibold mb-2">{rulesError}</p>
                  <Button onClick={() => window.location.reload()} variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">Try Again</Button>
                </div>
              ) : (
                <>
                  {/* Rules Table */}
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="w-12 text-center px-6 font-medium text-black">No</TableHead>
                        <TableHead className="text-left font-medium text-black">Rule</TableHead>
                        <TableHead className="text-left font-medium text-black">Description</TableHead>
                        <TableHead className="text-center font-medium text-black">Points</TableHead>
                        <TableHead className="text-center font-medium text-black">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedRules.length > 0 ? (
                        paginatedRules.map((rule, index) => (
                          <TableRow key={rule.id} className="border-b hover:bg-gray-50">
                            <TableCell className="text-center px-6 font-normal">{(rulesCurrentPage - 1) * rulesRowsPerPage + index + 1}</TableCell>
                            <TableCell className="text-left font-normal">
                              <div className="font-medium text-gray-900 mb-1">{rule.name}</div>
                            </TableCell>
                            <TableCell className="text-left font-normal">
                              <div className="text-sm text-gray-600 truncate" title={rule.description }>{rule.description}</div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge className={`text-white ${getPointBadgeClass(rule.points)}`}>{rule.points}</Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center gap-3 items-center">
                                <Button variant="outline" size="icon" onClick={() => handleEdit(rule)} className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 border-blue-200">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={() => handleDelete(rule.id, true)} className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  {/* Rules Pagination */}
                  {filteredRules.length > 0 && (
                    <div className="px-4 sm:px-6 pt-4 pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center border-t space-y-4 sm:space-y-0">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="text-sm text-gray-500 text-center sm:text-left">
                          Showing {paginatedRules.length} of {filteredRules.length} rules
                        </div>
                        <div className="flex items-center justify-center sm:justify-start space-x-2">
                          <span className="text-sm text-gray-600">Rows:</span>
                          <Select value={String(rulesRowsPerPage)} onValueChange={(value) => { setRulesRowsPerPage(parseInt(value)); setRulesCurrentPage(1); }}>
                            <SelectTrigger className="w-16 h-8 border-gray-200 focus:ring-green-400 rounded-lg">
                              <SelectValue />
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

                      <div className="flex items-center justify-center space-x-2">
                        <Button variant="outline" size="icon" className="text-gray-700 rounded-lg h-8 w-8 hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors" onClick={() => setRulesCurrentPage(prev => Math.max(prev - 1, 1))} disabled={rulesCurrentPage === 1}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="text-sm text-gray-600 px-2">
                          Page {rulesCurrentPage} of {rulesTotalPages}
                        </div>

                        <Button variant="outline" size="icon" className="text-gray-700 rounded-lg h-8 w-8 hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors" onClick={() => setRulesCurrentPage(prev => Math.min(prev + 1, rulesTotalPages))} disabled={rulesCurrentPage >= rulesTotalPages}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="mt-0">
            <div className="px-6 pt-4 pb-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <CardTitle className="text-xl font-bold text-gray-900">Achievement Management</CardTitle>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Button onClick={handleAdd} className="bg-green-500 hover:bg-green-600 text-white transition-all duration-300 w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Add Achievement</span>
                  </Button>
                  <div className="relative flex w-full">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input placeholder="Search achievements..." onChange={handleSearchChange(setAchievementsSearchText, setAchievementsCurrentPage)} className="pl-9 bg-white border-gray-200 w-full rounded-lg" />
                  </div>
                  <Select value={selectedAchievementLevel} onValueChange={setSelectedAchievementLevel}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      {achievementLevels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto pt-3">
              {isLoadingAchievements ? (
                <LoadingSpinner />
              ) : (
                <>
                  {/* Achievements Table */}
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="w-12 text-center px-6 font-medium text-black">No</TableHead>
                        <TableHead className="text-center font-medium text-black">Achievement</TableHead>
                        <TableHead className="text-left font-medium text-black">Level</TableHead>
                        <TableHead className="text-center font-medium text-black">Points</TableHead>
                        <TableHead className="text-center font-medium text-black">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedAchievements.length > 0 ? (
                        paginatedAchievements.map((achievement, index) => (
                          <TableRow key={achievement.id} className="border-b hover:bg-gray-50">
                            <TableCell className="text-center px-6 font-normal">{(achievementsCurrentPage - 1) * achievementsRowsPerPage + index + 1}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className={`text-xs ${getLevelBadgeClass(achievement.level)}`}>{achievement.level}</Badge>
                            </TableCell>
                            <TableCell className="text-left font-normal max-w-md">
                              <div className="font-medium text-gray-900">{achievement.achievement}</div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge className={`text-white ${getPointBadgeClass(achievement.points)}`}>{achievement.points}</Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center gap-3 items-center">
                                <Button variant="outline" size="icon" onClick={() => handleEdit(achievement)} className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 border-blue-200">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={() => handleDelete(achievement.id, false)} className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                            <Award className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <p className="text-lg font-medium mb-2">No achievements found</p>
                            <p className="text-sm">{achievementsSearchText || selectedAchievementLevel !== "all" ? "Try adjusting your search or filter criteria" : "Start by adding your first achievement"}</p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  {/* Achievements Pagination */}
                  {filteredAchievements.length > 0 && (
                    <div className="px-4 sm:px-6 pt-4 pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center border-t space-y-4 sm:space-y-0">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="text-sm text-gray-500 text-center sm:text-left">
                          Showing {paginatedAchievements.length} of {filteredAchievements.length} achievements
                        </div>
                        <div className="flex items-center justify-center sm:justify-start space-x-2">
                          <span className="text-sm text-gray-600">Rows:</span>
                          <Select value={String(achievementsRowsPerPage)} onValueChange={(value) => { setAchievementsRowsPerPage(parseInt(value)); setAchievementsCurrentPage(1); }}>
                            <SelectTrigger className="w-16 h-8 border-gray-200 focus:ring-green-400 rounded-lg">
                              <SelectValue />
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

                      <div className="flex items-center justify-center space-x-2">
                        <Button variant="outline" size="icon" className="text-gray-700 rounded-lg h-8 w-8 hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors" onClick={() => setAchievementsCurrentPage(prev => Math.max(prev - 1, 1))} disabled={achievementsCurrentPage === 1}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="text-sm text-gray-600 px-2">
                          Page {achievementsCurrentPage} of {achievementsTotalPages}
                        </div>

                        <Button variant="outline" size="icon" className="text-gray-700 rounded-lg h-8 w-8 hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors" onClick={() => setAchievementsCurrentPage(prev => Math.min(prev + 1, achievementsTotalPages))} disabled={achievementsCurrentPage >= achievementsTotalPages}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[500px] lg:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900">Add New {activeTab === "rules" ? "Rule" : "Achievement"}</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">Create a new {activeTab === "rules" ? "school rule with point assignment" : "achievement with point value"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {activeTab === "rules" ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Rule Name</label>
                  <Input value={formData.name || ""} onChange={(e) => handleFormChange("name", e.target.value)} placeholder="Enter rule name..." />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Rule Description</label>
                  <Textarea value={formData.description || ""} onChange={(e) => handleFormChange("description", e.target.value)} placeholder="Enter detailed rule description..." className="min-h-[100px]" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Points</label>
                  <Input type="number" value={formData.points || ""} onChange={(e) => handleFormChange("points", parseInt(e.target.value) || 0)} placeholder="Enter point value" min="1" />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Achievement Name</label>
                  <Input value={formData.achievement || ""} onChange={(e) => handleFormChange("achievement", e.target.value)} placeholder="Enter achievement name..." />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Level</label>
                  <Select value={formData.level || ""} onValueChange={(value) => handleFormChange("level", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {achievementLevels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Points</label>
                  <Input type="number" value={formData.points || ""} onChange={(e) => handleFormChange("points", parseInt(e.target.value) || 0)} placeholder="Enter point value" min="1" />
                </div>
              </>
            )}
            
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleCancelEdit} disabled={false} className="flex-1">Cancel</Button>
              <Button onClick={handleSave} disabled={false} className="flex-1 bg-green-500 hover:bg-green-600">
                Add {activeTab === "rules" ? "Rule" : "Achievement"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[500px] lg:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900">Edit {editingItem ? (editingItem as IRules).name || (editingItem as IAchievement).achievement : ""}</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">Modify the selected {editingItem ? (editingItem as IRules).name ? "rule" : "achievement" : ""} details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {editingItem && (editingItem as IRules).name ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Rule Name</label>
                  <Input value={formData.name || ""} onChange={(e) => handleFormChange("name", e.target.value)} placeholder="Enter rule name..." />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Rule Description</label>
                  <Textarea value={formData.description || ""} onChange={(e) => handleFormChange("description", e.target.value)} placeholder="Enter detailed rule description..." className="min-h-[100px]" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Points</label>
                  <Input type="number" value={formData.points || ""} onChange={(e) => handleFormChange("points", parseInt(e.target.value) || 0)} placeholder="Enter point value" min="1" />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Achievement Name</label>
                  <Input value={formData.achievement || ""} onChange={(e) => handleFormChange("achievement", e.target.value)} placeholder="Enter achievement name..." />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Level</label>
                  <Select value={formData.level || ""} onValueChange={(value) => handleFormChange("level", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {achievementLevels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Points</label>
                  <Input type="number" value={formData.points || ""} onChange={(e) => handleFormChange("points", parseInt(e.target.value) || 0)} placeholder="Enter point value" min="1" />
                </div>
              </>
            )}
            
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleCancelEdit} disabled={false} className="flex-1">Cancel</Button>
              <Button onClick={handleSave} disabled={false} className="flex-1 bg-green-500 hover:bg-green-600">
                Update {editingItem ? (editingItem as IRules).name ? "Rule" : "Achievement" : ""}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewManageRules;