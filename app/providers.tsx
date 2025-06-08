"use client";

import { apiKey } from "@/lib/checkout";
import { wagmiConfig } from "@/lib/wagmi";
import {
  CrossmintAuthProvider,
  CrossmintProvider,
  CrossmintWalletProvider,
} from "@crossmint/client-sdk-react-ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <CrossmintProvider apiKey={apiKey}>
          <CrossmintAuthProvider
            authModalTitle="Headless Quickstart"
            loginMethods={["web3:evm-only"]}
          >
            <CrossmintWalletProvider>{children}</CrossmintWalletProvider>
          </CrossmintAuthProvider>
        </CrossmintProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
