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
    preparation: {
      chain?: string;
      payerAddress?: string;
      serializedTransaction?: string;
      stripePublishableKey?: string;
    };
  };
};

export type OrderInput = {
  payment: {
    method: "stripe-payment-element";
    receiptEmail?: string;
    currency: string;
  };
  lineItems: {
    collectionLocator: string;
    callData: {
      totalPrice: string;
    };
  }[];
  recipient?: {
    email: string;
  };
};

export type CreateOrderResponse = {
  clientSecret: string;
  order: Order;
};
