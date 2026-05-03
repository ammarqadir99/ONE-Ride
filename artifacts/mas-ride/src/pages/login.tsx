import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Link } from "wouter";
import { Car } from "lucide-react";
import { useStore } from "@/store";

const schema = z.object({
  phone: z.string().min(10, "Enter a valid phone number"),
});

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const login = useStore((s) => s.login);
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { phone: "" } });

  const onSubmit = (data: { phone: string }) => {
    login("+92" + data.phone.replace(/\s/g, ""));
    setLocation("/verify-otp?mode=login");
  };

  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-full bg-white">
        {/* Header */}
        <div className="bg-primary pt-16 pb-12 px-6 flex flex-col items-center text-white rounded-b-[40px]">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <Car className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">MAS Ride</h1>
          <p className="text-white/75 text-sm mt-1">Your daily carpool companion</p>
        </div>

        <div className="flex-1 px-6 pt-10 pb-6">
          <h2 className="text-2xl font-bold text-foreground mb-1">Welcome back</h2>
          <p className="text-muted-foreground text-sm mb-8">Sign in to continue your journey</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex">
                        <div className="flex items-center px-3 bg-muted border border-input border-r-0 rounded-l-xl text-sm font-medium text-foreground">
                          +92
                        </div>
                        <Input
                          {...field}
                          type="tel"
                          placeholder="300 1234567"
                          className="rounded-l-none rounded-r-xl h-12 text-base"
                          data-testid="input-phone"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-12 rounded-2xl text-base font-semibold"
                data-testid="button-login"
              >
                Login
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-semibold" data-testid="link-register">
              Register
            </Link>
          </p>
        </div>
      </div>
    </PhoneFrame>
  );
}
