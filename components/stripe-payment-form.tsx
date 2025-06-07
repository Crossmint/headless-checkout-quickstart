import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  LinkAuthenticationElement,
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
      elements.update({
        customerSessionClientSecret:
          order.payment.preparation.stripeClientSecret,
      });
      const { error: submitError } = await elements.submit();
      const { error: confirmError } = await stripe.confirmPayment({
        clientSecret: order.payment.preparation.stripeClientSecret,
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

  const handleEmailChange = (event: { value: { email: string } }) => {
    if (event.value?.email) {
      onEmailChange(event.value.email);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <LinkAuthenticationElement
        onChange={handleEmailChange}
        options={{
          defaultValues: {
            email: order.payment?.receiptEmail || "",
          },
        }}
      />

      <PaymentElement
        options={{
          layout: "tabs",
          wallets: {
            applePay: "auto",
            googlePay: "auto",
          },
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

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  order,
  ...props
}) => {
  const stripePromise = loadStripe(
    order?.payment.preparation?.stripePublishableKey ?? ""
  );

  const elementOptions: StripeElementsOptions = {
    appearance: stripeAppearance,
    mode: "payment",
    currency: "usd",
    amount: Number(order?.quote?.totalPrice?.amount ?? 0) * 100,
    capture_method: "manual",
    payment_method_types: ["card"],
  };

  return (
    <Elements stripe={stripePromise} options={elementOptions}>
      <PaymentForm order={order} {...props} />
    </Elements>
  );
};
