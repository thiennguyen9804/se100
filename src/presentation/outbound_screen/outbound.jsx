import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  Timestamp,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../core/utils/firebase"; // Nhớ import cấu hình Firebase
import EditModal from "./edit_modal"; // Giả sử bạn có sẵn các component này
import DeleteModal from "./delete_modal";
import { useQuery } from "@tanstack/react-query";

// Chuyển đổi Timestamp thành Date
function convertTimestampToDate(timestamp) {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toLocaleString();
  }
  return timestamp;
}

// Hàm lấy dữ liệu từ Firestore
const useOutboundReceipts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [OutboundReceipts, setOutboundReceipts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const OutboundReceiptCollection = collection(db, "OutboundReceipt");
        const staffCollection = collection(db, "Staff");
        const supplierCollection = collection(db, "Supplier");

        // Lấy dữ liệu từ các collection
        const OutboundReceiptSnapshot = await getDocs(OutboundReceiptCollection);
        const staffSnapshot = await getDocs(staffCollection);
        const supplierSnapshot = await getDocs(supplierCollection);

        // Chuyển đổi dữ liệu Staff và Supplier thành dạng key-value
        const staffs = {};
        staffSnapshot.forEach((doc) => {
          staffs[doc.data().StaffID] = doc.data().Name;
        });

        const suppliers = {};
        supplierSnapshot.forEach((doc) => {
          suppliers[doc.data().SupplierID] = doc.data().Name;
        });

        // Xử lý dữ liệu OutboundReceipt
        const OutboundReceiptList = OutboundReceiptSnapshot.docs.map((doc) => {
          const data = doc.data();
          
          return {
            id: doc.id,
            ...data,
            StaffName: staffs[data.id] || "N/A", // Lấy StaffName
            SupplierName: suppliers[data.id] || "N/A", // Lấy SupplierName

          };
        });

        setOutboundReceipts(OutboundReceiptList);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { OutboundReceipts, isLoading };
};

// Lưu chỉnh sửa
const saveEdit = async (
  updatedOutboundReceipt,
  setEditOutboundReceipt,
  refetch,
) => {
  if (!updatedOutboundReceipt) return;
  try {
    const OutboundReceiptRef = doc(db, "OutboundReceipt", updatedOutboundReceipt.id);
    await updateDoc(OutboundReceiptRef, {
      ...updatedOutboundReceipt,
      UpdateTime: Timestamp.now(),
    });
    setEditOutboundReceipt(null);
    refetch();
    alert("Outbound Receipt updated successfully!");
  } catch (error) {
    alert("Failed to update Outbound Receipt. Please try again.");
    console.error("Error updating Outbound Receipt:", error);
  }
};

// Xác nhận xóa
const confirmDelete = async (
  deleteOutboundReceiptId,
  setDeleteOutboundReceiptId,
  refetch,
) => {
  if (!deleteOutboundReceiptId) return;
  try {
    const OutboundReceiptRef = doc(db, "OutboundReceipt", deleteOutboundReceiptId);
    await deleteDoc(OutboundReceiptRef);
    setDeleteOutboundReceiptId(null);
    refetch();
    alert("Outbound Receipt deleted successfully!");
  } catch (error) {
    alert("Failed to delete Outbound Receipt. Please try again.");
    console.error("Error deleting Outbound Receipt:", error);
  }
};

const OutboundReceiptScreen = ({ isSidebarOpen }) => {
  const { data: currentUser } = useQuery({
      queryKey: ["currentUser"],
      enalble: false,});
  const { OutboundReceipts, isLoading } = useOutboundReceipts();
  const [searchTerm, setSearchTerm] = useState("");
  const [editOutboundReceipt, setEditOutboundReceipt] = useState(null);
  const [deleteOutboundReceiptId, setDeleteOutboundReceiptId] = useState(null);

  // Lọc Outbound Receipt theo từ khóa tìm kiếm
  const filteredOutboundReceipts = OutboundReceipts?.filter((item) => {
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

  console.log("Filtered Outbound Receipts:", filteredOutboundReceipts); // In ra dữ liệu trước khi render

  return (
    <div className="h-screen bg-white p-4 shadow-md overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        {/* Buttons */}
        <div className="space-x-2">
        {currentUser.Role === "manager" && (
          <button
            onClick={() => {
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            NEW
          </button>)}
          <button
            onClick={() => {
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
              <th className="border border-gray-300 px-4 py-2">Outbound ID</th>
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
            ) : filteredOutboundReceipts?.length > 0 ? (
              filteredOutboundReceipts.map((item, index) => (
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
                  {currentUser.Role === "manager" && (
                  <td className="border border-gray-300 px-4 py-2 flex">
                    <button
                      onClick={() => setEditOutboundReceipt(item)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteOutboundReceiptId(item.id)}
                      className="bg-red-500 text-white px-2 py-1 ml-2 rounded"
                    >
                      Delete
                    </button>
                  </td>)}
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
      {editOutboundReceipt && (
        <EditModal
          OutboundReceipt={editOutboundReceipt}
          onSave={(updatedOutboundReceipt) =>
            saveEdit(
              updatedOutboundReceipt,
              setEditOutboundReceipt,
              // Thêm logic refresh tại đây
            )
          }
          onCancel={() => setEditOutboundReceipt(null)}
        />
      )}
      {deleteOutboundReceiptId && (
        <DeleteModal
          onConfirm={() =>
            confirmDelete(
              deleteOutboundReceiptId,
              setDeleteOutboundReceiptId,
              // Thêm logic refresh tại đây
            )
          }
          onCancel={() => setDeleteOutboundReceiptId(null)}
        />
      )}
    </div>
  );
};

export default OutboundReceiptScreen;