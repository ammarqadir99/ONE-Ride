import { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full bg-gray-200 sm:p-8 flex items-center justify-center">
      <div className="w-full h-[100dvh] sm:h-[844px] sm:max-w-[390px] bg-background sm:rounded-[40px] sm:shadow-2xl sm:border-[8px] sm:border-gray-900 relative overflow-hidden flex flex-col">
        {/* Notch simulation for desktop */}
        <div className="hidden sm:block absolute top-0 inset-x-0 h-6 bg-gray-900 rounded-b-3xl w-36 mx-auto z-50 pointer-events-none" />
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
