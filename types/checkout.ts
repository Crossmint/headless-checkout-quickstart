export type Order = {
  orderId: string;
  phase: string;
  payment: {
    status: string;
    method: string;
    currency: string;
    preparation: {
      stripePublishableKey?: string;
      stripeClientSecret?: string;
      serializedTransaction?: string;
      payerAddress?: string;
    };
  };
  quote: {
    totalPrice: {
      amount: string;
      currency: string;
    };
  };
};

export type OrderInput = {
  payment: {
    method: string;
    currency: string;
    payerAddress?: string;
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
