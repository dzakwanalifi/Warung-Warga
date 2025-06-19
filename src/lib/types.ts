// User and Authentication Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  address?: string;
  phone_number?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface AuthResponse {
  user: User;
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

// Lapak (Product Listing) Types
export interface Lapak {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  unit: string;
  stock_quantity: number;
  image_urls: string[];
  status: 'available' | 'sold_out' | 'inactive';
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
  seller: Profile;
  distance?: number; // Added by nearby query
}

export interface LapakCreate {
  title: string;
  description: string;
  price: number;
  unit: string;
  stock_quantity: number;
}

export interface LapakUpdate {
  title?: string;
  description?: string;
  price?: number;
  unit?: string;
  stock_quantity?: number;
  status?: 'available' | 'sold_out' | 'inactive';
}

export interface LapakAnalysisResult {
  title: string;
  description: string;
  suggested_price?: number;
  unit: string;
  category?: string;
}

export interface LapakListResponse {
  lapak: Lapak[];
  total: number;
  page: number;
  limit: number;
}

// Group Buy (Borongan) Types
export interface GroupBuy {
  id: string;
  organizer_id: string;
  title: string;
  description: string;
  price_per_unit: number;
  unit: string;
  target_quantity: number;
  current_quantity: number;
  deadline: string;
  status: 'active' | 'completed' | 'failed' | 'expired';
  pickup_point_address: string;
  created_at: string;
  updated_at: string;
  organizer: Profile;
  participants: GroupBuyParticipant[];
  progress_percentage?: number;
  days_left?: number;
}

export interface GroupBuyParticipant {
  id: string;
  group_buy_id: string;
  participant_id: string;
  quantity: number;
  total_price: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  joined_at: string;
  participant: Profile;
}

export interface GroupBuyCreate {
  title: string;
  description: string;
  price_per_unit: number;
  unit: string;
  target_quantity: number;
  deadline: string;
  pickup_point_address: string;
}

export interface GroupBuyJoin {
  quantity: number;
}

export interface GroupBuyJoinResponse {
  participant: GroupBuyParticipant;
  payment_url?: string;
  payment_reference?: string;
}

export interface GroupBuyListResponse {
  borongan: GroupBuy[];
  total: number;
  page: number;
  limit: number;
}

// Payment Types
export interface PaymentMethod {
  code: string;
  name: string;
  type: 'bank_transfer' | 'e_wallet' | 'retail' | 'credit_card';
  fee_type: 'flat' | 'percentage';
  fee_amount: number;
  minimum_amount: number;
  maximum_amount: number;
  is_active: boolean;
  icon_url?: string;
}

export interface PaymentStatus {
  participant_id: string;
  payment_reference: string;
  status: 'pending' | 'paid' | 'failed' | 'expired';
  payment_url?: string;
  amount: number;
  method_name: string;
  created_at: string;
  expires_at?: string;
}

// Location Types
export interface Location {
  latitude: number;
  longitude: number;
}

export interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface NearbyParams extends PaginationParams {
  latitude: number;
  longitude: number;
  radius?: number; // in kilometers
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface FormField {
  value: string;
  error: string | null;
  touched: boolean;
}

export interface UploadProgress {
  progress: number;
  isUploading: boolean;
  error: string | null;
}

// Toast/Notification Types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  isVisible: boolean;
}

// Filter and Search Types
export interface LapakFilters {
  search?: string;
  min_price?: number;
  max_price?: number;
  category?: string;
  status?: string;
  radius?: number;
}

export interface GroupBuyFilters {
  search?: string;
  status?: string;
  min_price?: number;
  max_price?: number;
  category?: string;
}

// Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'listing' | 'group-buy';
  onClick?: () => void;
  className?: string;
}

// Navigation Types
export interface NavItem {
  href: string;
  label: string;
  icon?: React.ComponentType<any>;
  isActive?: boolean;
}

export interface BottomNavItem extends NavItem {
  badge?: number;
}

// Constants for validation
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^(\+62|62|0)[8-9][0-9]{8,11}$/,
  PASSWORD_MIN_LENGTH: 6,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  MAX_IMAGES_PER_LAPAK: 5,
} as const;

// Status options
export const LAPAK_STATUS_OPTIONS = [
  { value: 'available', label: 'Tersedia' },
  { value: 'sold_out', label: 'Habis' },
  { value: 'inactive', label: 'Tidak Aktif' },
] as const;

export const GROUP_BUY_STATUS_OPTIONS = [
  { value: 'active', label: 'Aktif' },
  { value: 'completed', label: 'Selesai' },
  { value: 'failed', label: 'Gagal' },
  { value: 'expired', label: 'Kedaluwarsa' },
] as const;

export const PAYMENT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Menunggu' },
  { value: 'paid', label: 'Lunas' },
  { value: 'failed', label: 'Gagal' },
  { value: 'refunded', label: 'Dikembalikan' },
] as const; 