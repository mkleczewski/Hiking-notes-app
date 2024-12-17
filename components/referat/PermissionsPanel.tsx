'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/helpers/cn';
import { toggleSubregionPrivilege } from '@/lib/actions/referat.action';
import { ResponseData } from '@/schemas/index';

import { ChevronRight } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

type SubregionPrivilege = {
  subregionId: string;
  timeoutPrivileges: Date | null;
};

type FormData = {
  [subregionId: string]: boolean;
};

const PermissionPanel = ({
  leader,
  privileges,
}: {
  leader: string;
  privileges: ResponseData;
}) => {
  const [expandedRegions, setExpandedRegions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const getInitialFormData = () => {
    const formData: FormData = {};

    privileges.regions.forEach((region) => {
      region.subregions.forEach((subregion) => {
        const hasPrivilege = subregion.privileges.some(
          (privilege: { userId: string }) => privilege.userId === leader
        );
        formData[subregion.id] = hasPrivilege;
      });
    });

    return formData;
  };

  const initialFormData = getInitialFormData();

  const { control, handleSubmit, reset } = useForm<FormData>({
    values: initialFormData,
  });

  useEffect(() => {
    reset(getInitialFormData());
  }, [leader, privileges, reset]);

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    const now = new Date();
    const threeYearsLater = new Date(now.setFullYear(now.getFullYear() + 3));

    const permissions = Object.entries(data).reduce<SubregionPrivilege[]>(
      (acc, [subregionId, hasPermission]) => {
        if (hasPermission) {
          acc.push({
            subregionId,
            timeoutPrivileges: threeYearsLater,
          });
        }
        return acc;
      },
      []
    );

    try {
      const response = await toggleSubregionPrivilege(leader, permissions);
      setIsLoading(false);
      if (response.error) {
        throw new Error(response.error);
      } else {
        toast.success('Zapisano uprawnienia');
      }
    } catch (error: unknown) {
      throw new Error('Failed to save permissions:', error as Error);
    }
  });

  const toggleRegionExpansion = (regionId: string) => {
    setExpandedRegions((prev) =>
      prev.includes(regionId)
        ? prev.filter((id) => id !== regionId)
        : [...prev, regionId]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista regionów</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {privileges.regions.map((region) => (
            <Collapsible
              key={region.id}
              open={expandedRegions.includes(region.id)}
              onOpenChange={() => toggleRegionExpansion(region.id)}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="mb-2 w-full justify-between">
                  {region.name}

                  <ChevronRight
                    className={cn(
                      'h-4 w-4 transition-transform duration-200',
                      expandedRegions.includes(region.id) && 'rotate-90'
                    )}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {region.subregions.map((subregion) => {
                  return (
                    <div
                      key={subregion.id}
                      className="mb-2 ml-4 flex items-center space-x-2"
                    >
                      <Controller
                        name={subregion.id}
                        control={control}
                        render={({ field }) => (
                          <>
                            <Checkbox
                              id={`subregion-${subregion.id}`}
                              checked={field.value || false}
                              onCheckedChange={(checked) =>
                                field.onChange(checked)
                              }
                            />
                            <label
                              htmlFor={`subregion-${subregion.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {subregion.name}
                            </label>
                          </>
                        )}
                      />
                    </div>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </ScrollArea>
        <div className="flex justify-end">
          <Button className="m-6" onClick={onSubmit} disabled={isLoading}>
            Zapisz uprawnienia
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionPanel;
