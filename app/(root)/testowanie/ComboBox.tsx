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

interface ComboboxDemoProps {
  data: { id: string; name: string }[];
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

  console.log('data', data);
  console.log('value', value);

  // Znajdź wybrany element na podstawie id
  const selectedItem = React.useMemo(
    () => data.find((item) => item.id === value),
    [data, value]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-white"
        >
          {/* Wyświetl name wybranego elementu lub placeholder */}
          {selectedItem ? selectedItem.name : placeholder}
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
                  key={item.id} // Używaj unikalnego id jako klucza
                  value={item.id} // Ustaw value jako id
                  onSelect={(currentValue) => {
                    // Jeśli kliknięto już wybraną opcję, odznacz ją
                    const newValue = currentValue === value ? '' : currentValue;
                    setValue(newValue);
                    setOpen(false);
                    onSelect(newValue);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === item.id ? 'opacity-100' : 'opacity-0' // Sprawdź, czy id jest wybrane
                    )}
                  />
                  {item.name} {/* Wyświetl name jako tekst opcji */}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
