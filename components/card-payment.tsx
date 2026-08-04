"use client";

import { useEffect, useRef, useState } from "react";
import {
  CrossmintProvider,
  CrossmintCheckoutProvider,
  CrossmintEmbeddedCheckout,
  useCrossmintCheckout,
} from "@crossmint/client-sdk-react-ui";
import { TabHelper } from "@/components/UI/tab-helper";
import { CheckIcon, CopyIcon } from "@/components/UI/icons";
import { copyToClipboard } from "@/lib/utils";

const TEST_CARD_NUMBER = "4242 4242 4242 4242";

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
  const [cardCopied, setCardCopied] = useState(false);

  if (!orderId || !clientSecret) {
    return null;
  }

  const handleCopyCard = async () => {
    if (await copyToClipboard(TEST_CARD_NUMBER.replace(/\s/g, ""))) {
      setCardCopied(true);
      setTimeout(() => setCardCopied(false), 2000);
    }
  };

  return (
    <div key={`${orderId}-${clientSecret}-${paymentMethod}`}>
      <TabHelper title="TEST CARD">
        <div className="flex items-center justify-between gap-2">
          <span>{TEST_CARD_NUMBER}</span>
          <button
            type="button"
            onClick={handleCopyCard}
            className="p-1 cursor-pointer text-primary/80 hover:text-primary transition-colors"
            title="Copy test card number"
            aria-label="Copy test card number"
          >
            {cardCopied ? (
              <CheckIcon className="w-[18px] h-[18px] text-green-400" />
            ) : (
              <CopyIcon className="w-[18px] h-[18px]" />
            )}
          </button>
        </div>
      </TabHelper>
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
                Label: {
                  colors: { text: "#FFFFFFCC" },
                },
                Input: {
                  borderRadius: "12px",
                  colors: {
                    text: "#FFFFFF",
                    background: "#12122066",
                    border: "#C7D3FF55",
                    placeholder: "#FFFFFF99",
                  },
                  hover: { colors: { border: "#C7D3FF99" } },
                  focus: { colors: { border: "#C7D3FF", background: "#12122099" } },
                },
                Tab: {
                  borderRadius: "12px",
                  colors: {
                    text: "#FFFFFF",
                    background: "#12121233",
                    border: "#12121233",
                  },
                  hover: { colors: { border: "#C7D3FF55" } },
                  selected: {
                    colors: {
                      text: "#FFFFFF",
                      background: "#9DAFF44D",
                      border: "#C7D3FF",
                    },
                  },
                },
                PrimaryButton: {
                  borderRadius: "12px",
                  colors: { text: "#000000", background: "#C7D3FF" },
                  hover: { colors: { background: "#DCE4FF" } },
                  disabled: { colors: { background: "#C7D3FF66" } },
                },
              },
              variables: {
                borderRadius: "12px",
                colors: {
                  backgroundPrimary: "transparent",
                  textPrimary: "#FFFFFF",
                  textSecondary: "#FFFFFFB3",
                  accent: "#C7D3FF",
                  danger: "#EF4444",
                  borderPrimary: "#C7D3FF55",
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
