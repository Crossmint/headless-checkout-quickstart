import type { PaymentComponentProps } from "@/types/checkout";
import { PaymentError, PaymentLoading, PaymentSuccess } from "./payment-status";
import { Button } from "@/components/button";
import { useCrossmintWallet } from "@/hooks/useCrossmintWallet";
import { useEffect, useRef, useState } from "react";
import { useSendTransaction } from "wagmi";
import type { Hex } from "viem";
import { parseTransaction } from "viem";

export const UsdcPayment: React.FC<PaymentComponentProps> = ({
  order,
  isCreatingOrder,
  isPolling,
  onWalletChange,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const { user, login, logout, isWalletLoading, wallet, signerAddress } =
    useCrossmintWallet();
  // TODO: use crossmint wallet to send transaction
  const { data: hash, isPending, sendTransactionAsync } = useSendTransaction();

  const onWalletChangeRef = useRef(onWalletChange);
  onWalletChangeRef.current = onWalletChange;

  useEffect(() => {
    // update if address exists and has changed
    if (
      signerAddress &&
      signerAddress !== order?.payment?.preparation?.payerAddress
    ) {
      onWalletChangeRef.current?.(signerAddress);
    }
  }, [signerAddress, order?.payment?.preparation?.payerAddress]);

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

  if (!user) {
    return <Button onClick={login}>CONNECT WALLET</Button>;
  }

  if (isWalletLoading) {
    return <PaymentLoading message="Connecting wallet..." />;
  }

  if (isCreatingOrder) {
    return <PaymentLoading message="Creating your order..." />;
  }

  if (isPolling) {
    return <PaymentLoading message="Processing payment..." />;
  }

  if (order?.payment?.status === "completed") {
    return <PaymentSuccess message="Payment successful! 🎉" />;
  }

  if (order?.payment?.status === "failed") {
    return <PaymentError message="Payment failed. Please try again." />;
  }

  if (order?.payment?.status === "crypto-payer-insufficient-funds") {
    return <PaymentError message="Insufficient funds." />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <p>{signerAddress}</p>
      <Button onClick={logout}>LOGOUT</Button>
      <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
        <Button disabled={isPending} onClick={signAndSendTransaction}>
          PAY
        </Button>
        {hash && <p>Transaction hash: {hash}</p>}
      </div>
    </div>
  );
};
