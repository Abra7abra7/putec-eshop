import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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

  // Vynútenie typu, keďže Supabase nevie presný typ vnorených relácií
  const typedOrder = order as unknown as Order;

  return (
    <div className="text-left border-t border-b py-6 my-6">
      <h2 className="text-2xl font-semibold mb-4">Súhrn objednávky</h2>
      <p className="mb-2"><span className="font-semibold">Číslo objednávky:</span> {typedOrder.id}</p>
      <ul className="list-disc list-inside mb-4">
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
    <div className="container mx-auto my-12 p-8 bg-white rounded-lg shadow-lg max-w-2xl text-center">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Ďakujeme za vašu objednávku!</h1>
      <p className="text-lg text-gray-700 mb-6">Vaša objednávka bola úspešne prijatá a spracováva sa.</p>
      
      <OrderDetails sessionId={sessionId} />

      <p className="text-gray-600 mb-8">Na váš e-mail sme zaslali potvrdenie objednávky. V prípade akýchkoľvek otázok nás neváhajte kontaktovať.</p>

      <Link href="/eshop">
        <span className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300">
          Pokračovať v nákupe
        </span>
      </Link>
    </div>
  );
}
