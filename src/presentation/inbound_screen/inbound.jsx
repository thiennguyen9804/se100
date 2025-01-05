import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../core/utils/firebase"; 
import EditInboundReceiptModal from "./edit_modal";
import { updateInbound, deleteInbound, addNewInbound } from "../../api/inboundApi";
import DeleteInboundReceiptModal from "./delete_modal";
import ViewInboundModal from "./view_modal";
import AddInboundReceiptModal from "./add_modal";
import { useQuery } from "@tanstack/react-query";

// Chuyển đổi Timestamp thành Date
function convertTimestampToDate(timestamp) {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toLocaleString();
  }
  return timestamp;
}

// Lưu chỉnh sửa
const saveEdit = async (updatedInboundReceipt, setEditInboundReceipt, refetch) => {
  if (!updatedInboundReceipt) return;

  // Thêm trường UpdateTime với giá trị thời gian hiện tại
  const updatedData = {
    StaffID: updatedInboundReceipt.StaffID,
    SupplierID: updatedInboundReceipt.SupplierID,
    UpdateTime: Timestamp.now(), // Thời gian hiện tại
  };

  try {
    await updateInbound(updatedInboundReceipt.id, updatedData); 
    setEditInboundReceipt(null);
    refetch();
    alert("Inbound Receipt updated successfully!");
  } catch (error) {
    alert("Failed to update Inbound Receipt. Please try again.");
    console.error("Error updating Inbound Receipt:", error);
  }
};

// Xác nhận xóa
const confirmDelete = async (
  deleteInboundReceipt,
  setDeleteInboundReceipt,
  refetch,
) => {
  if (!deleteInboundReceipt) return;
  try {
    await deleteInbound(deleteInboundReceipt.id);
    setDeleteInboundReceipt(null);
    refetch();
    alert("Inbound Receipt deleted successfully!");
  } catch (error) {
    alert("Failed to delete Inbound Receipt. Please try again.");
    console.error("Error deleting Inbound Receipt:", error);
  }
};

// Tải thông tin lên listview
const useInbound = () => {
  const [inboundReceipts, setInboundReceipts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = async () => {
    setIsLoading(true);
    try {
      const inboundReceiptCollection = collection(db, "InboundReceipt");
      const staffCollection = collection(db, "Staff");
      const supplierCollection = collection(db, "Supplier");

      // Lấy dữ liệu từ các collection
      const inboundReceiptSnapshot = await getDocs(inboundReceiptCollection);
      const staffSnapshot = await getDocs(staffCollection);
      const supplierSnapshot = await getDocs(supplierCollection);

      // Chuyển đổi dữ liệu Staff và Supplier thành dạng key-value
      const staffs = {};
      staffSnapshot.forEach((doc) => {
        staffs[doc.id] = doc.data().Name;
      });

      const suppliers = {};
      supplierSnapshot.forEach((doc) => {
        suppliers[doc.data().id] = doc.data().Name;
      });

      // Xử lý dữ liệu InboundReceipt
      const inboundReceiptList = inboundReceiptSnapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          ...data,
          StaffName: staffs[data.StaffID] || "N/A", // Lấy StaffName
          SupplierName: suppliers[data.SupplierID] || "N/A", // Lấy SupplierName
        };
      });

      setInboundReceipts(inboundReceiptList);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { inboundReceipts, isLoading, refetch };
};

const InboundReceiptScreen = ({ isSidebarOpen }) => {
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    enalble: false,});
  const { inboundReceipts, isLoading, refetch } = useInbound();
  const [searchTerm, setSearchTerm] = useState("");
  const [editInboundReceipt, setEditInboundReceipt] = useState(null);
  const [deleteInboundReceipt, setDeleteInboundReceipt] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedInboundId, setSelectedInboundId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Thêm state để điều khiển modal

  // Lọc Inbound Receipt theo từ khóa tìm kiếm
  const filteredInboundReceipts = inboundReceipts?.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.id?.toLowerCase().includes(searchLower) ||
      item.StaffName?.toLowerCase().includes(searchLower) ||
      item.SupplierName?.toLowerCase().includes(searchLower) ||
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

  const handleViewClick = (id) => {
    setSelectedInboundId(id); // Lưu ID inbound được chọn
    setIsViewModalOpen(true); // Hiển thị modal
  };

  const handleAddNewClick = () => {
    setIsAddModalOpen(true); // Mở modal khi nhấn "NEW"
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false); // Đóng modal
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedInboundId(null); // Reset ID khi đóng modal
  };

  const handleAddNewInbound = async (newInboundData) => {
    try {
      await addNewInbound(newInboundData, refetch);
      closeAddModal(); // Đóng modal sau khi thêm mới
    } catch (error) {
      console.error("Error adding inbound receipt:", error);
    }
  };

  return (
    <div className="h-screen bg-white p-4 shadow-md overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        {/* Buttons */}
        <div className="space-x-2">
          <button
            onClick={handleAddNewClick}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            NEW
          </button>
          <button
            onClick={() => {
              refetch(); 
            }}
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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left text-black">
              <th className="border border-gray-300 px-4 py-2">Inbound ID</th>
              <th className="border border-gray-300 px-4 py-2">Staff Name</th>
              <th className="border border-gray-300 px-4 py-2">Supplier Name</th>
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
            ) : filteredInboundReceipts?.length > 0 ? (
              filteredInboundReceipts.map((item, index) => (
                <tr key={index} className="text-black">
                  <td className="border border-gray-300 px-4 py-2">
                    {item.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.StaffName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.SupplierName}
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
                      onClick={() => handleViewClick(item.id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      View
                    </button>
                    {currentUser.Role !== "employee" && (
                      <>
                        <button
                          onClick={() => setEditInboundReceipt(item)}
                          className="bg-blue-500 text-white px-2 py-1 ml-2 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteInboundReceipt(item)}
                          className="bg-red-500 text-white px-2 py-1 ml-2 rounded"
                        >
                          Delete
                        </button>
                      </>
                    )}
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
      {editInboundReceipt && (
        <EditInboundReceiptModal
          inboundReceipt={editInboundReceipt}
          onSave={(updatedInboundReceipt) => saveEdit(updatedInboundReceipt, setEditInboundReceipt, refetch)} 
          onCancel={() => setEditInboundReceipt(null)}
        />
      )}
      {deleteInboundReceipt && (
        <DeleteInboundReceiptModal
          onConfirm={() => confirmDelete(deleteInboundReceipt, setDeleteInboundReceipt, refetch)}
          onCancel={() => setDeleteInboundReceipt(null)}
        />
      )}
      {isViewModalOpen && (
        <ViewInboundModal
          inboundId={selectedInboundId}
          closeModal={closeViewModal}
        />
      )}
      {isAddModalOpen && (
        <AddInboundReceiptModal
          onAddNew={(newInboundData) => handleAddNewInbound(newInboundData)}
          onCancel={closeAddModal}        // Hàm đóng modal
        />
      )}
    </div>
  );
};

export default InboundReceiptScreen;
