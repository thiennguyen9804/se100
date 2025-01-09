import React, { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../core/utils/firebase";
import EditModal from "./edit_modal";
import DeleteModal from "./delete_modal";
import AddOutboundReceiptModal from "./add_modal";
import ViewOutboundModal from "./view_modal";
import { useQuery } from "@tanstack/react-query";
import {
  addNewOutbound,
  deleteOutbound,
} from "../../api/outboundApi";

// Chuyển đổi Timestamp thành Date
function convertTimestampToDate(timestamp) {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toLocaleString();
  }
  return timestamp;
}

const OutboundReceiptScreen = ({ isSidebarOpen }) => {
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    enable: false,
  });
  const [outboundReceipts, setOutboundReceipts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editOutboundReceipt, setEditOutboundReceipt] = useState(null);
  const [deleteOutboundReceiptId, setDeleteOutboundReceiptId] = useState(null);
  const [selectedOutboundId, setSelectedOutboundId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const outboundReceiptCollection = collection(db, "OutboundReceipt");
      const staffCollection = collection(db, "Staff");
      const customerCollection = collection(db, "Customer");

      const [
        outboundReceiptSnapshot,
        staffSnapshot,
        customerSnapshot,
      ] = await Promise.all([
        getDocs(outboundReceiptCollection),
        getDocs(staffCollection),
        getDocs(customerCollection),
      ]);

      // Xử lý dữ liệu Staff
      const staffs = {};
      staffSnapshot.forEach((doc) => {
        staffs[doc.id] = doc.data().Name;
      });

      // Xử lý dữ liệu Customer
      const customers = {};
      customerSnapshot.forEach((doc) => {
        customers[doc.id] = doc.data().Name;
      });

      // Xử lý dữ liệu OutboundReceipt
      const outboundReceiptList = outboundReceiptSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          StaffName: staffs[data.StaffID] || "N/A", // Lấy StaffName
          CustomerName: customers[data.CustomerID] || "N/A", // Lấy CustomerName
        };
      });

      setOutboundReceipts(outboundReceiptList);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const handleSave = () => {
    // Làm mới dữ liệu sau khi lưu thành công
    fetchData();
  
    // Đóng modal sau khi lưu thành công
    setIsViewModalOpen(false); // Đảm bảo modal bị đóng
    setEditOutboundReceipt(null); // Đảm bảo set lại state để đóng modal
  };

  const handleAddNewClick = () => {
    setIsAddModalOpen(true);
  };

  const handleViewClick = (item) => {
    setSelectedOutboundId(item.id);
    setIsViewModalOpen(true);
  };

  const filteredOutboundReceipts = outboundReceipts?.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.id?.toLowerCase().includes(searchLower) ||
      item.StaffName?.toLowerCase().includes(searchLower) ||
      item.CustomerName?.toLowerCase().includes(searchLower) ||
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

  const confirmDelete = async (deleteOutboundReceiptId, setDeleteOutboundReceiptId) => {
    if (!deleteOutboundReceiptId) return;
    try {
      await deleteOutbound(deleteOutboundReceiptId);
      setDeleteOutboundReceiptId(null);
      fetchData();
      alert("Outbound Receipt deleted successfully!");
    } catch (error) {
      alert("Failed to delete Outbound Receipt. Please try again.");
      console.error("Error deleting Outbound Receipt:", error);
    }
  };

  const handleAddNewOutbound = async (newOutboundData) => {
    try {
      await addNewOutbound(newOutboundData);
      fetchData();
      setIsAddModalOpen(false);
      alert("Outbound Receipt added successfully!");
    } catch (error) {
      alert("Failed to add Outbound Receipt. Please try again.");
      console.error("Error adding Outbound Receipt:", error);
    }
  };

  return (
    <div className="h-screen bg-white p-4 shadow-md overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
            <button
              onClick={handleAddNewClick}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              NEW
            </button>
          <button
            onClick={fetchData}
            className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            REFRESH
          </button>
        </div>
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

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left text-black">
              <th className="border border-gray-300 px-4 py-2">Outbound ID</th>
              <th className="border border-gray-300 px-4 py-2">Staff Name</th>
              <th className="border border-gray-300 px-4 py-2">Customer Name</th>
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
                  <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.StaffName}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.CustomerName}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.CreateTime ? convertTimestampToDate(item.CreateTime) : "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.UpdateTime ? convertTimestampToDate(item.UpdateTime) : "N/A"}
                  </td>
                    <td className="border border-gray-300 px-4 py-2 flex">
                      <button
                        onClick={() => handleViewClick(item)}
                        className="bg-blue-500 text-white px-2 py-1 ml-2 rounded"
                      >
                        View
                      </button>
                      {currentUser.Role !== "employee" && (
                        <>
                      <button
                        onClick={() => setEditOutboundReceipt(item)}
                        className="bg-blue-500 text-white px-2 py-1 ml-2 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteOutboundReceiptId(item.id)}
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

      {isViewModalOpen && (
        <ViewOutboundModal
          outboundId={selectedOutboundId}
          onCancel={() => setIsViewModalOpen(false)}
        />
      )}
      {editOutboundReceipt && (
        <EditModal
        OutboundReceipt={editOutboundReceipt}
        onSave={handleSave}
        onCancel={() => setEditOutboundReceipt(null)}
      />
      )}
      {deleteOutboundReceiptId && (
        <DeleteModal
          onConfirm={() =>
            confirmDelete(deleteOutboundReceiptId, setDeleteOutboundReceiptId)
          }
          onCancel={() => setDeleteOutboundReceiptId(null)}
        />
      )}
      {isAddModalOpen && (
        <AddOutboundReceiptModal
          onAddNew={handleAddNewOutbound}
        />
      )}
    </div>
  );
};

export default OutboundReceiptScreen;
