import type { PaymentComponentProps } from "@/types/checkout";
import { PaymentError, PaymentLoading, PaymentSuccess } from "./payment-status";
import {
  CrossmintAuthProvider,
  CrossmintProvider,
  CrossmintWalletProvider,
} from "@crossmint/client-sdk-react-ui";
import { apiKey } from "@/lib/checkout";
import { Button } from "@/components/button";
import { useCrossmintWallet } from "@/hooks/useCrossmintWallet";

const UsdcPaymentComponent: React.FC<PaymentComponentProps> = ({
  order,
  isCreatingOrder,
  isPolling,
}) => {
  const { user, login, logout, isWalletLoading, wallet, signerAddress } =
    useCrossmintWallet();

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
      <p>{signerAddress}</p>
      <Button onClick={logout}>LOGOUT</Button>
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

export const UsdcPayment: React.FC<PaymentComponentProps> = (props) => {
  return (
    <CrossmintProvider apiKey={apiKey}>
      <CrossmintAuthProvider
        authModalTitle="Headless Quickstart"
        loginMethods={["web3:evm-only"]}
      >
        <CrossmintWalletProvider>
          <UsdcPaymentComponent {...props} />
        </CrossmintWalletProvider>
      </CrossmintAuthProvider>
    </CrossmintProvider>
  );
};
