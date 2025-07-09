'use client';

import { useCartStore } from '@/hooks/use-cart-store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

const checkoutFormSchema = z.object({
  customerType: z.enum(['individual', 'company'], { required_error: 'Vyberte typ zákazníka' }),
  email: z.string().email({ message: 'Zadajte platnú e-mailovú adresu.' }),
  phone: z.string().optional(),
  firstName: z.string().min(1, { message: 'Meno je povinné.' }),
  lastName: z.string().min(1, { message: 'Priezvisko je povinné.' }),
  companyName: z.string().optional(),
  ico: z.string().optional(),
  dic: z.string().optional(),
  icDph: z.string().optional(),
  deliveryMethod: z.enum(['pickup', 'delivery'], { required_error: 'Vyberte spôsob doručenia.' }),
  shippingStreet: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingZip: z.string().optional(),
}).refine((data) => {
  if (data.customerType === 'company') {
    return !!data.companyName && !!data.ico && !!data.dic;
  }
  return true;
}, {
  message: 'Pri nákupe na firmu sú povinné: Názov firmy, IČO a DIČ.',
  path: ['companyName'],
}).refine((data) => {
  if (data.deliveryMethod === 'delivery') {
    return !!data.shippingStreet && !!data.shippingCity && !!data.shippingZip;
  }
  return true;
}, {
  message: 'Pri doručení na adresu sú všetky polia adresy povinné.',
  path: ['shippingStreet'],
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function PokladnaPage() {
  const { items } = useCartStore();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerType: 'individual',
      email: '',
      phone: '',
      firstName: '',
      lastName: '',
      companyName: '',
      ico: '',
      dic: '',
      icDph: '',
      deliveryMethod: 'pickup',
      shippingStreet: '',
      shippingCity: '',
      shippingZip: '',
    },
  });

  const customerType = form.watch('customerType');
  const deliveryMethod = form.watch('deliveryMethod');

  const totalPrice = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const deliveryCost = deliveryMethod === 'delivery' ? 5.00 : 0;
  const finalPrice = totalPrice + deliveryCost;

  useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      router.push('/eshop');
    }
  }, [items, router, isProcessing]);

  async function onSubmit(data: CheckoutFormValues) {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: items, customerDetails: data, deliveryCost }),
      });

      const { url } = await response.json();
      if (url) {
        // Vyčistenie košíka po úspešnom vytvorení session
        // clearCart(); 
        // Zvážiť, či vyčistiť košík tu, alebo až po úspešnej platbe (cez webhook)
        window.location.href = url;
      } else {
        console.error('Failed to create Stripe checkout session.');
        alert('Nepodarilo sa vytvoriť objednávku. Skúste to prosím znova.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Vyskytla sa chyba. Skúste to prosím znova.');
    } finally {
      // setIsProcessing(false); // Zostane na Stripe stránke
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="mx-auto max-w-max mb-8">
        <Link href="/">
          <Image src="/logo.png" alt="Vinárstvo Pútec Logo" width={120} height={42} className="h-12 w-auto" />
        </Link>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>1. Fakturačné údaje</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="customerType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Nakupujem na:</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2">
                              <FormControl><RadioGroupItem value="individual" /></FormControl>
                              <FormLabel className="font-normal">Súkromnú osobu</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                              <FormControl><RadioGroupItem value="company" /></FormControl>
                              <FormLabel className="font-normal">Firmu</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {customerType === 'company' && (
                    <div className="space-y-2 p-4 border rounded-md">
                      <FormField control={form.control} name="companyName" render={({ field }) => (<FormItem><FormLabel>Názov firmy</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="ico" render={({ field }) => (<FormItem><FormLabel>IČO</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="dic" render={({ field }) => (<FormItem><FormLabel>DIČ</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="icDph" render={({ field }) => (<FormItem><FormLabel>IČ DPH (ak ste platcom)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                  )}
                   <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="firstName" render={({ field }) => (<FormItem><FormLabel>Meno</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="lastName" render={({ field }) => (<FormItem><FormLabel>Priezvisko</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                  <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>E-mail</FormLabel><FormControl><Input {...field} type="email" /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Telefón</FormLabel><FormControl><Input {...field} type="tel" /></FormControl><FormMessage /></FormItem>)} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2. Doprava a platba</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="deliveryMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                            <FormItem className="flex items-center space-x-2 p-4 border rounded-md">
                              <FormControl><RadioGroupItem value="pickup" /></FormControl>
                              <FormLabel className="font-normal flex justify-between w-full"><span>Osobný odber</span><span className="font-bold">0.00 €</span></FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 p-4 border rounded-md">
                              <FormControl><RadioGroupItem value="delivery" /></FormControl>
                              <FormLabel className="font-normal flex justify-between w-full"><span>Doručenie na adresu (dobierka)</span><span className="font-bold">5.00 €</span></FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {deliveryMethod === 'delivery' && (
                    <div className="space-y-2 mt-4 p-4 border rounded-md">
                       <h3 className="text-lg font-semibold mb-2">Doručovacia adresa</h3>
                       <FormField control={form.control} name="shippingStreet" render={({ field }) => (<FormItem><FormLabel>Ulica a číslo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                       <div className="grid grid-cols-2 gap-4">
                         <FormField control={form.control} name="shippingCity" render={({ field }) => (<FormItem><FormLabel>Mesto</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                         <FormField control={form.control} name="shippingZip" render={({ field }) => (<FormItem><FormLabel>PSČ</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                       </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Súhrn objednávky</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {items.map((item) => (
                      <li key={item.product.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Image
                            src={item.product.image_url || '/images/placeholder.webp'}
                            alt={item.product.name}
                            width={64}
                            height={64}
                            className="rounded-md object-cover h-16 w-16"
                          />
                          <div>
                            <span className="font-semibold">{item.product.name}</span>
                            <p className="text-sm text-muted-foreground">Počet: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-semibold">{(item.product.price * item.quantity).toFixed(2)} €</span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t mt-4 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Medzisúčet</span>
                      <span>{totalPrice.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Doprava</span>
                      <span>{deliveryCost.toFixed(2)} €</span>
                    </div>
                    <div className="border-t mt-2 pt-2 flex justify-between font-bold text-lg">
                      <span>Celkom</span>
                      <span>{finalPrice.toFixed(2)} €</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Button type="submit" className="w-full text-lg py-6" disabled={isProcessing}>
                {isProcessing ? 'Spracúva sa...' : `Objednať s povinnosťou platby za ${finalPrice.toFixed(2)} €`}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
