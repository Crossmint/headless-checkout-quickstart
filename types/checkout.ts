export type Order = {
  orderId: string;
  phase: string;
  recipient?: {
    email?: string;
    walletAddress?: string;
  };
  payment: {
    status?: string;
    method: string;
    currency: string;
    payerAddress?: string;
    preparation?: {
      stripePublishableKey?: string;
      stripeClientSecret?: string;
      serializedTransaction?: string;
      payerAddress?: string;
    };
  };
  lineItems: {
    collectionLocator: string;
    callData: {
      totalPrice: string;
    };
  }[];
  quote: {
    totalPrice: {
      amount: string;
      currency: string;
    };
  };
};

export type CreateOrderResponse = {
  clientSecret: string;
  order: Order;
};
