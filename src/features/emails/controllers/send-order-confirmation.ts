import { Order, OrderItem } from '@/features/orders/types';
import { resend } from '@/libs/resend';

import { OrderConfirmationEmail } from '../components/order-confirmation-email';

interface OrderWithInvoice extends Order {
  invoiceUrl: string | null;
}

export const sendOrderConfirmation = async (order: OrderWithInvoice, orderItems: OrderItem[]) => {
  if (!order.email) {
    console.log(`Order #${order.id} has no email, skipping confirmation.`);
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Putec E-shop <onboarding@resend.dev>',
      to: order.email,
      subject: `Potvrdenie objednávky #${order.id}`,
      react: OrderConfirmationEmail({ order, orderItems, invoiceUrl: order.invoiceUrl }),
    });

    if (error) {
      console.error('Failed to send confirmation email. Resend error:', error);
      return;
    }

    console.log(`Confirmation email sent successfully for order #${order.id}. Response:`, data);
  } catch (error) {
    console.error('An unexpected error occurred while sending confirmation email:', error);
    // We don't re-throw the error, as failing to send an email should not fail the webhook.
  }
};
