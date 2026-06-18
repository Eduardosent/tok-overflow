"use client"

import Link from "next/link";
import { Plus, ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useVestingsCreated } from "@/hooks/queries";
import { VestingsCreatedTable } from "@/components/app/modules/vesting/sent/vestings-created-table";

export default function SentVestingPage() {

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Top Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Sent Vesting Schedules
          </h1>
          <p className="text-text-secondary text-sm">
            Overview of vesting accounts created to securely stream allocations to external recipients.
          </p>
        </div>

        {/* Link navigation to create workspace */}
        <Link 
          href="/app/vesting/sent/new" 
          className="inline-flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create New Schedule
        </Link>
      </div>

      {/* Centered & Compact Vesting Table */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <VestingsCreatedTable />
      </div>
    </div>
  );
}