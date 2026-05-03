import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Address = {
  id: string;
  title: string;
  address: string;
  city: string;
  phone: string;
};

export type User = {
  id: string;
  name: string;
  phone: string;
  email: string;
  gender: string;
  city: string;
  state: string;
  dob: string;
  sos: string;
  avatar: string | null;
  rating: number;
  totalRides: number;
  totalPosts: number;
  wallet: number;
  role: "driver" | "passenger";
  isDriver: boolean;
  addresses: Address[];
};

export type Ride = {
  id: string;
  driverId: string;
  vehicleType: string;
  origin: string;
  destination: string;
  stops: string[];
  departureTime: string;
  days: string[];
  availableSeats: number;
  pricePerSeat: number;
  routeComments: string;
  hasReturn: boolean;
  returnTime: string;
  returnPrice: number;
  returnDays: string[];
  status: "active" | "completed" | "cancelled";
  passengers: string[];
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
};

export type Conversation = {
  id: string;
  participants: string[];
  lastMessage: string;
  timestamp: string;
};

type AppState = {
  currentUser: User | null;
  users: User[];
  rides: Ride[];
  conversations: Conversation[];
  messages: Message[];
  login: (phone: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  addRide: (ride: Ride) => void;
  joinRide: (rideId: string) => void;
  depositWallet: (amount: number) => void;
  withdrawWallet: (amount: number) => void;
  addAddress: (addr: Address) => void;
  removeAddress: (id: string) => void;
};

const initialUsers: User[] = [
  { id: "u1", name: "Ahmed Khan", phone: "+923001234567", email: "ahmed@example.com", gender: "Male", city: "Karachi", state: "Sindh", dob: "1995-03-20", sos: "", avatar: null, rating: 4.8, totalRides: 47, totalPosts: 12, wallet: 2500, role: "driver", isDriver: true, addresses: [{ id: "a1", title: "Pickup", address: "DHA Phase 5, Karachi", city: "Karachi", phone: "+923001234567" }] },
  { id: "u2", name: "Sara Malik", phone: "+923211112222", email: "sara@example.com", gender: "Female", city: "Lahore", state: "Punjab", dob: "1998-07-14", sos: "", avatar: null, rating: 4.5, totalRides: 23, totalPosts: 5, wallet: 1200, role: "passenger", isDriver: false, addresses: [] }
];

const initialRides: Ride[] = [
  { id: "r1", driverId: "u1", vehicleType: "Car", origin: "DHA Phase 5, Karachi", destination: "I.I. Chundrigar Road, Karachi", stops: ["Clifton"], departureTime: "08:00 AM", days: ["M","T","W","T","F"], availableSeats: 3, pricePerSeat: 150, routeComments: "Meeting point at main gate. AC car, comfortable.", hasReturn: true, returnTime: "06:00 PM", returnPrice: 150, returnDays: ["M","T","W","T","F"], status: "active", passengers: ["u2"] },
  { id: "r2", driverId: "u2", vehicleType: "Bike", origin: "Gulshan-e-Iqbal, Karachi", destination: "PECHS, Karachi", stops: [], departureTime: "09:00 AM", days: ["M","W","F"], availableSeats: 1, pricePerSeat: 80, routeComments: "Bike ride, helmet provided.", hasReturn: false, returnTime: "", returnPrice: 0, returnDays: [], status: "active", passengers: [] },
  { id: "r3", driverId: "u1", vehicleType: "Van", origin: "Model Town, Lahore", destination: "Gulberg, Lahore", stops: ["Garden Town","Faisal Town"], departureTime: "07:30 AM", days: ["M","T","W","T","F","S"], availableSeats: 6, pricePerSeat: 120, routeComments: "AC Van. Door to door pickup available on request.", hasReturn: true, returnTime: "05:30 PM", returnPrice: 120, returnDays: ["M","T","W","T","F"], status: "active", passengers: [] }
];

const initialConversations: Conversation[] = [
  { id: "c1", participants: ["u1","u2"], lastMessage: "Are you available tomorrow?", timestamp: "10:30 AM" },
  { id: "c2", participants: ["u1","u3"], lastMessage: "Great, see you at 8!", timestamp: "Yesterday" }
];

const initialMessages: Message[] = [
  { id: "m1", conversationId: "c1", senderId: "u2", text: "Hi Ahmed! Are you available tomorrow?", timestamp: "10:28 AM" },
  { id: "m2", conversationId: "c1", senderId: "u1", text: "Yes, same time as usual. 8 AM from DHA.", timestamp: "10:29 AM" },
  { id: "m3", conversationId: "c1", senderId: "u2", text: "Are you available tomorrow?", timestamp: "10:30 AM" }
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      currentUser: null,
      users: initialUsers,
      rides: initialRides,
      conversations: initialConversations,
      messages: initialMessages,

      login: (phone) => set((state) => {
        const user = state.users.find(u => u.phone === phone);
        if (user) return { currentUser: user };
        const newUser: User = {
          id: `u${Date.now()}`, name: "", phone, email: "", gender: "", city: "", state: "",
          dob: "", sos: "", avatar: null, rating: 5.0, totalRides: 0, totalPosts: 0,
          wallet: 0, role: "passenger", isDriver: false, addresses: [],
        };
        return { currentUser: newUser, users: [...state.users, newUser] };
      }),

      logout: () => set({ currentUser: null }),

      updateUser: (data) => set((state) => {
        if (!state.currentUser) return state;
        const updatedUser = { ...state.currentUser, ...data };
        return { currentUser: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
      }),

      addRide: (ride) => set((state) => ({ rides: [...state.rides, ride] })),

      joinRide: (rideId) => set((state) => {
        if (!state.currentUser) return state;
        return {
          rides: state.rides.map(r =>
            r.id === rideId && !r.passengers.includes(state.currentUser!.id)
              ? { ...r, passengers: [...r.passengers, state.currentUser!.id], availableSeats: Math.max(0, r.availableSeats - 1) }
              : r
          )
        };
      }),

      depositWallet: (amount) => set((state) => {
        if (!state.currentUser) return state;
        const updated = { ...state.currentUser, wallet: state.currentUser.wallet + amount };
        return { currentUser: updated, users: state.users.map(u => u.id === updated.id ? updated : u) };
      }),

      withdrawWallet: (amount) => set((state) => {
        if (!state.currentUser) return state;
        const updated = { ...state.currentUser, wallet: Math.max(0, state.currentUser.wallet - amount) };
        return { currentUser: updated, users: state.users.map(u => u.id === updated.id ? updated : u) };
      }),

      addAddress: (addr) => set((state) => {
        if (!state.currentUser) return state;
        const updated = { ...state.currentUser, addresses: [...state.currentUser.addresses, addr] };
        return { currentUser: updated, users: state.users.map(u => u.id === updated.id ? updated : u) };
      }),

      removeAddress: (id) => set((state) => {
        if (!state.currentUser) return state;
        const updated = { ...state.currentUser, addresses: state.currentUser.addresses.filter(a => a.id !== id) };
        return { currentUser: updated, users: state.users.map(u => u.id === updated.id ? updated : u) };
      }),
    }),
    { name: "masride_store" }
  )
);
