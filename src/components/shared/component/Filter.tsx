import * as React from "react";
import { Filter, X, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Types for filter configuration
export interface FilterField {
  key: string;
  label: string;
  type: 'select' | 'search' | 'date' | 'number' | 'dateRange' | 'numberRange';
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  width?: 'full' | 'half' | 'third';
}

export interface FilterConfig {
  fields: FilterField[];
  searchFields?: string[]; // Fields to search in when using search filter
}

export interface FilterValues {
  [key: string]: string | number | undefined;
}

// Generic type for data items
export interface DataItem {
  [key: string]: unknown;
}

export interface FilterSystemProps {
  config: FilterConfig;
  filters: FilterValues;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  activeFilterCount?: number;
  data?: DataItem[]; // Properly typed data array
  children?: React.ReactNode; // For additional controls like DatePicker
}

export function FilterSystem({
  config,
  filters,
  onFilterChange,
  onClearFilters,
  showFilters,
  onToggleFilters,
  activeFilterCount = 0,
  data = [],
  children
}: FilterSystemProps) {
  const hasActiveFilters = activeFilterCount > 0;

  // Generate options for select fields from data
  const generateOptions = (field: FilterField): Array<{ value: string; label: string }> => {
    if (field.options) return field.options;
    
    if (data.length === 0) return [];
    
    // Extract unique values from data based on field key
    const uniqueValues = [...new Set(data.map(item => item[field.key]))].filter(Boolean);
    return uniqueValues.map(value => ({
      value: String(value),
      label: String(value)
    }));
  };

  const renderFilterField = (field: FilterField) => {
    const value = filters[field.key] || "";
    
    switch (field.type) {
      case 'search': {
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{field.label}</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder={field.placeholder || `Cari ${field.label.toLowerCase()}...`}
                value={value}
                onChange={(e) => onFilterChange(field.key, e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        );
      }

      case 'select': {
        const options = generateOptions(field);
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{field.label}</label>
            <Select
              value={String(value)}
              onValueChange={(newValue) => onFilterChange(field.key, newValue)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder={field.placeholder || `Semua ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{field.placeholder || `Semua ${field.label.toLowerCase()}`}</SelectItem>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      }

      case 'date': {
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{field.label}</label>
            <input
              type="date"
              value={String(value)}
              onChange={(e) => onFilterChange(field.key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
            />
          </div>
        );
      }

      case 'number': {
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{field.label}</label>
            <input
              type="number"
              placeholder={field.placeholder || "0"}
              value={String(value)}
              onChange={(e) => onFilterChange(field.key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
            />
          </div>
        );
      }

      case 'dateRange': {
        // Expecting field.key to be like "dateFrom" and "dateTo"
        const fromKey = `${field.key}From`;
        const toKey = `${field.key}To`;
        return (
          <div className="space-y-2 col-span-2">
            <label className="text-sm font-medium text-gray-700">{field.label}</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                placeholder="Dari"
                value={String(filters[fromKey] || "")}
                onChange={(e) => onFilterChange(fromKey, e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
              />
              <input
                type="date"
                placeholder="Sampai"
                value={String(filters[toKey] || "")}
                onChange={(e) => onFilterChange(toKey, e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
              />
            </div>
          </div>
        );
      }

      case 'numberRange': {
        // Expecting field.key to be like "points" and will create "pointsMin" and "pointsMax"
        const minKey = `${field.key}Min`;
        const maxKey = `${field.key}Max`;
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{field.label}</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                value={String(filters[minKey] || "")}
                onChange={(e) => onFilterChange(minKey, e.target.value)}
                className="w-20 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={String(filters[maxKey] || "")}
                onChange={(e) => onFilterChange(maxKey, e.target.value)}
                className="w-20 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
              />
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {hasActiveFilters && (
          <>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {activeFilterCount} filter aktif
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
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
          onClick={onToggleFilters}
          className={`h-8 ${showFilters ? "bg-blue-50 text-blue-600 border-blue-200" : ""}`}
        >
          <Filter className="h-3 w-3 mr-1" />
          Filter
        </Button>
      </div>
      
      {children && (
        <div className="border-l border-gray-200 pl-3">
          {children}
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-4 pt-4 border-t border-gray-200 bg-gray-50/50 -mx-6 px-6 pb-4 z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {config.fields.map((field) => (
              <div
                key={field.key}
                className={
                  field.width === 'full' ? 'col-span-full' :
                  field.width === 'half' ? 'col-span-2' :
                  field.type === 'dateRange' ? 'col-span-2' :
                  ''
                }
              >
                {renderFilterField(field)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Hook for managing filter state
export function useFilterSystem(initialFilters: FilterValues = {}) {
  const [filters, setFilters] = React.useState<FilterValues>(initialFilters);
  const [showFilters, setShowFilters] = React.useState(false);

  const handleFilterChange = React.useCallback((key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const clearFilters = React.useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const toggleFilters = React.useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  const activeFilterCount = React.useMemo(() => {
    return Object.values(filters).filter(value => value !== "" && value !== undefined && value !== null).length;
  }, [filters]);

  const hasActiveFilters = activeFilterCount > 0;

  return {
    filters,
    setFilters,
    showFilters,
    handleFilterChange,
    clearFilters,
    toggleFilters,
    activeFilterCount,
    hasActiveFilters
  };
}