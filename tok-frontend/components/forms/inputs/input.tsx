import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">
        {label}
      </label>
      <input
        {...props}
        ref={ref}
        className={`w-full px-4 py-3 rounded-xl text-sm transition-all bg-white border border-gray-200 outline-none 
          placeholder:text-gray-300
          focus:border-primary focus:ring-2 focus:ring-primary/20
          disabled:bg-gray-50 disabled:cursor-not-allowed
          ${error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10" : ""}
        `}
      />
      {error && (
        <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider ml-1">
          {error}
        </span>
      )}
    </div>
  )
);

Input.displayName = 'Input';