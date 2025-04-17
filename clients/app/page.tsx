"use client";

import Image from "next/image";

export default function Home() {
  return (
    <div className="h-[90vh] w-full p-4 sm:p-6 md:p-3">
      {/* Mobile view - with merged cells 1-6 and 7-8 */}
      <div className="grid grid-cols-3 grid-rows-3 gap-3 h-full w-full md:hidden">
        <div className="bg-white border border-white p-0 text-center rounded-xl flex items-center justify-center col-span-3 row-span-2 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/home.svg"
              alt="DeFi Swap Home"
              fill
              style={{ objectFit: "contain", transform: "scale(1.5)" }}
              priority
            />
          </div>
        </div>
        <div className="bg-white border text-black text-7xl border-white p-5 text-center rounded-xl flex items-center justify-center col-span-2">
          Lenda
        </div>
        <div className="bg-white border text-black text-2xl border-white p-5 text-center rounded-xl flex flex-col items-center justify-center">
          <p>Swap.</p>
          <p>Stake.</p>
          <p>Create.</p>
        </div>
      </div>

      {/* Desktop view - merged cells layout */}
      <div className="grid-cols-3 grid-rows-3 gap-3 h-full w-full hidden md:grid">
        <div className="bg-white border border-white p-0 text-center rounded-xl flex items-center justify-center col-span-2 row-span-3 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/home.svg"
              alt="DeFi Swap Home"
              fill
              style={{ objectFit: "contain", transform: "scale(1.4)" }}
              priority
            />
          </div>
        </div>
        <div className="bg-white border text-black text-6xl border-white p-5 text-left rounded-xl flex flex-col items-start justify-center row-span-2">
          <p>Swap.</p>
          <p>Stake.</p>
          <p>Create.</p>
          <p>Your DeFi journey starts here.</p>
        </div>
        <div className="bg-white border text-black text-9xl border-white p-5 text-center rounded-xl flex items-center justify-center">
          Lenda
        </div>
      </div>
    </div>
  );
}
