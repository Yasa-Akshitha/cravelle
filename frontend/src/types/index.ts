export type Role = 'ROLE_CUSTOMER' | 'ROLE_ADMIN' | 'ROLE_RESTAURANT_OWNER';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  avatarUrl?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  id: number;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatarUrl?: string;
}

export interface UserPreference {
  id?: number;
  userId?: number;
  isPureVeg: boolean;
  dietaryRestrictions?: string;
  favoriteCuisines?: string;
  budgetPerMeal?: number;
  spiceTolerance?: string;
}

export type PlaceType = 'COLLEGE' | 'OFFICE' | 'MALL' | 'PARK' | 'TOURIST_DESTINATION' | 'NEIGHBOURHOOD' | 'HOME';

export interface SavedPlace {
  id: number;
  userId?: number;
  name: string;
  placeType: PlaceType;
  address: string;
  latitude: number;
  longitude: number;
  visitCount?: number;
  lastVisitedAt?: string;
  createdAt?: string;
}

export interface SavedPlaceRequest {
  name: string;
  placeType: PlaceType;
  address: string;
  latitude: number;
  longitude: number;
}

export interface VisitHistory {
  id: number;
  userId?: number;
  placeName: string;
  placeType: PlaceType;
  latitude: number;
  longitude: number;
  visitedAt: string;
  durationMinutes?: number;
}

export interface Cuisine {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isPopular?: boolean;
  displayOrder?: number;
}

export interface Dish {
  id: number;
  restaurantId: number;
  restaurantName?: string;
  categoryId?: number;
  categoryName?: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  isVegetarian: boolean;
  isAvailable: boolean;
  isChefSpecial: boolean;
  calories?: number;
  prepTimeMinutes?: number;
  rating: number;
  reviewCount: number;
}

export interface DishCategory {
  id: number;
  restaurantId: number;
  name: string;
  displayOrder?: number;
  dishes: Dish[];
}

export interface Restaurant {
  id: number;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  phone?: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  estimatedDeliveryMinutes: number;
  deliveryFee: number;
  minimumOrderAmount: number;
  isPureVeg: boolean;
  isOpen: boolean;
  bannerImageUrl: string;
  logoImageUrl: string;
  cuisines: string[];
  distanceKm?: number;
  matchReason?: string;
}

export interface RestaurantDetail extends Restaurant {
  menuCategories: DishCategory[];
}

export interface CartItem {
  id: number;
  dishId: number;
  dishName: string;
  dishImageUrl?: string;
  isVegetarian: boolean;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  restaurantId: number;
  restaurantName?: string;
}

export interface Cart {
  items: CartItem[];
  restaurantId?: number;
  restaurantName?: string;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  totalItems: number;
}

export interface Address {
  id?: number;
  label?: string;
  street: string;
  area: string;
  city: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}

export type OrderStatus =
  | 'ORDER_PLACED'
  | 'RESTAURANT_CONFIRMED'
  | 'BEING_PREPARED'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id: number;
  dishId: number;
  dishName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  restaurantId: number;
  restaurantName: string;
  totalAmount: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: string;
  deliveryAddress: string;
  deliveryInstructions?: string;
  riderName?: string;
  riderPhone?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryStep {
  status: OrderStatus;
  note: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface OrderTracking {
  orderId: number;
  orderNumber: string;
  status: OrderStatus;
  currentStepIndex: number;
  steps: DeliveryStep[];
  restaurantName: string;
  deliveryAddress: string;
  riderName?: string;
  riderPhone?: string;
  createdAt: string;
  updatedAt: string;
  simulatedNextStatusAvailable?: boolean;
}

export interface PlaceRecommendation {
  placeName: string;
  placeType: PlaceType;
  distanceToPlaceKm: number;
  rationale: string;
  nearbyRestaurants: Restaurant[];
}

export interface RecommendationResponse {
  nearCurrentLocation: Restaurant[];
  inspiredByPlaces: PlaceRecommendation[];
  popularAroundYou: Restaurant[];
  curatedDishes: Dish[];
  userPreferenceApplied?: string;
  locationLabel?: string;
  locationSummary?: string;
  nearbyRestaurants?: Restaurant[];
  placeRecommendations?: PlaceRecommendation[];
}

export interface DishRecommendationCard {
  dishId: number;
  dishName: string;
  restaurantId: number;
  restaurantName: string;
  price: number;
  rating: number;
  imageUrl: string;
  isVegetarian: boolean;
  rationale?: string;
}

export interface ChatMessage {
  id?: number;
  role: 'USER' | 'ASSISTANT';
  content: string;
  createdAt?: string;
  recommendedDishes?: DishRecommendationCard[];
}

export interface ChatResponse {
  conversationId: number;
  reply: string;
  dishes: DishRecommendationCard[];
  suggestedPrompts: string[];
}

export interface DashboardStats {
  totalRestaurants: number;
  totalDishes: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  popularDishes: Dish[];
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
