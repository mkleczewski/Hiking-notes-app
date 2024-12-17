import { cn } from "@/lib/utils";

import { Mountain } from "lucide-react";

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div
      className={cn("w-full flex flex-col gap-y-4 items-center justify-center")}
    >
      <h1 className="flex items-center justify-center gap-3 text-3xl font-semibold"><Mountain/> GOT PTTK</h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};
