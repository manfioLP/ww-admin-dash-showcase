"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { customers } from "@/data/mock";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { AddCustomerModal } from "@/components/customers/AddCustomerModal";

export default function PartnersPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Partners</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {customers.length} partner companies managed by WaniWani
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#6C5CE7] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#5a4bd1] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Onboard Partner
        </button>
      </div>

      <CustomerTable customers={customers} />

      <AddCustomerModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
