import type { PaymentComponentProps } from "@/types/checkout";
import { PaymentLoading, PaymentSuccess, PaymentError } from "./payment-status";
import { StripePaymentForm } from "./stripe-payment-form";

export const CardPayment: React.FC<PaymentComponentProps> = ({
  order,
  isCreatingOrder,
  isPolling,
  onPaymentSuccess,
  onPaymentError,
  onEmailChange,
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

  if (!order) {
    return <PaymentLoading message="Preparing payment..." />;
  }

  if (!order.payment.preparation?.stripePublishableKey) {
    return <PaymentLoading message="Setting up payment..." />;
  }

  return (
    <div className="space-y-4">
      <StripePaymentForm
        order={order}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
        onEmailChange={onEmailChange}
      />
    </div>
  );
};
