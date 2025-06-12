"use client";

import { useState } from "react";
import { Button } from "../components/button";
import { CheckoutDialog } from "../components/checkout-dialog";
import { Footer } from "@/components/footer";
import Image from "next/image";

export default function Home() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-4 gap-4">
      <main className="flex flex-col items-center sm:items-start bg-white rounded-2xl shadow-lg border grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden w-full max-w-[1025px] h-[calc(100vh-2rem)] max-h-[715px] bg-[url('/main-bg.svg')] bg-center bg-no-repeat relative">
            <div className="h-full flex items-center justify-center p-4 md:p-8">
              <div className="w-full max-w-[440px] p-8 flex flex-col items-center justify-center gap-6 z-10 rounded-2xl bg-[#606089E5]">
                <h1 className="text-4xl text-white font-bold font-['BreatheFireIII']">
                  CHOOSE YOUR WEAPON
                </h1>
                <p className="text-white/80">
                  Select from the finest collection of expertly crafted items!
                </p>

                <Image src="/items.svg" alt="Items" width={405} height={162} className="w-full h-auto" />

                <div className="flex flex-col gap-4 w-full">
                  <Button onClick={() => setIsCheckoutOpen(true)} className="w-full">
                    PURCHASE
                  </Button>
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
