export type Order = {
  orderId: string;
  phase: string;
  lineItems: {
    collectionLocator: string;
    callData: {
      totalPrice: string;
    };
    metadata: {
      name: string;
      description: string;
      imageUrl: string;
    };
    quote: {
      status: string;
      charges: {
        unit: {
          amount: string;
          currency: string;
        };
        salesTax: {
          amount: string;
          currency: string;
        };
        shipping: {
          amount: string;
          currency: string;
        };
      };
      totalPrice: {
        amount: string;
        currency: string;
      };
    };
    delivery: {
      status: string;
      recipient: {
        locator: string;
        email: string;
        walletAddress: string;
      };
    };
  }[];
  quote: {
    status: string;
    quotedAt: string;
    expiresAt: string;
    totalPrice: {
      amount: string;
      currency: string;
    };
  };
  payment: {
    status: string;
    method: string;
    currency: string;
    receiptEmail: string;
    preparation: {
      chain?: string;
      payerAddress?: string;
      serializedTransaction?: string;
      stripePublishableKey?: string;
      stripeClientSecret?: string;
    };
  };
};

export type OrderInput = {
  payment: {
    method: string;
    receiptEmail?: string;
    currency: string;
    payerAddress?: string;
    walletAddress?: string;
  };
  lineItems: {
    collectionLocator: string;
    callData: {
      totalPrice: string;
    };
  }[];
  recipient?: {
    email?: string;
    walletAddress?: string;
  };
};

export type CreateOrderResponse = {
  clientSecret: string;
  order: Order;
};

export interface PaymentComponentProps {
  order: Order | null;
  isCreatingOrder: boolean;
  isPolling: boolean;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
  onEmailChange?: (email: string) => void;
  onWalletChange?: (walletAddress: string) => void;
  paymentError?: string | null;
}
