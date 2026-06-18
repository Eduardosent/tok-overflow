"use client";

import { FeeList, TransactionModal } from "@/components/ui";
import { FEES } from "@/constants";

// ==========================================
// SPECIFIC TOKEN CREATION MODAL IMPLEMENTATION
// ==========================================
interface TokenCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function TokenCreationModal({ isOpen, onClose, onConfirm }: TokenCreationModalProps) {
  return (
    <TransactionModal
      isOpen={isOpen}
      title="Confirm Creation"
      onClose={onClose}
      onConfirm={onConfirm}
      confirmLabel="Sign transactions"
      signingLabel="Signing..."
    >
      {/* Required sequence warning box translated to English */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-yellow-800 mb-2">
          You must sign <strong>two mandatory transactions</strong> to prevent deployment errors:
        </p>
        <ol className="text-sm text-yellow-800 list-decimal list-inside space-y-1">
          <li>Publish your contract/package with your Witness.</li>
          <li>Register the coin metadata and pay the total fees.</li>
        </ol>
      </div>

      {/* Fee details panel mapping the native Sui assets */}
      <FeeList feeList={FEES.FACTORY.TOKEN_CREATION} />
    </TransactionModal>
  );
}
