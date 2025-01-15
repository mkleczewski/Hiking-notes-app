import { Card, CardFooter, CardHeader } from "@/components/ui/card";

import { BackButton } from "./back-button";
import { Header } from "./header";

export const ErrorCard = () => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label="Oops! Coś poszło nie tak!" />
      </CardHeader>
      <CardFooter>
        <BackButton label="Wróć do logowania" href="/auth/login" />
      </CardFooter>
    </Card>
  );
};
