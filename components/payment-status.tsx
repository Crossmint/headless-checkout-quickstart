interface PaymentStatusProps {
  message?: string;
}

export const PaymentLoading: React.FC<PaymentStatusProps> = ({ message = "Processing..." }) => (
  <div className="flex flex-col items-center justify-center h-full gap-4">
    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    <p className="text-white/60 text-center">{message}</p>
  </div>
);

export const PaymentSuccess: React.FC<PaymentStatusProps> = ({ message = "Payment successful! 🎉" }) => (
  <div className="flex flex-col items-center justify-center h-full gap-4">
    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <p className="text-green-400 text-center font-medium">{message}</p>
  </div>
);

export const PaymentError: React.FC<PaymentStatusProps> = ({ message = "Payment failed. Please try again." }) => (
  <div className="flex flex-col items-center justify-center h-full gap-4">
    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
    <p className="text-red-400 text-center font-medium">{message}</p>
  </div>
); 