import { useState, useRef, useEffect } from 'react';
import { User, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function GeminiChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Gemini Assistant. How can I help you with your schedule today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Mock bot response for now
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm a demo interface for now. Integrate me with Gemini API to manage your calendar with AI!",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="bg-muted/10 backdrop-blur-sm border border-border shadow-sm flex flex-col overflow-hidden h-full min-h-[250px] max-h-[400px] lg:h-[300px] animate-slide-up animation-delay-300">
      {/* Header */}
      <div className="p-3 border-b border-border bg-background/50 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-0.5">
            <img src="/gemini-logo.png" alt="Gemini" className="h-5 w-5 object-contain" />
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-none">Gemini AI</h3>
            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Assistant is online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 rounded-full">
          <span className="text-[9px] font-medium text-primary">⚡ Gemini 3.0 Flash</span>
        </div>
      </div>

      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-none"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex items-start gap-2 max-w-[85%]",
              msg.sender === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={cn(
              "shrink-0 w-6 h-6 flex items-center justify-center overflow-hidden",
              msg.sender === 'user' ? "rounded-full bg-primary text-primary-foreground" : ""
            )}>
              {msg.sender === 'user' ? (
                <User className="h-3.5 w-3.5" />
              ) : (
                <img 
                  src="/gemini-logo.png" 
                  className="w-5 h-5 object-contain" 
                />
              )}
            </div>
            <div className={cn(
              "p-2 rounded-2xl text-xs leading-relaxed",
              msg.sender === 'user' 
                ? "bg-primary text-primary-foreground rounded-tr-none" 
                : "bg-muted/50 text-foreground rounded-tl-none border border-border/50"
            )}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start gap-2 animate-pulse">
            <div className="shrink-0 w-6 h-6 flex items-center justify-center overflow-hidden">
              <img 
                src="/gemini-logo.png" 
                className="w-5 h-5 object-contain" 
              />
            </div>
            <div className="bg-muted/50 p-2 rounded-2xl rounded-tl-none border border-border/50">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-3 border-t border-border bg-background/50 backdrop-blur-md">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI about your schedule..."
            className="h-8 text-xs border-none bg-background/50 hover:bg-background/80 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all rounded-xl shadow-inner inline-block"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim() || isTyping}
            className="h-8 w-8 rounded-xl shrink-0 transition-all active:scale-95"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
