"use client";

import { ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useVestingsCreated } from "@/hooks/queries";

const formatCoinType = (type: { name: string }) => {
  const typeStr = type.name;
  if (typeStr.includes("::")) {
    const parts = typeStr.split("::");
    return parts[parts.length - 1].toUpperCase();
  }
  return typeStr;
};

const formatAmount = (amount: string, decimals: number) => {
  const num = Number(amount) / Math.pow(10, decimals);
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

const truncateAddress = (address: string) => {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export function VestingsCreatedTable() {
  const { data, isLoading } = useVestingsCreated();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="p-8 text-center text-text-secondary text-sm">
          Loading vesting schedules...
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border bg-background/50 hover:bg-background/50">
            <TableHead className="h-9 py-2 font-semibold text-foreground">Recipient</TableHead>
            <TableHead className="h-9 py-2 font-semibold text-foreground">Coin</TableHead>
            <TableHead className="h-9 py-2 font-semibold text-foreground">Total Amount</TableHead>
            <TableHead className="h-9 py-2 text-right font-semibold text-foreground">Vesting ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.length > 0 ? (
            data.map((event) => (
              <TableRow
                key={event.vesting_id}
                className="border-b border-border/50 hover:bg-background/30 transition-colors"
              >
                <TableCell className="py-2 font-mono text-xs text-text-secondary">
                  {truncateAddress(event.to)}
                </TableCell>

                <TableCell className="py-2 text-xs font-medium text-foreground">
                  {formatCoinType(event.coin_type)}
                </TableCell>

                <TableCell className="py-2 text-xs font-semibold text-foreground">
                  {formatAmount(event.total_amount, event.decimals)}
                </TableCell>

                <TableCell className="py-2 text-right">
                  <a
                    href={`https://testnet.suivision.xyz/object/${event.vesting_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
                  >
                    {truncateAddress(event.vesting_id)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-xs text-text-secondary">
                No vesting schedules found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}