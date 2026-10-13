import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Truck, RefreshCw, ShieldCheck, Check, AlertCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { productService } from '../services/productService';
import { Product, ProductVariant, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { slugOrId } = useParams<{ slugOrId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Variant & Cart Selections
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeVariant, setActiveVariant] = useState<ProductVariant | null>(null);

  // Feedback & Accordions
  const [addingToCart, setAddingToCart] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [shippingOpen, setShippingOpen] = useState(false);
  const [craftOpen, setCraftOpen] = useState(false);

  // Review Form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadProduct = async () => {
      if (!slugOrId) return;
      try {
        setLoading(true);
        setStatusMessage(null);
        let prod: Product;
        if (/^\d+$/.test(slugOrId)) {
          prod = await productService.getProductById(Number(slugOrId));
        } else {
          prod = await productService.getProductBySlug(slugOrId);
        }

        setProduct(prod);
        setSelectedImage(prod.imageUrl);

        // Pre-select first variant
        if (prod.variants && prod.variants.length > 0) {
          const first = prod.variants[0];
          setSelectedSize(first.size);
          setSelectedColor(first.color);
          setActiveVariant(first);
        }

        // Fetch related and reviews in parallel
        const [relatedData, reviewData] = await Promise.all([
          productService.getRelatedProducts(prod.id),
          productService.getReviews(prod.id),
        ]);
        setRelated(relatedData);
        setReviews(reviewData);
      } catch (err) {
        console.error('Error loading product details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slugOrId]);

  // Update active variant when size or color changes
  useEffect(() => {
    if (!product || !product.variants) return;
    const match = product.variants.find(
      (v) => v.size === selectedSize && v.color === selectedColor
    );
    setActiveVariant(match || null);
  }, [selectedSize, selectedColor, product]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-editorial text-2xl text-charcoal-700">Piece Not Found</h2>
        <p className="text-xs text-taupe-400">The requested silhouette may be retired or moved.</p>
        <Link to="/shop" className="inline-block px-6 py-2.5 btn-gold text-xs font-semibold uppercase rounded">
          Return to Collection
        </Link>
      </div>
    );
  }

  // Extract unique sizes and colors
  const availableSizes = Array.from(new Set(product.variants?.map((v) => v.size) || []));
  const availableColors = Array.from(new Set(product.variants?.map((v) => v.color) || []));
  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = async () => {
    if (!activeVariant || !activeVariant.id) {
      setStatusMessage({ type: 'error', text: 'Please choose an available size and color combination.' });
      return;
    }

    if (activeVariant.stock < quantity) {
      setStatusMessage({ type: 'error', text: `Only ${activeVariant.stock} pieces remaining in this variant.` });
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(activeVariant.id, quantity);
      setStatusMessage({ type: 'success', text: `Added ${quantity} piece(s) to your shopping bag.` });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error adding piece to bag.' });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    try {
      setSubmittingReview(true);
      const newRev = await productService.submitReview(product.id, reviewRating, reviewComment.trim());
      setReviews((prev) => [newRev, ...prev]);
      setReviewComment('');
      setShowReviewForm(false);
      setStatusMessage({ type: 'success', text: 'Thank you for submitting your review.' });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Failed to submit review' });
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumbs */}
      <nav className="text-xs text-taupe-400 space-x-2">
        <Link to="/" className="hover:text-charcoal-700">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-charcoal-700">Collection</Link>
        <span>/</span>
        <span className="text-charcoal-700 font-medium">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left: Gallery Component */}
        <div className="space-y-4">
          <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-cream-100 border border-taupe-200 shadow-soft">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 0 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              <button
                type="button"
                onClick={() => setSelectedImage(product.imageUrl)}
                className={`w-20 aspect-[3/4] rounded overflow-hidden border-2 shrink-0 transition-all ${
                  selectedImage === product.imageUrl ? 'border-gold-500 scale-95' : 'border-taupe-200 opacity-70'
                }`}
              >
                <img src={product.imageUrl} alt="Main" className="w-full h-full object-cover" />
              </button>
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(img.imageUrl)}
                  className={`w-20 aspect-[3/4] rounded overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img.imageUrl ? 'border-gold-500 scale-95' : 'border-taupe-200 opacity-70'
                  }`}
                >
                  <img src={img.imageUrl} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Purchase Matrix */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600 block">
              {product.categoryName}
            </span>

            <h1 className="font-editorial text-3xl sm:text-4xl text-charcoal-800 leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center space-x-2 text-xs text-charcoal-500">
              <div className="flex text-gold-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(product.averageRating || 5) ? 'fill-gold-500 text-gold-500' : 'text-taupe-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-charcoal-700">{product.averageRating}</span>
              <span className="text-taupe-400">({product.reviewCount} customer reviews)</span>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline space-x-3 pt-2">
              <span className="text-2xl sm:text-3xl font-semibold text-charcoal-800">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-base text-taupe-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="bg-blush-100 text-blush-700 text-xs font-semibold px-2 py-0.5 rounded">
                    Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-light pt-2">
              {product.description}
            </p>
          </div>

          {/* Variant Selectors */}
          <div className="space-y-5 pt-4 border-t border-taupe-200">
            {/* Color Swatches */}
            {availableColors.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-charcoal-700 uppercase tracking-wider">Color:</span>
                  <span className="text-charcoal-500">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`text-xs px-3.5 py-1.5 rounded border transition-all ${
                        selectedColor === color
                          ? 'border-charcoal-700 bg-charcoal-700 text-white font-medium'
                          : 'border-taupe-300 text-charcoal-700 hover:border-charcoal-700 bg-white'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Options */}
            {availableSizes.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-charcoal-700 uppercase tracking-wider">Size:</span>
                  <span className="text-gold-600 hover:underline cursor-pointer">Bespoke Size Guide</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-10 text-xs px-3 py-1.5 rounded border transition-all font-medium ${
                        selectedSize === size
                          ? 'border-charcoal-700 bg-charcoal-700 text-white'
                          : 'border-taupe-300 text-charcoal-700 hover:border-charcoal-700 bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variant Stock Indicator */}
            <div className="text-xs pt-1">
              {activeVariant ? (
                activeVariant.stock > 0 ? (
                  <span className="text-emerald-700 font-medium inline-flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>In Stock ({activeVariant.stock} pieces tailored in this size)</span>
                  </span>
                ) : (
                  <span className="text-red-600 font-medium inline-flex items-center space-x-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Currently reserved / Sold Out in this variant</span>
                  </span>
                )
              ) : (
                <span className="text-taupe-400">Select size & color to view availability</span>
              )}
            </div>

            {/* Quantity Selector & Add To Bag */}
            <div className="flex items-center space-x-4 pt-2">
              <div className="flex items-center border border-taupe-300 rounded bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2.5 text-xs text-charcoal-600 hover:bg-cream-100"
                >
                  -
                </button>
                <span className="px-4 py-2.5 text-xs font-semibold text-charcoal-800">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  disabled={activeVariant ? quantity >= activeVariant.stock : false}
                  className="px-3 py-2.5 text-xs text-charcoal-600 hover:bg-cream-100 disabled:opacity-40"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addingToCart || !activeVariant || activeVariant.stock === 0}
                className="flex-1 py-3.5 btn-gold text-xs font-semibold uppercase tracking-widest rounded shadow-md disabled:opacity-50 inline-flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4 text-white" />
                <span>{addingToCart ? 'Adding to Bag...' : 'Add to Shopping Bag'}</span>
              </button>

              {/* Wishlist Toggle Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded border transition-colors ${
                  isFavorited
                    ? 'border-blush-400 bg-blush-50 text-blush-600'
                    : 'border-taupe-300 bg-white text-charcoal-500 hover:border-charcoal-700'
                }`}
                title={isFavorited ? 'Remove from Wishlist' : 'Save to Wishlist'}
                aria-label="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-blush-600' : ''}`} />
              </button>
            </div>

            {/* Status Toast */}
            {statusMessage && (
              <div
                className={`p-3 text-xs rounded border ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {statusMessage.text}
              </div>
            )}
          </div>

          {/* Accordions: Shipping & Craftsmanship */}
          <div className="pt-6 border-t border-taupe-200 divide-y divide-taupe-100 text-xs">
            <div className="py-3">
              <button
                type="button"
                onClick={() => setShippingOpen(!shippingOpen)}
                className="w-full flex items-center justify-between text-charcoal-700 font-semibold uppercase tracking-wider text-left"
              >
                <span className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-gold-600" />
                  <span>Complimentary Shipping & 14-Day Returns</span>
                </span>
                {shippingOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {shippingOpen && (
                <div className="pt-3 text-taupe-500 space-y-2 leading-relaxed">
                  <p>All Cravelle pieces over ₹3,000 enjoy complimentary express insured courier shipping.</p>
                  <p>We provide a 14-day return window from receipt of your shipment for unworn items with security ribbons intact.</p>
                </div>
              )}
            </div>

            <div className="py-3">
              <button
                type="button"
                onClick={() => setCraftOpen(!craftOpen)}
                className="w-full flex items-center justify-between text-charcoal-700 font-semibold uppercase tracking-wider text-left"
              >
                <span className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-gold-600" />
                  <span>Materials & Atelier Care</span>
                </span>
                {craftOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {craftOpen && (
                <div className="pt-3 text-taupe-500 space-y-2 leading-relaxed">
                  <p>Dry clean only or gentle hand-wash in cold water with mild silk detergent. Store in the complimentary Cravelle cotton dust-bag.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="pt-10 border-t border-taupe-200 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-editorial text-2xl text-charcoal-800">Atelier Client Reviews</h3>
            <p className="text-xs text-taupe-400">Verified thoughts from owners of this silhouette</p>
          </div>
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2 border border-charcoal-700 text-charcoal-700 hover:btn-gold hover:border-transparent text-xs font-semibold uppercase tracking-wider rounded transition-colors"
            >
              {showReviewForm ? 'Cancel Review' : 'Write a Review'}
            </button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="bg-cream-50 p-6 rounded-lg border border-taupe-200 space-y-4 max-w-xl">
            <h4 className="font-editorial text-base text-charcoal-800">Share Your Experience</h4>
            <div>
              <label className="text-xs font-semibold text-charcoal-700 block mb-1">Your Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className={`w-5 h-5 cursor-pointer ${
                      star <= reviewRating ? 'fill-gold-500 text-gold-500' : 'text-taupe-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal-700 block mb-1">Your Review</label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="How does the fabric drape? How was the fit and finish?"
                required
                className="w-full bg-white border border-taupe-300 rounded p-2.5 text-xs text-charcoal-700 focus:outline-none focus:border-gold-500"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="px-5 py-2.5 btn-gold text-xs font-semibold uppercase rounded"
            >
              {submittingReview ? 'Submitting...' : 'Post Review'}
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div key={rev.id} className="p-5 bg-white rounded-lg border border-taupe-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-charcoal-800">{rev.userName}</span>
                  <div className="flex text-gold-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold-500" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-charcoal-600 leading-relaxed font-light italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
                <p className="text-[10px] text-taupe-400">
                  {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-taupe-400 col-span-3">No reviews submitted yet for this piece. Be the first to review!</p>
          )}
        </div>
      </section>

      {/* Related Products Recommendation */}
      {related.length > 0 && (
        <section className="pt-10 border-t border-taupe-200 space-y-8">
          <div className="text-center space-y-1">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-600 font-semibold">Atelier Pairings</span>
            <h3 className="font-editorial text-2xl sm:text-3xl text-charcoal-800">You May Also Admire</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
