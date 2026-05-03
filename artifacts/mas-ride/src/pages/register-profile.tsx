import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Camera, Check } from "lucide-react";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";

const step1Schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  gender: z.string().min(1, "Required"),
  email: z.string().email("Enter a valid email"),
  dob: z.string().min(1, "Required"),
});

const step2Schema = z.object({
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
});

const cities = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta"];
const states = ["Sindh", "Punjab", "KPK", "Balochistan", "Islamabad Capital Territory"];

export default function RegisterProfilePage() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const updateUser = useStore((s) => s.updateUser);

  const form1 = useForm({ resolver: zodResolver(step1Schema), defaultValues: { firstName: "", lastName: "", gender: "", email: "", dob: "" } });
  const form2 = useForm({ resolver: zodResolver(step2Schema), defaultValues: { city: "", state: "" } });

  const [profileData, setProfileData] = useState<Record<string, string>>({});

  const onStep1 = (data: z.infer<typeof step1Schema>) => {
    setProfileData(d => ({ ...d, ...data }));
    setStep(2);
  };

  const onStep2 = (data: z.infer<typeof step2Schema>) => {
    setProfileData(d => ({ ...d, ...data }));
    setStep(3);
  };

  const onFinish = () => {
    updateUser({
      name: `${profileData.firstName} ${profileData.lastName}`,
      email: profileData.email,
      gender: profileData.gender,
      city: profileData.city,
      state: profileData.state,
    });
    setLocation("/home");
  };

  const stepLabels = ["Information", "Address", "Profile"];

  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-full bg-white">
        {/* Header */}
        <div className="bg-primary pt-14 pb-8 px-6 rounded-b-[40px]">
          <h1 className="text-2xl font-bold text-white mb-1">Profile Setup</h1>
          <p className="text-white/75 text-sm mb-6">Step {step} of 3 — {stepLabels[step - 1]}</p>
          {/* Progress indicator */}
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className={cn(
                "h-1.5 rounded-full flex-1 transition-all duration-300",
                s <= step ? "bg-white" : "bg-white/30"
              )} />
            ))}
          </div>
        </div>

        <div className="flex-1 px-6 pt-8 pb-6 overflow-y-auto">
          {step === 1 && (
            <Form {...form1}>
              <form onSubmit={form1.handleSubmit(onStep1)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <FormField control={form1.control} name="firstName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">First Name</FormLabel>
                      <FormControl><Input {...field} placeholder="Ahmed" className="h-11 rounded-xl" data-testid="input-firstname" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form1.control} name="lastName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Last Name</FormLabel>
                      <FormControl><Input {...field} placeholder="Khan" className="h-11 rounded-xl" data-testid="input-lastname" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form1.control} name="gender" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl" data-testid="select-gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form1.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</FormLabel>
                    <FormControl><Input {...field} type="email" placeholder="ahmed@example.com" className="h-11 rounded-xl" data-testid="input-email" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form1.control} name="dob" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date of Birth</FormLabel>
                    <FormControl><Input {...field} type="date" className="h-11 rounded-xl" data-testid="input-dob" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full h-12 rounded-2xl mt-4 font-semibold" data-testid="button-next-step1">Next</Button>
              </form>
            </Form>
          )}

          {step === 2 && (
            <Form {...form2}>
              <form onSubmit={form2.handleSubmit(onStep2)} className="space-y-4">
                <FormField control={form2.control} name="city" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">City</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl" data-testid="select-city">
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form2.control} name="state" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">State / Province</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl" data-testid="select-state">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="pt-2">
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Country</FormLabel>
                    <Input value="Pakistan" disabled className="h-11 rounded-xl bg-muted text-muted-foreground" />
                  </FormItem>
                </div>
                <Button type="submit" className="w-full h-12 rounded-2xl mt-4 font-semibold" data-testid="button-next-step2">Next</Button>
                <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-muted-foreground text-center mt-1">Back</button>
              </form>
            </Form>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center pt-4">
              <p className="text-sm text-muted-foreground mb-8 text-center">Add a profile photo so your carpoolers can recognize you</p>
              <div className="relative mb-10">
                <div className="w-28 h-28 rounded-full bg-accent border-4 border-primary flex items-center justify-center text-4xl font-bold text-primary">
                  {(profileData.firstName?.[0] || "U").toUpperCase()}
                </div>
                <button
                  className="absolute bottom-0 right-0 w-9 h-9 bg-primary rounded-full flex items-center justify-center shadow-lg"
                  data-testid="button-upload-avatar"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
              <Button onClick={onFinish} className="w-full h-12 rounded-2xl font-semibold mb-3" data-testid="button-done">
                <Check className="w-4 h-4 mr-2" /> Done
              </Button>
              <button onClick={onFinish} className="text-sm text-muted-foreground" data-testid="button-skip">Skip for now</button>
            </div>
          )}
        </div>
      </div>
    </PhoneFrame>
  );
}
