export const FEES = {
  FACTORY: {
    TOKEN_CREATION: [
      { label: "Tok Fee", amount: BigInt(100_000_000) },
      { label: "Network Fee", amount: BigInt(20_000_000) },
    ],
    TOKEN_MINT: [
      { label: "Network Fee", amount: BigInt(3_000_000) },
    ],
    TOKEN_BURN: [
      { label: "Network Fee", amount: BigInt(1_100_000) },
    ],
  },
  VESTING: {
    CREATE: [
      { label: "Tok Fee", amount: BigInt(1_000_000) },
      { label: "Network Fee", amount: BigInt(4_500_000 ) },
    ],
    CLAIM: [
      { label: "Network Fee", amount: BigInt(1_500_000) },
    ],
  }
};

// Helper para calcular el total fácilmente en cualquier componente
export const calculateTotal = (feeList: { amount: bigint }[]) => {
  return feeList.reduce((acc, curr) => acc + curr.amount, BigInt(0));
};