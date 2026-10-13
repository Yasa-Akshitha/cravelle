import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import { productService } from '../services/productService';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await productService.getProducts({ search: query.trim(), size: 4 });
        setResults(data.content);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelectProduct = (slugOrId: string | number) => {
    onClose();
    navigate(`/product/${slugOrId}`);
  };

  const handleViewAll = () => {
    onClose();
    navigate(`/shop?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-charcoal-700/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl border border-taupe-200 overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-taupe-100 flex items-center space-x-3 bg-cream-50">
          <Search className="w-5 h-5 text-gold-600 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dresses, tailored blazers, silk tops, cashmere..."
            autoFocus
            className="w-full bg-transparent text-sm text-charcoal-700 placeholder-taupe-400 focus:outline-none"
          />
          {loading && <Loader2 className="w-4 h-4 animate-spin text-taupe-400 shrink-0" />}
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-charcoal-400 hover:text-charcoal-700 transition-colors shrink-0"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        {!query && (
          <div className="p-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-400 mb-3">Popular Inquiries</p>
            <div className="flex flex-wrap gap-2">
              {['Mulberry Silk', 'Cocktail Gowns', 'Double-Breasted Blazers', 'Cashmere Knit', 'Gold Jewelry', 'Wide-Leg Trousers'].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setQuery(chip)}
                  className="text-xs bg-cream-100 hover:bg-blush-100 text-charcoal-600 hover:text-charcoal-800 px-3 py-1.5 rounded-full transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {results.length > 0 && (
          <div className="p-4 divide-y divide-taupe-100 max-h-96 overflow-y-auto">
            {results.map((product) => (
              <div
                key={product.id}
                onClick={() => handleSelectProduct(product.slug || product.id)}
                className="py-3 flex items-center space-x-4 cursor-pointer hover:bg-cream-50 p-2 rounded transition-colors"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-12 h-16 object-cover rounded bg-cream-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gold-600 uppercase font-semibold">{product.categoryName}</p>
                  <h4 className="text-sm font-editorial text-charcoal-700 truncate">{product.name}</h4>
                  <p className="text-xs font-semibold text-charcoal-800 mt-0.5">₹{product.price.toLocaleString('en-IN')}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-taupe-400 shrink-0" />
              </div>
            ))}
          </div>
        )}

        {query && results.length === 0 && !loading && (
          <div className="p-8 text-center text-xs text-charcoal-400">
            No atelier garments found matching &ldquo;{query}&rdquo;. Try another term.
          </div>
        )}

        {query && results.length > 0 && (
          <div className="p-3 bg-cream-100 text-center border-t border-taupe-200">
            <button
              type="button"
              onClick={handleViewAll}
              className="text-xs font-semibold text-charcoal-700 hover:text-gold-600 inline-flex items-center space-x-1"
            >
              <span>View all matching pieces</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
