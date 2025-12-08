import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_MESSAGE: Message = {
  id: '1',
  role: 'assistant',
  content: "Hi! I'm your AI Mechanic Assistant. I can help you with:\n\n• Diagnosing car problems\n• Understanding warning lights\n• Maintenance tips & schedules\n• Service recommendations\n\nWhat can I help you with today?",
};

// Mock AI responses for demo - TODO: Integrate with Kite AI or Lovable AI
const getMockResponse = (userMessage: string): string => {
  const lower = userMessage.toLowerCase();
  
  if (lower.includes('oil') || lower.includes('change')) {
    return "For most modern vehicles, I recommend changing your oil every 5,000-7,500 miles with synthetic oil, or every 3,000-5,000 miles with conventional oil. Based on your driving habits (city vs highway), you might need it more frequently. Would you like me to check your car's specific maintenance schedule?";
  }
  
  if (lower.includes('noise') || lower.includes('sound')) {
    return "Strange noises can indicate various issues:\n\n• **Squealing from brakes** - Likely worn brake pads\n• **Grinding noise** - Could be brake rotors or transmission\n• **Clicking when turning** - Possibly CV joints\n• **Humming at speed** - Often wheel bearings\n\nCan you describe where the noise is coming from and when it happens?";
  }
  
  if (lower.includes('light') || lower.includes('warning') || lower.includes('dashboard')) {
    return "Dashboard warning lights are important signals:\n\n🔴 **Red lights** - Stop driving, serious issue\n🟡 **Yellow/Amber** - Service needed soon\n\nCommon ones:\n• Check Engine - Could be emissions or engine issue\n• Oil pressure - Check oil level immediately\n• Battery - Charging system problem\n\nWhich warning light are you seeing?";
  }
  
  if (lower.includes('brake')) {
    return "Brake issues should never be ignored! Signs you need brake service:\n\n• Squealing or grinding sounds\n• Vibration when braking\n• Car pulling to one side\n• Soft or spongy brake pedal\n• Brake warning light on\n\nBrake pads typically last 25,000-65,000 miles. Would you like to schedule a brake inspection?";
  }
  
  if (lower.includes('tire') || lower.includes('tyre')) {
    return "Tire maintenance is crucial for safety:\n\n• **Rotation** - Every 5,000-7,500 miles\n• **Pressure check** - Monthly (use the door sticker for PSI)\n• **Tread depth** - Replace when at 2/32\"\n• **Alignment** - If pulling to one side or uneven wear\n\nPro tip: The penny test - if you can see Lincoln's head, time for new tires!";
  }
  
  return "That's a great question! Based on what you've described, I'd recommend:\n\n1. Check for any visible issues or leaks\n2. Note when the problem occurs (cold start, highway, etc.)\n3. Schedule a diagnostic inspection\n\nWould you like me to help you book a service appointment? Our certified mechanics can diagnose and fix the issue with transparent pricing.";
};

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate API delay - TODO: Replace with actual AI API call
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: getMockResponse(userMessage.content),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all flex items-center justify-center ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
        aria-label="Open AI Chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] bg-card border border-border rounded-xl shadow-2xl transition-all transform origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">AI Mechanic</h3>
              <p className="text-xs text-muted-foreground">Powered by Kite AI</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="h-[350px] overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-primary/10'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4 text-primary" />
                )}
              </div>
              <div
                className={`rounded-lg px-3 py-2 max-w-[80%] text-sm ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-muted rounded-lg px-3 py-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your car issue..."
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            AI assistant for guidance only. Always consult a certified mechanic.
          </p>
        </div>
      </div>
    </>
  );
}
