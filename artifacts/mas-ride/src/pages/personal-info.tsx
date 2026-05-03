import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Camera, Pencil } from "lucide-react";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";

export default function PersonalInfoPage() {
  const [, setLocation] = useLocation();
  const currentUser = useStore((s) => s.currentUser);
  const updateUser = useStore((s) => s.updateUser);
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nameParts = (currentUser?.name || "").split(" ");
  const [form, setForm] = useState({
    firstName: nameParts[0] || "",
    lastName: nameParts.slice(1).join(" ") || "",
    dob: currentUser?.dob || "",
    sos: currentUser?.sos || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleUpdate = () => {
    if (!validate()) return;
    updateUser({
      name: `${form.firstName.trim()} ${form.lastName.trim()}`,
      dob: form.dob,
      sos: form.sos,
    });
    setEditing(false);
  };

  const handleAvatarClick = () => {
    if (editing) fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (dataUrl) updateUser({ avatar: dataUrl });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const initials = (currentUser?.name || "U").substring(0, 2).toUpperCase();
  const avatar = currentUser?.avatar;

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full bg-gray-50">
        <div className="flex-shrink-0 bg-white px-5 pt-12 pb-4 flex items-center gap-3 shadow-sm">
          <button onClick={() => setLocation("/profile")} className="p-2 -ml-2">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg text-foreground">Personal Information</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pt-8 pb-8">
          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <button
                onClick={handleAvatarClick}
                className={cn("w-24 h-24 rounded-full border-[3px] border-primary overflow-hidden flex items-center justify-center bg-accent", editing && "cursor-pointer")}
                disabled={!editing}
                aria-label="Change profile photo"
              >
                {avatar ? (
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-primary text-3xl font-bold">{initials}</span>
                )}
              </button>

              {editing && (
                <button
                  onClick={handleAvatarClick}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md"
                  aria-label="Upload photo"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                data-testid="input-avatar"
              />
            </div>
          </div>

          {!editing ? (
            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden mb-6">
              {[
                { label: "Name", value: currentUser?.name || "—" },
                { label: "Mobile", value: currentUser?.phone || "—" },
                { label: "Date of Birth", value: currentUser?.dob ? new Date(currentUser.dob).toLocaleDateString("en-US") : "—" },
                { label: "SOS", value: currentUser?.sos || "Add your sos number" },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  className={cn("flex items-center justify-between px-5 py-4", i < arr.length - 1 && "border-b border-border")}
                >
                  <span className="text-sm text-muted-foreground w-24 flex-shrink-0">{row.label}</span>
                  <span className={cn("text-sm font-medium text-right flex-1", !currentUser?.sos && row.label === "SOS" && "text-muted-foreground italic")}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              <div>
                <Input
                  value={form.firstName}
                  onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                  placeholder="First Name"
                  className={cn("h-12 rounded-2xl border-2", errors.firstName ? "border-destructive" : "border-border")}
                  data-testid="input-firstname"
                />
                {errors.firstName && <p className="text-xs text-destructive mt-1 px-1">{errors.firstName}</p>}
              </div>
              <div>
                <Input
                  value={form.lastName}
                  onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                  placeholder="Last Name"
                  className={cn("h-12 rounded-2xl border-2", errors.lastName ? "border-destructive" : "border-border")}
                  data-testid="input-lastname"
                />
                {errors.lastName && <p className="text-xs text-destructive mt-1 px-1">{errors.lastName}</p>}
              </div>
              <Input
                value={form.dob}
                onChange={e => setForm(f => ({ ...f, dob: e.target.value }))}
                type="date"
                placeholder="Date of Birth"
                className="h-12 rounded-2xl border-2 border-border"
                data-testid="input-dob"
              />
              <Input
                value={form.sos}
                onChange={e => setForm(f => ({ ...f, sos: e.target.value }))}
                placeholder="Add your SOS number"
                className="h-12 rounded-2xl border-2 border-border"
                type="tel"
                data-testid="input-sos"
              />
            </div>
          )}

          {!editing ? (
            <Button
              onClick={() => setEditing(true)}
              className="w-full h-12 rounded-full text-base font-semibold"
              data-testid="button-edit"
            >
              <Pencil className="w-4 h-4 mr-2" /> Edit
            </Button>
          ) : (
            <div className="space-y-3">
              <Button
                onClick={handleUpdate}
                className="w-full h-12 rounded-full text-base font-semibold"
                data-testid="button-update"
              >
                Update
              </Button>
              <button
                onClick={() => { setEditing(false); setErrors({}); }}
                className="w-full text-sm text-muted-foreground text-center"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </PhoneFrame>
  );
}
