import React from "react";
import { useNavigate } from "react-router-dom";

const TopBar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xử lý logic log out nếu cần, ví dụ: xóa token hoặc state của người dùng
    // localStorage.removeItem('token'); // Ví dụ nếu dùng token trong localStorage
    navigate("/"); // Chuyển hướng về màn hình login
  };
  // Nhận state và hàm cập nhật state từ App.jsx
  return (
    <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between">
      {/* Top bar */}
      <div className="flex items-center">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{ backgroundColor: "white", padding: "8px" }}
        >
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
        <span className="ml-4 font-semibold text-lg">SE100</span>{" "}
        {/* Tên ứng dụng */}
      </div>

      {/* Nút Log Out */}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Log Out
      </button>
    </div>
  );
};

export default TopBar;
