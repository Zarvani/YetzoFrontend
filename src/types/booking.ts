export interface Booking {
  id: string;
  customer: string;
  professional?: string;
  service: string;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  scheduled_time: string;
  total_amount: number;
  created_at: string;
}

export interface CreateBookingPayload {
  service: string;
  scheduled_time: string; // ISO 8601 string
  address?: string; // Optional if address isn't fully implemented in backend yet
}
