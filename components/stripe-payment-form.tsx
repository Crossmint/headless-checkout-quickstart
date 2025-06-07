import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from "@stripe/react-stripe-js";
import type { Order } from "@/types/checkout";
import {
  type Appearance,
  type StripeElementsOptions,
  loadStripe,
} from "@stripe/stripe-js";

interface StripePaymentFormProps {
  order: Order;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
  onEmailChange: (email: string) => void;
}

const stripeAppearance: Appearance = {
  theme: "night",
  variables: {
    colorPrimary: "#3b82f6",
    colorBackground: "#374151",
    colorText: "#ffffff",
    colorDanger: "#ef4444",
  },
};

const PaymentForm: React.FC<StripePaymentFormProps> = ({
  order,
  onPaymentSuccess,
  onPaymentError,
  onEmailChange,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !stripe ||
      !elements ||
      !order.payment.preparation?.stripeClientSecret
    ) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error: submitError } = await elements.submit();
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret: order.payment.preparation.stripeClientSecret,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: "if_required",
      });

      if (submitError || confirmError) {
        onPaymentError(
          submitError?.message || confirmError?.message || "Payment failed"
        );
      } else {
        onPaymentSuccess();
      }
    } catch (err) {
      onPaymentError("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => onEmailChange(e.target.value)}
      />
      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />

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

export const StripePaymentForm: React.FC<StripePaymentFormProps> = (props) => {
  console.log("rendering stripe payment form", props.order);
  const stripePromise = loadStripe(
    props.order?.payment.preparation?.stripePublishableKey ?? ""
  );
  const elementOptions: StripeElementsOptions = {
    appearance: stripeAppearance,
    ...(props.order?.payment.preparation?.stripeClientSecret
      ? { clientSecret: props.order.payment.preparation.stripeClientSecret } // if we have a client secret, we're confirming payment
      : { mode: "setup", currency: "usd" }), // otherwise, we're setting up a payment method
  };

  return (
    <Elements stripe={stripePromise} options={elementOptions}>
      <PaymentForm {...props} />
    </Elements>
  );
};
