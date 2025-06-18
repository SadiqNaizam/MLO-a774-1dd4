import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import RestaurantCard from '@/components/RestaurantCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Utensils, MapPin, Star } from 'lucide-react';

// Placeholder restaurant data
const sampleRestaurants = [
  { id: '1', name: 'Pizza Heaven', imageUrl: 'https://via.placeholder.com/300x200?text=Pizza+Place', cuisineTypes: ['Pizza', 'Italian'], rating: 4.5, deliveryTime: '25-35 min' },
  { id: '2', name: 'Burger Hub', imageUrl: 'https://via.placeholder.com/300x200?text=Burger+Joint', cuisineTypes: ['Burgers', 'American'], rating: 4.2, deliveryTime: '20-30 min' },
  { id: '3', name: 'Sushi World', imageUrl: 'https://via.placeholder.com/300x200?text=Sushi+Restaurant', cuisineTypes: ['Sushi', 'Japanese'], rating: 4.8, deliveryTime: '30-40 min' },
  { id: '4', name: 'Taco Town', imageUrl: 'https://via.placeholder.com/300x200?text=Taco+Shop', cuisineTypes: ['Mexican', 'Tacos'], rating: 4.3, deliveryTime: '15-25 min' },
  { id: '5', name: 'Curry Corner', imageUrl: 'https://via.placeholder.com/300x200?text=Indian+Food', cuisineTypes: ['Indian', 'Curry'], rating: 4.6, deliveryTime: '35-45 min' },
];

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [isLoading, setIsLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<typeof sampleRestaurants>([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('HomePage loaded');
    // Simulate API call
    setTimeout(() => {
      setRestaurants(sampleRestaurants);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleRestaurantClick = (id: string | number) => {
    console.log(`Navigating to restaurant with ID: ${id}`);
    navigate(`/restaurant/${id}`);
  };

  const filteredAndSortedRestaurants = restaurants
    .filter(r => cuisineFilter === 'all' || r.cuisineTypes.map(c => c.toLowerCase()).includes(cuisineFilter.toLowerCase()))
    .filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'deliveryTime') {
        const timeA = parseInt(a.deliveryTime?.split('-')[0] || '999');
        const timeB = parseInt(b.deliveryTime?.split('-')[0] || '999');
        return timeA - timeB;
      }
      return 0;
    });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <NavigationMenu className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 justify-between">
          <NavigationMenuList>
            <NavigationMenuItem>
              <a href="/" className="text-2xl font-bold text-green-600 flex items-center">
                <Utensils className="mr-2 h-7 w-7" /> FoodFleet
              </a>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Button variant="ghost" onClick={() => navigate('/cart')}>Cart</Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button variant="ghost" onClick={() => navigate('/orders-profile')}>Orders & Profile</Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-8 p-6 bg-white rounded-lg shadow">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Find Your Next Meal</h1>
          <p className="text-center text-gray-600 mb-6">Discover local restaurants and enjoy delicious food delivered to your doorstep.</p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search restaurants or cuisines..."
                className="pl-10 pr-4 py-2 w-full h-12 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button size="lg" className="w-full sm:w-auto h-12 bg-green-600 hover:bg-green-700">
              <Search className="mr-2 h-5 w-5" /> Search
            </Button>
          </div>
        </section>

        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><Filter className="mr-2 h-5 w-5" /> Filters & Sorting</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="cuisine-filter" className="block text-sm font-medium text-gray-700 mb-1">Cuisine Type</label>
                <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
                  <SelectTrigger id="cuisine-filter" className="w-full">
                    <SelectValue placeholder="Select Cuisine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cuisines</SelectItem>
                    <SelectItem value="pizza">Pizza</SelectItem>
                    <SelectItem value="burgers">Burgers</SelectItem>
                    <SelectItem value="sushi">Sushi</SelectItem>
                    <SelectItem value="mexican">Mexican</SelectItem>
                    <SelectItem value="indian">Indian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort-by" className="w-full">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="deliveryTime">Delivery Time</SelectItem>
                    {/* <SelectItem value="popularity">Popularity</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            {cuisineFilter === 'all' ? 'Popular Restaurants' : `Restaurants - ${cuisineFilter.charAt(0).toUpperCase() + cuisineFilter.slice(1)}`}
          </h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </CardContent>
                  <CardFooter className="p-4">
                     <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            filteredAndSortedRestaurants.length > 0 ? (
              <ScrollArea className="h-[calc(100vh-400px)] pr-3"> {/* Adjust height as needed */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedRestaurants.map(restaurant => (
                    <RestaurantCard
                      key={restaurant.id}
                      id={restaurant.id}
                      name={restaurant.name}
                      imageUrl={restaurant.imageUrl}
                      cuisineTypes={restaurant.cuisineTypes}
                      rating={restaurant.rating}
                      deliveryTime={restaurant.deliveryTime}
                      onClick={handleRestaurantClick}
                    />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-center text-gray-500 py-10">No restaurants match your criteria. Try adjusting your search or filters.</p>
            )
          )}
        </section>
      </main>

      <footer className="bg-gray-800 text-white text-center p-6 mt-auto">
        <p>&copy; {new Date().getFullYear()} FoodFleet. All rights reserved.</p>
        <p className="text-sm">Delivering happiness, one meal at a time.</p>
      </footer>
    </div>
  );
};

export default HomePage;