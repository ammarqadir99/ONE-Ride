# ONE Ride

A mobile-first carpool and ride-sharing web app built for Pakistan. ONE Ride connects daily commuters — drivers can publish recurring routes, passengers can browse and join carpools, and everything is managed through a clean, WhatsApp-style mobile interface.

---

## Features

- Phone number login with OTP verification
- 3-step registration wizard (personal details, city/state, profile photo)
- Home dashboard with active ride cards
- Carpool listing with filters (vehicle type, seats, price)
- Carpool detail view with join flow
- Publish a ride (multi-step form with stops, return trip, pricing)
- My Rides (upcoming and past)
- Real-time-style Chat (conversation list + message thread)
- Notifications (read/unread state, detail view, mark all read)
- My Profile
  - Personal Information (view + edit: name, DOB, SOS number)
  - My Wallet (balance display, Deposit via JazzCash/EasyPaisa with invoice, Withdraw to bank)
  - Address book (add/delete saved addresses with city dropdown)
  - My Rating
- Slide-in drawer menu (stays within the phone frame)
- Bottom navigation bar

---

## Project Structure

```
workspace/
├── artifacts/
│   ├── mas-ride/          # ONE Ride frontend (React + Vite)
│   │   ├── src/
│   │   │   ├── pages/     # All page components
│   │   │   ├── components/# PhoneFrame, BottomNav, TopNav, DrawerMenu, shadcn/ui
│   │   │   ├── store/     # Zustand global state
│   │   │   ├── lib/       # Utilities (cn, etc.)
│   │   │   └── App.tsx    # Router + protected routes
│   │   └── package.json
│   └── api-server/        # Express API server (currently unused by frontend)
├── lib/                   # Shared TypeScript libraries
├── scripts/               # Utility scripts
├── pnpm-workspace.yaml
└── README.md
```

### Pages

| Route | Page | Auth Required |
|---|---|---|
| `/login` | Login (phone + OTP) | No |
| `/register` | Register | No |
| `/verify-otp` | OTP Verification | No |
| `/register/profile` | Registration Wizard | No |
| `/home` | Home Dashboard | Yes |
| `/carpool` | Carpool Listings | Yes |
| `/carpool/:id` | Carpool Detail | Yes |
| `/publish` | Publish a Ride | Yes |
| `/profile` | My Profile | Yes |
| `/profile/edit` | Personal Information | Yes |
| `/wallet` | My Wallet | Yes |
| `/profile/address` | Address Book | Yes |
| `/chat` | Chat | Yes |
| `/my-rides` | My Rides | Yes |
| `/notifications` | Notifications | Yes |

---

## Technologies Used

| Category | Technology |
|---|---|
| Framework | [React 18](https://react.dev/) |
| Build Tool | [Vite](https://vitejs.dev/) |
| Language | TypeScript |
| Routing | [Wouter](https://github.com/molefrog/wouter) |
| State Management | [Zustand](https://zustand-demo.pmnd.rs/) with `persist` middleware |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Data Fetching | [TanStack Query](https://tanstack.com/query) |
| Package Manager | [pnpm](https://pnpm.io/) (workspace monorepo) |

### Design Decisions

- **Phone-frame desktop layout** — a centered phone-shaped frame on desktop; full-screen on mobile
- **Purple brand** — primary color `#7C3AED`, Outfit font from Google Fonts
- **Frontend-only with mock data** — all data lives in Zustand with `localStorage` persistence; no backend calls required to explore the app
- **Protected routes** — unauthenticated users are redirected to `/login`

---

## Setup Guide

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [pnpm](https://pnpm.io/) v9 or later

```bash
npm install -g pnpm
```

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd workspace

# Install all dependencies
pnpm install
```

### Running the App

```bash
# Start the ONE Ride frontend
pnpm --filter @workspace/mas-ride run dev
```

The app will be available at `http://localhost:<PORT>` (the PORT is assigned automatically via the `PORT` environment variable, defaulting to `5173` locally).

### Building for Production

```bash
pnpm --filter @workspace/mas-ride run build
```

### Type Checking

```bash
# Check the frontend only
pnpm --filter @workspace/mas-ride run typecheck

# Check all packages
pnpm run typecheck
```

---

## Demo Accounts

The app ships with two pre-seeded mock users. Log in with either phone number (any OTP is accepted in mock mode):

| Name | Phone | Role | Wallet Balance |
|---|---|---|---|
| Ahmed Khan | +923001234567 | Driver | PKR 2,500 |
| Sara Malik | +923211112222 | Passenger | PKR 1,200 |

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Port the dev server listens on | `5173` |
| `BASE_URL` | Base path prefix for the app | `/` |

---

## Contributing

1. Create a feature branch
2. Make your changes inside the relevant `artifacts/` package
3. Run `pnpm run typecheck` to verify no type errors
4. Open a pull request with a clear description
