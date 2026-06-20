"use client";

import { TransactionModal, FeeList } from "@/components/ui";
import { FEES } from "@/constants";

// ==========================================
// SPECIFIC VESTING CLAIM MODAL IMPLEMENTATION
// ==========================================
interface VestingClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function VestingClaimModal({ isOpen, onClose, onConfirm }: VestingClaimModalProps) {
  return (
    <TransactionModal
      isOpen={isOpen}
      title="Confirm Vesting Claim"
      onClose={onClose}
      onConfirm={onConfirm}
      confirmLabel="Confirm and Sign"
      signingLabel="Signing..."
    >
      {/* Description of the claim operation for users and auditors */}
      <p className="text-sm text-gray-500 mb-5 leading-relaxed">
        You are about to claim the vested tokens available in the selected vesting object. This action will finalize the transfer of the currently unlocked assets to your wallet address.
      </p>

      {/* Transaction cost breakdown for transparency */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Required Fees</p>
        <FeeList feeList={FEES.VESTING.CLAIM} />
      </div>
    </TransactionModal>
  );
}