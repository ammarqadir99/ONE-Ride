import { useLocation } from "wouter";
import { PhoneFrame } from "@/components/PhoneFrame";
import { ChevronLeft, Star } from "lucide-react";
import { useStore } from "@/store";

const mockReviews = [
  { id: "rv1", name: "Sara Malik",    rating: 5, comment: "Very punctual and friendly driver. Comfortable ride!", date: "28 Apr 2026" },
  { id: "rv2", name: "Ali Hassan",    rating: 4, comment: "Good experience overall. Would ride again.",            date: "22 Apr 2026" },
  { id: "rv3", name: "Fatima Zahra",  rating: 5, comment: "Excellent! Car was clean and AC was on.",              date: "15 Apr 2026" },
  { id: "rv4", name: "Usman Tariq",   rating: 4, comment: "On time and polite. Recommended.",                     date: "10 Apr 2026" },
  { id: "rv5", name: "Nida Rashid",   rating: 5, comment: "Best carpool experience so far!",                      date: "02 Apr 2026" },
];

function StarRow({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}`}
        />
      ))}
    </div>
  );
}

export default function MyRatingPage() {
  const [, setLocation] = useLocation();
  const currentUser = useStore((s) => s.currentUser);
  const rating = currentUser?.rating ?? 5.0;

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: mockReviews.filter((r) => r.rating === star).length,
    pct: Math.round((mockReviews.filter((r) => r.rating === star).length / mockReviews.length) * 100),
  }));

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full bg-gray-50">
        <div className="flex-shrink-0 bg-white px-5 pt-12 pb-4 flex items-center gap-3 shadow-sm">
          <button onClick={() => setLocation("/profile")} className="p-2 -ml-2">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg">My Rating</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pt-5 pb-6 space-y-4">
          {/* Summary card */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
            <div className="flex items-center gap-5">
              <div className="flex flex-col items-center">
                <span className="text-5xl font-extrabold text-foreground leading-none">{rating.toFixed(1)}</span>
                <StarRow rating={Math.round(rating)} />
                <span className="text-xs text-muted-foreground mt-1">{mockReviews.length} reviews</span>
              </div>
              <div className="flex-1 space-y-1.5">
                {distribution.map(({ star, count, pct }) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-3">{star}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-4 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews list */}
          <h2 className="font-bold text-sm text-foreground px-1">Recent Reviews</h2>
          <div className="space-y-3">
            {mockReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl border border-border shadow-sm px-4 py-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                      {review.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground leading-tight">{review.name}</p>
                      <p className="text-[10px] text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                  <StarRow rating={review.rating} />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
