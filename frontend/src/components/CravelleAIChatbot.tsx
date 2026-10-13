import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User as UserIcon, 
  ShoppingBag, 
  Star, 
  ArrowRight,
  Maximize2,
  Minimize2,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { chatService } from '../services/chatService';
import { ChatMessage, DishRecommendationCard } from '../types';
import { useLocation } from '../context/LocationContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface CravelleAIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_PROMPTS = [
  "What should I eat near my college under ₹250?",
  "Suggest pure vegetarian comfort food for dinner.",
  "Find the best biryani near my current GPS location.",
  "I visited a mall today. What desserts or cafes are nearby?",
  "Quick snack for a busy workday at the tech park."
];

export const CravelleAIChatbot: React.FC<CravelleAIChatbotProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { location } = useLocation();
  const { addToCart } = useCart();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'ASSISTANT',
      content: `Hello! I'm **Cravelle AI**, your food concierge. I discover real dishes from verified kitchens near ${location.placeName}. How can I satisfy your appetite today?`,
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | undefined>();
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      role: 'USER',
      content: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatService.sendMessage(
        textToSend.trim(),
        conversationId,
        { lat: location.latitude, lon: location.longitude }
      );

      setConversationId(response.conversationId);

      const assistantMsg: ChatMessage = {
        role: 'ASSISTANT',
        content: response.reply,
        recommendedDishes: response.dishes,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'ASSISTANT',
          content: "I'm having trouble connecting to the food discovery service right now. Please explore our restaurant menu directly!",
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderDish = (card: DishRecommendationCard) => {
    // Construct dish model to add to cart
    addToCart(
      {
        id: card.dishId,
        name: card.dishName,
        restaurantId: card.restaurantId,
        restaurantName: card.restaurantName,
        price: card.price,
        imageUrl: card.imageUrl,
        isVegetarian: card.isVegetarian,
        rating: card.rating,
        reviewCount: 100,
        description: card.rationale || '',
        isAvailable: true,
        isChefSpecial: false,
      },
      { id: card.restaurantId, name: card.restaurantName }
    );
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${isExpanded ? 'w-[95vw] sm:w-[540px] h-[85vh]' : 'w-[92vw] sm:w-[420px] h-[620px] max-h-[88vh]'} bg-white rounded-3xl shadow-2xl border border-charcoal-100 flex flex-col overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-4`}>
      
      {/* Header */}
      <div className="p-4 px-5 bg-gradient-to-r from-cravelle-600 via-cravelle-500 to-coral-500 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base flex items-center gap-1.5 leading-tight">
              Cravelle AI Concierge
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
            </h3>
            <p className="text-[11px] text-white/80 font-medium truncate max-w-[200px]">
              Grounded in kitchens near {location.placeName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/90 transition-colors"
            title={isExpanded ? 'Minimize' : 'Expand'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/90 transition-colors"
            title="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cream-50/50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${msg.role === 'USER' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-start gap-2.5 max-w-[88%]">
              {msg.role === 'ASSISTANT' && (
                <div className="w-7 h-7 rounded-xl bg-cravelle-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'USER'
                    ? 'bg-charcoal-800 text-white rounded-tr-xs shadow-xs'
                    : 'bg-white text-charcoal-800 rounded-tl-xs border border-charcoal-100 shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>
              </div>

              {msg.role === 'USER' && (
                <div className="w-7 h-7 rounded-xl bg-charcoal-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Recommended Dish Cards Carousel */}
            {msg.recommendedDishes && msg.recommendedDishes.length > 0 && (
              <div className="w-full mt-3 pl-9 pr-1 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cravelle-600 block">
                  Verified Dishes Available Now:
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {msg.recommendedDishes.map((dish) => (
                    <div
                      key={dish.dishId}
                      className="p-3 rounded-2xl bg-white border border-cravelle-200 shadow-xs flex items-center justify-between gap-3 hover:border-cravelle-400 transition-all"
                    >
                      {/* Left thumbnail & info */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {dish.imageUrl ? (
                          <img
                            src={dish.imageUrl}
                            alt={dish.dishName}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-cream-100 flex items-center justify-center text-cravelle-500 shrink-0">
                            🍲
                          </div>
                        )}
                        <div className="truncate">
                          <div className="flex items-center gap-1.5 truncate">
                            {dish.isVegetarian ? (
                              <span className="badge-veg shrink-0"></span>
                            ) : (
                              <span className="badge-nonveg shrink-0"></span>
                            )}
                            <h5 className="font-bold text-xs text-charcoal-800 truncate">
                              {dish.dishName}
                            </h5>
                          </div>
                          <p className="text-[11px] text-charcoal-400 truncate">
                            {dish.restaurantName}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-bold text-xs text-charcoal-900">
                              ₹{dish.price}
                            </span>
                            <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              {dish.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Order Button */}
                      <button
                        onClick={() => handleOrderDish(dish)}
                        className="px-3 py-1.5 rounded-xl btn-primary text-white text-xs font-bold shrink-0 shadow-xs flex items-center gap-1"
                      >
                        <span>Order</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-charcoal-400 pl-9">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-cravelle-500" />
            <span>Scanning verified dishes & delivery radius...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sample Prompts Pills */}
      <div className="p-2 px-4 bg-white border-t border-charcoal-100 flex gap-1.5 overflow-x-auto no-scrollbar">
        {SAMPLE_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 rounded-full bg-cream-100 hover:bg-cream-200 border border-cravelle-200/60 text-[11px] text-charcoal-700 whitespace-nowrap font-medium transition-colors shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-charcoal-100 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask e.g. What's good near my college under ₹200?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-2xl bg-charcoal-50 border border-charcoal-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cravelle-500 focus:bg-white transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-2xl btn-primary text-white shadow-md disabled:opacity-50 transition-all shrink-0"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Verified Grounding Badge */}
      <div className="px-4 py-1.5 bg-cream-100 border-t border-charcoal-100 flex items-center justify-between text-[10px] text-charcoal-400">
        <span className="flex items-center gap-1 text-green-700 font-semibold">
          <ShieldCheck className="w-3 h-3 text-green-600" />
          Verified Restaurant Grounding
        </span>
        <span>No hallucinated prices or orders</span>
      </div>

    </div>
  );
};
