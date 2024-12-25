import React from "react";

const TopBar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  // Nhận state và hàm cập nhật state từ App.jsx
  return (
    <div className="bg-gray-800 text-white px-4 py-2 flex items-center">
      {/* Top bar */}
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ backgroundColor: "white", padding: "8px" }}>
        {/* Nút Menu */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="black"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>
      <span className="ml-4 font-semibold text-lg">SE100</span> {/* Tên ứng dụng */}
    </div>
  );
};

export default TopBar;