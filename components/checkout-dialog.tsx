import Image from "next/image";
import { useState, useEffect } from "react";
import { clsx } from "clsx";
import type { Weapon } from "../types/weapon";
import { useCheckout } from "@/hooks/useCheckout";
import { collectionId } from "@/lib/checkout";

interface CheckoutDialogProps {
  selectedWeapon: Weapon;
  isOpen: boolean;
  onClose: () => void;
}

type PaymentMethod = "card" | "usdc";

export const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  selectedWeapon,
  isOpen,
  onClose,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("card");

  const { createOrder, isCreatingOrder } = useCheckout();

  useEffect(() => {
    if (isOpen) {
      createOrder({
        payment: {
          method: "stripe-payment-element",
          currency: "usd",
        },
        lineItems: [
          {
            collectionLocator: `crossmint:${collectionId}:${selectedWeapon.templateId}`,
            callData: {
              totalPrice: selectedWeapon.price,
            },
          },
        ],
      });
    }
  }, [isOpen, selectedWeapon.templateId, selectedWeapon.price, createOrder]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 rounded-2xl p-8 max-w-md w-full relative md:backdrop-blur-lg border border-white/20">
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
              "p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3",
              selectedPaymentMethod === "card"
                ? "border-blue-400 bg-blue-500/20"
                : "border-gray-600 bg-gray-700/30 hover:border-gray-500"
            )}
          >
            <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
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
            <span className="text-white font-medium">Pay with Card</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPaymentMethod("usdc")}
            className={clsx(
              "p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3",
              selectedPaymentMethod === "usdc"
                ? "border-blue-400 bg-blue-500/20"
                : "border-gray-600 bg-gray-700/30 hover:border-gray-500"
            )}
          >
            <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
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
            <span className="text-white font-medium">Pay with USDC</span>
          </button>
        </div>

        {/* Payment method content area */}
        <div className="min-h-[200px] bg-gray-700/20 rounded-xl p-6 flex items-center justify-center">
          {isCreatingOrder ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <p className="text-white/60 text-center">
                Creating your order...
              </p>
            </div>
          ) : (
            <p className="text-white/60 text-center">
              {selectedPaymentMethod === "card"
                ? "Credit card form will be added here"
                : "USDC payment form will be added here"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
