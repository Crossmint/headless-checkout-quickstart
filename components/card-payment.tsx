"use client";

import { useEffect, useRef } from "react";
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
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const handledRef = useRef<{
    orderId?: string;
    status?: string;
    failureMessage?: string;
  } | null>(null);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    if (!order?.orderId) return;

    const handled = handledRef.current;
    const orderId = order.orderId;
    const status = order.payment?.status;

    if (status === "completed") {
      if (handled?.orderId !== orderId || handled?.status !== "completed") {
        handledRef.current = { orderId, status: "completed" };
        onSuccessRef.current();
      }
    } else if (order.payment?.failureReason) {
      const message = order.payment.failureReason.message || "Payment failed";
      if (
        handled?.orderId !== orderId ||
        handled?.failureMessage !== message
      ) {
        handledRef.current = { orderId, failureMessage: message };
        onErrorRef.current(message);
      }
    }
  }, [order]);

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
