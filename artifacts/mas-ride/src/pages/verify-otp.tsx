import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";

export default function VerifyOtpPage() {
  const [, setLocation] = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const currentUser = useStore((s) => s.currentUser);
  const login = useStore((s) => s.login);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleInput = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError("");
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length !== 6) { setError("Please enter all 6 digits"); return; }
    // Mock: any 6-digit code works. If user has no name, go to profile setup
    if (!currentUser?.name) {
      setLocation("/register/profile");
    } else {
      setLocation("/home");
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setCountdown(60);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-full bg-white">
        <div className="bg-primary pt-14 pb-12 px-6 rounded-b-[40px]">
          <Link href="/register" className="flex items-center text-white/80 mb-6 w-fit">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Change Number</span>
          </Link>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Verify your number</h1>
          <p className="text-white/75 text-sm mt-1">Enter the 6-digit code sent to {currentUser?.phone || "+92..."}</p>
        </div>

        <div className="flex-1 px-6 pt-10 pb-6">
          {/* OTP boxes */}
          <div className="flex gap-3 justify-center mb-6">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el; }}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleInput(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                data-testid={`input-otp-${i}`}
                className={cn(
                  "w-12 h-14 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all",
                  digit ? "border-primary bg-accent text-primary" : "border-input bg-white text-foreground",
                  error ? "border-destructive" : "",
                  "focus:border-primary focus:bg-accent/50"
                )}
              />
            ))}
          </div>

          {error && <p className="text-destructive text-sm text-center mb-4">{error}</p>}

          {/* Countdown */}
          <div className="text-center mb-8">
            {canResend ? (
              <button onClick={handleResend} className="text-primary font-semibold text-sm" data-testid="button-resend">
                Resend Code
              </button>
            ) : (
              <p className="text-muted-foreground text-sm">
                Resend code in{" "}
                <span className="text-primary font-semibold">00:{String(countdown).padStart(2, "0")}</span>
              </p>
            )}
          </div>

          <Button
            onClick={handleVerify}
            className="w-full h-12 rounded-2xl text-base font-semibold"
            data-testid="button-verify"
          >
            Verify
          </Button>
        </div>
      </div>
    </PhoneFrame>
  );
}
