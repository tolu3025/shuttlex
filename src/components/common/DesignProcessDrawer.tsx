import React from 'react';
import { X } from 'lucide-react';

interface DesignProcessDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignProcessDrawer: React.FC<DesignProcessDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAFAFA] rounded-[36px] max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-gray-200 space-y-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white text-[#010101] flex items-center justify-center shadow-md hover:bg-gray-100 transition-all border border-gray-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Section 02 Design Process */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#666666] tracking-wider uppercase">
            <span>//</span>
            <span className="w-2 h-2 rounded-full bg-[#010101]"></span>
            <span>02 Design Process</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#010101] tracking-tight">
            Innovation Through <span className="underline decoration-[#999999] decoration-2 underline-offset-4">Design Process</span>
          </h2>
        </div>

        {/* Curved Design Sprints Diagram */}
        <div className="bg-white rounded-3xl p-5 border border-[#EEEEEE] shuttlex-shadow-sm space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {/* 1. Strategy */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-[#666666] uppercase flex items-center gap-1">
                <span>Sprints</span>
                <span className="flex gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-[#010101]"></span><span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span><span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span></span>
              </div>
              <h3 className="font-extrabold text-sm text-[#010101]">Strategy</h3>
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="bg-[#F5F5F7] text-[#010101] text-[11px] font-semibold px-2.5 py-1 rounded-full text-center">Goals</span>
                <span className="bg-[#F5F5F7] text-[#010101] text-[11px] font-semibold px-2.5 py-1 rounded-full text-center">Functional</span>
              </div>
            </div>

            {/* 2. Discovery */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-[#666666] uppercase flex items-center gap-1">
                <span>Sprints</span>
                <span className="flex gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-[#010101]"></span><span className="w-1.5 h-1.5 rounded-full bg-[#010101]"></span><span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span></span>
              </div>
              <h3 className="font-extrabold text-sm text-[#010101]">Discovery</h3>
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="bg-[#F5F5F7] text-[#010101] text-[11px] font-semibold px-2 py-1 rounded-full text-center">Research</span>
                <span className="bg-[#F5F5F7] text-[#010101] text-[11px] font-semibold px-2 py-1 rounded-full text-center">User Journey</span>
                <span className="bg-[#010101] text-white text-[11px] font-bold px-2 py-1 rounded-full text-center">Branding</span>
                <span className="bg-[#F5F5F7] text-[#010101] text-[11px] font-semibold px-2 py-1 rounded-full text-center">Sketch</span>
              </div>
            </div>

            {/* 3. Solution */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-[#666666] uppercase flex items-center gap-1">
                <span>Sprints</span>
                <span className="flex gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-[#010101]"></span><span className="w-1.5 h-1.5 rounded-full bg-[#010101]"></span><span className="w-1.5 h-1.5 rounded-full bg-[#010101]"></span><span className="w-1.5 h-1.5 rounded-full bg-[#010101]"></span></span>
              </div>
              <h3 className="font-extrabold text-sm text-[#010101]">Solution</h3>
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="bg-[#F5F5F7] text-[#010101] text-[11px] font-semibold px-2 py-1 rounded-full text-center">User flow</span>
                <span className="bg-[#F5F5F7] text-[#010101] text-[11px] font-semibold px-2 py-1 rounded-full text-center">Wireframe</span>
                <span className="bg-[#010101] text-white text-[11px] font-bold px-2 py-1 rounded-full text-center">UI Design</span>
                <span className="bg-[#F5F5F7] text-[#010101] text-[11px] font-semibold px-2 py-1 rounded-full text-center">Prototype</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 03 Typography & Color */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#666666] tracking-wider uppercase">
            <span>//</span>
            <span className="w-2 h-2 rounded-full bg-[#010101]"></span>
            <span>03 Typography & Color</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#010101] tracking-tight">
            Transforming Ideas Into <span className="underline decoration-[#999999] decoration-2 underline-offset-4">Visual Harmony</span>
          </h2>

          {/* Typography Display: Lufga */}
          <div className="bg-white rounded-3xl p-5 border border-[#EEEEEE] shuttlex-shadow-sm flex items-center justify-between gap-4">
            <div>
              <div className="text-4xl font-extrabold text-[#010101] tracking-tight">
                Lufga
              </div>
              <p className="text-xs text-[#666666] pt-1 max-w-[200px]">
                Geometric sans appearance that is clean, modern, and effortless to read.
              </p>
            </div>

            {/* Color Palette Bubbles */}
            <div className="flex -space-x-4 items-center">
              <div className="w-12 h-12 rounded-full bg-[#010101] border-2 border-white shadow-md flex items-center justify-center text-[9px] font-bold text-white">
                #010101
              </div>
              <div className="w-12 h-12 rounded-full bg-[#FAFAFA] border-2 border-white shadow-md flex items-center justify-center text-[9px] font-bold text-gray-700">
                #FAFAFA
              </div>
              <div className="w-12 h-12 rounded-full bg-[#666666] border-2 border-white shadow-md flex items-center justify-center text-[9px] font-bold text-white">
                #666666
              </div>
              <div className="w-12 h-12 rounded-full bg-[#FFFFFF] border-2 border-gray-200 shadow-md flex items-center justify-center text-[9px] font-bold text-gray-800">
                #FFFFFF
              </div>
            </div>
          </div>
        </div>

        {/* Section 01 About ShuttleX */}
        <div className="bg-[#010101] text-white rounded-3xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
            <span>// 01 About ShuttleX</span>
            <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">2026 Edition</span>
          </div>
          <h3 className="text-lg font-extrabold text-white leading-snug">
            Where meets creativity to <span className="text-gray-300">ShuttleX</span>
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            <strong className="text-white">ShuttleX</strong> delivers fast, safe rides with real-time tracking, AI-assisted dispatch, and flexible instant booking.
          </p>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center text-[11px]">
            <div>
              <p className="text-gray-400">Project name</p>
              <p className="font-bold text-white">ShuttleX App</p>
            </div>
            <div>
              <p className="text-gray-400">Industry</p>
              <p className="font-bold text-white">Transportation</p>
            </div>
            <div>
              <p className="text-gray-400">Status</p>
              <p className="font-bold text-emerald-400">Live Ready</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-[#010101] text-white font-bold rounded-2xl shadow-lg hover:bg-[#1A1A1A] transition-all text-sm"
        >
          Return to ShuttleX App
        </button>
      </div>
    </div>
  );
};
