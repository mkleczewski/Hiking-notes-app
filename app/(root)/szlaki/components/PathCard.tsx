import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

const PathCard = ({ path }) => {
  return (
    <Card key={path.id} className={`relative ${path.visited ? 'bg-green-50' : ''}`}>
      <CardHeader className="p-6">
        <div className="flex w-full items-start justify-between">
          <div className="flex flex-col">
            <span className="font-bold">GOT Punkty</span>
            <div>
              Wejście: <strong>{path.startPointDistance}</strong>
            </div>
            <div>
              Zejście: <strong>{path.endPointDistance}</strong>
            </div>
          </div>
          {path.visited && (
            <Badge variant="success" className="absolute top-2 right-2">
              Odwiedzony
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <img
          src={path.image || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'}
          alt={path.name}
          className="mb-4 h-40 w-full rounded object-cover"
        />
        <div className="mb-2 flex flex-col justify-center gap-2">
          <div className="flex items-center">
            <MapPin className="mr-1" size={16} />
            <span className="text-sm">{path.startPlace.name}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-1" size={16} />
            <span className="text-sm">{path.endPlace.name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PathCard;
