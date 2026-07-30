"use client";

import { useEffect } from "react";
import {
  CrossmintProvider,
  CrossmintCheckoutProvider,
  CrossmintEmbeddedCheckout,
  useCrossmintCheckout,
} from "@crossmint/client-sdk-react-ui";

interface CardPaymentProps {
  apiKey: string;
  orderId: string | null;
  clientSecret: string | null;
  email: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

function PaymentStatusWatcher({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: string) => void;
}) {
  const { order } = useCrossmintCheckout();

  useEffect(() => {
    if (!order) return;

    if (order.payment?.status === "completed") {
      onSuccess();
    } else if (order.payment?.failureReason) {
      onError(order.payment.failureReason.message || "Payment failed");
    }
  }, [order, onSuccess, onError]);

  return null;
}

export const CardPayment: React.FC<CardPaymentProps> = ({
  apiKey,
  orderId,
  clientSecret,
  email,
  onSuccess,
  onError,
}) => {
  if (!orderId || !clientSecret) {
    return null;
  }

  return (
    <div key={`${orderId}-${clientSecret}`}>
      <CrossmintProvider apiKey={apiKey}>
        <CrossmintCheckoutProvider>
          <CrossmintEmbeddedCheckout
            orderId={orderId}
            clientSecret={clientSecret}
            payment={{
              fiat: {
                enabled: true,
                defaultCurrency: "usd",
                allowedMethods: { card: true },
              },
              crypto: { enabled: false },
              defaultMethod: "fiat",
              receiptEmail: email,
            }}
            appearance={{
              rules: {
                DestinationInput: { display: "hidden" },
                ReceiptEmailInput: { display: "hidden" },
              },
              variables: {
                colors: {
                  backgroundPrimary: "#8989A3B2",
                  textPrimary: "#FFFFFF",
                  textSecondary: "#FFFFFF",
                  accent: "#FFFFFF",
                  danger: "#EF4444",
                  borderPrimary: "#FFFFFF",
                },
              },
            }}
          />
          <PaymentStatusWatcher onSuccess={onSuccess} onError={onError} />
        </CrossmintCheckoutProvider>
      </CrossmintProvider>
    </div>
  );
};
