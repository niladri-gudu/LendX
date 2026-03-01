"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function WalletConnect() {
  return (
    <div className="flex justify-end">
      <ConnectButton showBalance={false} />
    </div>
  );
}
