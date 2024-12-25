import React from "react";
import { Link } from "react-router-dom"; // Sử dụng react-router-dom

const Sidebar = ({ isSidebarOpen }) => {
  // Nhận state từ App.jsx
  const navigation = [
    { name: "Dashboard", icon: "⚡", path: "/dashboard" },
    { name: "Inbound", icon: "📥", path: "/inbound" },
    { name: "Outbound", icon: "📤", path: "/outbound" },
    <hr key="hr1" />, // Thêm key cho các phần tử <hr />
    { name: "Inventory", icon: "📦", path: "/inventory" },
    { name: "Goods List", icon: "📃", path: "/goods-list" },
    { name: "Warehouse", icon: "🏢", path: "/warehouse" },
    { name: "Base Info", icon: "🏠", path: "/base-info" },
    <hr key="hr2" />,
    { name: "Staff", icon: "👤", path: "/staff" },
    { name: "Driver", icon: "🚚", path: "/driver" },
    <hr key="hr3" />,
    { name: "Download Center", icon: "⬇️", path: "/download-center" },
  ];

  return (
    <div
    style={{ 
      width: isSidebarOpen ? "256px" : "0px", 
      backgroundColor: "#252525", 
      height: "calc(100vh - 48px)",
      color: "white",
      transition: "all 0.3s ease-in-out"
    }}
    >
       <nav style={{ flex: 1 }}>
        {navigation.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            style={{ 
              display: "flex",
              alignItems: "center",
              padding: "10px 16px",
              color: "#ccc",
              textDecoration: "none",
              transition: "all 0.3s ease-in-out",
              opacity: isSidebarOpen ? 1 : 0 
            }}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span> 
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;