export type BookingStatus =
  | 'DRAFT'
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'SEARCHING'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'ON_THE_WAY'
  | 'ARRIVED'
  | 'OTP_VERIFIED'
  | 'IN_PROGRESS'
  | 'PAUSED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED'
  | 'REFUNDED'
  | 'NO_SHOW';

export interface ServiceItem {
  id: string;
  name: string;
  slug?: string;
  category?: {
    id: string;
    name: string;
    slug?: string;
  };
  duration?: number;
  description?: string;
  base_price?: number;
  pricing_rules?: Array<{
    id: string;
    base_price: number;
    city?: string;
  }>;
}

export interface AddressItem {
  id: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  pincode: string;
  address_type: 'HOME' | 'WORK' | 'OTHER';
  latitude?: string;
  longitude?: string;
  is_default?: boolean;
}

export interface CouponItem {
  id: string;
  code: string;
  discount_type: 'PERCENTAGE' | 'FLAT';
  discount_value: number;
  min_order_value?: number;
  max_discount_amount?: number;
  description?: string;
  valid_until?: string;
}

export interface BookingSlotItem {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  available_capacity: number;
  status: 'OPEN' | 'FULL' | 'CLOSED';
}

export interface BookingItem {
  id: string;
  service_id?: string;
  name?: string;
  variant_id?: string;
  addon_id?: string;
  quantity: number;
  price?: number;
}

export interface BookingAnswer {
  question_id: string;
  answer_text: string | string[];
}

export interface Booking {
  id: string;
  booking_reference: string;
  customer?: {
    id: string;
    first_name: string;
    last_name?: string;
    phone?: string;
    email?: string;
  };
  service: ServiceItem;
  status: BookingStatus;
  scheduled_date?: string;
  scheduled_time?: string;
  is_instant: boolean;
  is_verified_session: boolean;
  address: AddressItem;
  start_otp?: string;
  end_otp?: string;
  base_price: number;
  addons_price: number;
  taxes: number;
  discount: number;
  platform_fee: number;
  total_amount: number;
  items?: BookingItem[];
  answers?: BookingAnswer[];
  assigned_professional?: any;
  created_at: string;
  updated_at?: string;
}

export interface CreateBookingPayload {
  service_id: string;
  address_id: string;
  scheduled_date?: string;
  scheduled_time?: string;
  is_instant: boolean;
  is_verified_session?: boolean;
  items?: BookingItem[];
  answers?: BookingAnswer[];
}
