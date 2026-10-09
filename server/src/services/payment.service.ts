import crypto from 'crypto';
import { ENV } from '../config/env';

export interface CreateOrderParams {
  amount: number; // in rupees
  receipt: string;
}

export const createPaymentOrder = async ({ amount, receipt }: CreateOrderParams) => {
  // If Razorpay keys are configured
  if (ENV.RAZORPAY_KEY_ID && ENV.RAZORPAY_KEY_SECRET) {
    const auth = Buffer.from(`${ENV.RAZORPAY_KEY_ID}:${ENV.RAZORPAY_KEY_SECRET}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // convert to paise
        currency: 'INR',
        receipt,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Razorpay Order creation failed: ${errText}`);
    }

    const data = await response.json();
    return {
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      isMock: false,
    };
  }

  // Fallback to development mock order
  return {
    orderId: `order_mock_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    amount: Math.round(amount * 100),
    currency: 'INR',
    isMock: true,
  };
};

export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  if (orderId.startsWith('order_mock_')) {
    return true; // Mock mode always succeeds
  }

  if (!ENV.RAZORPAY_KEY_SECRET) {
    return true;
  }

  const generatedSignature = crypto
    .createHmac('sha256', ENV.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
};
