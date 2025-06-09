import type { PaymentComponentProps } from "@/types/checkout";
import { PaymentLoading, PaymentSuccess, PaymentError } from "./payment-status";
import { StripePaymentForm } from "./stripe-payment-form";

export const CardPayment: React.FC<PaymentComponentProps> = ({
  order,
  isCreatingOrder,
  isPolling,
  onPaymentSuccess,
  onPaymentError,
  paymentError,
}) => {
  if (isCreatingOrder) {
    return <PaymentLoading message="Creating your order..." />;
  }

  if (isPolling) {
    return <PaymentLoading message="Processing payment..." />;
  }

  if (order?.payment?.status === "completed") {
    return <PaymentSuccess message="Payment successful! 🎉" />;
  }

  if (order?.payment?.status === "failed" || paymentError) {
    return (
      <PaymentError
        message={paymentError ?? "Payment failed. Please try again."}
      />
    );
  }

  if (!order?.payment.preparation?.stripePublishableKey) {
    return <PaymentLoading message="Setting up payment..." />;
  }

  return (
    <div className="space-y-4">
      <StripePaymentForm
        stripeClientSecret={order.payment.preparation?.stripeClientSecret ?? ""}
        stripePublishableKey={
          order.payment.preparation?.stripePublishableKey ?? ""
        }
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
      />
    </div>
  );
};
