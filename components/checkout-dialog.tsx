import Image from "next/image";
import { useState, useEffect } from "react";
import { clsx } from "clsx";
import type { Weapon } from "../types/weapon";
import type { Order } from "@/types/checkout";
import { collectionId, createOrder, updateOrder, pollOrder } from "@/lib/api";
import { CardPayment } from "./card-payment";
import { CryptoPayment } from "./crypto-payment";
import { CheckoutStatus } from "./checkout-status";
import { useAccount } from "wagmi";

interface CheckoutDialogProps {
  selectedWeapon: Weapon;
  isOpen: boolean;
  onClose: () => void;
}

type PaymentMethod = "card" | "crypto";

const emailAddress = "buyer@crossmint.com";

export const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  selectedWeapon,
  isOpen,
  onClose,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("card");
  const [order, setOrder] = useState<Order | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const { address: walletAddress } = useAccount();

  // create order when dialog opens
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
              totalPrice: selectedWeapon.price,
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
  }, [isOpen, selectedWeapon.price]);

  // update order when payment method changes
  useEffect(() => {
    if (!order || !clientSecret) return;

    const updatePaymentMethod = async () => {
      // handle card payment method update
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

      // handle crypto payment method update
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
      <div className="bg-white/10 rounded-2xl p-8 max-w-lg w-full relative backdrop-blur-lg border border-white/20">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl"
          type="button"
        >
          ×
        </button>

        {/* Dialog title */}
        <h2 className="text-3xl text-white font-bold mb-8 font-['BreatheFireIII']">
          ORDER SUMMARY
        </h2>

        {/* Selected weapon info */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-white text-xl font-semibold mb-1">
              {selectedWeapon.name}
            </h3>
            <p className="text-white/60">Weapon</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <Image
              src={selectedWeapon.icon}
              alt={selectedWeapon.name}
              width={48}
              height={48}
              className="w-12 h-12 object-contain"
            />
          </div>
        </div>

        {/* Payment method tabs */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            type="button"
            onClick={() => setSelectedPaymentMethod("card")}
            className={clsx(
              "p-4 rounded-xl border transition-all duration-200 flex items-center gap-3",
              selectedPaymentMethod === "card"
                ? "border-blue-400 bg-blue-500/20"
                : "border-gray-600 bg-gray-700/30 hover:border-gray-500"
            )}
          >
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
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
            </div>
            <div className="flex flex-col items-start">
              <span className="text-white text-md font-bold">Pay With Card</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPaymentMethod("crypto")}
            className={clsx(
              "p-4 rounded-xl border transition-all duration-200 flex items-center gap-3",
              selectedPaymentMethod === "crypto"
                ? "border-blue-400 bg-blue-500/20"
                : "border-gray-600 bg-gray-700/30 hover:border-gray-500"
            )}
          >
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
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
            <div className="flex flex-col items-start">
              <span className="text-white text-md font-bold">Pay with USDC</span>
            </div>
          </button>
        </div>

        {/* Payment method content area */}
        <div className="min-h-[200px] w-full">
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
