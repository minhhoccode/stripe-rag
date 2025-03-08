import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface ModelSearchFilterProps {
  searchTerm: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ModelSearchFilter: React.FC<ModelSearchFilterProps> = ({
  searchTerm,
  handleSearch,
}) => {
  return (
    <div className="mt-6 flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search models..."
          className="w-full pl-8"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <Button variant="outline">Filter</Button>
    </div>
  );
};

export default ModelSearchFilter;
