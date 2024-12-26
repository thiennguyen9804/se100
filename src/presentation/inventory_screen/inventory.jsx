import React, { useState } from "react";
import { useInventory } from "../../hooks/useInventory";
import { Timestamp } from "firebase/firestore";

function convertTimestampToDate(timestamp) {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toLocaleString(); // Chuyển sang chuỗi hiển thị được
  }
  return timestamp; // Trả về nếu không phải là Timestamp
}

const InventoryScreen = ({ isSidebarOpen }) => {
  const { data: inventoryList, isLoading, refetch } = useInventory();
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc sản phẩm theo từ khóa tìm kiếm
  const filteredInventory = inventoryList?.filter((item) => {
    const searchLower = searchTerm.toLowerCase();

    // Kiểm tra từng thuộc tính của sản phẩm
    return (
      item.id?.toLowerCase().includes(searchLower) ||
      item.Name?.toLowerCase().includes(searchLower) ||
      item.ProductType?.toLowerCase().includes(searchLower) ||
      item.Quantity?.toString().includes(searchLower) ||
      item.Location?.toLowerCase().includes(searchLower) ||
      (item.CreateTime &&
        convertTimestampToDate(item.CreateTime)
          .toLowerCase()
          .includes(searchLower)) ||
      (item.UpdateTime &&
        convertTimestampToDate(item.UpdateTime)
          .toLowerCase()
          .includes(searchLower))
    );
  });

  return (
    <div className="h-screen bg-white p-4 shadow-md overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        {/* Buttons */}
        <div className="space-x-2">
          <button
            onClick={refetch} // Gọi refetch khi bấm Refresh
            className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            REFRESH
          </button>
        </div>
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search Word"
            className="border border-gray-300 rounded-md px-4 py-2 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật từ khóa tìm kiếm
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left text-black">
              <th className="border border-gray-300 px-4 py-2">Inventory ID</th>
              <th className="border border-gray-300 px-4 py-2">Product Name</th>
              <th className="border border-gray-300 px-4 py-2">Product Type</th>
              <th className="border border-gray-300 px-4 py-2">Quantity</th>
              <th className="border border-gray-300 px-4 py-2">Location</th>
              <th className="border border-gray-300 px-4 py-2">Create Time</th>
              <th className="border border-gray-300 px-4 py-2">Update Time</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr className="text-gray-600">
                <td className="border border-gray-300 px-4 py-2" colSpan={10}>
                  Loading...
                </td>
              </tr>
            ) : filteredInventory?.length > 0 ? (
              filteredInventory.map((item, index) => (
                <tr key={index} className="text-black">
                  <td className="border border-gray-300 px-4 py-2">
                    {item.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.Name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.ProductType}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.Quantity}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.Location}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.CreateTime
                      ? convertTimestampToDate(item.CreateTime)
                      : "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.UpdateTime
                      ? convertTimestampToDate(item.UpdateTime)
                      : "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 flex">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded">
                      Edit
                    </button>
                    <button className="bg-red-500 text-white px-2 py-1 ml-2 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-gray-600">
                <td className="border border-gray-300 px-4 py-2" colSpan={10}>
                  NO MORE DATA
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryScreen;
