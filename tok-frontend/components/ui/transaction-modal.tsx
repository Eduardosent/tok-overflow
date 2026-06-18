"use client";

import { useState, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";

// ==========================================
// REUSABLE BASE TRANSACTION MODAL
// ==========================================
interface TransactionModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  confirmLabel?: string;
  signingLabel?: string;
  children: ReactNode;
}

export function TransactionModal({
  isOpen,
  title,
  onClose,
  onConfirm,
  confirmLabel = "Confirm",
  signingLabel = "Signing...",
  children,
}: TransactionModalProps) {
  const [isSigning, setIsSigning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleConfirm = async () => {
    try {
      setIsSigning(true);
      await onConfirm();
    } catch (error) {
      console.error("Transaction execution failed:", error);
    } finally {
      setIsSigning(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Modal Header */}
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
        
        {/* Slotted Custom Content */}
        <div className="mb-6">{children}</div>

        {/* Global Action Controls Layout */}
        <div className="flex gap-3">
          <button 
            type="button"
            onClick={onClose}
            disabled={isSigning}
            className="flex-1 border border-primary text-primary py-3 rounded-xl font-bold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleConfirm}
            disabled={isSigning}
            className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigning ? signingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}