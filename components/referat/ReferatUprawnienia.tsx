'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Leaders, ResponseData } from '@/schemas/index';

import PermissionPanel from './PermissionsPanel';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface ReferatUprawnieniaProps {
  leaders: Leaders;
  privileges: ResponseData;
}

const ReferatUprawnienia: React.FC<ReferatUprawnieniaProps> = ({
  leaders,
  privileges,
}) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const [selectedLeader, setSelectedLeader] = useState<string | null>(null);

  useEffect(() => {
    const leaderFromParams = searchParams.get('leader');
    if (leaderFromParams) {
      setSelectedLeader(leaderFromParams);
    }
  }, [searchParams]);

  const handleSearch = (term: string) => {
    setSelectedLeader(term);

    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('leader', term);
    } else {
      params.delete('leader');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">
        Referat Górskiej Odznaki GOT PTTK
      </h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lista Przodowników</CardTitle>
            <CardDescription>
              Wybierz przodownika, aby zarządzać uprawnieniami
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {leaders.map((leader) => (
                <Button
                  key={leader.id}
                  variant={
                    selectedLeader === leader?.id ? 'secondary' : 'ghost'
                  }
                  className="mb-2 w-full justify-start"
                  onClick={() => handleSearch(leader?.id)}
                >
                  {leader?.name || 'Brak imienia'}
                </Button>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
        {selectedLeader && (
          <PermissionPanel leader={selectedLeader} privileges={privileges} />
        )}
      </div>
    </div>
  );
};

export { ReferatUprawnienia };
