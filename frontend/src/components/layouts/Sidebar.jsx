import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaMapMarkedAlt,
  FaExclamationTriangle,
  FaUserShield,
  FaHospital,
  FaChartBar,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const menuItems = [
  { icon: <FaTachometerAlt />, title: "Dashboard", path: "/" },
  { icon: <FaUsers />, title: "Tourists", path: "/tourists" },
  { icon: <FaMapMarkedAlt />, title: "Monitoring", path: "/monitoring" },
  { icon: <FaExclamationTriangle />, title: "Incidents", path: "/incidents" },
  { icon: <FaUserShield />, title: "Police", path: "/police" },
  { icon: <FaHospital />, title: "Hospitals", path: "/hospitals" },
  { icon: <FaChartBar />, title: "Analytics", path: "/analytics" },
  { icon: <FaFileAlt />, title: "Reports", path: "/reports" },
  { icon: <FaCog />, title: "Settings", path: "/settings" },
];

function Sidebar({ currentPath }) {
  const navigate=useNavigate();
  const handleLogout=()=>{

localStorage.removeItem("token");

navigate("/login");

};
  return (
    <aside className="w-full bg-slate-950 text-white lg:w-72 lg:shrink-0">
      <div className="border-b border-slate-800 p-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/70 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-300">
            Live Ops
          </span>
        </div>
        <h1 className="mt-4 text-2xl font-semibold">Smart Tourist</h1>
        <p className="mt-1 text-sm text-slate-400">Department Admin</p>
      </div>

      <nav className="mt-6 space-y-1 px-3">
        {menuItems.map((item, index) => {
          const isActive = currentPath === item.path.replace(/^\//, "") || (item.path === "/" && currentPath === "dashboard");

          return (
            <Link
              key={index}
              to={item.path}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                isActive
                  ? "bg-sky-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 border-t border-slate-800 p-4">
        <button

onClick={handleLogout}

className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/20"

>

<FaSignOutAlt/>

Logout

</button>
      </div>
    </aside>
  );
}

export default Sidebar;