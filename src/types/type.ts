import type { ReactNode } from "react";

export type NavItem = {
  path: string;
  label: string;
  icon: ReactNode;
};
export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
export type Order = {
  id: number;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  orderDate: string;
};
export interface OrderTableProps {
  orders: Order[];
}
export interface UserToken {
  email: string;
  name: string;
  loginTime: string;
}
export interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onToggle?: () => void;
  user: UserToken;
}
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  description?: string;
  imageUrl?: string;
  updatedAt?: string;
}
export interface ProductsResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}
export interface ApiResponse {
  success: boolean;
  message: string;
  data: ProductsResponse;
}
