import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from "@stripe/react-stripe-js";
import type { Order, PaymentComponentProps } from "@/types/checkout";
import { type Appearance, loadStripe } from "@stripe/stripe-js";

interface StripePaymentFormProps {
  stripeClientSecret: string;
  stripePublishableKey: string;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
}

const PaymentForm: React.FC<
  Omit<StripePaymentFormProps, "stripeClientSecret" | "stripePublishableKey">
> = ({ onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

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
        onPaymentError(
          submitError?.message || confirmError?.message || "Payment failed"
        );
        return;
      }
      onPaymentSuccess();
    } catch (err) {
      onPaymentError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement className="w-full" />

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
      >
        {isProcessing ? "Processing..." : "Complete Payment"}
      </button>
    </form>
  );
};

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  stripeClientSecret,
  stripePublishableKey,
  ...props
}) => {
  const stripePromise = loadStripe(stripePublishableKey);

  return (
    <Elements
      key={`${stripeClientSecret}-${stripePublishableKey}`}
      stripe={stripePromise}
      options={{
        clientSecret: stripeClientSecret,
        appearance: {
          variables: {
            colorPrimary: "#3b82f6",
            colorBackground: "#374151",
            colorText: "#ffffff",
            colorDanger: "#ef4444",
          },
          rules: {
            ".Label": {
              color: "#fff",
              fontSize: "0px",
              padding: "0px",
              margin: "0px",
            },
            ".Tab": {
              border: "none",
            },
            ".Input": {
              border: "none",
            },
          },
        },
      }}
    >
      <PaymentForm {...props} />
    </Elements>
  );
};
