import { cn } from "@/lib/utils";

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div
      className={cn("w-full flex flex-col gap-y-4 items-center justify-center")}
    >
      <h1 className="text-3xl font-semibold">🏔️ Witamy Cię</h1>
      <p className='text-muted-foreground text-sm'>{label}</p>
    </div>
  );
};
