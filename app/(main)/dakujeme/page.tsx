import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CircleCheckBig } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

// Definovanie typov pre lepšiu prácu s dátami
type OrderItem = {
  quantity: number;
  price_per_unit: number;
  products: { name: string } | null;
};

type Order = {
  id: string;
  total_price: number;
  order_items: OrderItem[];
};

// Asynchrónny komponent na načítanie a zobrazenie detailov objednávky
async function OrderDetails({ sessionId }: { sessionId: string }) {
  const supabase = await createClient();
  const { data: order, error } = await supabase
    .from('orders')
    .select('id, total_price, order_items(quantity, price_per_unit, products(name))')
    .eq('stripe_session_id', sessionId)
    .single();

  if (error || !order) {
    return notFound();
  }

  const typedOrder = order as unknown as Order;

  return (
    <div className="w-full text-left border-t py-6 my-6">
      <h2 className="text-xl font-semibold mb-4">Súhrn objednávky</h2>
      <p className="mb-2 text-gray-600"><span className="font-semibold text-gray-800">Číslo objednávky:</span> {typedOrder.id}</p>
      <ul className="list-disc list-inside mb-4 text-gray-600">
        {typedOrder.order_items.map((item, index) => (
          <li key={index} className="mb-1">
            {item.products?.name || 'Neznámy produkt'} - {item.quantity} ks
          </li>
        ))}
      </ul>
      <p className="text-xl font-bold text-right">Celková suma: {typedOrder.total_price.toFixed(2)} €</p>
    </div>
  );
}

// Hlavný (synchrónny) komponent stránky
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DakujemePage({ searchParams }: { searchParams: any }) {
  const sessionId = typeof searchParams.session_id === 'string' ? searchParams.session_id : null;

  if (!sessionId) {
    return notFound();
  }

  return (
    <div className="container mx-auto my-24">
      <div className="max-w-2xl mx-auto border rounded-lg p-12 flex flex-col items-center text-center shadow-sm">
        <Link href="/" className="mb-8">
          <Image src="/logo.png" alt="Vinárstvo Pútec Logo" width={120} height={42} className="h-12 w-auto" />
        </Link>
        <CircleCheckBig className="h-20 w-20 text-green-600 mb-6" />
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Ďakujeme za vašu objednávku!</h1>
        <p className="text-md text-gray-500 mb-6">Vaša objednávka bola úspešne prijatá a spracováva sa.</p>
        
        <OrderDetails sessionId={sessionId} />

        <p className="text-sm text-gray-500 mb-8">Na váš e-mail sme zaslali potvrdenie objednávky. V prípade akýchkoľvek otázok nás neváhajte kontaktovať.</p>

        <Button asChild variant="outline" size="lg" className="bg-[#b4956d] text-white hover:bg-[#a88961] border-[#b4956d]">
          <Link href="/eshop">Pokračovať v nákupe</Link>
        </Button>
      </div>
    </div>
  );
}
