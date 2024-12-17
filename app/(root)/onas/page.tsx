import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone } from 'lucide-react';

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">O nas</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Nasz serwis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Witamy w serwisie do zdobywania odznak GOT PTTK! Nasza platforma
              oferuje następujące funkcje:
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>Prowadzenie elektronicznej ewidencji wypraw górskich</li>
              <li>
                Cyfrowy dziennik/książeczka z zapisem wszystkich Twoich wypraw
              </li>
              <li>System śledzenia postępów w zdobywaniu odznak GOT PTTK</li>
              <li>
                Możliwość weryfikacji i zatwierdzania wpisów przez uprawnionych
                przodowników
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kontakt z administratorami</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>admin@got-pttk.pl</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>+48 123 456 789</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
