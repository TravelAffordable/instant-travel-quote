import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Bot, User, Minimize2, Maximize2 } from 'lucide-react';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  isOpen: boolean;
  onToggle: () => void;
}

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: { role: string; content: string }[];
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok) {
    const errorData = await resp.json().catch(() => ({ error: "Connection failed" }));
    onError(errorData.error || "Something went wrong");
    return;
  }

  if (!resp.body) {
    onError("No response stream");
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);

      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") {
        streamDone = true;
        break;
      }

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  // Final flush
  if (textBuffer.trim()) {
    for (let raw of textBuffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (raw.startsWith(":") || raw.trim() === "") continue;
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch { /* ignore */ }
    }
  }

  onDone();
}

// Parse HOTEL_LINK format: HOTEL_LINK:destination|packageId|adults|childrenAges|tier|hotelName
function parseHotelLink(linkData: string) {
  const parts = linkData.split('|');
  if (parts.length < 6) return null;
  return {
    destination: parts[0],
    packageId: parts[1],
    adults: parts[2],
    childrenAges: parts[3],
    tier: parts[4],
    hotelName: parts.slice(5).join('|'),
  };
}

// Render markdown with support for bold, bullets, emojis, and clickable hotel links
function RenderMarkdown({ text, onHotelClick }: { text: string; onHotelClick: (link: ReturnType<typeof parseHotelLink>) => void }) {
  const lines = text.split('\n');
  
  return (
    <>
      {lines.map((line, lineIdx) => {
        const isBullet = line.match(/^[•\-\*]\s/);
        const content = isBullet ? line.slice(2) : line;

        // Parse inline content with bold and hotel links
        const parts = parseInlineContent(content, onHotelClick);

        if (isBullet) {
          return <div key={lineIdx} className="flex gap-1.5 ml-1"><span>•</span><span>{parts}</span></div>;
        }
        return <span key={lineIdx}>{parts}{lineIdx < lines.length - 1 ? '\n' : ''}</span>;
      })}
    </>
  );
}

function parseInlineContent(text: string, onHotelClick: (link: ReturnType<typeof parseHotelLink>) => void): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Match markdown links: [text](HOTEL_LINK:...) and **bold**
  const regex = /(\[([^\]]+)\]\(HOTEL_LINK:([^)]+)\)|\*\*([^*]+)\*\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[2] && match[3]) {
      // Hotel link
      const linkData = parseHotelLink(match[3]);
      nodes.push(
        <button
          key={`link-${match.index}`}
          onClick={() => onHotelClick(linkData)}
          className="text-primary underline font-semibold hover:text-primary/80 cursor-pointer text-left inline"
        >
          {match[2]}
        </button>
      );
    } else if (match[4]) {
      // Bold
      nodes.push(<strong key={`bold-${match.index}`}>{match[4]}</strong>);
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}

export function ChatBot({ isOpen, onToggle }: ChatBotProps) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm your Travel Affordable AI assistant. I can help you find the perfect getaway!\n\n🌍 **Where would you like to go?**\n\n• Hartbeespoort (Harties)\n• Magaliesburg\n• Durban Beachfront\n• Umhlanga\n• Cape Town\n• Sun City\n• Mpumalanga\n• Knysna\n• Vaal River\n• Bela Bela\n• The Blyde (Pretoria)\n• 🌏 Bali, Dubai, Thailand\n\nJust tell me your dream destination! 😊",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleHotelClick = useCallback((linkData: ReturnType<typeof parseHotelLink>) => {
    if (!linkData) return;
    
    // Map chatbot destination IDs to the main form's destination IDs
    const destMap: Record<string, string> = {
      'harties': 'harties',
      'magalies': 'magalies',
      'durban': 'durban',
      'umhlanga': 'umhlanga',
      'cape-town': 'cape-town',
      'sun-city': 'sun-city',
      'mpumalanga': 'mpumalanga',
      'knysna': 'knysna',
      'vaal-river': 'vaal-river',
      'vaal': 'vaal-river',
      'bela-bela': 'bela-bela',
      'pretoria': 'pretoria',
    };

    const destination = destMap[linkData.destination] || linkData.destination;
    const packageId = linkData.packageId;
    const adults = linkData.adults;
    const childrenAges = linkData.childrenAges;
    const tier = linkData.tier;

    // Build URL params to pre-fill the hero form
    const params = new URLSearchParams();
    params.set('destination', destination);
    params.set('package', packageId);
    params.set('adults', adults);
    if (childrenAges && childrenAges !== '0') {
      params.set('childrenAges', childrenAges);
    }
    params.set('budget', tier === 'very-affordable' ? 'budget' : tier);
    params.set('autoSearch', 'true');

    // Navigate to home with params - the Hero component will pick these up
    onToggle(); // Close chatbot
    navigate(`/?${params.toString()}`);
    
    // Scroll to the quote calculator section
    setTimeout(() => {
      const heroEl = document.getElementById('quote-section');
      if (heroEl) {
        heroEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  }, [navigate, onToggle]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    let assistantSoFar = "";

    const chatHistory = [...messages, userMessage]
      .filter(m => m.id !== '1')
      .map(m => ({ role: m.role, content: m.content }));

    const recentHistory = chatHistory.slice(-20);

    try {
      await streamChat({
        messages: recentHistory,
        onDelta: (chunk) => {
          assistantSoFar += chunk;
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last?.role === 'assistant' && last.id.startsWith('ai-')) {
              return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
            }
            return [...prev, { id: `ai-${Date.now()}`, role: 'assistant', content: assistantSoFar, timestamp: new Date() }];
          });
        },
        onDone: () => setIsTyping(false),
        onError: (err) => {
          setMessages(prev => [...prev, {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: `⚠️ ${err}\n\nPlease try again, or contact us on WhatsApp: 079 681 3869`,
            timestamp: new Date(),
          }]);
          setIsTyping(false);
        },
      });
    } catch {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: "⚠️ Connection error. Please try again or WhatsApp us at 079 681 3869.",
        timestamp: new Date(),
      }]);
      setIsTyping(false);
    }
  }, [input, isTyping, messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50 animate-pulse-slow"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 w-[380px] shadow-2xl border-0 z-50 transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[520px]'}`}>
      <CardHeader className="py-3 px-4 bg-primary text-primary-foreground rounded-t-lg flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">Travel Assistant</CardTitle>
            <p className="text-xs opacity-80">AI Powered • Ready to help</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20" onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20" onClick={onToggle}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[calc(100%-64px)]">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-br-sm' 
                      : 'bg-muted rounded-bl-sm'
                  }`}>
                    <div className="text-sm whitespace-pre-line leading-relaxed">
                      <RenderMarkdown text={message.content} onHotelClick={handleHotelClick} />
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && messages[messages.length - 1]?.role !== 'assistant' && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t bg-background">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about destinations, packages, prices..."
                className="flex-1 h-10"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                size="icon"
                className="h-10 w-10 bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
