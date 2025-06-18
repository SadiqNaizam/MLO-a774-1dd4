import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface RestaurantCardProps {
  id: string | number;
  name: string;
  imageUrl: string;
  cuisineTypes: string[];
  rating?: number; // e.g., 4.5
  deliveryTime?: string; // e.g., "25-35 min"
  onClick: (id: string | number) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  imageUrl,
  cuisineTypes,
  rating,
  deliveryTime,
  onClick,
}) => {
  console.log("Rendering RestaurantCard:", name);

  return (
    <Card
      className="w-full overflow-hidden transition-all hover:shadow-lg cursor-pointer"
      onClick={() => onClick(id)}
    >
      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 9}>
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={name}
            className="object-cover w-full h-full"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
        <div className="flex flex-wrap gap-1">
          {cuisineTypes.slice(0, 3).map((cuisine) => (
            <Badge key={cuisine} variant="secondary" className="text-xs">
              {cuisine}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          {rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
          {deliveryTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{deliveryTime}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full">
          View Menu
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RestaurantCard;