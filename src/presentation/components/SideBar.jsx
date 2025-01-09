import React from "react";
import { Link, useLocation } from "react-router-dom"; // Sử dụng đúng react-router-dom
import { useQuery } from "@tanstack/react-query";
import { roles } from "../../core/utils/constants";

const Sidebar = ({ isSidebarOpen }) => {
  const { pathname } = useLocation(); // Lấy đường dẫn hiện tại
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    enabled: false,
  });

  if (!currentUser) {
    return null;
  }

  let navigation = [];
  if (currentUser.Role === roles[0].value) {
    navigation = [{ name: "Staff", icon: "👤", path: "/staff" }];
  } else if (
    currentUser.Role === roles[1].value ||
    currentUser.Role === roles[2].value
  ) {
    navigation = [
      { name: "Inbound", icon: "📥", path: "/warehouse" },
      { name: "Outbound", icon: "📤", path: "/warehouse/outbound" },
      <hr key="hr1" />,
      { name: "Inventory", icon: "📦", path: "/warehouse/inventory" },
      { name: "ProductInfo", icon: "📦", path: "/warehouse/productinfo" },
      <hr key="hr2" />,
      { name: "Supplier", icon: "👨‍🌾", path: "/warehouse/supplier" },
      { name: "Customer", icon: "🤵", path: "/warehouse/customer" },
      <hr key="hr3" />,
      { name: "Statistical", icon: "📊", path: "/warehouse/statistical" },
    ];
  }

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
      <div style={{ padding: "16px", borderBottom: "1px solid #444" }}>
        <p
          style={{
            margin: 0,
            fontSize: "20px",
            color: "yellow",
            opacity: isSidebarOpen ? 1 : 0,
          }}
        >
          Welcome 🎉
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "17px",
            color: "#FFFFFF",
            opacity: isSidebarOpen ? 1 : 0,
          }}
        >
          {currentUser.Name}
        </p>
      </div>

      <nav style={{ flex: 1 }}>
        {navigation.map((item, idx) =>
          typeof item === "string" ? (
            <hr key={`hr-${idx}`} style={{ border: "1px solid #444" }} />
          ) : (
            <Link
              key={idx}
              to={`${item.path}`}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 16px",
                color: pathname === item.path ? "white" : "#ccc", // Đổi màu nếu được chọn
                backgroundColor:
                  pathname === item.path ? "#444" : "transparent", // Tùy chọn thêm màu nền
                textDecoration: "none",
                transition: "all 0.3s ease-in-out",
                opacity: isSidebarOpen ? 1 : 0,
              }}
            >
              <span style={{ marginRight: "8px" }}>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          )
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
