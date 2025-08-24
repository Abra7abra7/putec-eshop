import { redirect } from 'next/navigation';
import { OrderItem } from '@/features/account/types';

import { getSession } from '@/features/account/controllers/get-session';
import { getOrders } from '@/features/account/controllers/get-orders';

export default async function AccountPage() {
  const [session, orders] = await Promise.all([getSession(), getOrders()]);

  if (!session) {
    redirect('/login');
  }

  return (
    <section className='py-xl'>
      <h1 className='text-4xl font-bold'>Váš účet</h1>

      <div className='mt-8'>
        <h2 className='text-2xl font-bold'>História objednávok</h2>
        {orders.length === 0 ? (
          <p className='mt-4 text-zinc-400'>Zatiaľ nemáte žiadne objednávky.</p>
        ) : (
          <ul className='mt-4 divide-y divide-zinc-700'>
            {orders.map((order) => (
              <li key={order.id} className='py-4'>
                <div className='flex justify-between'>
                  <div>
                    <p className='font-semibold'>Objednávka #{order.id}</p>
                    <p className='text-sm text-zinc-400'>
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='font-semibold'>€{order.total_amount / 100}</p>
                    <p className='text-sm text-zinc-400'>{order.status}</p>
                  </div>
                </div>
                <ul className='mt-2 divide-y divide-zinc-800'>
                  {order.order_items.map((item: OrderItem) => (
                    <li key={item.id} className='flex items-center gap-4 py-2'>
                      <div className='flex-1'>
                        <p>{item.products.name}</p>
                        <p className='text-sm text-zinc-400'>
                          {item.quantity} x €{(item.prices.unit_amount || 0) / 100}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

