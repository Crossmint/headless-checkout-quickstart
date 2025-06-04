"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "../components/button";
import { WeaponSelection } from "../components/weapon-selection";
import { CheckoutDialog } from "../components/checkout-dialog";
import type { Weapon } from "../types/weapon";

// Weapon data - keeping it in sync with weapon-selection.tsx
const WEAPONS: Weapon[] = [
  {
    id: "gods-sword",
    name: "God's sword",
    price: "$0.53",
    icon: "/sword.svg",
  },
  {
    id: "elves-axe-silver",
    name: "Elves axe - Silver",
    price: "$0.53",
    icon: "/axe.svg",
  },
  {
    id: "magic-potion",
    name: "Magic potion",
    price: "$0.53",
    icon: "/elixir.svg",
  },
];

export default function Home() {
  const [selectedWeapon, setSelectedWeapon] = useState("gods-sword");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handlePayClick = () => {
    console.log("Payment button clicked!");
    console.log("Selected weapon:", selectedWeapon);
    setIsCheckoutOpen(true);
  };

  const selectedWeaponData =
    WEAPONS.find((weapon) => weapon.id === selectedWeapon) || WEAPONS[0];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <main className="flex flex-col items-center sm:items-start">
        <div className="w-full flex items-center justify-center py-8 md:pt-4">
          <div className="bg-white rounded-2xl shadow-lg border grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden lg:w-[1025px] lg:h-[715px] bg-[url('/main-bg.svg')] bg-center bg-no-repeat relative">
            <div className="p-8 md:m-15 md:backdrop-blur-lg flex border border-white/20 flex-col items-center justify-center gap-6 relative z-10 rounded-2xl">
              <h1 className="text-4xl text-white font-bold mb-4 font-['BreatheFireIII']">
                CHOOSE YOUR WEAPON
              </h1>
              <p className="text-white/80 text-center mb-6">
                Select from the finest collection of expertly crafted items!
              </p>

              <WeaponSelection
                selectedWeaponId={selectedWeapon}
                onWeaponSelect={setSelectedWeapon}
              />

              <div className="flex flex-col gap-4 w-full max-w-xs">
                <Button onClick={handlePayClick} size="lg">
                  PURCHASE
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="flex flex-col gap-4 items-center justify-center">
        <div className="flex gap-6 flex-wrap items-center justify-center">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://github.com/Crossmint/headless-checkout-quickstart"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/file.svg"
              alt="File icon"
              width={16}
              height={16}
            />
            View code
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://github.com/crossmint"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/window.svg"
              alt="Window icon"
              width={16}
              height={16}
            />
            See all quickstarts
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://crossmint.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            Go to crossmint.com →
          </a>
        </div>
        <div className="flex">
          <Image
            src="/crossmint-leaf.svg"
            alt="Powered by Crossmint"
            priority
            width={152}
            height={100}
          />
        </div>
      </footer>

      <CheckoutDialog
        selectedWeapon={selectedWeaponData}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
}
