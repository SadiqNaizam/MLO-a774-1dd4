import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderProgressIndicator, { OrderProgressStep } from '@/components/OrderProgressIndicator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Package, History, Edit3, Save, Home, CreditCard as CreditCardIcon, Utensils } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast"; // for notifications

// --- Schemas and Types ---
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

const addressSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["home", "work", "other"]).default("home"),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid postal code"),
});
type AddressFormValues = z.infer<typeof addressSchema>;

// --- Sample Data ---
const sampleActiveOrders = [
  {
    id: 'ORD12345',
    restaurantName: 'Pizza Heaven',
    estimatedDelivery: '10:30 AM Today',
    total: 25.99,
    items: [{ name: 'Pepperoni Pizza', quantity: 1 }],
    steps: [
      { name: 'Order Placed', status: 'completed', timestamp: '9:45 AM' },
      { name: 'Preparing', status: 'current', timestamp: '9:50 AM' },
      { name: 'Out for Delivery', status: 'pending' },
      { name: 'Delivered', status: 'pending' },
    ] as OrderProgressStep[],
  },
];

const samplePastOrders = [
  { id: 'ORD00789', date: '2024-07-15', restaurantName: 'Burger Hub', total: 18.50, status: 'Delivered' },
  { id: 'ORD00654', date: '2024-07-10', restaurantName: 'Sushi World', total: 45.00, status: 'Delivered' },
];

const sampleUserProfile = {
  name: 'Alex Johnson',
  email: 'alex.j@example.com',
  phone: '+15551234567',
};

const sampleAddresses = [
    { id: 'addr1', type: 'home' as const, street: '123 Main St', city: 'Anytown', postalCode: '12345' },
    { id: 'addr2', type: 'work' as const, street: '456 Office Ave', city: 'Busytown', postalCode: '67890' },
];

const OrdersAndProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'active-orders');

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: sampleUserProfile,
  });

  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: { type: 'home', street: '', city: '', postalCode: '' },
  });

  const [userAddresses, setUserAddresses] = useState(sampleAddresses);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);


  useEffect(() => {
    console.log('OrdersAndProfilePage loaded');
    if (searchParams.get('status') === 'success') {
        toast({ title: "Order Placed!", description: "Your order has been successfully placed and is now being processed." });
        navigate('/orders-profile?tab=active-orders', { replace: true }); // Clear query param
    }
  }, [searchParams, navigate]);

  const onProfileSubmit = (data: ProfileFormValues) => {
    console.log('Profile updated:', data);
    toast({ title: "Profile Updated", description: "Your profile information has been saved." });
  };
  
  const onAddressSubmit = (data: AddressFormValues) => {
    console.log('Address submitted:', data);
    if (editingAddressId) {
        setUserAddresses(prev => prev.map(addr => addr.id === editingAddressId ? {...data, id: editingAddressId } : addr));
        toast({ title: "Address Updated", description: "Address has been successfully updated."});
    } else {
        setUserAddresses(prev => [...prev, {...data, id: `addr${Date.now()}`}]);
        toast({ title: "Address Added", description: "New address has been successfully added."});
    }
    setEditingAddressId(null);
    addressForm.reset({ type: 'home', street: '', city: '', postalCode: '' });
  };

  const handleEditAddress = (address: AddressFormValues) => {
    setEditingAddressId(address.id!);
    addressForm.reset(address);
  };

  const handleDeleteAddress = (addressId: string) => {
    setUserAddresses(prev => prev.filter(addr => addr.id !== addressId));
    toast({ title: "Address Removed", variant: "destructive" });
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <NavigationMenu className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 justify-between">
          <NavigationMenuList>
            <NavigationMenuItem>
                <a href="/" className="text-xl font-bold text-green-600 flex items-center">
                    <Utensils className="mr-2 h-6 w-6" /> FoodFleet
                </a>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Button variant="ghost" onClick={() => navigate('/')}>Home</Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button variant="ghost" onClick={() => navigate('/cart')}>Cart</Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="active-orders"><Package className="mr-2 h-4 w-4" />Active Orders</TabsTrigger>
            <TabsTrigger value="order-history"><History className="mr-2 h-4 w-4" />Order History</TabsTrigger>
            <TabsTrigger value="profile-settings"><User className="mr-2 h-4 w-4" />Profile & Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="active-orders">
            <Card>
              <CardHeader>
                <CardTitle>Your Active Orders</CardTitle>
                <CardDescription>Track the progress of your current food orders.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {sampleActiveOrders.length > 0 ? sampleActiveOrders.map(order => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="bg-slate-50 dark:bg-slate-800/50 p-4">
                      <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                            <p className="text-sm text-muted-foreground">From: {order.restaurantName}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-lg">${order.total.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">Est. Delivery: {order.estimatedDelivery}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6">
                      <OrderProgressIndicator steps={order.steps} orientation="horizontal" />
                       <div className="mt-4">
                            <h4 className="font-medium text-sm mb-1">Items:</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                                {order.items.map(item => <li key={item.name}>{item.name} (x{item.quantity})</li>)}
                            </ul>
                        </div>
                    </CardContent>
                     <CardFooter className="p-4 border-t">
                        <Button variant="outline" size="sm">View Details / Contact Support</Button>
                    </CardFooter>
                  </Card>
                )) : <p>No active orders at the moment.</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="order-history">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>Review your past orders.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Restaurant</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {samplePastOrders.map(order => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>{order.restaurantName}</TableCell>
                          <TableCell>${order.total.toFixed(2)}</TableCell>
                          <TableCell><Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>{order.status}</Badge></TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">Reorder</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile-settings">
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><User className="mr-2 h-5 w-5" /> Profile Information</CardTitle>
                        <CardDescription>Manage your personal details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...profileForm}>
                            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                                <FormField control={profileForm.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Full Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                                <FormField control={profileForm.control} name="email" render={({ field }) => ( <FormItem> <FormLabel>Email</FormLabel> <FormControl><Input type="email" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                                <FormField control={profileForm.control} name="phone" render={({ field }) => ( <FormItem> <FormLabel>Phone</FormLabel> <FormControl><Input type="tel" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                                <Button type="submit"><Save className="mr-2 h-4 w-4" />Save Profile</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><Home className="mr-2 h-5 w-5" /> Saved Addresses</CardTitle>
                        <CardDescription>Manage your delivery addresses.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ScrollArea className="h-[150px] mb-4 pr-3">
                        {userAddresses.map(addr => (
                            <div key={addr.id} className="p-3 border rounded-md mb-2 flex justify-between items-start">
                                <div>
                                    <p className="font-semibold capitalize">{addr.type} Address</p>
                                    <p className="text-sm text-muted-foreground">{addr.street}, {addr.city}, {addr.postalCode}</p>
                                </div>
                                <div className="space-x-1">
                                    <Button variant="ghost" size="icon" onClick={() => handleEditAddress(addr)}><Edit3 className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteAddress(addr.id!)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        ))}
                        {userAddresses.length === 0 && <p className="text-sm text-muted-foreground">No addresses saved yet.</p>}
                        </ScrollArea>
                         <Form {...addressForm}>
                            <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-3 border-t pt-4">
                                <h4 className="font-medium text-md">{editingAddressId ? "Edit Address" : "Add New Address"}</h4>
                                <FormField control={addressForm.control} name="type" render={({ field }) => ( <FormItem> <FormLabel>Type</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl> <SelectContent> <SelectItem value="home">Home</SelectItem> <SelectItem value="work">Work</SelectItem> <SelectItem value="other">Other</SelectItem> </SelectContent> </Select> <FormMessage /> </FormItem> )} />
                                <FormField control={addressForm.control} name="street" render={({ field }) => ( <FormItem> <FormLabel>Street</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField control={addressForm.control} name="city" render={({ field }) => ( <FormItem> <FormLabel>City</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                                    <FormField control={addressForm.control} name="postalCode" render={({ field }) => ( <FormItem> <FormLabel>Postal Code</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                                </div>
                                <Button type="submit">{editingAddressId ? "Update Address" : "Add Address"}</Button>
                                {editingAddressId && <Button type="button" variant="outline" onClick={() => { setEditingAddressId(null); addressForm.reset({ type: 'home', street: '', city: '', postalCode: '' });}} className="ml-2">Cancel Edit</Button>}
                            </form>
                        </Form>
                    </CardContent>
                </Card>
                 {/* Placeholder for Payment Methods Card */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center"><CreditCardIcon className="mr-2 h-5 w-5" /> Payment Methods</CardTitle>
                        <CardDescription>Manage your saved payment options (Feature coming soon).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">You have no saved payment methods. This feature is under development.</p>
                        <Button variant="secondary" className="mt-4" disabled>Add Payment Method</Button>
                    </CardContent>
                </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
        <p>&copy; {new Date().getFullYear()} FoodFleet. Your Account, Your Control.</p>
      </footer>
    </div>
  );
};

export default OrdersAndProfilePage;