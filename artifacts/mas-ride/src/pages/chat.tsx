import { useState, useRef, useEffect } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft, Send, MessageCircle } from "lucide-react";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const [openConvId, setOpenConvId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversations = useStore((s) => s.conversations);
  const messages = useStore((s) => s.messages);
  const users = useStore((s) => s.users);
  const currentUser = useStore((s) => s.currentUser);

  const convMessages = messages.filter((m) => m.conversationId === openConvId);
  const getOther = (participants: string[]) => {
    const otherId = participants.find((p) => p !== currentUser?.id);
    return users.find((u) => u.id === otherId) || { name: "Unknown", id: "?" };
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convMessages.length]);

  const handleSend = () => {
    if (!text.trim()) return;
    setText("");
  };

  if (openConvId) {
    const conv = conversations.find((c) => c.id === openConvId);
    const other = conv ? getOther(conv.participants) : { name: "Chat", id: "?" };

    return (
      <PhoneFrame>
        <div className="flex flex-col h-full bg-white">
          <div className="flex-shrink-0 px-5 pt-12 pb-4 flex items-center gap-3 border-b border-border bg-white">
            <button onClick={() => setOpenConvId(null)} data-testid="button-back-chat" className="p-2 -ml-2">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <Avatar className="w-9 h-9">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                {other.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-sm text-foreground">{other.name}</p>
              <p className="text-xs text-emerald-500 font-medium">Online</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
            {convMessages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">No messages yet. Say hi!</p>
              </div>
            )}
            {convMessages.map((msg) => {
              const isMe = msg.senderId === currentUser?.id;
              return (
                <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")} data-testid={`message-${msg.id}`}>
                  <div className={cn(
                    "max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                    isMe ? "bg-primary text-white rounded-br-sm" : "bg-white text-foreground rounded-bl-sm shadow-sm border border-border"
                  )}>
                    <p>{msg.text}</p>
                    <p className={cn("text-[10px] mt-1 text-right", isMe ? "text-white/60" : "text-muted-foreground")}>{msg.timestamp}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-border flex items-center gap-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-muted rounded-2xl px-4 py-2.5 text-sm outline-none text-foreground placeholder:text-muted-foreground"
              data-testid="input-message"
            />
            <button
              onClick={handleSend}
              data-testid="button-send"
              className="w-10 h-10 bg-primary rounded-full flex items-center justify-center active:scale-90 transition-transform"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full bg-gray-50">
        <div className="flex-shrink-0 bg-white px-5 pt-12 pb-4 shadow-sm">
          <h1 className="font-bold text-xl text-foreground">Messages</h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 && (
            <div className="flex flex-col items-center pt-20">
              <MessageCircle className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">No conversations yet</p>
            </div>
          )}
          {conversations.map((conv) => {
            const other = getOther(conv.participants);
            return (
              <button
                key={conv.id}
                onClick={() => setOpenConvId(conv.id)}
                data-testid={`conversation-${conv.id}`}
                className="w-full bg-white px-5 py-4 flex items-center gap-4 border-b border-border active:bg-accent/30 transition-colors text-left"
              >
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {other.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-semibold text-sm text-foreground">{other.name}</p>
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{conv.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
                </div>
              </button>
            );
          })}
        </div>

        <BottomNav />
      </div>
    </PhoneFrame>
  );
}
