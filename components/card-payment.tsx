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
  paymentMethod: string;
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
  const previousOrderRef = useRef(order);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    const previousOrder = previousOrderRef.current;
    previousOrderRef.current = order;

    if (!order?.orderId) {
      return;
    }

    const status = order.payment?.status;
    const previousStatus = previousOrder?.payment?.status;
    const failureReason = order.payment?.failureReason;
    const previousFailureReason = previousOrder?.payment?.failureReason;
    const failureMessage =
      failureReason?.message || failureReason?.code || "Payment failed";
    const previousFailureMessage =
      previousFailureReason?.message || previousFailureReason?.code;

    if (status === "completed" && previousStatus !== "completed") {
      onSuccessRef.current();
      return;
    }

    if (failureReason && failureMessage !== previousFailureMessage) {
      onErrorRef.current(failureMessage);
    }
  }, [order]);

  return null;
}

export const CardPayment: React.FC<CardPaymentProps> = ({
  apiKey,
  orderId,
  clientSecret,
  email,
  paymentMethod,
  onSuccess,
  onError,
}) => {
  if (!orderId || !clientSecret) {
    return null;
  }

  return (
    <div key={`${orderId}-${clientSecret}-${paymentMethod}`}>
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
