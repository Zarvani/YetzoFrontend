export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon_url?: string;
  banner_url?: string;
  display_order: number;
  is_active: boolean;
}

export interface Service {
  id: string;
  category: string; // UUID or Category object depending on serializer
  name: string;
  slug: string;
  short_description: string;
  description: string;
  icon_url: string;
  image_url: string;
  video_url?: string;
  is_active: boolean;
  base_price?: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
