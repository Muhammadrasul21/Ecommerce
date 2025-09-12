import type { NavItem } from "../types/type";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import PersonIcon from "@mui/icons-material/Person";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import {
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";

export const navItems: NavItem[] = [
  { path: "/admin", label: "Dashboard", icon: <DashboardIcon /> },
  { path: "/admin/products", label: "Products", icon: <Inventory2Icon /> },
  {
    path: "/admin/orders",
    label: "Orders",
    icon: <ShoppingCartCheckoutIcon />,
  },
  { path: "/admin/profile", label: "Profile", icon: <PersonIcon /> },
];
export const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Profil", icon: <PersonIcon />, path: "/profile" },
  { text: "Mahsulotlar", icon: <InventoryIcon />, path: "/products" },
  { text: "Analitika", icon: <AnalyticsIcon />, path: "/analytics" },
  { text: "Sozlamalar", icon: <SettingsIcon />, path: "/settings" },
];
