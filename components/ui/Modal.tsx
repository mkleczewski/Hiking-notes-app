'use client';

import { cn } from '@/helpers/cn';

import { Dialog, DialogContent, DialogOverlay } from './dialog';
import { useRouter } from 'next/navigation';

export function Modal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();

  const handleOpenChange = () => {
    router.back();
  };

  return (
    <Dialog defaultOpen={true} open={true} onOpenChange={handleOpenChange}>
      <DialogOverlay className="bg-transparent">
        <DialogContent
          className={cn('w-full min-w-[650px] overflow-y-hidden', className)}
        >
          {children}
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
