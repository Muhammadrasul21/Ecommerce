import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { navItems } from "../../constants";

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const location = useLocation();

  return (
    <div className="flex h-screen">
      <aside
        className={`overflow-auto px-2 h-screen sticky top-0 left-0 border-r border-blue-500 rounded-xl py-6 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "w-60" : "w-16"
        }`}
      >
        <div
          className={`flex ${
            sidebarOpen ? "flex-row" : "flex-col gap-8"
          } items-center justify-between flex gap-10 mb-4`}
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
          <ul className="space-y-4 flex flex-col gap-1">
            {navItems.map(({ path, label, icon }) => {
              const isActive =
                location.pathname === path ||
                location.pathname === `/admin${path}`;
              return (
                <li key={path}>
                  <Link
                    to={path}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300
      ${sidebarOpen ? "w-[200px] justify-start" : "w-[45px] justify-center"}
      ${isActive ? "bg-blue-500 text-white" : "hover:bg-blue-100 text-gray-700"}
    `}
                  >
                    <span className="text-xl">{icon}</span>
                    {sidebarOpen && <span>{label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div className="flex-1 min-h-screen p-4 bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
