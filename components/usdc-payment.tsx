import type { PaymentComponentProps } from "@/types/checkout";
import { PaymentError, PaymentLoading, PaymentSuccess } from "./payment-status";

export const UsdcPayment: React.FC<PaymentComponentProps> = ({
  order,
  isCreatingOrder,
  isPolling,
}) => {
  if (isCreatingOrder) {
    return <PaymentLoading message="Creating your order..." />;
  }

  if (isPolling) {
    return <PaymentLoading message="Processing crypto payment..." />;
  }

  if (order?.payment?.status === "completed") {
    return <PaymentSuccess message="Payment successful! 🎉" />;
  }

  if (order?.payment?.status === "failed") {
    return <PaymentError message="Payment failed. Please try again." />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
        <svg
          className="w-8 h-8 text-blue-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="text-center">
        <h3 className="text-white text-lg font-semibold mb-2">USDC Payment</h3>
        <p className="text-white/60">Coming soon! Pay with crypto.</p>
      </div>
    </div>
  );
};
