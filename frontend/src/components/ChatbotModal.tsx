import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, X, Send, Sparkles, Trash2, ArrowRight, Loader2, Bot, ShoppingBag } from 'lucide-react';
import { chatService } from '../services/chatService';
import { ChatMessage, ProductRecommendationCard } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const ChatbotModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    "Help me find an outfit for an evening gala.",
    "Recommend products under ₹3,000.",
    "Show me new silk arrivals.",
    "What is your return & exchange policy?"
  ]);
  const [guestSessionId, setGuestSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Generate or retrieve guest session id
    let sessionId = localStorage.getItem('cravelle_guest_session');
    if (!sessionId) {
      sessionId = 'guest_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('cravelle_guest_session', sessionId);
    }
    setGuestSessionId(sessionId);

    // Initial greeting if no messages
    if (messages.length === 0) {
      setMessages([
        {
          role: 'ASSISTANT',
          message: 'Bonjour and welcome to Cravelle. I am your personal couture stylist. How may I assist your style journey today? You may ask for tailored recommendations, fabric insights, or store policies.',
          createdAt: new Date().toISOString(),
        }
      ]);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    // Add user message to UI immediately
    const userMsg: ChatMessage = {
      role: 'USER',
      message: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await chatService.sendMessage(text, guestSessionId);

      const assistantMsg: ChatMessage = {
        role: 'ASSISTANT',
        message: response.reply,
        cards: response.products,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (response.suggestedQuestions && response.suggestedQuestions.length > 0) {
        setSuggestedQuestions(response.suggestedQuestions);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ASSISTANT',
          message: 'I apologize for the brief pause in my connection. Our atelier concierges are also available at concierge@cravelle.com or please try asking again in a moment.',
          createdAt: new Date().toISOString(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    try {
      await chatService.clearHistory(guestSessionId);
    } catch {
      // ignore
    }
    setMessages([
      {
        role: 'ASSISTANT',
        message: 'Chat history cleared. How may I style you today?',
        createdAt: new Date().toISOString(),
      }
    ]);
  };

  const handleViewProduct = (slugOrId: string | number) => {
    setIsOpen(false);
    navigate(`/product/${slugOrId}`);
  };

  const handleCardQuickAdd = async (card: ProductRecommendationCard) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      // Navigate to product details to select size
      navigate(`/product/${card.slug || card.id}`);
      setIsOpen(false);
    } catch {
      // ignore
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center space-x-2 bg-[#1C1B1A] text-white hover:bg-gold-600 px-4 py-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 border border-gold-500/40 group"
            aria-label="Open Cravelle AI Personal Stylist"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-gold-400 group-hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase font-sans">
              Cravelle AI Stylist
            </span>
          </button>
        )}
      </div>

      {/* Expandable Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[94vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-taupe-200 flex flex-col overflow-hidden animate-scaleUp">
          {/* Header */}
          <div className="bg-[#1C1B1A] text-white px-5 py-4 flex items-center justify-between border-b border-gold-500/30">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-gold-600/20 border border-gold-400 flex items-center justify-center text-gold-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-editorial text-base font-semibold tracking-wide text-[#FAF7F0]">Cravelle AI</h3>
                  <span className="text-[9px] uppercase tracking-wider bg-gold-600/30 text-gold-300 px-1.5 py-0.5 rounded-sm">Stylist</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[10px] text-taupe-400">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
                  <span>Online Atelier Assistant</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handleClearChat}
                className="p-1.5 text-taupe-400 hover:text-white transition-colors"
                title="Clear conversation"
                aria-label="Clear conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-taupe-400 hover:text-white transition-colors"
                title="Close chat"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Conversation Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FCFBF9]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.role === 'USER' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] text-xs leading-relaxed rounded-2xl px-4 py-3 ${
                    msg.role === 'USER'
                      ? 'bg-[#1C1B1A] text-white rounded-br-xs'
                      : 'bg-white text-charcoal-700 border border-taupe-200/80 rounded-bl-xs shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.message}</p>
                </div>

                {/* Structured Recommendation Cards */}
                {msg.cards && msg.cards.length > 0 && (
                  <div className="mt-2.5 space-y-2 w-full max-w-[90%]">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gold-600 px-1">
                      Curated For You:
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.cards.map((card) => (
                        <div
                          key={card.id}
                          className="bg-white border border-taupe-200 rounded-lg p-2.5 flex items-center space-x-3 shadow-xs hover:border-gold-500 transition-colors"
                        >
                          <img
                            src={card.imageUrl}
                            alt={card.name}
                            className="w-12 h-16 object-cover rounded bg-cream-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] uppercase font-bold text-gold-600 truncate block">
                              {card.categoryName}
                            </span>
                            <h5 className="font-editorial text-xs text-charcoal-800 font-medium truncate">
                              {card.name}
                            </h5>
                            <p className="text-xs font-semibold text-charcoal-900 mt-0.5">
                              ₹{card.price.toLocaleString('en-IN')}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleViewProduct(card.slug || card.id)}
                            className="px-2.5 py-1.5 bg-cream-100 hover:btn-gold hover:text-white text-charcoal-700 text-[10px] font-semibold rounded transition-colors shrink-0"
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex items-center space-x-2 text-charcoal-400 text-xs bg-white border border-taupe-200 rounded-2xl px-4 py-2.5 w-fit shadow-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-gold-500" />
                <span className="text-[11px] italic">Cravelle Stylist is consulting atelier records...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Inquiries */}
          {suggestedQuestions.length > 0 && (
            <div className="px-3 py-2 bg-cream-50 border-t border-taupe-100 overflow-x-auto flex space-x-1.5 no-scrollbar">
              {suggestedQuestions.slice(0, 3).map((sq, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(sq)}
                  disabled={loading}
                  className="whitespace-nowrap text-[10px] bg-white border border-taupe-200 text-charcoal-600 hover:text-gold-700 hover:border-gold-500 px-2.5 py-1 rounded-full transition-colors shrink-0"
                >
                  {sq}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-taupe-200 flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask for styling advice, budgets, or pieces..."
              disabled={loading}
              className="flex-1 bg-cream-50 border border-taupe-200 rounded-full px-4 py-2.5 text-xs text-charcoal-700 placeholder-taupe-400 focus:outline-none focus:border-gold-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="w-9 h-9 rounded-full bg-[#1C1B1A] text-white hover:bg-gold-600 disabled:opacity-40 flex items-center justify-center transition-colors shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 stroke-[1.75]" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
