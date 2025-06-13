import { Button } from "@/components/button";
import { useAccount, useSendTransaction } from "wagmi";
import type { Hex } from "viem";
import { parseTransaction } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { baseSepolia } from "viem/chains";
import Link from "next/link";
import { TabHelper } from "@/components/tab-helper";

interface CryptoPaymentProps {
  serializedTransaction: string | null;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export const CryptoPayment: React.FC<CryptoPaymentProps> = ({
  serializedTransaction,
  onSuccess,
  onError,
}) => {
  const { isPending, sendTransactionAsync } = useSendTransaction();
  const { address: walletAddress, chainId } = useAccount();

  const signAndSendTransaction = async () => {
    if (!serializedTransaction) {
      return;
    }
    try {
      const serializedTxn = serializedTransaction as Hex;
      const txn = parseTransaction(serializedTxn);

      await sendTransactionAsync({
        to: txn.to,
        value: txn.value,
        data: txn.data,
        chainId: txn.chainId,
      });
      onSuccess();
    } catch (err) {
      onError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 w-full">
      <ConnectButton
        showBalance={false}
        accountStatus={{
          smallScreen: "address",
          largeScreen: "address",
        }}
      />
      {walletAddress && chainId === baseSepolia.id && (
        <>
          
          {/* Testing instructions */}
          <TabHelper title="Testing instructions">
            <ul className="list-disc pl-4">
              <li>
                <Link
                  href="https://faucet.circle.com/"
                  target="_blank"
                  className="text-white underline"
                >
                  Get test USDC
                </Link>{" "}
                to proceed with the transaction
              </li>
              <li>
                <Link
                  href="https://faucet.quicknode.com/base/sepolia"
                  target="_blank"
                  className="text-white underline"
                >
                  Get test ETH
                </Link>{" "}
                to pay for the gas fees
              </li>
            </ul>
          </TabHelper>

          <Button
            disabled={isPending}
            onClick={signAndSendTransaction}
            className="w-full"
          >
            {isPending ? "PROCESSING..." : "PAY"}
          </Button>
        </>
      )}
    </div>
  );
};
