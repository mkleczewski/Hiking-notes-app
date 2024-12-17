'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PathFilters from './PathFilters';

interface FilterModalProps {
  onFilterChange: (filters: any) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ onFilterChange }) => {
  const [open, setOpen] = React.useState(false);

  const handleFilterApply = (filters: any) => {
    onFilterChange(filters);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Filtry</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filtry</DialogTitle>
        </DialogHeader>
        <PathFilters onFilterChange={handleFilterApply} />
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
