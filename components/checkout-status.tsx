interface CheckoutStatusProps {
  status: string;
  message: string;
}

export const CheckoutStatus: React.FC<CheckoutStatusProps> = ({
  status,
  message,
}) => {
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-white/80 text-center">{message}</p>
      </div>
    );
  }

  return null;
};
