import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/button";

interface CardPaymentProps {
  stripePublishableKey: string | null;
  stripeClientSecret: string | null;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const StripeForm: React.FC<{
  onSuccess: () => void;
  onError: (error: string) => void;
}> = ({ onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

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
