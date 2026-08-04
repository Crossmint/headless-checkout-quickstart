import Image from "next/image";
import { useState } from "react";
import type { Order } from "@/types/api";
import { getNftUrl, getTransactionUrl } from "@/lib/explorer";
import { copyToClipboard } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "@/components/UI/icons";
import { Button } from "@/components/UI/button";

interface CheckoutSuccessProps {
  order: Order;
}

const DOCS_URL = "https://docs.crossmint.com/payments/headless/overview";
const CONTACT_URL = "https://www.crossmint.com/contact/sales";

const ExternalLinkIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
    />
  </svg>
);

const BuildStep: React.FC = () => (
  <div className="flex flex-col items-center gap-6 py-6 text-center success-pop">
    <div className="w-16 h-16 rounded-full bg-accent-foreground border border-accent/40 flex items-center justify-center">
      <svg
        className="w-8 h-8 text-accent"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
        />
      </svg>
    </div>

    <div className="flex flex-col items-center gap-2">
      <h3 className="text-primary text-3xl font-['BreatheFireIII'] tracking-wide">
        BUILD YOUR OWN
      </h3>
      <p className="text-primary/70 max-w-sm">
        This demo runs on Crossmint&apos;s headless checkout API. Add the same
        flow to your app in minutes.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      <Button
        onClick={() => window.open(DOCS_URL, "_blank", "noopener")}
        className="w-full px-4"
      >
        READ THE DOCS
      </Button>
      <Button
        onClick={() => window.open(CONTACT_URL, "_blank", "noopener")}
        className="w-full px-4"
      >
        CONTACT SALES
      </Button>
    </div>
  </div>
);

export const CheckoutSuccess: React.FC<CheckoutSuccessProps> = ({
  order,
}) => {
  const [step, setStep] = useState<"receipt" | "build">("receipt");
  const [copied, setCopied] = useState(false);

  const lineItem = order.lineItems?.[0];
  const token = lineItem?.delivery?.tokens?.[0];
  const nftUrl = getNftUrl(
    lineItem?.chain,
    token?.contractAddress,
    token?.tokenId
  );
  const txUrl = getTransactionUrl(lineItem?.chain, lineItem?.delivery?.txId);
  const explorerUrl = nftUrl ?? txUrl;
  const totalPrice = order.quote?.totalPrice;

  const handleCopyOrderId = async () => {
    if (await copyToClipboard(order.orderId)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (step === "build") {
    return <BuildStep />;
  }

  return (
    <div className="flex flex-col items-center gap-6 py-2 success-pop">
      {/* Animated check; top margin leaves room for the ping halo (2x scale) */}
      <div className="relative mt-12">
        <div className="absolute inset-0 rounded-full bg-green-400/40 animate-ping" />
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-b from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/40">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-primary text-3xl font-['BreatheFireIII'] tracking-wide">
          PAYMENT SUCCESSFUL
        </h3>
        <p className="text-primary/70">
          The God Sword is yours! It has been delivered on-chain.
        </p>
      </div>

      {/* Receipt card */}
      <div className="w-full rounded-xl border border-accent/40 bg-accent-foreground p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-card-foreground rounded-lg p-2">
            <Image
              src="/sword.svg"
              alt="God Sword"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
            />
          </div>
          <div className="flex-1">
            <p className="text-primary font-semibold">God Sword</p>
            <p className="text-primary/60 text-sm">Delivered ✓</p>
          </div>
        </div>

        <div className="border-t border-accent/20 pt-3 flex flex-col gap-2 text-sm">
          {totalPrice && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-primary/60">Total paid</span>
              <span className="text-primary font-semibold">
                ${totalPrice.amount}{" "}
                <span className="text-primary/60 font-normal uppercase">
                  {totalPrice.currency}
                </span>
              </span>
            </div>
          )}
          <div className="flex items-center justify-between gap-2">
            <span className="text-primary/60">Order ID</span>
            <button
              type="button"
              onClick={handleCopyOrderId}
              className="flex items-center gap-1.5 text-primary/90 hover:text-primary font-mono"
              title="Copy order ID"
            >
              {order.orderId.slice(0, 8)}…{order.orderId.slice(-4)}
              {copied ? (
                <CheckIcon className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <CopyIcon className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          {explorerUrl && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-primary/60">
                {nftUrl ? "Your NFT" : "Transaction"}
              </span>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-accent hover:underline underline-offset-4"
              >
                View on block explorer
                <ExternalLinkIcon />
              </a>
            </div>
          )}
        </div>
      </div>

      <Button onClick={() => setStep("build")} className="w-full">
        CONTINUE
      </Button>
    </div>
  );
};
