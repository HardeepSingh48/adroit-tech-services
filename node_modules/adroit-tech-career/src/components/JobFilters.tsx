import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { cities, jobTypes, shifts, experienceLevels } from "@/data/jobs";
import { X, SlidersHorizontal } from "lucide-react";

interface JobFiltersProps {
  filters: {
    city: string;
    type: string[];
    shift: string[];
    experience: string;
    salaryRange: [number, number];
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    city: string;
    type: string[];
    shift: string[];
    experience: string;
    salaryRange: [number, number];
  }>>;
  onClose?: () => void;
}

const JobFilters = ({ filters, setFilters, onClose }: JobFiltersProps) => {
  const handleTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setFilters((prev) => ({ ...prev, type: [...prev.type, type] }));
    } else {
      setFilters((prev) => ({
        ...prev,
        type: prev.type.filter((t) => t !== type),
      }));
    }
  };

  const handleShiftChange = (shift: string, checked: boolean) => {
    if (checked) {
      setFilters((prev) => ({ ...prev, shift: [...prev.shift, shift] }));
    } else {
      setFilters((prev) => ({
        ...prev,
        shift: prev.shift.filter((s) => s !== shift),
      }));
    }
  };

  const clearFilters = () => {
    setFilters({
      city: "",
      type: [],
      shift: [],
      experience: "",
      salaryRange: [10000, 40000],
    });
  };

  return (
    <div className="bg-card rounded-xl p-5 md:p-6 shadow-card border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <h3 className="font-display text-lg font-bold text-foreground">Filters</h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-2">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Location */}
        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">
            Location
          </Label>
          <select
            value={filters.city}
            onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
            className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          >
            <option value="">All Locations</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Job Type */}
        <div>
          <Label className="text-sm font-semibold text-foreground mb-3 block">
            Job Type
          </Label>
          <div className="space-y-2">
            {jobTypes.map((type) => (
              <div key={type} className="flex items-center gap-3">
                <Checkbox
                  id={`type-${type}`}
                  checked={filters.type.includes(type)}
                  onCheckedChange={(checked) =>
                    handleTypeChange(type, checked as boolean)
                  }
                  className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label
                  htmlFor={`type-${type}`}
                  className="text-sm text-foreground cursor-pointer"
                >
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Shift */}
        <div>
          <Label className="text-sm font-semibold text-foreground mb-3 block">
            Shift Preference
          </Label>
          <div className="space-y-2">
            {shifts.map((shift) => (
              <div key={shift} className="flex items-center gap-3">
                <Checkbox
                  id={`shift-${shift}`}
                  checked={filters.shift.includes(shift)}
                  onCheckedChange={(checked) =>
                    handleShiftChange(shift, checked as boolean)
                  }
                  className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label
                  htmlFor={`shift-${shift}`}
                  className="text-sm text-foreground cursor-pointer"
                >
                  {shift}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">
            Experience Level
          </Label>
          <select
            value={filters.experience}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, experience: e.target.value }))
            }
            className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          >
            <option value="">All Levels</option>
            {experienceLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Salary Range */}
        <div>
          <Label className="text-sm font-semibold text-foreground mb-3 block">
            Salary Range
          </Label>
          <Slider
            value={filters.salaryRange}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                salaryRange: value as [number, number],
              }))
            }
            min={10000}
            max={40000}
            step={1000}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹{filters.salaryRange[0].toLocaleString()}</span>
            <span>₹{filters.salaryRange[1].toLocaleString()}</span>
          </div>
        </div>

        {/* Clear Filters */}
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
};

export default JobFilters;
