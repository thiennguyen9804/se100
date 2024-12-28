import React from "react";
import { Link } from "react-router"; // Sử dụng react-router-dom

const Sidebar = ({ isSidebarOpen }) => {
  // Nhận state từ App.jsx
  const navigation = [
    { name: "Inbound", icon: "📥", path: "/inbound" },
    { name: "Outbound", icon: "📤", path: "/outbound" },
    <hr key="hr1" />, // Thêm key cho các phần tử <hr />
    { name: "Inventory", icon: "📦", path: "/inventory" },
    <hr key="hr2" />,
    { name: "Staff", icon: "👤", path: "/staff" },
    <hr key="hr3" />,
    { name: "Supplier", icon: "👨‍🌾", path: "/supplier" },
    { name: "Customer", icon: "🤵", path: "/customer" },
  ];

  return (
    <div
      style={{
        width: isSidebarOpen ? "256px" : "0px",
        backgroundColor: "#252525",
        height: "calc(100vh - 48px)",
        color: "white",
        transition: "all 0.3s ease-in-out",
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
              opacity: isSidebarOpen ? 1 : 0,
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
