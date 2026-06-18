"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tokenSchema, TokenValues } from "@/types/forms/token";
import { Input, TextArea } from "@/components/forms/inputs";
import { TokenCreationModal } from "./token-creation-modal";
import { useCreateToken } from "@/hooks/modules/factory";

export function NewToken() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingData, setPendingData] = useState<TokenValues | null>(null);
  const { createToken } = useCreateToken();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TokenValues>({
    resolver: zodResolver(tokenSchema),
  });

  // Primero validamos con Zod, si es correcto, abrimos el modal
  const onSubmit = (data: TokenValues) => {
    setPendingData(data);
    setIsModalOpen(true);
  };

  // Esta función es la que llamará el modal para ejecutar el proceso real
// En tu componente NewToken
const handleConfirmCreation = async () => {
    if (!pendingData) return;
    
    try {
      // Llamamos al hook real pasando los datos del formulario
      // Nota: Asegúrate de que los campos coincidan con lo que espera tu hook (imageUrl -> iconUrl)
      await createToken({
        name: pendingData.name,
        symbol: pendingData.symbol,
        description: pendingData.description,
        iconUrl: pendingData.imageUrl, 
        decimals: pendingData.decimals,
      });
      
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error en el proceso de creación:", error);
      // El hook ya maneja el toast de error, así que aquí solo cerramos o mantenemos según prefieras
    }
};

  return (
    <>
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="flex flex-col gap-6 w-full max-w-xl mx-auto p-8 bg-white rounded-2xl border border-gray-100 shadow-sm"
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-gray-900">Create New Token</h2>
          <p className="text-sm text-gray-500">Define the properties for your new asset on Sui.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Name" placeholder="e.g. My Token" {...register("name")} error={errors.name?.message} />
          <Input label="Symbol" placeholder="e.g. MTK" {...register("symbol")} error={errors.symbol?.message} />
        </div>

        <Input label="Image URL" placeholder="https://..." {...register("imageUrl")} error={errors.imageUrl?.message} />
        <Input label="Decimals" type="number" placeholder="0-9" {...register("decimals", { valueAsNumber: true })} error={errors.decimals?.message} />
        <TextArea label="Description" placeholder="Tell us about your token..." {...register("description")} error={errors.description?.message} />

        <button 
          type="submit" 
          className="cursor-pointer w-full bg-primary text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all mt-2"
        >
          Create Token
        </button>
      </form>

      <TokenCreationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmCreation} 
      />
    </>
  );
}