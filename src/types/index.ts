export type Role = "CUSTOMER" | "ADMIN" | "STAFF";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  loyaltyPoints: number;
}

export type Category = string;

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category;
  isVeg: boolean;
  isAvailable: boolean;
  rating: number;
  featured?: boolean;
}

export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export interface Reservation {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCount: number;
  date: string;
  timeSlot: string;
  tableNumber?: string;
  status: ReservationStatus;
  specialNotes?: string;
  createdAt: string;
}

export type OrderStatus = "PLACED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
export type OrderType = "DELIVERY" | "PICKUP" | "DINE_IN";

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address?: string;
  tableNumber?: string;
  type: OrderType;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  couponCode?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  guestName: string;
  rating: number;
  comment: string;
  date: string;
}
