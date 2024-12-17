'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { Check, ChevronsUpDown } from 'lucide-react';

interface OdznakaData {
  id: string;
  title: string;
  pointsRequired: number; // Zakładamy, że jest liczba punktów
}

interface ComboboxDemoProps {
  data: OdznakaData[];
  placeholder: string;
  onSelect: (value: string) => void;
}

export function ComboboxDemo({
  data,
  placeholder,
  onSelect,
}: ComboboxDemoProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>(''); // Przechowuje id wybranego elementu

  const selectedItem = React.useMemo(
    () => data.find((item) => item.id === value),
    [data, value]
  );

  // Wyświetlany tekst w przycisku (tytuł + punkty)
  const displayText = selectedItem
    ? `${selectedItem.title} (${selectedItem.pointsRequired} pkt)`
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-white"
        >
          {displayText}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full bg-white p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
          />
          <CommandList>
            <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    setOpen(false);
                    onSelect(currentValue);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === item.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {item.title} ({item.pointsRequired} pkt)
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
