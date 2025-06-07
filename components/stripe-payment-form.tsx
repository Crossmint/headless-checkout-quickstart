import { useState, useEffect } from "react";
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
  const [email, setEmail] = useState(order.payment?.receiptEmail || "");

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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    onEmailChange(newEmail);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
        className="w-full px-4 py-3 bg-gray-600/50 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
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
    <Elements
      stripe={stripePromise}
      options={elementOptions}
      key={props.order?.payment.preparation?.stripeClientSecret || "setup"} // force re-render when switching modes
    >
      <PaymentForm {...props} />
    </Elements>
  );
};
