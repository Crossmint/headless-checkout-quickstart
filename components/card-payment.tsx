import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/UI/button";
import { TabHelper } from "@/components/UI/tab-helper";
import { copyToClipboard } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "@/components/UI/icons";

interface CardPaymentProps {
  stripePublishableKey: string | null;
  stripeClientSecret: string | null;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const TEST_CARD_NUMBER = "4242 4242 4242 4242";

const StripeForm: React.FC<{
  onSuccess: () => void;
  onError: (error: string) => void;
}> = ({ onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardCopied, setCardCopied] = useState(false);

  const handleCopyCard = async () => {
    if (await copyToClipboard(TEST_CARD_NUMBER.replace(/\s/g, ""))) {
      setCardCopied(true);
      setTimeout(() => setCardCopied(false), 2000);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const { error: submitError } = await elements.submit();
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: "if_required",
      });

      if (submitError || confirmError) {
        onError(
          submitError?.message || confirmError?.message || "Payment failed"
        );
        return;
      }
      onSuccess();
    } catch (err) {
      onError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
      <PaymentElement className="w-full" />
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
      >
        {isProcessing ? "PROCESSING..." : "PAY"}
      </Button>
    </form>
  );
};

export const CardPayment: React.FC<CardPaymentProps> = ({
  stripePublishableKey,
  stripeClientSecret,
  onSuccess,
  onError,
}) => {
  if (!stripePublishableKey || !stripeClientSecret) {
    return null;
  }

  const stripePromise = loadStripe(stripePublishableKey);

  return (
    <Elements
      key={`${stripeClientSecret}-${stripePublishableKey}`}
      stripe={stripePromise}
      options={{
        clientSecret: stripeClientSecret,
        appearance: {
          variables: {
            colorPrimary: "#FFFFFF",
            colorBackground: "#8989A3B2",
            colorText: "#FFFFFF",
            colorDanger: "#EF4444",
          },
        },
      }}
    >
      <StripeForm onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
};
