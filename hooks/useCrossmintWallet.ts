import { useQuery } from "@tanstack/react-query";
import { useAuth, useWallet } from "@crossmint/client-sdk-react-ui";
import { useAccount } from "wagmi";

export const useCrossmintWallet = () => {
  const { user, login, logout } = useAuth();
  const { wallet, getOrCreateWallet, status } = useWallet();
  const { address: signerAddress } = useAccount();

  const { isLoading: isWalletLoading, refetch: refetchWallet } = useQuery({
    queryKey: ["wallet", signerAddress, user?.id],
    queryFn: async () => {
      if (!signerAddress || !user) {
        return null;
      }
      return getOrCreateWallet({
        chain: "base-sepolia",
        signer: {
          type: "external-wallet",
          address: signerAddress,
        },
      });
    },
    enabled: !!signerAddress && !!user,
  });

  return {
    login,
    logout,
    wallet,
    status,
    signerAddress,
    user,
    isWalletLoading,
    refetchWallet,
  };
};
