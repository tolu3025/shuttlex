import React, { useState, useEffect } from 'react';
import type { RideRequest } from '../../types/ride';
import { backendStore } from '../../services/backendStore';
import { CheckCircle2, Star, ShieldAlert, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentCompletionProps {
  ride: RideRequest;
  onDone: () => void;
}

export const StudentCompletion: React.FC<StudentCompletionProps> = ({ ride, onDone }) => {
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showIssueModal, setShowIssueModal] = useState<boolean>(false);
  const [issueText, setIssueText] = useState<string>('');

  useEffect(() => {
    // Fire celebration confetti when ride completes!
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.6 }
    });
  }, []);

  const handleSubmitRating = () => {
    backendStore.rateRide(ride.id, rating, feedback);
    setIsSubmitted(true);
    setTimeout(() => {
      onDone();
    }, 1200);
  };

  const handleReportIssue = () => {
    if (issueText.trim()) {
      alert('Issue reported to ShuttleX Support. We will investigate promptly.');
      setShowIssueModal(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-5 p-4 pb-20 animate-in zoom-in-95 duration-300">
      {/* Completion Header */}
      <div className="bg-[#071F17] text-white p-6 rounded-3xl text-center space-y-3 shadow-xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-[#0B6B4B] text-white flex items-center justify-center mx-auto shadow-inner border-4 border-[#DFF5EA]/20">
          <CheckCircle2 className="w-9 h-9 text-[#DFF5EA]" />
        </div>
        <div>
          <span className="bg-[#DFF5EA]/20 text-[#DFF5EA] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Ride Completed
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight pt-1">
            You've Arrived Safely!
          </h2>
          <p className="text-xs text-gray-300">
            Thank you for riding with ShuttleX.
          </p>
        </div>

        {/* Fare Summary Pill */}
        <div className="bg-[#1A1A1A] backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 flex items-center justify-between text-xs font-semibold">
          <span className="text-gray-300">Total Paid (Passenger Wallet)</span>
          <span className="text-xl font-black text-white">
            ₦{ride.fare.totalFare.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Rider Rating Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#EEEEEE] space-y-4 text-center">
        <div className="space-y-1">
          <h3 className="font-extrabold text-base text-[#010101]">
            Rate your ride with {ride.rider?.name || 'Driver'}
          </h3>
          <p className="text-xs text-[#666666]">
            Your rating helps keep the ShuttleX community safe.
          </p>
        </div>

        {/* 5-Star Interactive Selector */}
        <div className="flex items-center justify-center gap-2 py-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="p-1.5 focus:outline-none transition-transform hover:scale-110 active:scale-95"
            >
              <Star
                className={`w-9 h-9 ${
                  star <= rating
                    ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Feedback Input */}
        <textarea
          rows={2}
          placeholder="Add optional feedback (e.g., helmet provided, smooth driving)..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full p-3 rounded-2xl bg-[#F7F8F5] border border-[#E2E6E0] text-xs font-semibold focus:outline-none focus:border-[#0B6B4B]"
        />

        {/* Submit Rating Button */}
        <button
          onClick={handleSubmitRating}
          disabled={isSubmitted}
          className="w-full bg-[#0B6B4B] hover:bg-[#071F17] text-white font-bold py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
        >
          {isSubmitted ? (
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Submitted!
            </span>
          ) : (
            <>
              <span>Submit & Return Home</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Report Problem Action Link */}
      <div className="text-center pt-1">
        <button
          onClick={() => setShowIssueModal(true)}
          className="text-xs font-bold text-gray-800 hover:text-red-700 underline flex items-center justify-center gap-1 mx-auto"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
          <span>Report a problem with this ride</span>
        </button>
      </div>

      {/* Issue Reporting Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 text-left">
            <h3 className="font-extrabold text-base text-[#071F17] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <span>Report an Issue</span>
            </h3>
            <p className="text-xs text-gray-800">
              Please describe what went wrong during your trip with {ride.rider?.name}.
            </p>

            <textarea
              rows={3}
              placeholder="Explain the issue (e.g. overcharging, unsafe driving)..."
              value={issueText}
              onChange={(e) => setIssueText(e.target.value)}
              className="w-full p-3 rounded-2xl bg-[#F7F8F5] border border-[#E2E6E0] text-xs font-semibold"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setShowIssueModal(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-800 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleReportIssue}
                className="flex-1 py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
