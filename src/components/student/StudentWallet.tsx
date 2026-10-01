import React, { useState, useEffect } from 'react';
import { backendStore } from '../../services/backendStore';
import type { StudentProfile } from '../../types/user';
import { Wallet, PlusCircle, ShieldCheck, CreditCard } from 'lucide-react';

export const StudentWallet: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile>(backendStore.getStudentProfile());
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(1000);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    setProfile(backendStore.getStudentProfile());
    const unsubscribe = backendStore.subscribe(() => {
      setProfile(backendStore.getStudentProfile());
    });
    return unsubscribe;
  }, []);

  const handleTopUp = () => {
    setIsProcessing(true);
    setTimeout(() => {
      backendStore.topUpWallet(amount);
      setIsProcessing(false);
      setShowDepositModal(false);
    }, 1000);
  };

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto">
      {/* Balance Card (ShuttleX Black Theme) */}
      <div className="bg-[#010101] p-6 rounded-[32px] text-white shadow-xl space-y-4 relative overflow-hidden border border-black">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-white" />
            <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              ShuttleX Balance
            </span>
          </div>
          <span className="text-[10px] font-extrabold bg-white/20 text-white px-2.5 py-0.5 rounded-full border border-white/20">
            Instant Pay
          </span>
        </div>

        <div>
          <div className="text-xs text-gray-400">Available Wallet</div>
          <div className="text-4xl font-black tracking-tight text-white pt-0.5">
            ₦{profile.walletBalance.toLocaleString()}
          </div>
        </div>

        {/* Deposit CTA */}
        <button
          onClick={() => setShowDepositModal(true)}
          className="w-full bg-white hover:bg-gray-100 text-[#010101] font-extrabold py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
        >
          <PlusCircle className="w-4 h-4 text-[#010101]" />
          <span>Top Up Wallet</span>
        </button>
      </div>

      {/* Quick Info Banner */}
      <div className="bg-white rounded-[28px] p-4 shuttlex-shadow-sm border border-[#EEEEEE] flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#F5F5F7] text-[#010101] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-[#010101]" />
        </div>
        <div>
          <h4 className="font-extrabold text-xs text-[#010101]">Frictionless Shuttle Payments</h4>
          <p className="text-[11px] text-[#666666] font-medium">
            Rides are seamlessly deducted from your wallet with zero cash hassle.
          </p>
        </div>
      </div>

      {/* Top Up Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full space-y-4 shadow-2xl border border-[#EEEEEE] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-3">
              <h3 className="font-extrabold text-base text-[#010101] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#010101]" />
                <span>Top Up ShuttleX Wallet</span>
              </h3>
              <button
                onClick={() => setShowDepositModal(false)}
                className="text-gray-400 font-bold hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#666666]">Select Amount (₦)</label>
              <div className="grid grid-cols-3 gap-2">
                {[500, 1000, 2000, 5000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      amount === amt
                        ? 'bg-[#010101] text-white border-[#010101]'
                        : 'bg-[#F5F5F7] text-[#010101] border-[#EEEEEE]'
                    }`}
                  >
                    ₦{amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-[#F5F5F7] rounded-2xl border border-[#EEEEEE] text-xs text-[#010101] font-medium flex items-center justify-between">
              <span>Security:</span>
              <span className="font-extrabold">256-bit Encrypted</span>
            </div>

            <button
              onClick={handleTopUp}
              disabled={isProcessing}
              className="w-full bg-[#010101] hover:bg-[#1A1A1A] text-white font-extrabold py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>Processing Deposit...</span>
              ) : (
                <span>Pay ₦{amount.toLocaleString()} Now</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
