export interface User {
  id: number;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  id: number;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface ProductVariant {
  id?: number;
  size: string;
  color: string;
  stock: number;
}

export interface ProductImage {
  id?: number;
  imageUrl: string;
  displayOrder?: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  images: ProductImage[];
  variants: ProductVariant[];
  averageRating: number;
  reviewCount: number;
  createdAt?: string;
}

export interface CartItem {
  id: number;
  productVariantId: number;
  productId: number;
  productName: string;
  productSlug: string;
  productImageUrl: string;
  size: string;
  color: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  availableStock: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  totalItems: number;
}

export interface WishlistItem {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  categoryName: string;
  createdAt: string;
}

export interface Address {
  id?: number;
  recipientName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  lineTotal: number;
  productImageUrl?: string;
}

export interface Order {
  id: number;
  userId: number;
  customerName: string;
  customerEmail: string;
  shippingAddress: Address;
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  orderStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: string;
  paymentId?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ProductRecommendationCard {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  categoryName: string;
  stylingNote?: string;
}

export interface ChatMessage {
  id?: number;
  role: 'USER' | 'ASSISTANT';
  message: string;
  createdAt?: string;
  cards?: ProductRecommendationCard[];
}

export interface ChatResponse {
  conversationId: number;
  reply: string;
  products: ProductRecommendationCard[];
  suggestedQuestions: string[];
}

export interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockCount: number;
  activeSubscribers: number;
  recentOrders: Order[];
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
