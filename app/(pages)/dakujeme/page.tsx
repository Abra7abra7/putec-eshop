import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Definovanie typov pre lepšiu prácu s dátami
type OrderItem = {
  quantity: number;
  price_per_unit: number;
  products: {
    name: string;
  } | null;
};

type Order = {
  id: string;
  total_price: number;
  order_items: OrderItem[];
};

// Funkcia na načítanie objednávky z databázy
async function getOrder(sessionId: string): Promise<Order | null> {
  const supabase = await createClient();
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      id,
      total_price,
      order_items (
        quantity,
        price_per_unit,
        products ( name )
      )
    `)
    .eq('stripe_session_id', sessionId)
    .single();

  if (error || !order) {
    return null;
  }

  return order as unknown as Order;
}

// Komponent stránky
export default async function DakujemePage({ searchParams }: { searchParams: { session_id?: string } }) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    return notFound(); // Ak chýba session_id, zobrazíme 404
  }

  const order = await getOrder(sessionId);

  if (!order) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-4xl font-bold mb-4 text-destructive">Objednávka nenájdená</h1>
        <p className="text-lg text-muted-foreground mb-8">Ľutujeme, ale objednávku s daným ID sa nepodarilo nájsť. Skontrolujte prosím svoj e-mail alebo nás kontaktujte.</p>
        <Link href="/" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold hover:bg-primary/90">
          Návrat na hlavnú stránku
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">Ďakujeme za Váš nákup!</h1>
        <p className="text-lg text-muted-foreground">Vaša objednávka bola úspešne prijatá.</p>
      </div>

      <div className="border rounded-lg p-6 bg-card">
        <h2 className="text-xl font-semibold mb-4">Zhrnutie objednávky</h2>
        <p className="text-muted-foreground mb-4">Číslo objednávky: <span className="font-mono text-foreground">{order.id}</span></p>
        
        <div className="space-y-3 border-t pt-4">
          {order.order_items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-card-foreground">{item.products?.name || 'Neznámy produkt'} x{item.quantity}</span>
              <span className="font-semibold">{(item.price_per_unit * item.quantity).toFixed(2)} €</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center border-t mt-4 pt-4">
          <span className="text-lg font-bold">Celkom</span>
          <span className="text-lg font-bold">{order.total_price.toFixed(2)} €</span>
        </div>
      </div>

      <div className="text-center mt-10">
        <Link href="/vino" className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors">
          Pokračovať v nákupe
        </Link>
      </div>
    </div>
  );
}
