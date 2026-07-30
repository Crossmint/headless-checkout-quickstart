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
    if (!order?.orderId) {
      handledRef.current = null;
      return;
    }

    const orderId = order.orderId;
    const status = order.payment?.status;
    const failureReason = order.payment?.failureReason;

    // Reset the terminal-state guard when the order changes or the payment
    // moves back to a non-terminal state (e.g. retry after a failure).
    if (handledRef.current && handledRef.current.orderId !== orderId) {
      handledRef.current = null;
    }
    if (!failureReason && status !== "completed") {
      if (handledRef.current?.orderId === orderId) {
        handledRef.current = null;
      }
      return;
    }

    if (status === "completed") {
      if (
        handledRef.current?.orderId !== orderId ||
        handledRef.current?.status !== "completed"
      ) {
        handledRef.current = { orderId, status: "completed" };
        onSuccessRef.current();
      }
    } else if (failureReason) {
      const message = failureReason.message || "Payment failed";
      if (
        handledRef.current?.orderId !== orderId ||
        handledRef.current?.failureMessage !== message
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
