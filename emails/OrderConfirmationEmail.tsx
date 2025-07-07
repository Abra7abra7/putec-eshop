import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Row,
  Column,
  Hr,
} from '@react-email/components';
import * as React from 'react';

// Definovanie typov pre props, ktoré bude emailová šablóna prijímať
interface OrderConfirmationEmailProps {
  orderId: string;
  orderDate: string;
  customerName: string;
  orderItems: {
    name: string;
    quantity: number;
    price_per_unit: number;
  }[];
  totalPrice: number;
}

// Základná URL pre prípadné obrázky alebo linky
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Komponent e-mailovej šablóny
export const OrderConfirmationEmail = ({
  orderId,
  orderDate,
  customerName,
  orderItems,
  totalPrice,
}: OrderConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Potvrdenie objednávky č. {orderId}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Ďakujeme za Vašu objednávku!</Heading>
        <Text style={paragraph}>Dobrý deň {customerName},</Text>
        <Text style={paragraph}>
          Ďakujeme za Váš nákup. Vaša objednávka bola úspešne prijatá a je spracovávaná.
        </Text>
        <Hr style={hr} />
        <Text style={subheading}>Detaily objednávky:</Text>
        <Text style={details}><strong>Číslo objednávky:</strong> {orderId}</Text>
        <Text style={details}><strong>Dátum objednávky:</strong> {orderDate}</Text>
        <Hr style={hr} />
        {orderItems.map((item, index) => (
          <Row key={index} style={itemRow}>
            <Column>
              <Text style={itemText}>{item.name} (x{item.quantity})</Text>
            </Column>
            <Column style={itemPriceColumn}>
              <Text style={itemPrice}>{(item.price_per_unit * item.quantity).toFixed(2)} €</Text>
            </Column>
          </Row>
        ))}
        <Hr style={hr} />
        <Row style={totalRow}>
            <Column>
                <Text style={totalText}><strong>Celkom k úhrade</strong></Text>
            </Column>
            <Column style={totalPriceColumn}>
                <Text style={totalPriceText}><strong>{totalPrice.toFixed(2)} €</strong></Text>
            </Column>
        </Row>
        <Hr style={hr} />
        <Text style={paragraph}>
          S pozdravom,
          <br />
          Tím Putec Eshop
        </Text>
      </Container>
    </Body>
  </Html>
);

export default OrderConfirmationEmail;

// Štýly pre e-mail
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  border: '1px solid #f0f0f0',
  borderRadius: '4px',
};

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  color: '#484848',
};

const subheading = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#484848',
    padding: '0 20px',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#484848',
  padding: '0 20px',
};

const details = {
    ...paragraph,
    padding: '0 20px',
}

const hr = {
  borderColor: '#f0f0f0',
  margin: '20px 0',
};

const itemRow = {
    padding: '0 20px',
}

const itemText = {
    fontSize: '14px',
    color: '#484848',
}

const itemPriceColumn = {
    textAlign: 'right' as const,
}

const itemPrice = {
    ...itemText,
    fontWeight: 'bold',
}

const totalRow = {
    padding: '0 20px',
}

const totalText = {
    fontSize: '16px',
    color: '#484848',
}

const totalPriceColumn = {
    textAlign: 'right' as const,
}

const totalPriceText = {
    ...totalText,
    fontWeight: 'bold',
}
