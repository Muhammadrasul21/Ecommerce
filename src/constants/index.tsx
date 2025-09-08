import type { NavItem } from "../types/type";
import { MdDashboard, MdProductionQuantityLimits } from "react-icons/md";
import { TiShoppingCart } from "react-icons/ti";
import { FaRegUser } from "react-icons/fa6";

export const navItems: NavItem[] = [
  { path: "/", label: "Dashboard", icon: <MdDashboard /> },
  {
    path: "/products",
    label: "Products",
    icon: <MdProductionQuantityLimits />,
  },
  { path: "/orders", label: "Orders", icon: <TiShoppingCart /> },
  { path: "/profile", label: "Profile", icon: <FaRegUser /> },
];
