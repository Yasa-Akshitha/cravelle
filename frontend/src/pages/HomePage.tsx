import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, ShieldCheck, ChevronRight, Compass } from 'lucide-react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';

export const HomePage: React.FC = () => {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [arrivalsData, categoriesData] = await Promise.all([
          productService.getNewArrivals(),
          categoryService.getCategories(),
        ]);
        setNewArrivals(arrivalsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Large Fashion Campaign Hero Banner */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#1E1B19]">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85"
            alt="Cravelle Haute Couture Campaign"
            className="w-full h-full object-cover object-top opacity-55 scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141211] via-[#1E1B19]/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6 pt-12">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-gold-400/30 text-gold-300 text-xs tracking-widest uppercase font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Spring/Summer Atelier Collection</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl text-[#FCFBF7] font-medium tracking-tight leading-[1.1]">
            Discover Your <br />
            <span className="italic font-normal text-gold-300">Signature Style</span>
          </h1>

          <p className="text-sm sm:text-base text-cream-200 max-w-xl mx-auto font-light leading-relaxed">
            Where Parisian tailoring meets fluid mulberry silk. Crafted for timeless evenings, power dressing, and effortless modern grandeur.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-3.5 btn-gold text-xs font-semibold uppercase tracking-widest rounded shadow-xl inline-flex items-center justify-center space-x-2"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/shop?category=1"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs font-semibold uppercase tracking-widest rounded backdrop-blur-sm transition-all"
            >
              Evening Silhouettes
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-600 font-semibold">Atelier Curation</span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-charcoal-700">Explore by Category</h2>
          <div className="w-12 h-0.5 bg-gold-500 mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="group relative aspect-[3/4] rounded-lg overflow-hidden bg-cream-100 border border-taupe-200 shadow-soft hover:shadow-card transition-all duration-300"
            >
              <img
                src={cat.imageUrl || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 inset-x-4 text-center">
                <h3 className="font-editorial text-base sm:text-lg text-white font-medium group-hover:text-gold-300 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-taupe-300 mt-1 inline-flex items-center space-x-1 group-hover:text-white">
                  <span>View Capsule</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-taupe-200 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-gold-600 font-semibold">Fresh Off The Loom</span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-charcoal-700 mt-1">New Arrivals</h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal-600 hover:text-gold-600 transition-colors"
          >
            <span>View All Pieces</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Editorial Campaign Showcase Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-charcoal-700 text-white min-h-[460px] flex items-center shadow-xl">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1800&q=85"
              alt="Editorial Cravelle Campaign"
              className="w-full h-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
          </div>

          <div className="relative z-10 max-w-xl p-8 sm:p-14 space-y-6">
            <div className="text-gold-400 text-xs uppercase tracking-[0.3em] font-semibold">
              The Silk & Cashmere Manifesto
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl leading-tight">
              Fluid Mulberry Silks Crafted for Quiet Opulence
            </h2>
            <p className="text-xs sm:text-sm text-taupe-300 font-light leading-relaxed">
              Every seam is finished by hand. Designed for transitions between private gallery receptions, high-profile summits, and midnight galas.
            </p>
            <div className="pt-2">
              <Link
                to="/shop?category=3"
                className="px-8 py-3.5 btn-gold text-xs font-semibold uppercase tracking-widest rounded inline-flex items-center space-x-2"
              >
                <span>Shop Silk Blouses</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trending Now Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-taupe-200 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-gold-600 font-semibold">Most Desired</span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-charcoal-700 mt-1">Trending in the Atelier</h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal-600 hover:text-gold-600 transition-colors"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals.slice(4, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 6. Customer Testimonials / Press Quotes */}
      <section className="bg-cream-100 py-16 border-y border-taupe-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <span className="text-xs uppercase tracking-[0.3em] text-gold-600 font-semibold">Editorial Acclaim</span>
          <h2 className="font-editorial text-2xl sm:text-3xl text-charcoal-800 max-w-2xl mx-auto italic font-normal leading-relaxed">
            &ldquo;Cravelle redefines affordable luxury with silhouettes that feel worthy of Parisian haute couture week. An absolute tour-de-force.&rdquo;
          </h2>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest text-charcoal-600 font-bold">Vogue Style Gazette</p>
            <p className="text-[11px] text-taupe-500">October Seasonal Edition</p>
          </div>
        </div>
      </section>
    </div>
  );
};
