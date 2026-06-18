"use client";

import Image from "next/image";

interface TokLoadingProps {
  message?: string;
  className?: string;
}

export function TokLoading({ message, className = "" }: TokLoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-10 gap-4 ${className}`}>
      <div className="animate-spin">
        <Image src="/logo1.png" alt="Loading" width={40} height={40} />
      </div>
      {message && (
        <p className="text-sm text-gray-500 font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}