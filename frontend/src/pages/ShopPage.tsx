import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { Product, Category, PageResponse } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const initialCategory = searchParams.get('category') ? Number(searchParams.get('category')) : undefined;
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortDir, setSortDir] = useState<string>('desc');
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Load Categories once
  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(console.error);
  }, []);

  // Sync url param if changes
  useEffect(() => {
    const cat = searchParams.get('category');
    const search = searchParams.get('search');
    if (cat) setSelectedCategory(Number(cat));
    if (search !== null) setSearchQuery(search);
  }, [searchParams]);

  // Load Products with filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data: PageResponse<Product> = await productService.getProducts({
          categoryId: selectedCategory,
          search: searchQuery || undefined,
          minPrice,
          maxPrice,
          sortBy,
          sortDir,
          page,
          size: 12,
        });
        setProducts(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } catch (err) {
        console.error('Error fetching shop products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery, minPrice, maxPrice, sortBy, sortDir, page]);

  const handleClearFilters = () => {
    setSelectedCategory(undefined);
    setSearchQuery('');
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSortBy('createdAt');
    setSortDir('desc');
    setPage(0);
    setSearchParams({});
  };

  const handleSortChange = (value: string) => {
    if (value === 'price-asc') {
      setSortBy('price');
      setSortDir('asc');
    } else if (value === 'price-desc') {
      setSortBy('price');
      setSortDir('desc');
    } else if (value === 'newest') {
      setSortBy('createdAt');
      setSortDir('desc');
    }
    setPage(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="text-center space-y-3 mb-10 pb-6 border-b border-taupe-200">
        <span className="text-xs uppercase tracking-[0.25em] text-gold-600 font-semibold">Ready-To-Wear & Couture</span>
        <h1 className="font-editorial text-3xl sm:text-5xl text-charcoal-700">The Atelier Collection</h1>
        <p className="text-xs sm:text-sm text-charcoal-500 max-w-lg mx-auto font-light">
          Explore exquisite evening slip dresses, tailored wool outerwear, mulberry silk tops, and artisanal leather accessories.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Filter Sidebar (Desktop) */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-8">
          <div className="flex items-center justify-between pb-3 border-b border-taupe-200">
            <h3 className="font-editorial text-lg text-charcoal-700 font-medium">Refine Selection</h3>
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs text-taupe-500 hover:text-gold-600 flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-600">Categories</h4>
            <div className="space-y-1.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(undefined);
                  setPage(0);
                }}
                className={`w-full text-left py-1 px-2 rounded transition-colors ${
                  selectedCategory === undefined
                    ? 'bg-cream-200 text-charcoal-800 font-semibold'
                    : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-100'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setPage(0);
                  }}
                  className={`w-full text-left py-1 px-2 rounded transition-colors truncate ${
                    selectedCategory === cat.id
                      ? 'bg-cream-200 text-charcoal-800 font-semibold'
                      : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3 pt-4 border-t border-taupe-200">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-600">Price Range</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-taupe-400 block mb-1">Min (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice !== undefined ? minPrice : ''}
                  onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full bg-white border border-taupe-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-gold-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-taupe-400 block mb-1">Max (₹)</label>
                <input
                  type="number"
                  placeholder="10000"
                  value={maxPrice !== undefined ? maxPrice : ''}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full bg-white border border-taupe-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column: Catalog Grid & Top Filter Controls */}
        <div className="flex-1 space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg border border-taupe-200 shadow-soft">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setFilterDrawerOpen(true)}
                className="lg:hidden flex items-center space-x-1.5 text-xs font-semibold text-charcoal-700 border border-taupe-300 px-3 py-1.5 rounded"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
              <span className="text-xs text-charcoal-500">
                Showing <strong className="text-charcoal-800">{totalElements}</strong> pieces
              </span>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 text-xs">
              <label className="text-charcoal-400">Sort by:</label>
              <select
                onChange={(e) => handleSortChange(e.target.value)}
                defaultValue="newest"
                className="bg-cream-50 border border-taupe-200 rounded px-3 py-1.5 text-charcoal-700 focus:outline-none focus:border-gold-500"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(selectedCategory || searchQuery || minPrice || maxPrice) && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-taupe-500 uppercase tracking-wider font-semibold">Active Filters:</span>
              {selectedCategory && (
                <span className="inline-flex items-center space-x-1 text-xs bg-cream-100 text-charcoal-700 px-2.5 py-1 rounded-full border border-taupe-200">
                  <span>Category: {categories.find((c) => c.id === selectedCategory)?.name}</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory(undefined)} />
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center space-x-1 text-xs bg-cream-100 text-charcoal-700 px-2.5 py-1 rounded-full border border-taupe-200">
                  <span>Search: &ldquo;{searchQuery}&rdquo;</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                </span>
              )}
              {minPrice && (
                <span className="inline-flex items-center space-x-1 text-xs bg-cream-100 text-charcoal-700 px-2.5 py-1 rounded-full border border-taupe-200">
                  <span>Min: ₹{minPrice}</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setMinPrice(undefined)} />
                </span>
              )}
              {maxPrice && (
                <span className="inline-flex items-center space-x-1 text-xs bg-cream-100 text-charcoal-700 px-2.5 py-1 rounded-full border border-taupe-200">
                  <span>Max: ₹{maxPrice}</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setMaxPrice(undefined)} />
                </span>
              )}
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs text-gold-600 hover:underline font-semibold ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4 bg-white rounded-lg border border-taupe-200 p-8">
              <p className="font-editorial text-xl text-charcoal-700">No atelier garments match your current selection.</p>
              <p className="text-xs text-taupe-400 max-w-md mx-auto">
                Try widening your price range or clearing selected categories to explore the complete Cravelle collection.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-6 py-2.5 btn-gold text-xs font-semibold uppercase tracking-wider rounded"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-10">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-2 rounded border border-taupe-300 text-charcoal-600 disabled:opacity-40 hover:bg-cream-100"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i)}
                  className={`w-9 h-9 rounded text-xs font-semibold transition-colors ${
                    page === i
                      ? 'bg-[#1C1B1A] text-white'
                      : 'border border-taupe-200 text-charcoal-700 hover:bg-cream-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-2 rounded border border-taupe-300 text-charcoal-600 disabled:opacity-40 hover:bg-cream-100"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setFilterDrawerOpen(false)} />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-taupe-200">
              <h3 className="font-editorial text-lg text-charcoal-700">Filter Pieces</h3>
              <button type="button" onClick={() => setFilterDrawerOpen(false)}>
                <X className="w-5 h-5 text-charcoal-500" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-600">Categories</h4>
              <div className="space-y-1.5 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setFilterDrawerOpen(false);
                    }}
                    className="block w-full text-left py-1 text-charcoal-700 hover:text-gold-600"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                handleClearFilters();
                setFilterDrawerOpen(false);
              }}
              className="w-full py-2.5 bg-cream-100 text-charcoal-700 text-xs font-semibold rounded"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
