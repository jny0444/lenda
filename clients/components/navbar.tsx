"use client";

import { Account } from "@/components/account";
import { WalletOptions } from "@/components/wallet-options";
import { useAccount } from "wagmi";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  function ConnectWallet() {
    const { isConnected } = useAccount();
    if (isConnected) return <Account />;
    return <WalletOptions />;
  }

  function getLinkClassName(path: string) {
    const isActive = pathname === path;
    return `font-medium text-lg transition-colors duration-200 ease-in-out px-2 py-1 rounded-md text-center md:text-left ${
      isActive
        ? "bg-orange-100 !text-black"
        : "text-orange-50 hover:text-black hover:bg-orange-100"
    }`;
  }

  return (
    <div className="flex justify-between items-center p-4 relative w-full">
      {/* Logo - Responsive sizing */}
      <div className="flex-shrink-0">
        <p className="text-3xl md:text-6xl transition-all duration-300 text-orange-50">
          <Link href={"/"}>💩 Lenda</Link>
        </p>
      </div>

      {/* Hamburger Menu Button - Positioned in center for mobile */}
      <div className="md:hidden absolute left-1/2 transform -translate-x-1/2 z-20">
        <button
          className="focus:outline-none p-2 flex flex-col justify-center items-center"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <div
            className="w-6 h-0.5 bg-orange-100 mb-1.5 transition-all duration-300 ease-in-out origin-center"
            style={{
              transform: isMenuOpen
                ? "translateY(8px) rotate(45deg)"
                : "rotate(0)",
            }}
          ></div>
          <div
            className="w-6 h-0.5 bg-orange-100 transition-all duration-300 ease-in-out"
            style={{
              opacity: isMenuOpen ? "0" : "1",
              transform: isMenuOpen ? "scale(0)" : "scale(1)",
            }}
          ></div>
          <div
            className="w-6 h-0.5 bg-orange-100 mt-1.5 transition-all duration-300 ease-in-out origin-center"
            style={{
              transform: isMenuOpen
                ? "translateY(-8px) rotate(-45deg)"
                : "rotate(0)",
            }}
          ></div>
        </button>
      </div>

      {/* Navigation Links - Desktop: centered, Mobile: full-width dropdown */}
      <div
        className={`${
          isMenuOpen
            ? "flex flex-col absolute top-16 right-0 left-0 bg-black py-4 shadow-lg z-10"
            : "hidden"
        } md:flex md:flex-row md:bg-transparent md:shadow-none md:gap-4 md:absolute md:left-1/2 md:transform md:-translate-x-1/2`}
      >
        <Link
          href={"/swap"}
          className={getLinkClassName("/swap")}
          onClick={() => setIsMenuOpen(false)}
        >
          Swap
        </Link>
        <Link
          href={"/pool"}
          className={getLinkClassName("/pool")}
          onClick={() => setIsMenuOpen(false)}
        >
          Pool
        </Link>
        <Link
          href={"/token"}
          className={getLinkClassName("/token")}
          onClick={() => setIsMenuOpen(false)}
        >
          Token
        </Link>
      </div>

      {/* Wallet Connection - Responsive positioning */}
      <div className="z-10 flex-shrink-0 order-last">
        <div className="hidden md:block">
          <ConnectWallet />
        </div>
        <div className="md:hidden text-2xl text-orange-50 text-[18px] bg-orange-50 font-medium px-3 py-1.5 border border-orange-100 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-100 inline-block cursor-pointer">
          🍙
        </div>
      </div>
    </div>
  );
}
