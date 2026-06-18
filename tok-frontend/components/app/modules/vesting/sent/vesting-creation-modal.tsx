"use client";

import { TransactionModal, FeeList } from "@/components/ui";
import { FEES } from "@/constants";

// ==========================================
// SPECIFIC VESTING CREATION MODAL IMPLEMENTATION
// ==========================================
interface VestingCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function VestingCreationModal({ isOpen, onClose, onConfirm }: VestingCreationModalProps) {
  return (
    <TransactionModal
      isOpen={isOpen}
      title="Confirm Vesting Creation"
      onClose={onClose}
      onConfirm={onConfirm}
      confirmLabel="Confirm and Sign"
      signingLabel="Signing..."
    >
      {/* Grey descriptive operational summary */}
      <p className="text-sm text-gray-500 mb-5 leading-relaxed">
        You are about to create a linear streaming and lockup schedule. The selected token assets will be securely locked into a new vesting object instance and systematically transferred to the designated recipient address based on your streaming variables.
      </p>

      {/* Synchronized dynamic blockchain transaction cost metadata parameters */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Required Fees</p>
        <FeeList feeList={FEES.VESTING.CREATE} />
      </div>
    </TransactionModal>
  );
}
