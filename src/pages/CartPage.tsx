import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import MenuItemCard from '@/components/MenuItemCard'; // Used for displaying cart items
// QuantityInput is part of MenuItemCard
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Trash2, Tag, Utensils, ShoppingBag } from 'lucide-react';

// Simulate cart data. In a real app, this would come from global state/context/API
interface CartItem extends Omit<MenuItemCardProps, 'onAddToCart' | 'isCartView'> {
  quantityInCart: number;
}

const initialCartItems: CartItem[] = [
  { id: 'm1', name: 'Margherita Pizza', description: 'Classic cheese and tomato', price: 12.99, imageUrl: 'https://via.placeholder.com/80x80?text=Pizza', quantityInCart: 2 },
  { id: 'm3', name: 'Garlic Bread', description: 'With cheese option', price: 5.50, imageUrl: 'https://via.placeholder.com/80x80?text=GarlicBread', quantityInCart: 1 },
];


const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('CartPage loaded');
    // Potentially fetch cart from localStorage or API if needed
  }, []);

  const handleQuantityChange = (itemId: string | number, newQuantity: number) => {
    console.log(`Quantity changed for item ${itemId} to ${newQuantity}`);
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantityInCart: newQuantity } : item
      ).filter(item => item.quantityInCart > 0) // Remove if quantity is 0
    );
  };

  const handleRemoveFromCart = (itemId: string | number) => {
    console.log(`Removing item ${itemId} from cart`);
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantityInCart, 0);
  const taxRate = 0.08; // Example tax rate
  const taxes = subtotal * taxRate;
  const deliveryFee = subtotal > 0 ? 5.00 : 0; // Example delivery fee
  const discount = promoCode.toLowerCase() === 'SAVE10' ? subtotal * 0.10 : 0; // Example promo
  const grandTotal = subtotal + taxes + deliveryFee - discount;


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
       <header className="sticky top-0 z-50 bg-white shadow-md">
        <NavigationMenu className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 justify-between">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="mr-2 h-5 w-5" /> Continue Shopping</Button>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuList>
            <NavigationMenuItem>
              <a href="/" className="text-xl font-bold text-green-600 flex items-center">
                <ShoppingBag className="mr-2 h-6 w-6" /> Your Cart
              </a>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuList>
            {/* Placeholder for potential user/profile icon */}
          </NavigationMenuList>
        </NavigationMenu>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <Card className="text-center p-10">
            <CardHeader>
              <Utensils className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <CardTitle className="text-2xl font-semibold">Your Cart is Empty</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
              <Button size="lg" onClick={() => navigate('/')} className="bg-green-600 hover:bg-green-700">
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2">
              <h2 className="text-2xl font-semibold mb-6 text-gray-700">Review Your Order ({cartItems.reduce((acc, item) => acc + item.quantityInCart, 0)} items)</h2>
              <ScrollArea className="h-[calc(100vh-350px)] pr-2"> {/* Adjust height */}
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <MenuItemCard
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      description={item.description}
                      price={item.price}
                      imageUrl={item.imageUrl}
                      quantityInCart={item.quantityInCart}
                      onQuantityChange={handleQuantityChange}
                      onRemoveFromCart={handleRemoveFromCart}
                      isCartView={true}
                    />
                  ))}
                </div>
              </ScrollArea>
            </section>

            <section className="lg:col-span-1">
              <Card className="sticky top-24 shadow-lg"> {/* Sticky summary card */}
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes ({(taxRate * 100).toFixed(0)}%)</span>
                    <span>${taxes.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (SAVE10)</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Grand Total</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                  <div className="pt-2">
                    <label htmlFor="promo-code" className="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
                    <div className="flex gap-2">
                      <Input
                        id="promo-code"
                        type="text"
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-grow"
                      />
                      <Button variant="outline" onClick={() => alert(promoCode.toLowerCase() === 'save10' ? 'Promo applied!' : 'Invalid promo code')} className="whitespace-nowrap">
                         <Tag className="mr-2 h-4 w-4" /> Apply
                      </Button>
                    </div>
                     {promoCode && promoCode.toLowerCase() === 'save10' && <p className="text-xs text-green-600 mt-1">"SAVE10" applied for 10% off!</p>}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => navigate('/checkout')}
                    disabled={cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            </section>
          </div>
        )}
      </main>
      <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
        <p>&copy; {new Date().getFullYear()} FoodFleet. Secure Shopping.</p>
      </footer>
    </div>
  );
};

export default CartPage;