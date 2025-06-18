import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import MenuItemCard from '@/components/MenuItemCard';
// QuantityInput is part of MenuItemCard, not directly used here unless standalone
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ShoppingCart, Star, Clock, Utensils, Info } from 'lucide-react';

// Placeholder restaurant and menu data
const sampleRestaurantDetails = {
  '1': {
    id: '1',
    name: 'Pizza Heaven',
    imageUrl: 'https://via.placeholder.com/150x150?text=Pizza+Heaven+Logo',
    cuisineTypes: ['Pizza', 'Italian'],
    rating: 4.5,
    deliveryTime: '25-35 min',
    address: '123 Pizza St, Flavor Town',
    description: 'The best authentic Italian pizzas in town. Fresh ingredients, classic recipes.',
    menu: [
      { id: 'm1', name: 'Margherita Pizza', description: 'Classic cheese and tomato', price: 12.99, imageUrl: 'https://via.placeholder.com/100x100?text=Margherita' },
      { id: 'm2', name: 'Pepperoni Pizza', description: 'Loaded with pepperoni', price: 14.99, imageUrl: 'https://via.placeholder.com/100x100?text=Pepperoni' },
      { id: 'm3', name: 'Garlic Bread', description: 'With cheese option', price: 5.50, imageUrl: 'https://via.placeholder.com/100x100?text=Garlic+Bread' },
      { id: 'm4', name: 'Pasta Carbonara', description: 'Creamy and delicious', price: 13.00, imageUrl: 'https://via.placeholder.com/100x100?text=Carbonara' },
    ]
  },
  // Add more restaurants if needed for testing
};

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface Restaurant {
  id: string;
  name: string;
  imageUrl: string;
  cuisineTypes: string[];
  rating: number;
  deliveryTime: string;
  address: string;
  description: string;
  menu: MenuItem[];
}


const RestaurantMenuPage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<Map<string, number>>(new Map()); // Map<itemId, quantity>
  const [selectedItemForDialog, setSelectedItemForDialog] = useState<MenuItem | null>(null);


  useEffect(() => {
    console.log(`RestaurantMenuPage loaded for ID: ${restaurantId}`);
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const foundRestaurant = (sampleRestaurantDetails as Record<string, Restaurant>)[restaurantId || ''];
      if (foundRestaurant) {
        setRestaurant(foundRestaurant);
      } else {
        // Handle restaurant not found, e.g., navigate to 404 or show message
        console.error(`Restaurant with ID ${restaurantId} not found.`);
      }
      setIsLoading(false);
    }, 1000);
  }, [restaurantId]);

  const handleAddToCart = (itemId: string | number, quantity: number) => {
    console.log(`Adding item ${itemId} (quantity: ${quantity}) to cart.`);
    setCart(prevCart => {
      const newCart = new Map(prevCart);
      newCart.set(String(itemId), (newCart.get(String(itemId)) || 0) + quantity);
      return newCart;
    });
    // Here you would typically update a global cart state or make an API call
    // For now, just log and potentially show a toast
    // For the dialog:
    if (selectedItemForDialog) {
        // logic to add item from dialog, quantity from dialog state
        setSelectedItemForDialog(null); // Close dialog
    }
  };
  
  const totalCartItems = Array.from(cart.values()).reduce((sum, qty) => sum + qty, 0);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 bg-white shadow-md">
         <NavigationMenu className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 justify-between">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="mr-2 h-5 w-5" /> Back</Button>
                </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Button variant="outline" onClick={() => navigate('/cart')}>
                        <ShoppingCart className="mr-2 h-5 w-5" /> Cart ({totalCartItems})
                    </Button>
                </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-32 w-full mb-4 rounded-lg" /> {/* Restaurant Header Skeleton */}
          <Skeleton className="h-10 w-1/3 mb-6" /> {/* Menu Title Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-lg" />)} {/* MenuItem Skeletons */}
          </div>
        </main>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Utensils className="h-24 w-24 text-gray-400 mb-4" />
        <h1 className="text-2xl font-semibold">Restaurant Not Found</h1>
        <p className="text-gray-600 mb-4">We couldn't find the restaurant you're looking for.</p>
        <Button onClick={() => navigate('/')}>Go to Homepage</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <NavigationMenu className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 justify-between">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Button variant="ghost" onClick={() => navigate('/')}><ArrowLeft className="mr-2 h-5 w-5" /> Restaurants</Button>
                </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuList>
                <NavigationMenuItem>
                     <a href="/" className="text-xl font-bold text-green-600 flex items-center">
                        <Utensils className="mr-2 h-6 w-6" /> {restaurant.name}
                    </a>
                </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Button variant="solid" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => navigate('/cart')}>
                        <ShoppingCart className="mr-2 h-5 w-5" /> Cart ({totalCartItems})
                    </Button>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-8 p-6 bg-white rounded-lg shadow-lg flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-2 border-green-500">
            <AvatarImage src={restaurant.imageUrl} alt={restaurant.name} />
            <AvatarFallback>{restaurant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">{restaurant.name}</h1>
            <div className="flex flex-wrap gap-2 my-2 justify-center md:justify-start">
              {restaurant.cuisineTypes.map(cuisine => (
                <Badge key={cuisine} variant="secondary">{cuisine}</Badge>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 justify-center md:justify-start">
              <span className="flex items-center"><Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" /> {restaurant.rating.toFixed(1)}</span>
              <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {restaurant.deliveryTime}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">{restaurant.address}</p>
             <Dialog>
                <DialogTrigger asChild>
                    <Button variant="link" size="sm" className="text-green-600 hover:text-green-700 mt-1 px-0">
                        <Info className="w-4 h-4 mr-1" /> More Info
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{restaurant.name} - Details</DialogTitle>
                        <DialogDescription className="pt-2">
                            {restaurant.description || "No additional description available."}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {/* Close dialog, not strictly needed if controlled by DialogTrigger */}}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">Menu</h2>
          <ScrollArea className="h-[calc(100vh-350px)] pr-3"> {/* Adjust height */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {restaurant.menu.map(item => (
                <MenuItemCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  imageUrl={item.imageUrl}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </ScrollArea>
        </section>
      </main>
      <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
        <p>&copy; {new Date().getFullYear()} {restaurant.name}. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default RestaurantMenuPage;