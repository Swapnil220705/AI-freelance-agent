"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Transaction } from "@/lib/mockData";
import { ArrowUpRight, ArrowDownLeft, Zap, ClipboardList } from "lucide-react";
import { format } from "date-fns";

function TxRow({ tx, index }: { tx: Transaction; index: number }) {
  const isPayment = tx.type === "payment" || tx.type === "bonus";
  const icon = tx.type === "bonus" ? Zap : isPayment ? ArrowUpRight : ArrowDownLeft;
  const Icon = icon;

  const colorClass = tx.type === "refund"
    ? "text-warning"
    : tx.type === "bonus"
    ? "text-secondary"
    : "text-success";

  const typeLabel = {
    payment: "Payment Released",
    refund: "Refund Issued",
    bonus: "Bonus Payment",
  }[tx.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 py-3 border-b border-border/50 last:border-0 group"
    >
      <div className={`w-8 h-8 border flex items-center justify-center flex-shrink-0 ${
        tx.type === "refund" ? "border-warning/30 bg-warning/5" :
        tx.type === "bonus" ? "border-secondary/30 bg-secondary/5" :
        "border-success/30 bg-success/5"
      }`}>
        <Icon size={14} className={colorClass} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{tx.milestoneTitle}</p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className={`text-[10px] font-mono uppercase tracking-widest ${colorClass}`}>
            {typeLabel}
          </span>
          <span className="text-[10px] font-mono text-gray-600">
            {Math.round(tx.confidenceScore * 100)}% confidence
          </span>
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <p className={`font-mono font-bold text-sm ${colorClass}`}>
          {isPayment ? "+" : "-"}${tx.amount.toLocaleString()}
        </p>
        <p className="text-[10px] font-mono text-gray-600">
          {format(new Date(tx.timestamp), "MM.dd HH:mm")}
        </p>
      </div>
    </motion.div>
  );
}

export function TransactionLedger() {
  const { transactions } = useAppStore();

  return (
    <div className="border border-border bg-panel p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-mono tracking-widest uppercase text-gray-500 mb-1">
            Blockchain Ledger
          </p>
          <h3 className="text-lg font-display font-bold text-foreground">Transaction Log</h3>
        </div>
        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          {transactions.length} records
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="py-10 flex flex-col items-center gap-3 text-center border border-dashed border-border">
          <ClipboardList size={32} className="text-gray-700" />
          <p className="text-xs font-mono text-gray-600 uppercase tracking-widest">
            No transactions recorded yet
          </p>
        </div>
      ) : (
        <div>
          <AnimatePresence>
            {transactions.map((tx, i) => (
              <TxRow key={tx.id} tx={tx} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {transactions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
            Total Disbursed
          </span>
          <span className="font-mono font-bold text-success">
            ${transactions
              .filter(t => t.type !== "refund")
              .reduce((sum, t) => sum + t.amount, 0)
              .toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}
