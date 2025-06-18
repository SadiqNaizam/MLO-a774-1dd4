import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from 'lucide-react';

interface QuantityInputProps {
  initialQuantity?: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

const QuantityInput: React.FC<QuantityInputProps> = ({
  initialQuantity = 1,
  onQuantityChange,
  min = 1,
  max = 99,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  const handleDecrement = () => {
    const newQuantity = Math.max(min, quantity - 1);
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
    console.log("Quantity decremented to:", newQuantity);
  };

  const handleIncrement = () => {
    const newQuantity = Math.min(max, quantity + 1);
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
    console.log("Quantity incremented to:", newQuantity);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      value = min; // Or handle as an error, or keep previous value
    } else if (value < min) {
      value = min;
    } else if (value > max) {
      value = max;
    }
    setQuantity(value);
    onQuantityChange(value);
    console.log("Quantity changed via input to:", value);
  };

  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={handleDecrement}
        disabled={quantity <= min}
      >
        <Minus className="h-4 w-4" />
        <span className="sr-only">Decrease quantity</span>
      </Button>
      <Input
        type="number"
        className="w-12 h-8 text-center mx-1 focus-visible:ring-0 focus-visible:ring-offset-0"
        value={quantity}
        onChange={handleChange}
        min={min}
        max={max}
        readOnly // Or implement debounced input handling
      />
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={handleIncrement}
        disabled={quantity >= max}
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Increase quantity</span>
      </Button>
    </div>
  );
};

export default QuantityInput;