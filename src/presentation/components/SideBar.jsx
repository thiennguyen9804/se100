import React from "react";
import { Link } from "react-router"; // Sử dụng react-router-dom
import { useAuth } from "../../hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roles } from "../../core/utils/constants";


const Sidebar = ({ isSidebarOpen }) => {
  // Lấy thông tin user, phải đăng nhập trước khi lấylấy
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    enabled: false
  });
  
  console.log("🚀 ~ Sidebar ~ currentUser:", currentUser)
  let navigation
  if(!currentUser) {
    return;
  }
  // Truy cập tới các thuộc tính của user
  if(currentUser.Role === roles[0].value) {
    navigation = [
      { name: "Staff", icon: "👤", path: "/staff" },
    ];
  } else if(currentUser.Role === roles[1].value || currentUser.Role === roles[2].value) {
    navigation = [
      { name: "Inbound", icon: "📥", path: "/warehouse" },
      { name: "Outbound", icon: "📤", path: "/warehouse/outbound" },
      <hr key="hr1" />, // Thêm key cho các phần tử <hr />
      { name: "Inventory", icon: "📦", path: "/warehouse/inventory" },
      <hr key="hr2" />,
      { name: "Supplier", icon: "👨‍🌾", path: "/warehouse/supplier" },
      { name: "Customer", icon: "🤵", path: "/warehouse/customer" },
  ];

  }
  // navigation = [
  //   { name: "Inbound", icon: "📥", path: "/warehouse" },
  //   { name: "Outbound", icon: "📤", path: "/warehouse/outbound" },
  //   <hr key="hr1" />, // Thêm key cho các phần tử <hr />
  //   { name: "Inventory", icon: "📦", path: "/warehouse/inventory" },
  //   <hr key="hr2" />,
  //   { name: "Staff", icon: "👤", path: "/staff" },
  //   <hr key="hr3" />,
  //   { name: "Supplier", icon: "👨‍🌾", path: "/warehouse/supplier" },
  //   { name: "Customer", icon: "🤵", path: "/warehouse/customer" },
  // ];

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
            to={`${item.path}`}
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
