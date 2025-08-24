import { Order, OrderItem } from '@/features/orders/types';
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text, Button } from '@react-email/components';

interface OrderConfirmationEmailProps {
  order: Order;
  orderItems: OrderItem[];
  invoiceUrl: string | null;
}

export const OrderConfirmationEmail = ({ order, orderItems, invoiceUrl }: OrderConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Potvrdenie objednávky z Putec E-shop</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Ďakujeme za vašu objednávku!</Heading>
        <Text style={paragraph}>Dobrý deň,</Text>
        <Text style={paragraph}>týmto potvrdzujeme prijatie vašej objednávky číslo #{order.id}.</Text>

        <Hr style={hr} />

        <Section>
          <Heading as="h2" style={subheading}>Zhrnutie objednávky</Heading>
          {orderItems.map((item) => (
            <Text key={`${item.product_id}-${item.price_id}`} style={itemText}>
              - Produkt ID: {item.product_id}, Množstvo: {item.quantity}
            </Text>
          ))}
          {invoiceUrl && (
            <Section style={{ textAlign: 'center', marginTop: 32, marginBottom: 32 }}>
              <Button
                style={{ 
                  backgroundColor: '#000000', 
                  borderRadius: 4, 
                  color: '#ffffff', 
                  fontSize: 12, 
                  fontWeight: 'bold', 
                  textDecoration: 'none', 
                  padding: '12px 20px' 
                }}
                href={invoiceUrl}
              >
                Zobraziť faktúru
              </Button>
            </Section>
          )}
        </Section>

        <Hr style={hr} />

        <Section>
          <Text style={totalText}>Celková suma: {((order.amount_total ?? 0) / 100).toFixed(2)} €</Text>
        </Section>

        <Hr style={hr} />

        <Text style={footer}>S pozdravom, Váš Putec E-shop</Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  marginTop: '48px',
  textAlign: 'center' as const,
};

const subheading = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginTop: '20px',
  };

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
  padding: '0 20px',
};

const itemText = {
    fontSize: '14px',
    lineHeight: '20px',
    padding: '0 20px',
}

const totalText = {
    fontSize: '18px',
    fontWeight: 'bold',
    padding: '0 20px',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 20px',
};
