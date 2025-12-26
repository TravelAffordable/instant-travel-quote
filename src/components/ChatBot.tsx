import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Bot, User, Sparkles, Minimize2, Maximize2 } from 'lucide-react';
import { destinations, packages, calculateQuote, getPackagesByDestination } from '@/data/travelData';
import { formatCurrency } from '@/lib/utils';

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

export function ChatBot({ isOpen, onToggle }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm your Travel Affordable assistant. I can help you:\n\n• Get instant quotes for any destination\n• Find the perfect package for your needs\n• Answer questions about our tours\n\nWhere would you like to go?",
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


  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Check for destination mentions
    const destinationMatch = destinations.find(d => 
      lowerMessage.includes(d.name.toLowerCase()) || 
      lowerMessage.includes(d.id.toLowerCase())
    );

    if (destinationMatch) {
      const destPackages = getPackagesByDestination(destinationMatch.id);
      if (destPackages.length > 0) {
        const packageList = destPackages.slice(0, 3).map(p => 
          `• **${p.shortName}** - from ${formatCurrency(p.basePrice)}/person`
        ).join('\n');
        
        return `Great choice! 🌴 **${destinationMatch.name}** is amazing!\n\n${destinationMatch.description}\n\n**Available Packages:**\n${packageList}\n\nFor an instant quote, tell me:\n1. When do you want to travel?\n2. How many adults and children?\n3. Which package interests you?`;
      }
      return `**${destinationMatch.name}** is a wonderful destination! ${destinationMatch.description}\n\nPackages start from ${formatCurrency(destinationMatch.startingPrice)}. Would you like me to help you get a quote?`;
    }

    // Price/quote related
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('quote') || lowerMessage.includes('how much')) {
      return "I'd love to give you a quote! 💰\n\nTo calculate an accurate price, I need to know:\n\n1. **Destination** - Where do you want to go?\n2. **Dates** - When are you planning to travel?\n3. **Travelers** - How many adults and children?\n4. **Package** - Any specific activities you want?\n\nOr you can use our **Instant Quote Calculator** on this page for immediate pricing!";
    }

    // Package related
    if (lowerMessage.includes('package') || lowerMessage.includes('tour') || lowerMessage.includes('activity')) {
      return "We have amazing packages for every type of traveler! 🎒\n\n**Popular Categories:**\n• **Adventure** - Quad biking, zip-lining, game drives\n• **Romance** - Couples retreats, sunset cruises, spa\n• **Family** - Theme parks, beaches, kid-friendly activities\n• **Relaxation** - Spa getaways, scenic cruises\n\nWhich type interests you? Or tell me your destination and I'll show you what's available!";
    }

    // Booking related
    if (lowerMessage.includes('book') || lowerMessage.includes('reserve') || lowerMessage.includes('confirm')) {
      return "Ready to book? Excellent! 🎉\n\nHere's how to proceed:\n\n1. **Use the Quote Calculator** to get your instant price\n2. **Click 'Book Now'** or **WhatsApp us** at 079 681 3869\n3. We'll confirm availability and send you the booking form\n4. Pay your deposit to secure your dates\n\nNeed help with anything specific?";
    }

    // Contact related
    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('whatsapp') || lowerMessage.includes('email')) {
      return "📞 **Contact Us:**\n\n• **WhatsApp:** 079 681 3869\n• **Email:** info@travelaffordable.co.za\n• **Email 2:** travelaffordable2017@gmail.com\n\nWe typically respond within 30 minutes during business hours. For instant quotes, use our calculator above!";
    }

    // Help/greeting
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('help')) {
      return "Hello! Welcome to Travel Affordable! 😊\n\nI'm here to help you plan the perfect getaway. Here's what I can do:\n\n• **Find packages** - Tell me a destination\n• **Get quotes** - Tell me your travel details\n• **Answer questions** - About tours, bookings, etc.\n\nWhat would you like to explore today?";
    }

    // Destinations list
    if (lowerMessage.includes('destination') || lowerMessage.includes('where') || lowerMessage.includes('option')) {
      const saDestinations = destinations.filter(d => !d.international).map(d => d.name).join(', ');
      const intDestinations = destinations.filter(d => d.international).map(d => `${d.name} (${d.country})`).join(', ');
      
      return `🗺️ **Our Destinations:**\n\n**South Africa:**\n${saDestinations}\n\n**International:**\n${intDestinations}\n\nWhich destination catches your eye?`;
    }

    // Default response
    return "I'd be happy to help! 😊\n\nHere are some things you can ask me:\n\n• \"Tell me about Cape Town packages\"\n• \"How much for a Sun City trip?\"\n• \"What destinations do you have?\"\n• \"Help me plan a romantic getaway\"\n\nOr use the **Quote Calculator** above for instant pricing!";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(userMessage.content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 500);
  };

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
            <p className="text-xs opacity-80">Online • Ready to help</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={onToggle}
          >
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
                  className={`flex gap-3 chat-message ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
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
                    <p className="text-sm whitespace-pre-line leading-relaxed">
                      {message.content.split('**').map((part, i) => 
                        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                      )}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 chat-message">
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
