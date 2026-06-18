// providers/sui-wallet-provider.tsx
"use client";

import type { ReactNode } from "react";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import {
  SuiJsonRpcClient,
  getJsonRpcFullnodeUrl,
} from "@mysten/sui/jsonRpc";

import "@mysten/dapp-kit/dist/index.css";

const networks = {
  devnet: new SuiJsonRpcClient({
    url: getJsonRpcFullnodeUrl("devnet"),
    network: "devnet",
  }),

  testnet: new SuiJsonRpcClient({
    url: getJsonRpcFullnodeUrl("testnet"),
    network: "testnet",
  }),

  mainnet: new SuiJsonRpcClient({
    url: getJsonRpcFullnodeUrl("mainnet"),
    network: "mainnet",
  }),
};

export function SuiWalletProvider({ children }: { children: ReactNode }) {
  return (
    <SuiClientProvider networks={networks} defaultNetwork="testnet">
      <WalletProvider autoConnect>{children}</WalletProvider>
    </SuiClientProvider>
  );
}