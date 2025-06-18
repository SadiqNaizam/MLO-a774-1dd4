import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useFormField } from "@/components/ui/form"; // Assuming Form is from shadcn
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Used standalone if not through FormField
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, MapPin, ShieldCheck, Utensils } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define Zod schema for form validation
const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid postal code"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  deliveryOption: z.enum(["standard", "express"]),
  paymentMethod: z.enum(["creditCard", "paypal", "applePay"]),
  cardNumber: z.string().optional(), // Optional for now, make required based on paymentMethod
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      address: '',
      city: '',
      postalCode: '',
      phone: '',
      deliveryOption: 'standard',
      paymentMethod: 'creditCard',
      notes: '',
    },
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    console.log('CheckoutPage loaded');
  }, []);

  const onSubmit: SubmitHandler<CheckoutFormValues> = (data) => {
    setIsProcessing(true);
    console.log('Checkout form submitted:', data);
    // Simulate API call for order placement
    setTimeout(() => {
      setIsProcessing(false);
      alert('Order placed successfully! Redirecting to orders page...');
      // In a real app, you might pass order ID or some confirmation
      navigate('/orders-profile?status=success');
    }, 2000);
  };
  
  // Simulate order summary (in a real app, this would come from cart state)
  const orderSummary = {
    subtotal: 55.96,
    delivery: 5.00,
    tax: 4.48,
    total: 65.44,
    items: [
        { name: "Margherita Pizza", quantity: 2, price: 12.99 },
        { name: "Garlic Bread", quantity: 1, price: 5.50 },
    ]
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <NavigationMenu className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 justify-between">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Button variant="ghost" onClick={() => navigate('/cart')}><ArrowLeft className="mr-2 h-5 w-5" /> Back to Cart</Button>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuList>
            <NavigationMenuItem>
               <a href="/" className="text-xl font-bold text-green-600 flex items-center">
                <ShieldCheck className="mr-2 h-6 w-6" /> Secure Checkout
              </a>
            </NavigationMenuItem>
          </NavigationMenuList>
           <NavigationMenuList>
             {/* Right side empty or for user icon */}
           </NavigationMenuList>
        </NavigationMenu>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 space-y-6">
              {/* Delivery Information Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center"><MapPin className="mr-2 h-5 w-5 text-green-600" /> Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl><Input placeholder="123 Main St" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="city" render={({ field }) => ( <FormItem> <FormLabel>City</FormLabel> <FormControl><Input placeholder="Anytown" {...field} /></FormControl> <FormMessage /> </FormItem>)} />
                    <FormField control={form.control} name="postalCode" render={({ field }) => ( <FormItem> <FormLabel>Postal Code</FormLabel> <FormControl><Input placeholder="12345" {...field} /></FormControl> <FormMessage /> </FormItem>)} />
                  </div>
                  <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem> <FormLabel>Phone Number</FormLabel> <FormControl><Input type="tel" placeholder="+1 (555) 123-4567" {...field} /></FormControl> <FormMessage /> </FormItem>)} />
                  <FormField
                    control={form.control}
                    name="deliveryOption"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Delivery Option</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="standard" /></FormControl>
                              <FormLabel className="font-normal">Standard Delivery (3-5 days)</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="express" /></FormControl>
                              <FormLabel className="font-normal">Express Delivery (1-2 days)</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Notes (Optional)</FormLabel>
                        <FormControl><Input placeholder="E.g., gate code, leave at door" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Payment Method Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center"><CreditCard className="mr-2 h-5 w-5 text-green-600" /> Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Payment Method</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select a payment method" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="creditCard">Credit Card</SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                            <SelectItem value="applePay">Apple Pay</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch('paymentMethod') === 'creditCard' && (
                    <div className="space-y-4 p-4 border rounded-md">
                       <FormField control={form.control} name="cardNumber" render={({ field }) => ( <FormItem> <FormLabel>Card Number</FormLabel> <FormControl><Input placeholder="•••• •••• •••• ••••" {...field} /></FormControl> <FormMessage /> </FormItem>)} />
                       <div className="grid grid-cols-2 gap-4">
                           <FormField control={form.control} name="expiryDate" render={({ field }) => ( <FormItem> <FormLabel>Expiry Date</FormLabel> <FormControl><Input placeholder="MM/YY" {...field} /></FormControl> <FormMessage /> </FormItem>)} />
                           <FormField control={form.control} name="cvv" render={({ field }) => ( <FormItem> <FormLabel>CVV</FormLabel> <FormControl><Input placeholder="123" {...field} /></FormControl> <FormMessage /> </FormItem>)} />
                       </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Order Summary Card */}
            <section className="lg:col-span-1">
              <Card className="sticky top-24 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center"><Utensils className="mr-2 h-5 w-5 text-green-600" /> Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {orderSummary.items.map(item => (
                        <div key={item.name} className="flex justify-between text-sm">
                            <span>{item.name} (x{item.quantity})</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <hr/>
                  <div className="flex justify-between"><span>Subtotal</span> <span>${orderSummary.subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Delivery</span> <span>${orderSummary.delivery.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Tax</span> <span>${orderSummary.tax.toFixed(2)}</span></div>
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${orderSummary.total.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" size="lg" className="w-full bg-green-600 hover:bg-green-700" disabled={isProcessing || !form.formState.isValid}>
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </Button>
                </CardFooter>
              </Card>
            </section>
          </form>
        </Form>
      </main>
      <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
        <p>&copy; {new Date().getFullYear()} FoodFleet. Secure Payments.</p>
      </footer>
    </div>
  );
};

export default CheckoutPage;