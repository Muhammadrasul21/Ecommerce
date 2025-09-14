import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { navItems } from "../../constants";
import { useAppSelector } from "../../store/hooks";

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const location = useLocation();
  const { itemCount } = useAppSelector((state) => state.cart);

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
                      ${
                        sidebarOpen
                          ? "justify-start w-full"
                          : "justify-center w-[45px]"
                      }
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
          </ul>
        </nav>
      </aside>

      <div
        className={`flex-1 min-h-screen p-4 bg-gray-50 transition-all duration-300 
          ${sidebarOpen ? "ml-60" : "ml-16"}`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
