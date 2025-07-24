import React, { useState, useEffect, useCallback } from "react";
import { ApiRules } from "@/config/Services/Rules.service";
import { IRules } from "@/config/Models/Rules";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  FileText,
  AlertCircle,
  Trophy,
  Award,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import {
  useAccomplishmentsType,
  useAccomplishmentsTypeCreate,
  useAccomplishmentsTypeUpdate,
  useAccomplishmentsTypeDelete,
} from "@/config/Api/useAccomplismentsType";
import {
  useAccomplishmentsRanks,
  useAccomplishmentsRankCreate,
  useAccomplishmentsRankUpdate,
  useAccomplishmentsRankDelete,
} from "@/config/Api/useAccomplishmentsRanks";
import {
  useAccomplishmentsLevel,
  useAccomplishmentsLevelCreate,
  useAccomplishmentsLevelUpdate,
  useAccomplishmentsLevelDelete,
} from "@/config/Api/useAccomplishmentsLevel";
import { IType } from "@/config/Models/AccomplismentsType";
import { IRank } from "@/config/Models/AccomplishmentsRanks";
import { ILevel } from "@/config/Models/AccomplishmentsLevel";
import ConfirmationModal from "@/components/ui/confirmation";

const ViewManageRules: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("rules");
  const [activeAchievementTab, setActiveAchievementTab] =
    useState<string>("types");

  // Rules state
  const [rules, setRules] = useState<IRules[]>([]);
  const [filteredRules, setFilteredRules] = useState<IRules[]>([]);
  const [isLoadingRules, setIsLoadingRules] = useState<boolean>(true);
  const [rulesError, setRulesError] = useState<string | null>(null);
  const [rulesSearchText, setRulesSearchText] = useState<string>("");
  const [rulesCurrentPage, setRulesCurrentPage] = useState<number>(1);
  const [rulesRowsPerPage, setRulesRowsPerPage] = useState<number>(10);

  // Achievement types state
  const [typesSearchText, setTypesSearchText] = useState<string>("");
  const [typesCurrentPage, setTypesCurrentPage] = useState<number>(1);
  const [typesRowsPerPage, setTypesRowsPerPage] = useState<number>(10);

  // Achievement ranks state
  const [ranksSearchText, setRanksSearchText] = useState<string>("");
  const [ranksCurrentPage, setRanksCurrentPage] = useState<number>(1);
  const [ranksRowsPerPage, setRanksRowsPerPage] = useState<number>(10);

  // Achievement levels state
  const [levelsSearchText, setLevelsSearchText] = useState<string>("");
  const [levelsCurrentPage, setLevelsCurrentPage] = useState<number>(1);
  const [levelsRowsPerPage, setLevelsRowsPerPage] = useState<number>(10);

  // Dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<
    IRules | IType | IRank | ILevel | null
  >(null);
  const [formData, setFormData] = useState<
    Partial<IRules & IType & IRank & ILevel>
  >({});

  // Confirmation modal state
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: "add" | "delete" | "update";
    title: string;
    description: string;
    onConfirm: () => void;
    confirmText: string;
  } | null>(null);

  // Achievement Types hooks
  const { data: typesData, refetch: refetchTypes } = useAccomplishmentsType();
  const createType = useAccomplishmentsTypeCreate();
  const updateType = useAccomplishmentsTypeUpdate();
  const deleteType = useAccomplishmentsTypeDelete();

  // Achievement Ranks hooks
  const { data: ranksData, refetch: refetchRanks } = useAccomplishmentsRanks();
  const createRank = useAccomplishmentsRankCreate();
  const updateRank = useAccomplishmentsRankUpdate();
  const deleteRank = useAccomplishmentsRankDelete();

  // Achievement Levels hooks
  const { data: levelsData, refetch: refetchLevels } =
    useAccomplishmentsLevel();
  const createLevel = useAccomplishmentsLevelCreate();
  const updateLevel = useAccomplishmentsLevelUpdate();
  const deleteLevel = useAccomplishmentsLevelDelete();

  // Filtered data based on search
  const filteredTypes = typesData
    ? typesData.filter((type) =>
        type.type.toLowerCase().includes(typesSearchText.toLowerCase())
      )
    : [];

  const filteredRanks = ranksData
    ? ranksData.filter((rank) =>
        rank.rank.toLowerCase().includes(ranksSearchText.toLowerCase())
      )
    : [];

  const filteredLevels = levelsData
    ? levelsData.filter((level) =>
        level.level.toLowerCase().includes(levelsSearchText.toLowerCase())
      )
    : [];

  const LoadingSpinner: React.FC = () => {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  };

  const filterRules = (data: IRules[], searchText: string): IRules[] => {
    return data.filter(
      (rule) =>
        rule.name.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  // Fetch rules from API
  const fetchRules = useCallback(async () => {
    return await ApiRules.getAll();
  }, []);

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

  useEffect(() => {
    setFilteredRules(filterRules(rules, rulesSearchText));
  }, [rules, rulesSearchText]);

  // Handle search with debounce
  const handleSearchChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    currentPageSetter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setter(value);
      currentPageSetter(1);
    };
  };

  // Pagination logic
  const paginateData = <T,>(
    data: T[],
    currentPage: number,
    rowsPerPage: number
  ) => {
    const totalPages = Math.ceil(data.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    return {
      paginatedData: data.slice(startIndex, startIndex + rowsPerPage),
      totalPages,
    };
  };

  const { paginatedData: paginatedRules, totalPages: rulesTotalPages } =
    paginateData(filteredRules, rulesCurrentPage, rulesRowsPerPage);

  const { paginatedData: paginatedTypes, totalPages: typesTotalPages } =
    paginateData(filteredTypes, typesCurrentPage, typesRowsPerPage);

  const { paginatedData: paginatedRanks, totalPages: ranksTotalPages } =
    paginateData(filteredRanks, ranksCurrentPage, ranksRowsPerPage);

  const { paginatedData: paginatedLevels, totalPages: levelsTotalPages } =
    paginateData(filteredLevels, levelsCurrentPage, levelsRowsPerPage);

  // Handle form changes
  const handleFormChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };


  const checkForDuplicates = (
    value: string | number,
    data: any[],
    field: string
  ) => {
    return data.some((item) => item[field].toLowerCase() === (value as string).toLowerCase());
  };


  // Save function
const performSave = async () => {
  const isRule = activeTab === "rules";
  const isType = activeAchievementTab === "types";
  const isRank = activeAchievementTab === "ranks";
  const isLevel = activeAchievementTab === "levels";

  let isValid = false;
  let itemName = "";

  // Check for duplicate rule, type, rank, or level before saving
  if (isRule) {
    // Check if rule name already exists
    if (checkForDuplicates(formData.name || "", rules, "name")) {
      toast.error("Rule name already exists.");
      return;
    }
    isValid = !!formData.name && (formData.points ?? 0) > 0;
    itemName = formData.name || "Rule";
  } else if (isType) {
    // Check if achievement type already exists
    if (checkForDuplicates(formData.type || "", typesData, "type")) {
      toast.error("Achievement type already exists.");
      return;
    }
    isValid = !!formData.type && (formData.point ?? 0) > 0;
    itemName = formData.type || "Achievement Type";
  } else if (isRank) {
    // Check if achievement rank already exists
    if (checkForDuplicates(formData.rank || "", ranksData, "rank")) {
      toast.error("Achievement rank already exists.");
      return;
    }
    isValid = !!formData.rank && (formData.point ?? 0) > 0;
    itemName = formData.rank || "Achievement Rank";
  } else if (isLevel) {
    // Check if achievement level already exists
    if (checkForDuplicates(formData.level || "", levelsData, "level")) {
      toast.error("Achievement level already exists.");
      return;
    }
    isValid = !!formData.level && (formData.point ?? 0) > 0;
    itemName = formData.level || "Achievement Level";
  }

  if (!isValid) {
    toast.error("Please fill all fields with valid values.");
    return;
  }

  const loadingId = toast.loading("Saving...");

  try {
    if (editingItem) {
      // Update existing item
      if (isRule) {
        await ApiRules.update((editingItem as IRules).id, formData as IRules);
        const updatedRules = await fetchRules();
        setRules(updatedRules);
        toast.success(`${itemName} updated successfully!`);
      } else if (isType) {
        updateType.mutate(
          {
            id: (editingItem as IType).id,
            data: formData as Partial<IType>,
          },
          {
            onSuccess: () => {
              toast.dismiss(loadingId);
              refetchTypes();
              toast.success(`${itemName} updated successfully!`);
            },
            onError: (error) => {
              toast.dismiss(loadingId);
              console.error("Update type error:", error);
              toast.error("Failed to update type.");
            },
          }
        );
        return;
      } else if (isRank) {
        updateRank.mutate(
          {
            id: (editingItem as IRank).id,
            data: formData as Partial<IRank>,
          },
          {
            onSuccess: () => {
              toast.dismiss(loadingId);
              refetchRanks();
              toast.success(`${itemName} updated successfully!`);
            },
            onError: (error) => {
              toast.dismiss(loadingId);
              console.error("Update rank error:", error);
              toast.error("Failed to update rank.");
            },
          }
        );
        return;
      } else if (isLevel) {
        updateLevel.mutate(
          {
            id: (editingItem as ILevel).id,
            data: formData as Partial<ILevel>,
          },
          {
            onSuccess: () => {
              toast.dismiss(loadingId);
              refetchLevels();
              toast.success(`${itemName} updated successfully!`);
            },
            onError: (error) => {
              toast.dismiss(loadingId);
              console.error("Update level error:", error);
              toast.error("Failed to update level.");
            },
          }
        );
        return;
      }
    } else {
      // Add new item
      if (isRule) {
        const added = await ApiRules.create(formData as IRules);
        setRules((prev) => [...prev, added]);
        toast.success(`${itemName} added successfully!`);
      } else if (isType) {
        createType.mutate(formData as IType, {
          onSuccess: () => {
            toast.dismiss(loadingId);
            refetchTypes();
            toast.success(`${itemName} added successfully!`);
          },
          onError: (error) => {
            toast.dismiss(loadingId);
            console.error("Create type error:", error);
            toast.error("Failed to add type.");
          },
        });
        return;
      } else if (isRank) {
        createRank.mutate(formData as IRank, {
          onSuccess: () => {
            toast.dismiss(loadingId);
            refetchRanks();
            toast.success(`${itemName} added successfully!`);
          },
          onError: (error) => {
            toast.dismiss(loadingId);
            console.error("Create rank error:", error);
            toast.error("Failed to add rank.");
          },
        });
        return;
      } else if (isLevel) {
        createLevel.mutate(formData as ILevel, {
          onSuccess: () => {
            toast.dismiss(loadingId);
            refetchLevels();
            toast.success(`${itemName} added successfully!`);
          },
          onError: (error) => {
            toast.dismiss(loadingId);
            console.error("Create level error:", error);
            toast.error("Failed to add level.");
          },
        });
        return;
      }
    }

    toast.dismiss(loadingId);
    setFormData({});
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
  } catch (error) {
    toast.dismiss(loadingId);
    console.error("Unexpected save error:", error);
    toast.error("Failed to save. Please try again.");
  }
};


  // Confirm save action
  const confirmSave = () => {
    const actionType = editingItem ? "update" : "add";
    const itemType =
      activeTab === "rules"
        ? "Rule"
        : activeAchievementTab === "types"
        ? "Achievement Type"
        : activeAchievementTab === "ranks"
        ? "Achievement Rank"
        : "Achievement Level";

    setConfirmationModal({
      isOpen: true,
      type: actionType,
      title: editingItem ? `Edit ${itemType}` : `Add ${itemType}`,
      description: editingItem
        ? `Anda yakin untuk memperbarui ${itemType.toLowerCase()}?`
        : `Anda yakin untuk menambah ${itemType.toLowerCase()}?`,
      confirmText: editingItem ? "Update" : "Add",
      onConfirm: () => {
        setConfirmationModal(null);
        setIsEditDialogOpen(false);
        performSave();
      },
    });
  };

  // Delete function
  const performDelete = async (id: string, isRule: boolean) => {
    const loadingId = toast.loading("Deleting...");
    try {
      if (isRule) {
        await ApiRules.delete(id);
        setRules((prev) => prev.filter((r) => r.id !== id));
        toast.success("Rule deleted successfully!");
      } else if (activeAchievementTab === "types") {
        await deleteType.mutateAsync(id, {
          onSuccess: () => {
            toast.dismiss(loadingId);
            refetchTypes();
            toast.success("Achievement type deleted successfully!");
          },
          onError: (error) => {
            toast.dismiss(loadingId);
            console.error("Delete type error:", error);
            toast.error("Failed to delete type. Please try again.");
          },
        });
      } else if (activeAchievementTab === "ranks") {
        await deleteRank.mutateAsync(id, {
          onSuccess: () => {
            toast.dismiss(loadingId);
            refetchRanks();
            toast.success("Achievement rank deleted successfully!");
          },
          onError: (error) => {
            toast.dismiss(loadingId);
            console.error("Delete rank error:", error);
            toast.error("Failed to delete rank. Please try again.");
          },
        });
      } else if (activeAchievementTab === "levels") {
        await deleteLevel.mutateAsync(id, {
          onSuccess: () => {
            toast.dismiss(loadingId);
            refetchLevels();
            toast.success("Achievement level deleted successfully!");
          },
          onError: (error) => {
            toast.dismiss(loadingId);
            console.error("Delete level error:", error);
            toast.error("Failed to delete level. Please try again.");
          },
        });
      }

      toast.dismiss(loadingId);
    } catch (error) {
      toast.dismiss(loadingId);
      console.error("Unexpected delete error:", error);
      toast.error("Failed to delete. Please try again.");
    }
  };

  // Confirm delete action
  const confirmDelete = (id: string, isRule: boolean, itemName: string) => {
    const itemType = isRule
      ? "Rule"
      : activeAchievementTab === "types"
      ? "Achievement Type"
      : activeAchievementTab === "ranks"
      ? "Achievement Rank"
      : "Achievement Level";

    setConfirmationModal({
      isOpen: true,
      type: "delete",
      title: `Delete ${itemType}`,
      description: `Anda yakin untuk menghapus "${itemName}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: "Delete",
      onConfirm: () => {
        setConfirmationModal(null);
        setIsEditDialogOpen(false);
        performDelete(id, isRule);
      },
    });
  };

  // Edit handlers
  const handleEdit = (item: IRules | IType | IRank | ILevel) => {
    setEditingItem(item);

    // FIX: Properly set formData based on item type
    if ("name" in item) {
      // Rules
      setFormData({
        name: item.name,
        points: item.points,
      });
    } else if ("type" in item) {
      // Achievement type
      setFormData({
        type: item.type,
        point: item.point,
      });
    } else if ("rank" in item) {
      // Achievement rank
      setFormData({
        rank: item.rank,
        point: item.point,
      });
    } else if ("level" in item) {
      // Achievement level
      setFormData({
        level: item.level,
        point: item.point,
      });
    }

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

  const getPointBadgeClass = (point: number) => {
    if (point <= 10) return "bg-blue-500";
    if (point <= 20) return "bg-yellow-500 text-gray-900";
    if (point <= 30) return "bg-orange-500";
    if (point <= 50) return "bg-red-500";
    return "bg-purple-500";
  };

  // Render form based on active tab
  const renderFormFields = () => {
    if (activeTab === "rules") {
      return (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Rule Name
            </label>
            <Input
              value={formData.name || ""}
              onChange={(e) => handleFormChange("name", e.target.value)}
              placeholder="Enter rule name..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Points</label>
            <Input
              type="number"
              value={formData.points || ""}
              onChange={(e) =>
                handleFormChange("points", parseInt(e.target.value) || 0)
              }
              placeholder="Enter point value"
              min="1"
            />
          </div>
        </>
      );
    }

    if (activeAchievementTab === "types") {
      return (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Achievement Type
            </label>
            <Input
              value={formData.type || ""}
              onChange={(e) => handleFormChange("type", e.target.value)}
              placeholder="Enter achievement type..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Points</label>
            <Input
              type="number"
              value={formData.point || ""}
              onChange={(e) =>
                handleFormChange("point", parseInt(e.target.value) || 0)
              }
              placeholder="Enter point value"
              min="1"
            />
          </div>
        </>
      );
    }

    if (activeAchievementTab === "ranks") {
      return (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Achievement Rank
            </label>
            <Input
              value={formData.rank || ""}
              onChange={(e) => handleFormChange("rank", e.target.value)}
              placeholder="Enter achievement rank..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Points</label>
            <Input
              type="number"
              value={formData.point || ""}
              onChange={(e) =>
                handleFormChange("point", parseInt(e.target.value) || 0)
              }
              placeholder="Enter point value"
              min="1"
            />
          </div>
        </>
      );
    }

    if (activeAchievementTab === "levels") {
      return (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Achievement Level
            </label>
            <Input
              value={formData.level || ""}
              onChange={(e) => handleFormChange("level", e.target.value)}
              placeholder="Enter achievement level..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Points</label>
            <Input
              type="number"
              value={formData.point || ""}
              onChange={(e) =>
                handleFormChange("point", parseInt(e.target.value) || 0)
              }
              placeholder="Enter point value"
              min="1"
            />
          </div>
        </>
      );
    }

    return null;
  };

  // Get title for dialog based on active tab
  const getDialogTitle = () => {
    if (activeTab === "rules") {
      return editingItem ? "Edit Rule" : "Add New Rule";
    }

    let title = "";
    if (activeAchievementTab === "types") title = "Achievement Type";
    if (activeAchievementTab === "ranks") title = "Achievement Rank";
    if (activeAchievementTab === "levels") title = "Achievement Level";

    return editingItem ? `Edit ${title}` : `Add New ${title}`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5">
          <h1 className="text-3xl font-bold text-green-500">
            School Management System
          </h1>
          <div className="mt-1 flex items-center">
            <span className="text-gray-600">
              Manage school rules and achievement points
            </span>
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
              <TabsTrigger
                value="achievements"
                className="flex items-center gap-2"
              >
                <Trophy className="h-4 w-4" />
                Achievement Management
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Rules Tab */}
          <TabsContent value="rules" className="mt-0">
            <div className="px-6 pt-4 pb-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <CardTitle className="text-xl font-bold text-gray-900">
                  Rules Management
                </CardTitle>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Button
                    onClick={handleAdd}
                    className="bg-green-500 hover:bg-green-600 text-white transition-all duration-300 w-full sm:w-auto"
                  >
                    <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Add New Rule</span>
                  </Button>
                  <div className="relative flex w-full">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search rules..."
                      onChange={handleSearchChange(
                        setRulesSearchText,
                        setRulesCurrentPage
                      )}
                      className="pl-9 bg-white border-gray-200 w-full rounded-lg"
                    />
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
                  <p className="text-red-600 font-semibold mb-2">
                    {rulesError}
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <>
                  {/* Rules Table */}
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="w-12 text-center px-6 font-medium text-black">
                          No
                        </TableHead>
                        <TableHead className="text-left font-medium text-black">
                          Rule
                        </TableHead>
                        <TableHead className="text-center font-medium text-black">
                          Points
                        </TableHead>
                        <TableHead className="text-center font-medium text-black">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedRules.length > 0 ? (
                        paginatedRules.map((rule, index) => (
                          <TableRow
                            key={rule.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <TableCell className="text-center px-6 font-normal">
                              {(rulesCurrentPage - 1) * rulesRowsPerPage +
                                index +
                                1}
                            </TableCell>
                            <TableCell className="text-left font-normal">
                              <div className="font-medium text-gray-900 mb-1">
                                {rule.name}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                className={`text-white ${getPointBadgeClass(
                                  rule.points
                                )}`}
                              >
                                {rule.points}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center gap-3 items-center">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleEdit(rule)}
                                  className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 border-blue-200"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    confirmDelete(rule.id, true, rule.name)
                                  }
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-12 text-gray-500"
                          >
                            <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <p className="text-lg font-medium mb-2">
                              No rules found
                            </p>
                            <p className="text-sm">
                              {rulesSearchText
                                ? "Try adjusting your search criteria"
                                : "Start by adding your first rule"}
                            </p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  {/* Rules Pagination */}
                  {filteredRules.length > 0 && (
                    <div className="px-4 sm:px-6 pt-4 pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center border-t space-y-4 sm:space-y-0">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="text-sm text-gray-500 text-center sm:text-left">
                          Showing {paginatedRules.length} of{" "}
                          {filteredRules.length} rules
                        </div>
                        <div className="flex items-center justify-center sm:justify-start space-x-2">
                          <span className="text-sm text-gray-600">Rows:</span>
                          <Select
                            value={String(rulesRowsPerPage)}
                            onValueChange={(value) => {
                              setRulesRowsPerPage(parseInt(value));
                              setRulesCurrentPage(1);
                            }}
                          >
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
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-gray-700 rounded-lg h-8 w-8 hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors"
                          onClick={() =>
                            setRulesCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={rulesCurrentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="text-sm text-gray-600 px-2">
                          Page {rulesCurrentPage} of {rulesTotalPages}
                        </div>

                        <Button
                          variant="outline"
                          size="icon"
                          className="text-gray-700 rounded-lg h-8 w-8 hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors"
                          onClick={() =>
                            setRulesCurrentPage((prev) =>
                              Math.min(prev + 1, rulesTotalPages)
                            )
                          }
                          disabled={rulesCurrentPage >= rulesTotalPages}
                        >
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
            <Tabs
              value={activeAchievementTab}
              onValueChange={setActiveAchievementTab}
              className="w-full"
            >
              <div className="px-6 pt-4 pb-4 border-b border-gray-200">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                  <TabsTrigger value="types">Achievement Types</TabsTrigger>
                  <TabsTrigger value="ranks">Achievement Ranks</TabsTrigger>
                  <TabsTrigger value="levels">Achievement Levels</TabsTrigger>
                </TabsList>
              </div>

              {/* Achievement Types Tab */}
              <TabsContent value="types" className="mt-0">
                <div className="px-6 pt-4 pb-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Achievement Type Management
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <Button
                        onClick={handleAdd}
                        className="bg-green-500 hover:bg-green-600 text-white transition-all duration-300 w-full sm:w-auto"
                      >
                        <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="truncate">Add Achievement Type</span>
                      </Button>
                      <div className="relative flex w-full">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="Search types..."
                          onChange={handleSearchChange(
                            setTypesSearchText,
                            setTypesCurrentPage
                          )}
                          className="pl-9 bg-white border-gray-200 w-full rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto pt-3">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="w-12 text-center px-6 font-medium text-black">
                          No
                        </TableHead>
                        <TableHead className="text-center font-medium text-black">
                          Achievement Type
                        </TableHead>
                        <TableHead className="text-center font-medium text-black">
                          Points
                        </TableHead>
                        <TableHead className="text-center font-medium text-black">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {typesData && paginatedTypes.length > 0 ? (
                        paginatedTypes.map((type, index) => (
                          <TableRow
                            key={type.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <TableCell className="text-center px-6 font-normal">
                              {(typesCurrentPage - 1) * typesRowsPerPage +
                                index +
                                1}
                            </TableCell>
                            <TableCell className="text-center font-normal">
                              <div className="font-medium text-gray-900">
                                {type.type}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                className={`text-white ${getPointBadgeClass(
                                  type.point
                                )}`}
                              >
                                {type.point}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center gap-3 items-center">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleEdit(type)}
                                  className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 border-blue-200"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    confirmDelete(type.id, false, type.type)
                                  }
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center py-12 text-gray-500"
                          >
                            <Award className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <p className="text-lg font-medium mb-2">
                              {typesData && typesData.length === 0
                                ? "No achievement types found"
                                : "Loading achievement types..."}
                            </p>
                            <p className="text-sm">
                              {typesSearchText
                                ? "Try adjusting your search criteria"
                                : "Start by adding your first achievement type"}
                            </p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  {/* Types Pagination */}
                  {typesData && filteredTypes.length > 0 && (
                    <div className="px-4 sm:px-6 pt-4 pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center border-t space-y-4 sm:space-y-0">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="text-sm text-gray-500 text-center sm:text-left">
                          Showing {paginatedTypes.length} of{" "}
                          {filteredTypes.length} types
                        </div>
                        <div className="flex items-center justify-center sm:justify-start space-x-2">
                          <span className="text-sm text-gray-600">Rows:</span>
                          <Select
                            value={String(typesRowsPerPage)}
                            onValueChange={(value) => {
                              setTypesRowsPerPage(parseInt(value));
                              setTypesCurrentPage(1);
                            }}
                          >
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
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-gray-700 rounded-lg h-8 w-8 hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors"
                          onClick={() =>
                            setTypesCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={typesCurrentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="text-sm text-gray-600 px-2">
                          Page {typesCurrentPage} of {typesTotalPages}
                        </div>

                        <Button
                          variant="outline"
                          size="icon"
                          className="text-gray-700 rounded-lg h-8 w-8 hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors"
                          onClick={() =>
                            setTypesCurrentPage((prev) =>
                              Math.min(prev + 1, typesTotalPages)
                            )
                          }
                          disabled={typesCurrentPage >= typesTotalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Achievement Ranks Tab */}
              <TabsContent value="ranks" className="mt-0">
                <div className="px-6 pt-4 pb-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Achievement Rank Management
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <Button
                        onClick={handleAdd}
                        className="bg-green-500 hover:bg-green-600 text-white transition-all duration-300 w-full sm:w-auto"
                      >
                        <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="truncate">Add Achievement Rank</span>
                      </Button>
                      <div className="relative flex w-full">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="Search ranks..."
                          onChange={handleSearchChange(
                            setRanksSearchText,
                            setRanksCurrentPage
                          )}
                          className="pl-9 bg-white border-gray-200 w-full rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto pt-3">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="w-12 text-center px-6 font-medium text-black">
                          No
                        </TableHead>
                        <TableHead className="text-center font-medium text-black">
                          Achievement Rank
                        </TableHead>
                        <TableHead className="text-center font-medium text-black">
                          Points
                        </TableHead>
                        <TableHead className="text-center font-medium text-black">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ranksData && paginatedRanks.length > 0 ? (
                        paginatedRanks.map((rank, index) => (
                          <TableRow
                            key={rank.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <TableCell className="text-center px-6 font-normal">
                              {(ranksCurrentPage - 1) * ranksRowsPerPage +
                                index +
                                1}
                            </TableCell>
                            <TableCell className="text-center font-normal">
                              <div className="font-medium text-gray-900">
                                {rank.rank}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                className={`text-white ${getPointBadgeClass(
                                  rank.point
                                )}`}
                              >
                                {rank.point}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center gap-3 items-center">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleEdit(rank)}
                                  className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 border-blue-200"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    confirmDelete(rank.id, false, rank.rank)
                                  }
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center py-12 text-gray-500"
                          >
                            <Award className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <p className="text-lg font-medium mb-2">
                              {ranksData && ranksData.length === 0
                                ? "No achievement ranks found"
                                : "Loading achievement ranks..."}
                            </p>
                            <p className="text-sm">
                              {ranksSearchText
                                ? "Try adjusting your search criteria"
                                : "Start by adding your first achievement rank"}
                            </p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  {/* Ranks Pagination */}
                  {ranksData && filteredRanks.length > 0 && (
                    <div className="px-4 sm:px-6 pt-4 pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center border-t space-y-4 sm:space-y-0">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="text-sm text-gray-500 text-center sm:text-left">
                          Showing {paginatedRanks.length} of{" "}
                          {filteredRanks.length} ranks
                        </div>
                        <div className="flex items-center justify-center sm:justify-start space-x-2">
                          <span className="text-sm text-gray-600">Rows:</span>
                          <Select
                            value={String(ranksRowsPerPage)}
                            onValueChange={(value) => {
                              setRanksRowsPerPage(parseInt(value));
                              setRanksCurrentPage(1);
                            }}
                          >
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
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-gray-700 rounded-lg h-8 w-8 hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors"
                          onClick={() =>
                            setRanksCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={ranksCurrentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="text-sm text-gray-600 px-2">
                          Page {ranksCurrentPage} of {ranksTotalPages}
                        </div>

                        <Button
                          variant="outline"
                          size="icon"
                          className="text-gray-700 rounded-lg h-8 w-8 hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors"
                          onClick={() =>
                            setRanksCurrentPage((prev) =>
                              Math.min(prev + 1, ranksTotalPages)
                            )
                          }
                          disabled={ranksCurrentPage >= ranksTotalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Achievement Levels Tab */}
              <TabsContent value="levels" className="mt-0">
                <div className="px-6 pt-4 pb-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Achievement Level Management
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <Button
                        onClick={handleAdd}
                        className="bg-green-500 hover:bg-green-600 text-white transition-all duration-300 w-full sm:w-auto"
                      >
                        <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="truncate">Add Achievement Level</span>
                      </Button>
                      <div className="relative flex w-full">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="Search levels..."
                          onChange={handleSearchChange(
                            setLevelsSearchText,
                            setLevelsCurrentPage
                          )}
                          className="pl-9 bg-white border-gray-200 w-full rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto pt-3">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="w-12 text-center px-6 font-medium text-black">
                          No
                        </TableHead>
                        <TableHead className="text-center font-medium text-black">
                          Achievement Level
                        </TableHead>
                        <TableHead className="text-center font-medium text-black">
                          Points
                        </TableHead>
                        <TableHead className="text-center font-medium text-black">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {levelsData && paginatedLevels.length > 0 ? (
                        paginatedLevels.map((level, index) => (
                          <TableRow
                            key={level.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <TableCell className="text-center px-6 font-normal">
                              {(levelsCurrentPage - 1) * levelsRowsPerPage +
                                index +
                                1}
                            </TableCell>
                            <TableCell className="text-center font-normal">
                              <div className="font-medium text-gray-900">
                                {level.level}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                className={`text-white ${getPointBadgeClass(
                                  level.point
                                )}`}
                              >
                                {level.point}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center gap-3 items-center">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleEdit(level)}
                                  className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 border-blue-200"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    confirmDelete(level.id, false, level.level)
                                  }
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center py-12 text-gray-500"
                          >
                            <Award className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <p className="text-lg font-medium mb-2">
                              {levelsData && levelsData.length === 0
                                ? "No achievement levels found"
                                : "Loading achievement levels..."}
                            </p>
                            <p className="text-sm">
                              {levelsSearchText
                                ? "Try adjusting your search criteria"
                                : "Start by adding your first achievement level"}
                            </p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  {/* Levels Pagination */}
                  {levelsData && filteredLevels.length > 0 && (
                    <div className="px-4 sm:px-6 pt-4 pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center border-t space-y-4 sm:space-y-0">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="text-sm text-gray-500 text-center sm:text-left">
                          Showing {paginatedLevels.length} of{" "}
                          {filteredLevels.length} levels
                        </div>
                        <div className="flex items-center justify-center sm:justify-start space-x-2">
                          <span className="text-sm text-gray-600">Rows:</span>
                          <Select
                            value={String(levelsRowsPerPage)}
                            onValueChange={(value) => {
                              setLevelsRowsPerPage(parseInt(value));
                              setLevelsCurrentPage(1);
                            }}
                          >
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
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-gray-700 rounded-lg h-8 w-8 hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors"
                          onClick={() =>
                            setLevelsCurrentPage((prev) =>
                              Math.max(prev - 1, 1)
                            )
                          }
                          disabled={levelsCurrentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="text-sm text-gray-600 px-2">
                          Page {levelsCurrentPage} of {levelsTotalPages}
                        </div>

                        <Button
                          variant="outline"
                          size="icon"
                          className="text-gray-700 rounded-lg h-8 w-8 hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors"
                          onClick={() =>
                            setLevelsCurrentPage((prev) =>
                              Math.min(prev + 1, levelsTotalPages)
                            )
                          }
                          disabled={levelsCurrentPage >= levelsTotalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={
          isAddDialogOpen ? setIsAddDialogOpen : setIsEditDialogOpen
        }
      >
        <DialogContent className="max-w-[95vw] sm:max-w-[500px] lg:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900">
              {getDialogTitle()}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              {editingItem
                ? "Modify the selected item details"
                : "Create a new item"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {renderFormFields()}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmSave}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                {editingItem ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      {confirmationModal && (
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal(null)}
          onConfirm={confirmationModal.onConfirm}
          title={confirmationModal.title}
          description={confirmationModal.description}
          confirmText={confirmationModal.confirmText}
          type={confirmationModal.type}
        />
      )}
    </div>
  );
};

export default ViewManageRules;
