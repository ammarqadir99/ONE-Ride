import { useState } from "react";
import { useLocation } from "wouter";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Trash2, Pencil, MapPin, ChevronDown } from "lucide-react";
import { useStore, Address } from "@/store";
import { cn } from "@/lib/utils";

const cities = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta"];

export default function AddressPage() {
  const [, setLocation] = useLocation();
  const currentUser = useStore((s) => s.currentUser);
  const addAddress = useStore((s) => s.addAddress);
  const removeAddress = useStore((s) => s.removeAddress);

  const [adding, setAdding] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [form, setForm] = useState({ title: "", address: "", city: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addresses: Address[] = currentUser?.addresses || [];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city) e.city = "City is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;
    addAddress({ id: `a${Date.now()}`, ...form });
    setForm({ title: "", address: "", city: "", phone: "" });
    setErrors({});
    setAdding(false);
  };

  if (adding) {
    return (
      <PhoneFrame>
        <div className="flex flex-col h-full bg-gray-50">
          <div className="flex-shrink-0 bg-white px-5 pt-12 pb-4 flex items-center gap-3 shadow-sm">
            <button onClick={() => { setAdding(false); setErrors({}); }} className="p-2 -ml-2">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-lg">Add Address</h1>
          </div>

          <div className="flex-1 px-5 pt-6 pb-6 space-y-3">
            <div>
              <Input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Title (e.g. Pickup, Home)"
                className={cn("h-12 rounded-2xl border-2", errors.title ? "border-destructive" : "border-border")}
                data-testid="input-title"
              />
              {errors.title && <p className="text-xs text-destructive mt-1 px-1">{errors.title}</p>}
            </div>

            <div>
              <Input
                value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                placeholder="Address"
                className={cn("h-12 rounded-2xl border-2", errors.address ? "border-destructive" : "border-border")}
                data-testid="input-address"
              />
              {errors.address && <p className="text-xs text-destructive mt-1 px-1">{errors.address}</p>}
            </div>

            {/* City dropdown */}
            <div className="relative">
              <button
                onClick={() => setCityOpen(o => !o)}
                className={cn(
                  "w-full flex items-center justify-between px-4 h-12 bg-white border-2 rounded-2xl text-sm",
                  errors.city ? "border-destructive" : "border-border"
                )}
                data-testid="button-city-select"
              >
                <span className={form.city ? "text-foreground font-medium" : "text-muted-foreground"}>
                  {form.city || "City"}
                </span>
                <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", cityOpen && "rotate-180")} />
              </button>
              {cityOpen && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-border rounded-2xl shadow-lg z-20 overflow-hidden max-h-48 overflow-y-auto">
                  {cities.map(c => (
                    <button key={c} onClick={() => { setForm(f => ({ ...f, city: c })); setCityOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-accent border-b border-border last:border-0">
                      {c}
                    </button>
                  ))}
                </div>
              )}
              {errors.city && <p className="text-xs text-destructive mt-1 px-1">{errors.city}</p>}
            </div>

            <div>
              <Input
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="Phone no"
                type="tel"
                className={cn("h-12 rounded-2xl border-2", errors.phone ? "border-destructive" : "border-border")}
                data-testid="input-phone"
              />
              {errors.phone && <p className="text-xs text-destructive mt-1 px-1">{errors.phone}</p>}
            </div>

            <Button onClick={handleAdd} className="w-full h-12 rounded-full text-base font-semibold mt-4" data-testid="button-add-address">
              Add Address
            </Button>
          </div>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full bg-gray-50">
        <div className="flex-shrink-0 bg-white px-5 pt-12 pb-4 flex items-center gap-3 shadow-sm">
          <button onClick={() => setLocation("/profile")} className="p-2 -ml-2">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg">Address</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pt-5 pb-24 space-y-3">
          {addresses.length === 0 && (
            <div className="flex flex-col items-center pt-20">
              <MapPin className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">No saved addresses</p>
            </div>
          )}
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white rounded-2xl border border-border shadow-sm px-4 py-4 flex items-start justify-between">
              <div className="flex-1">
                <p className="font-semibold text-sm text-foreground">{addr.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{addr.phone}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{addr.address}, {addr.city}, Pakistan</p>
              </div>
              <div className="flex items-center gap-2 ml-3">
                <button
                  onClick={() => removeAddress(addr.id)}
                  className="w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                  data-testid={`button-delete-${addr.id}`}
                >
                  <Trash2 className="w-3.5 h-3.5 text-white" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center" data-testid={`button-edit-${addr.id}`}>
                  <Pencil className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-5 pb-6 bg-gradient-to-t from-gray-50 pt-6">
          <Button onClick={() => setAdding(true)} className="w-full h-12 rounded-full text-base font-semibold" data-testid="button-add-new">
            Add New Address
          </Button>
        </div>
      </div>
    </PhoneFrame>
  );
}
