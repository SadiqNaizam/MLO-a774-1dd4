import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { PlusCircle } from 'lucide-react';
import QuantityInput from './QuantityInput'; // Assuming QuantityInput is in the same directory

interface MenuItemCardProps {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  onAddToCart?: (id: string | number, quantity: number) => void;
  // Props for cart page variant
  quantityInCart?: number;
  onQuantityChange?: (id: string | number, newQuantity: number) => void;
  onRemoveFromCart?: (id: string | number) => void;
  isCartView?: boolean;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  onAddToCart,
  quantityInCart,
  onQuantityChange,
  onRemoveFromCart,
  isCartView = false,
}) => {
  console.log("Rendering MenuItemCard:", name, "isCartView:", isCartView);
  const [currentQuantity, setCurrentQuantity] = React.useState(1);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(id, currentQuantity);
      console.log(`Added ${currentQuantity} of ${name} (ID: ${id}) to cart.`);
      // Potentially show a toast notification
    }
  };

  const handleQuantityUpdate = (newQuantity: number) => {
    if (isCartView && onQuantityChange) {
        onQuantityChange(id, newQuantity);
    } else {
        setCurrentQuantity(newQuantity);
    }
  };

  return (
    <Card className="w-full flex flex-col sm:flex-row overflow-hidden">
      {imageUrl && (
        <div className="sm:w-1/3 w-full">
          <AspectRatio ratio={isCartView ? 1 : 4 / 3} className="sm:h-full">
            <img
              src={imageUrl || '/placeholder.svg'}
              alt={name}
              className="object-cover w-full h-full"
              onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
            />
          </AspectRatio>
        </div>
      )}
      <div className={`flex flex-col justify-between p-4 ${imageUrl ? 'sm:w-2/3 w-full' : 'w-full'}`}>
        <div>
          <CardHeader className="p-0 mb-2">
            <CardTitle className="text-md font-semibold">{name}</CardTitle>
          </CardHeader>
          <CardContent className="p-0 mb-2">
            {description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {description}
              </p>
            )}
            <p className="text-sm font-medium mt-1">${price.toFixed(2)}</p>
          </CardContent>
        </div>
        <CardFooter className="p-0 flex items-center justify-between gap-2">
          {isCartView && onQuantityChange ? (
            <QuantityInput
              initialQuantity={quantityInCart || 0}
              onQuantityChange={handleQuantityUpdate}
              min={0} // Allow setting to 0 to remove from cart via quantity
            />
          ) : (
             onAddToCart && (
                <QuantityInput
                    initialQuantity={currentQuantity}
                    onQuantityChange={setCurrentQuantity}
                    min={1}
                />
             )
          )}
          {isCartView && onRemoveFromCart && (
            <Button variant="outline" size="sm" onClick={() => onRemoveFromCart(id)}>
              Remove
            </Button>
          )}
          {!isCartView && onAddToCart && (
            <Button size="sm" onClick={handleAddToCart}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add
            </Button>
          )}
        </CardFooter>
      </div>
    </Card>
  );
};

export default MenuItemCard;