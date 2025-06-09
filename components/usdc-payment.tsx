import type { PaymentComponentProps } from "@/types/checkout";
import { PaymentError, PaymentLoading, PaymentSuccess } from "./payment-status";
import { Button } from "@/components/button";
import { useAccount, useSendTransaction } from "wagmi";
import type { Hex } from "viem";
import { parseTransaction } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { baseSepolia } from "viem/chains";

export const UsdcPayment: React.FC<PaymentComponentProps> = ({
  order,
  isCreatingOrder,
  isPolling,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const { data: hash, isPending, sendTransactionAsync } = useSendTransaction();
  const { address: walletAddress, chainId } = useAccount();

  const signAndSendTransaction = async () => {
    if (!order?.payment?.preparation?.serializedTransaction) {
      return;
    }
    try {
      const serializedTxn = order.payment.preparation
        .serializedTransaction as Hex;
      const txn = parseTransaction(serializedTxn);

      await sendTransactionAsync({
        to: txn.to,
        value: txn.value,
        data: txn.data,
        chainId: txn.chainId,
      });
      onPaymentSuccess();
    } catch (err) {
      onPaymentError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    }
  };

  if (isPolling) {
    return <PaymentLoading message="Processing payment..." />;
  }

  if (order?.payment?.status === "completed") {
    return <PaymentSuccess message="Payment successful! 🎉" />;
  }

  if (order?.payment?.status === "failed") {
    return <PaymentError message="Payment failed. Please try again." />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <ConnectButton />
      {order?.payment?.status === "crypto-payer-insufficient-funds" && (
        <PaymentError message="Insufficient funds." />
      )}
      {walletAddress && chainId === baseSepolia.id && (
        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
          <Button disabled={isPending} onClick={signAndSendTransaction}>
            PAY
          </Button>
          {hash && <p>Transaction hash: {hash}</p>}
        </div>
      )}
    </div>
  );
};
