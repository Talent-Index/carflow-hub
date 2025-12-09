import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { mockVehicles, mockServiceSessions, mockWashSessions, mockLoyaltyWallets } from '@/lib/mock-data';
import { 
  MECHANIC_SYSTEM_PROMPT, 
  INITIAL_GREETING, 
  buildTrackWashContextPrompt,
  TrackWashContext 
} from '@/lib/ai-mechanic-config';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_MESSAGE: Message = {
  id: '1',
  role: 'assistant',
  content: INITIAL_GREETING,
};

// Build user context from TrackWash data
function getUserContext(userId: string): TrackWashContext {
  const userVehicles = mockVehicles.filter(v => v.customerId === userId);
  const vehicleIds = userVehicles.map(v => v.id);
  
  return {
    vehicles: userVehicles,
    serviceHistory: mockServiceSessions.filter(s => vehicleIds.includes(s.vehicleId)),
    washHistory: mockWashSessions.filter(w => vehicleIds.includes(w.vehicleId)),
    loyaltyWallet: mockLoyaltyWallets.find(l => l.customerId === userId),
    upcomingServices: [
      { vehicleId: 'v-1', type: 'Oil Change', dueDate: 'In 500 miles', urgency: 'due_soon' },
      { vehicleId: 'v-2', type: 'Tire Rotation', dueDate: 'Next month', urgency: 'upcoming' },
    ],
    region: 'United States - Urban/Suburban',
  };
}

// Smart AI response with context awareness
// TODO: Replace with actual Kite AI or Lovable AI API integration
function getAIResponse(userMessage: string, context: TrackWashContext): string {
  const lower = userMessage.toLowerCase();
  const hasVehicles = context.vehicles.length > 0;
  const vehicleInfo = hasVehicles 
    ? context.vehicles.map(v => `${v.year} ${v.make} ${v.model}`).join(' or ')
    : 'your vehicle';

  // Oil-related questions
  if (lower.includes('oil') || lower.includes('change')) {
    const lastOilChange = context.serviceHistory.find(s => s.type === 'oil_change');
    return `Great question about oil changes for ${vehicleInfo}! 🔧

**General Guidelines:**
- **Synthetic oil:** Every 7,500-10,000 miles
- **Conventional oil:** Every 3,000-5,000 miles
- **Time-based:** At least once per year, even with low mileage

${lastOilChange 
  ? `📋 I see your last oil change was on ${lastOilChange.completedAt?.toLocaleDateString() || 'recently'}. Based on your driving patterns, you're ${context.upcomingServices?.some(s => s.type.includes('Oil')) ? '🟡 due soon for your next one.' : '✅ looking good for now.'}`
  : '📋 I don\'t see a recent oil change in your history – would you like to schedule one?'}

**Pro tip:** Check your dipstick monthly. Oil should be amber/brown and reach the "full" line.

Want me to help you schedule an oil change?`;
  }

  // Noise-related questions
  if (lower.includes('noise') || lower.includes('sound') || lower.includes('hear')) {
    return `I'd love to help diagnose that noise in your ${vehicleInfo}! 🔊

To give you the best advice, can you tell me:

1. **Where** does it come from? (front, rear, engine, wheels)
2. **When** does it happen?
   - Starting the car?
   - Only when moving?
   - When braking or turning?
   - At certain speeds?
3. **What** does it sound like?
   - Squealing/squeaking
   - Grinding/metal-on-metal
   - Clicking/ticking
   - Humming/droning
   - Knocking/rattling

⚠️ **Safety Note:** Grinding from brakes = stop driving and get it checked immediately!

Describe the noise and I'll help narrow it down.`;
  }

  // Warning lights
  if (lower.includes('light') || lower.includes('warning') || lower.includes('dashboard')) {
    return `Dashboard warning lights are your car's way of communicating! Let me help decode them for your ${vehicleInfo}. 🚨

**Urgency Guide:**

🔴 **RED = STOP DRIVING**
- Oil pressure (oil can icon)
- Temperature (thermometer)
- Brake system (! in circle)
- Battery/charging

🟡 **YELLOW/AMBER = SERVICE SOON**
- Check engine (engine outline)
- TPMS (tire icon)
- ABS (ABS text)
- Service reminder

🟢 **GREEN/BLUE = INFORMATION**
- Turn signals
- High beams
- Cruise control

**Which light are you seeing?** Describe the icon or color and I'll explain exactly what it means and how urgent it is.`;
  }

  // Brake questions
  if (lower.includes('brake')) {
    return `Brakes are **safety-critical** – good on you for asking! 🛑

**Warning Signs You Need Brake Service:**
- 🔊 Squealing or grinding sounds
- 🌀 Vibration when braking
- ↔️ Car pulls to one side
- 🫧 Soft or spongy pedal
- 💡 Brake warning light on

**Typical Brake Life:**
- Pads: 25,000 - 65,000 miles
- Rotors: 50,000 - 70,000 miles

${context.serviceHistory.some(s => s.type === 'brake_service')
  ? `📋 I see you've had brake work done before – how are they feeling now?`
  : `📋 I don't see recent brake service in your history. When did you last have them checked?`}

⚠️ **If you hear grinding, please don't drive!** Metal-on-metal means pads are gone and you're damaging rotors.

What symptoms are you experiencing?`;
  }

  // Tire questions
  if (lower.includes('tire') || lower.includes('tyre') || lower.includes('wheel')) {
    return `Tires are your only contact with the road – super important! 🛞

**Tire Maintenance Checklist:**
- ✅ **Pressure check:** Monthly (use door sticker for PSI)
- ✅ **Rotation:** Every 5,000-7,500 miles
- ✅ **Alignment check:** If pulling or uneven wear
- ✅ **Replace:** When tread reaches 2/32"

**The Penny Test:** Insert a penny head-first into the tread. If you see Lincoln's whole head, time for new tires!

**Seasonal Tips:**
- Winter: Consider snow tires below 45°F
- Summer: Check for heat damage and cracks
- All-season: Great for moderate climates

${context.serviceHistory.some(s => s.type === 'tire_rotation')
  ? `📋 Your last tire rotation is in the system. Keep up the good work!`
  : `📋 I'd recommend scheduling a tire rotation soon to extend tire life.`}

What's happening with your tires?`;
  }

  // Wash questions
  if (lower.includes('wash') || lower.includes('clean') || lower.includes('wax')) {
    const recentWashes = context.washHistory.filter(w => w.status === 'completed').length;
    return `Let's talk about keeping your ${vehicleInfo} looking fresh! 🫧

**Car Wash Frequency Guide:**
- 🏙️ **City driving:** Every 1-2 weeks (pollution, bird droppings)
- 🛣️ **Highway commuter:** Every 2-3 weeks
- 🏔️ **Winter/salt roads:** Weekly during season
- 🌴 **Mild climate:** Every 2-4 weeks

**Wash Types at Carflow:**
- **Basic:** Quick exterior clean
- **Premium:** Exterior + tire shine + windows
- **Deluxe:** Full detail with wax protection

${recentWashes > 0
  ? `📋 You've had ${recentWashes} wash${recentWashes > 1 ? 'es' : ''} recently – nice! Regular washing protects your paint.`
  : `📋 I don't see recent washes – your car might be due for some TLC!`}

**Pro tip:** Wash within 48 hours of rain to prevent water spots from mineral deposits.

Would you like to schedule a wash?`;
  }

  // Maintenance schedule questions
  if (lower.includes('schedule') || lower.includes('maintenance') || lower.includes('when') || lower.includes('due')) {
    return `Let me check your maintenance schedule for ${vehicleInfo}! 📋

**Standard Maintenance Intervals:**

| Service | Interval |
|---------|----------|
| Oil change | 5,000-7,500 miles |
| Tire rotation | 5,000-7,500 miles |
| Air filter | 15,000-30,000 miles |
| Brake inspection | 12,000 miles |
| Transmission fluid | 30,000-60,000 miles |
| Coolant flush | 30,000-50,000 miles |
| Spark plugs | 30,000-100,000 miles |

${context.upcomingServices && context.upcomingServices.length > 0
  ? `**Your Upcoming Services:**\n${context.upcomingServices.map(s => `${s.urgency === 'overdue' ? '🔴' : s.urgency === 'due_soon' ? '🟡' : '🟢'} ${s.type} – ${s.dueDate}`).join('\n')}`
  : '✅ You\'re all caught up on scheduled maintenance!'}

Want me to explain any of these services or help you book one?`;
  }

  // Default helpful response
  return `Thanks for reaching out about your ${vehicleInfo}! 🚗

Based on what you've described, here's my initial take:

1. **Observation:** Note when the issue occurs (cold start, highway, etc.)
2. **Check basics:** Look for visible leaks, unusual smells, or dashboard lights
3. **Document:** Take a video of any noise – super helpful for diagnosis

${context.upcomingServices && context.upcomingServices.length > 0
  ? `📋 **From your Carflow profile:** You have some services coming up that might be related:\n${context.upcomingServices.slice(0, 2).map(s => `- ${s.type}`).join('\n')}`
  : ''}

**Would you like me to:**
- Help diagnose a specific symptom?
- Explain a maintenance item?
- Check your service history?
- Recommend a service to book?

Just describe what's going on and I'll do my best to help! 🔧`;
}

export function AIChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get user's TrackWash context
  const userContext = getUserContext(user?.id || 'customer-1');

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

    // TODO: Replace with actual Kite AI API call
    // The call should include:
    // - MECHANIC_SYSTEM_PROMPT as system message
    // - buildTrackWashContextPrompt(userContext) as context
    // - User's message
    // 
    // Example API structure for Kite AI integration:
    // const response = await fetch('https://api.gokite.ai/v1/chat', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${KITE_API_KEY}` },
    //   body: JSON.stringify({
    //     messages: [
    //       { role: 'system', content: MECHANIC_SYSTEM_PROMPT + buildTrackWashContextPrompt(userContext) },
    //       ...messages.map(m => ({ role: m.role, content: m.content })),
    //       { role: 'user', content: userMessage.content }
    //     ]
    //   })
    // });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 800));

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: getAIResponse(userMessage.content, userContext),
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

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all flex items-center justify-center ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
        aria-label="Open AI Mechanic Chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-card border border-border rounded-xl shadow-2xl transition-all transform origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-primary/5 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Car className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Carflow AI Mechanic</h3>
              <p className="text-xs text-muted-foreground">Certified • Always Available</p>
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

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {['Check engine light on', 'When is oil change due?', 'Hearing a noise'].map((q) => (
                <button
                  key={q}
                  onClick={() => handleQuickQuestion(q)}
                  className="text-xs px-2 py-1 bg-background border border-border rounded-full hover:border-primary hover:text-primary transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="h-[320px] overflow-y-auto p-4 space-y-4">
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
                className={`rounded-lg px-3 py-2 max-w-[85%] text-sm ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <div className="whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-muted rounded-lg px-3 py-2 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground">Thinking...</span>
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
            For guidance only. Consult a certified mechanic for safety-critical issues.
          </p>
        </div>
      </div>
    </>
  );
}
