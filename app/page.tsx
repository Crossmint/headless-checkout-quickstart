"use client";

import { useState } from "react";
import { Button } from "../components/button";
import { CheckoutDialog } from "../components/checkout-dialog";
import { Footer } from "@/components/footer";
import Image from "next/image";

export default function Home() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

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

              <Image src="/items.svg" alt="Items" width={405} height={162} />

              <div className="flex flex-col gap-4 w-full max-w-xs">
                <Button onClick={() => setIsCheckoutOpen(true)}>
                  PURCHASE
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <CheckoutDialog
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
      <Footer />
    </div>
  );
}
