import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { navItems } from "../../constants";
import { useAppSelector } from "../../store/hooks";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/slices/authSlice";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import TranslateIcon from "@mui/icons-material/Translate";
import Avatar from "@mui/material/Avatar";
import { useColorMode } from "../../theme/ColorModeContext";
import LogoutIcon from "@mui/icons-material/Logout";

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const location = useLocation();
  const { itemCount } = useAppSelector((state) => state.cart);
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { mode, toggleColorMode } = useColorMode();

  return (
    <div className="h-screen flex">
      <aside
        className={`fixed top-0 left-0 h-full overflow-auto px-2 border-r border-blue-500 rounded-r-xl py-6 flex flex-col transition-all duration-300
          ${sidebarOpen ? "w-60" : "w-16"}`}
      >
        <div
          className={`flex ${
            sidebarOpen ? "flex-row" : "flex-col"
          } items-center justify-between mb-4`}
        >
          <p
            className={`text-2xl font-bold transition-all ${
              sidebarOpen ? "block" : "hidden"
            }`}
          >
            Admin
          </p>
          <GiHamburgerMenu
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="cursor-pointer transition-transform duration-300"
            style={{
              transform: sidebarOpen ? "rotate(90deg)" : "rotate(0deg)",
            }}
          />
        </div>

        <nav className="mt-8">
          <ul className="space-y-2">
            {navItems.map(({ path, label, icon }) => {
              const isActive = location.pathname === path;
              const isCartItem = path === "/admin/cart";

              return (
                <li key={path}>
                  <Link
                    to={path}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300
            ${sidebarOpen ? "justify-start w-full" : "justify-center w-[45px]"}
            ${
              isActive
                ? "bg-blue-500 text-white"
                : "hover:bg-blue-100 text-gray-700"
            }
          `}
                  >
                    <span className="text-xl">{icon}</span>
                    {sidebarOpen && <span>{label}</span>}
                    {sidebarOpen && isCartItem && itemCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}

            <li>
              <div
                onClick={() => dispatch(logoutUser())}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300
        ${sidebarOpen ? "justify-start w-full" : "justify-center w-[45px]"}
        hover:bg-red-100 text-red-600
      `}
              >
                <span className="text-xl">
                  <LogoutIcon />
                </span>
                {sidebarOpen && <span>Logout</span>}
              </div>
            </li>
          </ul>
        </nav>
      </aside>

      <div
        className={`flex-1 min-h-screen p-4 transition-all duration-300 
          ${sidebarOpen ? "ml-60" : "ml-16"}`}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{ mb: 2, backgroundColor: "#2B7FFF", borderRadius: 2 }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Admin Dashboard
            </Typography>
            <div>
              <Tooltip title="Toggle dark mode">
                <IconButton onClick={toggleColorMode} sx={{ mr: 1 }}>
                  {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Localization">
                <IconButton sx={{ mr: 1 }}>
                  <TranslateIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={
                  auth.user ? `${auth.user.email} • ${auth.user.role}` : "Guest"
                }
              >
                <IconButton>
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {auth.user?.role === "admin" ? "A" : "U"}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </div>
          </Toolbar>
        </AppBar>
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
