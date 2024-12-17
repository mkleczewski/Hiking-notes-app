"use client";

import { Card, CardContent, CardFooter,CardHeader } from "@/components/ui/card";

import { BackButton } from "./back-button";
import { Header } from "./header";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
}: CardWrapperProps) => {
  return (
    <Card className="w-[600px] rounded-2xl border-l-[10px] border-t-[10px] border-l-gray-300 border-t-gray-200/70 bg-white p-6 shadow-xl">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
   <CardFooter>
    <BackButton label={backButtonLabel} href={backButtonHref}/>
   </CardFooter>
    </Card>
  );
};
