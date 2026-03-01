import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";
import "dotenv/config";

export const wagmiConfig = getDefaultConfig({
  appName: "LendX",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [sepolia],
  ssr: true,
});

export const config = wagmiConfig;
