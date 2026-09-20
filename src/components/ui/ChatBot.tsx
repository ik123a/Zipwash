import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ChatMessage {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

const BOT_RESPONSES: { keywords: string[]; response: string }[] = [
  { keywords: ['order', 'track', 'status'], response: "You can track your laundry orders on the Track Laundry page. Just go to Track in the sidebar." },
  { keywords: ['price', 'cost', 'how much', 'pricing'], response: "Check the Dry Clean Pricing page for a full list of our services. Basic laundry starts at ₹40 per item." },
  { keywords: ['time', 'how long', 'duration'], response: "Standard turnaround is 24-48 hours. Express service is available for an additional charge." },
  { keywords: ['pickup', 'collect', 'ready'], response: "When your laundry is ready, you'll get a notification. You can pick it up at the main counter during operating hours." },
  { keywords: ['machine', 'washer', 'available'], response: "Check the dashboard for real-time machine availability. Green machines are free to use!" },
  { keywords: ['hello', 'hi', 'hey'], response: "Hello! How can I help you with your laundry today?" },
  { keywords: ['reward', 'points', 'loyalty'], response: "You earn loyalty points for every order! Check the Rewards page to see your balance and available perks." },
  { keywords: ['help', 'support', 'issue', 'problem'], response: "I'm here to help! For complex issues, please contact the laundry staff directly or check the Info pages for FAQs." },
];

function getBotResponse(message: string): string {
  const lower = message.toLowerCase();
  for (const rule of BOT_RESPONSES) {
    if (rule.keywords.some(kw => lower.includes(kw))) {
      return rule.response;
    }
  }
  return "I'm not sure about that. Try asking about orders, pricing, machines, pickup, or rewards. Or contact staff for help!";
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, text: "Hi! How can I help you with your laundry today?", sender: 'bot', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: Date.now() + 1,
        text: getBotResponse(userMsg.text),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
      {isOpen && (
        <Card className="w-[350px] shadow-2xl border-border bg-card pointer-events-auto animate-in slide-in-from-bottom-5 duration-300">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg flex flex-row items-center justify-between py-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Bot className="h-4 w-4" />
              ZIPPWASH Support
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10 p-0"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="h-[300px] bg-muted/30 p-4 overflow-y-auto">
            <div className="flex flex-col gap-3">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg border shadow-sm max-w-[85%] text-xs ${
                    msg.sender === 'user'
                      ? 'bg-primary/10 border-primary/20 self-end text-card-foreground'
                      : 'bg-card border-border self-start'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter className="p-3 border-t bg-card">
            <div className="flex w-full gap-2">
              <Input
                placeholder="Type your message..."
                className="h-9 text-xs"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button
                size="icon"
                className="h-9 w-9 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={sendMessage}
                disabled={!input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      <Button
        size="icon"
        className={`h-14 w-14 rounded-full shadow-xl transition-all duration-300 pointer-events-auto ${
          isOpen ? 'rotate-90 bg-muted text-muted-foreground scale-90' : 'bg-primary text-primary-foreground hover:scale-110'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  );
}