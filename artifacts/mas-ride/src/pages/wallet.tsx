import { useState } from "react";
import { useLocation } from "wouter";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Download, ChevronDown, Loader2 } from "lucide-react";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";

type View = "wallet" | "deposit" | "withdraw" | "invoice";

const banks = ["JazzCash", "EasyPaisa", "Bank Alfalah", "HBL", "Meezan Bank"];

export default function WalletPage() {
  const [, setLocation] = useLocation();
  const currentUser = useStore((s) => s.currentUser);
  const depositWallet = useStore((s) => s.depositWallet);
  const withdrawWallet = useStore((s) => s.withdrawWallet);

  const [view, setView] = useState<View>("wallet");
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [bankOpen, setBankOpen] = useState(false);
  const [payMethod, setPayMethod] = useState<"jazzcash" | "easypaisa" | null>(null);
  const [cnic, setCnic] = useState("");
  const [mobile, setMobile] = useState("");
  const [processing, setProcessing] = useState(false);
  const [invoiceAmount, setInvoiceAmount] = useState(0);

  const balance = currentUser?.wallet ?? 0;

  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const fmt = (d: Date) => d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/ /g, "-");

  /* --- Deposit flow --- */
  const handleDeposit = () => {
    const val = parseInt(amount);
    if (!amount || isNaN(val)) { setAmountError("Amount is required"); return; }
    if (val < 50) { setAmountError("Minimum deposit is 50"); return; }
    setAmountError("");
    setInvoiceAmount(val);
    setView("invoice");
  };

  const handleProceed = () => {
    if (!cnic || !mobile) return;
    setProcessing(true);
    setTimeout(() => {
      depositWallet(invoiceAmount);
      setProcessing(false);
      setView("wallet");
      setAmount(""); setCnic(""); setMobile(""); setPayMethod(null);
    }, 2500);
  };

  /* --- Withdraw flow --- */
  const handleWithdraw = () => {
    const val = parseInt(amount);
    if (!amount || isNaN(val)) { setAmountError("Amount is required"); return; }
    if (val <= 0) { setAmountError("Enter a valid amount"); return; }
    if (val > balance) { setAmountError("Cannot withdraw more than the wallet balance"); return; }
    setAmountError("");
    withdrawWallet(val);
    setAmount(""); setSelectedBank("");
    setView("wallet");
  };

  const resetAndGo = (v: View) => {
    setAmount(""); setAmountError(""); setPayMethod(null); setCnic(""); setMobile("");
    setView(v);
  };

  /* ====== VIEWS ====== */

  if (view === "invoice") {
    const payProId = `2629261${Date.now().toString().slice(-7)}`;
    return (
      <PhoneFrame>
        <div className="flex flex-col h-full bg-gray-50">
          <div className="flex-shrink-0 bg-white px-5 pt-12 pb-4 flex items-center gap-3 shadow-sm">
            <button onClick={() => setView("deposit")} className="p-2 -ml-2"><ChevronLeft className="w-5 h-5" /></button>
            <h1 className="font-bold text-lg">Deposit</h1>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pt-5 pb-6 space-y-4">
            {/* Invoice fields */}
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              {[
                ["Billed To", currentUser?.name || "User"],
                ["PayPro ID", payProId],
                ["Invoice Status", "UNPAID"],
                ["Issue Date", fmt(today)],
                ["Due Date", fmt(tomorrow)],
              ].map(([label, val]) => (
                <div key={label} className={cn("flex gap-4 px-4 py-3 border-b border-border last:border-0")}>
                  <span className="text-xs text-muted-foreground w-28 flex-shrink-0 pt-0.5">{label}</span>
                  <span className={cn("text-sm font-semibold flex-1", label === "Invoice Status" && "text-amber-500")}>{val}</span>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl border border-border shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-foreground">Summary</h3>
                <button className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Download className="w-3.5 h-3.5" /> Download Invoice
                </button>
              </div>
              {[
                ["Bill Amount", `PKR ${invoiceAmount}`],
                ["Service Fee", "PKR 0.00"],
                ["Total Amount", `PKR ${invoiceAmount}.00`],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between py-2.5 border-b border-border last:border-0 text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold">{val}</span>
                </div>
              ))}
            </div>

            {/* Pay Via */}
            <div>
              <h3 className="font-bold text-foreground mb-3">Pay Via</h3>
              <div className="space-y-2">
                {(["jazzcash", "easypaisa"] as const).map((method) => (
                  <div key={method} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                    <button
                      onClick={() => setPayMethod(payMethod === method ? null : method)}
                      className="w-full flex items-center justify-between px-4 py-4"
                    >
                      <span className="font-semibold text-sm capitalize">{method === "jazzcash" ? "JazzCash" : "EasyPaisa"}</span>
                      <span className={cn("text-xs font-bold px-2 py-1 rounded-full", method === "jazzcash" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600")}>
                        {method === "jazzcash" ? "JC" : "EP"}
                      </span>
                    </button>
                    {payMethod === method && (
                      <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                        <p className="text-xs font-semibold text-muted-foreground">Card Information</p>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Enter Last 6 Digits of your CNIC</p>
                          <Input value={cnic} onChange={e => setCnic(e.target.value.replace(/\D/g,"").slice(0,6))}
                            placeholder="XXXXXX" className="h-10 rounded-xl" maxLength={6} data-testid="input-cnic" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Enter {method === "jazzcash" ? "JazzCash" : "EasyPaisa"} Registered Mobile Number</p>
                          <Input value={mobile} onChange={e => setMobile(e.target.value)}
                            placeholder="03XXXXXXXXX" className="h-10 rounded-xl" type="tel" data-testid="input-mobile" />
                        </div>
                        <Button
                          onClick={handleProceed}
                          disabled={!cnic || !mobile || processing}
                          className="w-full h-10 rounded-full text-sm font-semibold"
                          data-testid="button-proceed"
                        >
                          {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing…</> : "Proceed"}
                        </Button>
                        {processing && (
                          <div className="text-center py-2 px-4 bg-white rounded-2xl border border-border">
                            <p className="font-semibold text-sm text-foreground mb-1">Processing your Payment</p>
                            <p className="text-xs text-muted-foreground">We have sent you a payment request in your {method === "jazzcash" ? "JazzCash" : "EasyPaisa"} App. Please review and approve it.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PhoneFrame>
    );
  }

  if (view === "deposit") {
    return (
      <PhoneFrame>
        <div className="flex flex-col h-full bg-gray-50">
          <div className="flex-shrink-0 bg-white px-5 pt-12 pb-4 flex items-center gap-3 shadow-sm">
            <button onClick={() => resetAndGo("wallet")} className="p-2 -ml-2"><ChevronLeft className="w-5 h-5" /></button>
            <h1 className="font-bold text-lg">Deposit</h1>
          </div>
          <div className="flex-1 px-5 pt-8 pb-6">
            <div>
              <Input
                value={amount}
                onChange={e => { setAmount(e.target.value); setAmountError(""); }}
                placeholder="Amount"
                type="number"
                className={cn("h-12 rounded-2xl border-2", amountError ? "border-destructive" : "border-border")}
                data-testid="input-amount"
              />
              {amountError && <p className="text-xs text-destructive mt-1.5 px-1">{amountError}</p>}
            </div>
            <Button onClick={handleDeposit} className="w-full h-12 rounded-full text-base font-semibold mt-8" data-testid="button-deposit">
              Deposit
            </Button>
          </div>
        </div>
      </PhoneFrame>
    );
  }

  if (view === "withdraw") {
    return (
      <PhoneFrame>
        <div className="flex flex-col h-full bg-gray-50">
          <div className="flex-shrink-0 bg-white px-5 pt-12 pb-4 flex items-center gap-3 shadow-sm">
            <button onClick={() => resetAndGo("wallet")} className="p-2 -ml-2"><ChevronLeft className="w-5 h-5" /></button>
            <h1 className="font-bold text-lg">Withdraw</h1>
          </div>
          <div className="flex-1 px-5 pt-8 pb-6 space-y-4">
            {amountError && (
              <div className="bg-white border border-border rounded-2xl px-4 py-3 shadow-sm">
                <p className="text-xs font-bold text-foreground">Error</p>
                <p className="text-xs text-muted-foreground mt-0.5">{amountError}</p>
              </div>
            )}
            {/* Bank dropdown */}
            <div className="relative">
              <button
                onClick={() => setBankOpen(o => !o)}
                className="w-full flex items-center justify-between px-4 py-3.5 bg-white border border-border rounded-2xl text-sm shadow-sm"
                data-testid="button-bank-select"
              >
                <span className={selectedBank ? "text-foreground font-medium" : "text-muted-foreground"}>
                  {selectedBank || "Select bank account"}
                </span>
                <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", bankOpen && "rotate-180")} />
              </button>
              {bankOpen && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-border rounded-2xl shadow-lg z-20 overflow-hidden">
                  {banks.map(b => (
                    <button key={b} onClick={() => { setSelectedBank(b); setBankOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-accent border-b border-border last:border-0">
                      {b}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Input
                value={amount}
                onChange={e => { setAmount(e.target.value); setAmountError(""); }}
                placeholder="Amount"
                type="number"
                className={cn("h-12 rounded-2xl border-2", amountError ? "border-destructive" : "border-border")}
                data-testid="input-withdraw-amount"
              />
            </div>

            <Button onClick={handleWithdraw} className="w-full h-12 rounded-full text-base font-semibold mt-4" data-testid="button-withdraw">
              Withdraw
            </Button>
          </div>
        </div>
      </PhoneFrame>
    );
  }

  /* Default: wallet view */
  return (
    <PhoneFrame>
      <div className="flex flex-col h-full bg-gray-50">
        <div className="flex-shrink-0 bg-white px-5 pt-12 pb-4 flex items-center gap-3 shadow-sm">
          <button onClick={() => setLocation("/profile")} className="p-2 -ml-2"><ChevronLeft className="w-5 h-5" /></button>
          <h1 className="font-bold text-lg">My Wallet</h1>
        </div>
        <div className="flex-1 flex flex-col items-center px-5 pt-12 pb-6">
          <p className="text-muted-foreground text-sm mb-1">Available Balance</p>
          <p className="text-4xl font-bold text-foreground mb-8">
            PKR <span>{balance.toLocaleString()}</span>.00
          </p>
          <div className="flex gap-4 w-full">
            <Button onClick={() => resetAndGo("deposit")} className="flex-1 h-12 rounded-full text-base font-semibold" data-testid="button-go-deposit">
              Deposit
            </Button>
            <Button onClick={() => resetAndGo("withdraw")} variant="outline" className="flex-1 h-12 rounded-full text-base font-semibold border-primary text-primary" data-testid="button-go-withdraw">
              Withdraw
            </Button>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
