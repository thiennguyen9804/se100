import React, { useState } from "react";
import { useCustomer } from "../../hooks/useCustomer";
import { Timestamp } from "firebase/firestore";
import { updateCustomer, deleteCustomer } from "../../api/customerApi";
import EditModal from "./edit_modal";
import DeleteModal from "./delete_modal";
import AddModal from "./add_modal";

function convertTimestampToDate(timestamp) {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toLocaleString(); // Chuyển sang chuỗi hiển thị được
  }
  return timestamp; // Trả về nếu không phải là Timestamp
}

// Lưu chỉnh sửa
const saveEdit = async (updatedCustomer, setEditCustomer, refetch) => {
  if (!updatedCustomer) return;

  // Thêm trường UpdateTime với giá trị thời gian hiện tại
  const updatedData = {
    ...updatedCustomer,
    UpdateTime: Timestamp.now(), // Thời gian hiện tại
  };

  try {
    await updateCustomer(updatedCustomer.id, updatedData);
    setEditCustomer(null);
    refetch(); // Refresh dữ liệu
    alert("Data updated successfully!");
  } catch (error) {
    alert("Failed to update data. Please try again.");
    console.error("Error updating data:", error);
  }
};

// Xác nhận xóa
const confirmDelete = async (deleteCustomerID, setDeleteCustomerID, refetch) => {
  if (!deleteCustomerID) return;
  try {
    await deleteCustomer(deleteCustomerID);
    setDeleteCustomerID(null);
    refetch(); // Refresh dữ liệu
    alert("Data deleted successfully!");
  } catch (error) {
    alert("Failed to delete data. Please try again.");
    console.error("Error deleting data:", error);
  }
};

const CustomerScreen = ({ isSidebarOpen }) => {
  const { data: CustomerList, isLoading, refetch } = useCustomer();
  const [searchTerm, setSearchTerm] = useState("");
  const [editCustomer, setEditCustomer] = useState(null);
  const [deleteCustomerID, setDeleteCustomerID] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Lọc sản phẩm theo từ khóa tìm kiếm
  const filteredInventory = CustomerList?.filter((item) => {
    const searchLower = searchTerm.toLowerCase();

    // Kiểm tra từng thuộc tính của sản phẩm
    return (
      item.id?.toLowerCase().includes(searchLower) ||
      item.Name?.toLowerCase().includes(searchLower) ||
      item.Contact?.toLowerCase().includes(searchLower) ||
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

  const onAddClick = () => {
    setIsAddModalOpen(true)
  }

  return (
    <div className="h-screen bg-white p-4 shadow-md overflow-x-auto">
      <div className="flex justify-between items-center mb-4">

        {/* Buttons */}
        <div className="space-x-2">
          <button
            onClick={onAddClick}
            className="bg-blue-500 text-white px-4 py-2 rounded-md">
            + NEW
          </button>

          <button
            onClick={refetch}
            className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            REFRESH
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="border border-gray-300 rounded-md px-4 py-2 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left text-black">
              <th className="border border-gray-300 px-4 py-2">Customer Name</th>
              <th className="border border-gray-300 px-4 py-2">Contact</th>
              <th className="border border-gray-300 px-4 py-2">Location</th>
              <th className="border border-gray-300 px-4 py-2">Create Time</th>
              <th className="border border-gray-300 px-4 py-2">Update Time</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
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
                    {item.Name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.Contact}
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
                    <button
                      onClick={() => setEditCustomer(item)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteCustomerID(item.id)}
                      className="bg-red-500 text-white px-2 py-1 ml-2 rounded"
                    >
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

      {/* Modals */}
      {editCustomer && (
        <EditModal
          product={editCustomer}
          onSave={(updatedCustomer) =>
            saveEdit(updatedCustomer, setEditCustomer, refetch)
          }
          onCancel={() => setEditCustomer(null)}
        />
      )}
      {deleteCustomerID && (
        <DeleteModal
          onConfirm={() =>
            confirmDelete(deleteCustomerID, setDeleteCustomerID, refetch)
          }
          onCancel={() => setDeleteCustomerID(null)}
        />
      )}
      {isAddModalOpen && (
        <AddModal
        setModalState={setIsAddModalOpen}
        refetchMethod={refetch}
        />
      )}
    </div>
  );
};

export default CustomerScreen;