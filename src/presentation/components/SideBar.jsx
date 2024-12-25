import React from "react";
import { Link } from "react-router";

const Sidebar = ({props}) => {
  const navigation = [
    { name: "Dashboard", icon: "⚡", path: "/dashboard" },
    { name: "Inbound", icon: "📥", path: "/inbound" },
    { name: "Outbound", icon: "📤", path: "/outbound" },
    { name: "Inventory", icon: "📦", path: "/inventory" },
    { name: "Finance", icon: "💰", path: "/finance" },
    { name: "Goods List", icon: "📃", path: "/goods-list" },
    { name: "Warehouse", icon: "🏢", path: "/warehouse" },
    { name: "Staff", icon: "👤", path: "/staff" },
    { name: "Driver", icon: "🚚", path: "/driver" },
    { name: "Upload Center", icon: "⬆️", path: "/upload-center" },
    { name: "Download Center", icon: "⬇️", path: "/download-center" },
  ];

  return (
    <div className={"min-w-[280px] bg-slate-900 text-white flex flex-col"}>
      <div className="px-6 py-4 text-lg font-semibold">SE100</div>
      <nav className="flex-1">
        {navigation.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            className="flex items-center px-4 py-2 text-gray-300 hover:bg-blue-700 hover:text-white"
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
