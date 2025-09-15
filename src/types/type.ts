import type { JSX, ReactNode } from "react";

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
export type Props = {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
};

export type PropsAuth = {
  children: JSX.Element;
  allowRoles?: Array<"admin" | "user">;
};
export type Role = "admin" | "user";
export type AuthUser = {
  email: string;
  role: Role;
};
export type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser | null;
};
export type StoredUser = {
  email: string;
  password: string;
};
export interface CartItem {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
  quantity: number;
}
export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}
export type Mode = "light" | "dark";

export type ColorModeContextValue = {
  mode: Mode;
  toggleColorMode: () => void;
};

export type SuspenseContainerProps = {
  children: ReactNode;
};
