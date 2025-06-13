import Image from "next/image";
import { useState, useEffect } from "react";
import { clsx } from "clsx";
import type { Order } from "@/types/api";
import { collectionId, createOrder, updateOrder, pollOrder } from "@/lib/api";
import { CardPayment } from "./card-payment";
import { CryptoPayment } from "./crypto-payment";
import { CheckoutStatus } from "./checkout-status";
import { useAccount } from "wagmi";
import { PaymentMethodButton } from "./PaymentMethodButton";

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type PaymentMethod = "card" | "crypto";

const emailAddress = "buyer@crossmint.com";

export const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("card");
  const [order, setOrder] = useState<Order | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const { address: walletAddress } = useAccount();

  // Create order ID when dialog opens and set credit card payment method as default
  useEffect(() => {
    if (!isOpen) return;

    const initializeOrder = async () => {
      const result = await createOrder({
        recipient: { email: emailAddress },
        payment: {
          method: "stripe-payment-element",
          currency: "usd",
        },
        lineItems: [
          {
            collectionLocator: `crossmint:${collectionId}`,
            callData: {
              totalPrice: "0.53",
            },
          },
        ],
      });

      if (result.success && result.order) {
        setOrder(result.order.order);
        setClientSecret(result.order.clientSecret);
      }
    };

    initializeOrder();

    return () => {
      setSelectedPaymentMethod("card");
      setOrder(null);
      setClientSecret(null);
      setIsPolling(false);
    };
  }, [isOpen]);

  // Update order when payment method changes
  useEffect(() => {
    if (!order || !clientSecret) return;

    const updatePaymentMethod = async () => {
      // Handle card payment method update
      if (
        selectedPaymentMethod === "card" &&
        order.payment.method !== "stripe-payment-element"
      ) {
        const result = await updateOrder(order.orderId, clientSecret, {
          recipient: { email: emailAddress },
          payment: {
            method: "stripe-payment-element",
            currency: "usd",
          },
        });
        if (result.success && result.order) {
          setOrder(result.order);
        }
        return;
      }

      // Handle crypto payment method update
      if (
        selectedPaymentMethod === "crypto" &&
        order?.payment?.preparation?.payerAddress?.toLowerCase() !==
          walletAddress?.toLowerCase()
      ) {
        const result = await updateOrder(order.orderId, clientSecret, {
          recipient: { walletAddress },
          payment: {
            method: "base-sepolia",
            currency: "usdc",
            payerAddress: walletAddress,
          },
        });
        if (result.success && result.order) {
          setOrder(result.order);
        }
        return;
      }
    };

    updatePaymentMethod();
  }, [selectedPaymentMethod, order, clientSecret, walletAddress]);

  const handlePaymentSuccess = async () => {
    if (!order || !clientSecret) return;

    setIsPolling(true);

    try {
      const result = await pollOrder(order.orderId, clientSecret);
      if (result.success && result.order) {
        setOrder(result.order);
      }
    } catch (error) {
      console.error("Polling error:", error);
    } finally {
      setIsPolling(false);
    }
  };

  const getCheckoutStatus = () => {
    if (!order) {
      return { status: "loading", message: "Creating your order..." };
    }
    if (isPolling) {
      return { status: "loading", message: "Processing payment..." };
    }
    if (order.payment?.status === "completed") {
      return { status: "success", message: "Payment successful! 🎉" };
    }
    if (order.payment?.status === "failed") {
      return {
        status: "error",
        message: "Payment failed. Please try again.",
      };
    }
    if (order.payment?.status === "crypto-payer-insufficient-funds") {
      return { status: "error", message: "Insufficient funds." };
    }
    return null;
  };

  if (!isOpen) return null;

  const checkoutStatus = getCheckoutStatus();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="modal max-h-[calc(100vh-32px)] max-w-lg w-full flex flex-col justify-between">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-primary/60 hover:text-primary text-2xl"
          type="button"
        >
          ×
        </button>

        {/* Selected weapon info */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-primary text-xl font-semibold">
              Order Summary
            </h3>
            <p className="text-primary/60">God Sword</p>
          </div>
          <div className="bg-accent-foreground rounded-lg p-3">
            <Image
              src="/sword.svg"
              alt="Sword"
              width={48}
              height={48}
              className="w-12 h-12 object-contain"
            />
          </div>
        </div>

        {/* Payment method tabs */}
        <div className="grid grid-cols-2 gap-4">

         {/* Select credit card as payment method */}
          <PaymentMethodButton
            selected={selectedPaymentMethod === "card"}
            onClick={() => setSelectedPaymentMethod("card")}
            icon={
              <svg
                className="w-8 h-8 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path
                  fillRule="evenodd"
                  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                  clipRule="evenodd"
                />
              </svg>
            }
            label="Pay With Card"
          />
         {/* Select USDC as payment method */}
          <PaymentMethodButton
            selected={selectedPaymentMethod === "crypto"}
            onClick={() => setSelectedPaymentMethod("crypto")}
            icon={
              <svg
                className="w-8 h-8 text-primary"
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
            }
            label="Pay with USDC"
          />
        </div>

        {/* Payment method content area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pr-4 -mr-4 scrollbar-stable">
          {checkoutStatus && checkoutStatus?.status !== "error" ? (
            <CheckoutStatus
              status={checkoutStatus?.status}
              message={checkoutStatus?.message}
            />
          ) : (
            <>
              {checkoutStatus && checkoutStatus?.status === "error" && (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <p className="text-red-400 text-center">
                    {checkoutStatus.message}
                  </p>
                </div>
              )}

              {selectedPaymentMethod === "card" && (
                <CardPayment
                  stripePublishableKey={
                    order?.payment.preparation?.stripePublishableKey || null
                  }
                  stripeClientSecret={
                    order?.payment.preparation?.stripeClientSecret || null
                  }
                  onSuccess={handlePaymentSuccess}
                  onError={(error) => {
                    console.error("Card payment error:", error);
                    setIsPolling(false);
                  }}
                />
              )}

              {selectedPaymentMethod === "crypto" && (
                <CryptoPayment
                  serializedTransaction={
                    order?.payment.preparation?.serializedTransaction || null
                  }
                  onSuccess={handlePaymentSuccess}
                  onError={(error) => {
                    console.error("Crypto payment error:", error);
                    setIsPolling(false);
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
