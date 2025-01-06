import React, { useState, useEffect } from "react";
import { db } from "../../core/utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { updateOutbound } from "../../api/outboundApi";

const EditOutboundReceiptModal = ({ OutboundReceipt, onSave, onCancel }) => {
  const [OutboundReceiptData, setOutboundReceiptData] = useState(OutboundReceipt);
  const [staffs, setStaffs] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    console.log("Received OutboundReceipt:", OutboundReceipt);
    setOutboundReceiptData(OutboundReceipt);
  }, [OutboundReceipt]);

  useEffect(() => {
    const fetchStaffsAndSuppliers = async () => {
      try {
        const staffCollection = collection(db, "Staff");
        const customerCollection = collection(db, "Customer");

        const staffSnapshot = await getDocs(staffCollection);
        const customerSnapshot = await getDocs(customerCollection);

        const staffList = staffSnapshot.docs.map((doc) => ({
          id: doc.id, // Sử dụng StaffID làm key
          Name: doc.data().Name,
        }));
        setStaffs(staffList);

        const customerList = customerSnapshot.docs.map((doc) => ({
          id: doc.id, // Sử dụng CustomerID làm key
          Name: doc.data().Name,
        }));
        setCustomers(customerList);
      } catch (error) {
        console.error("Error fetching staffs and customers:", error);
      }
    };

    fetchStaffsAndSuppliers();
  }, []);

  const handleChange = (field, value) => {
    if (value !== undefined && value !== null) {
      setOutboundReceiptData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      if (!OutboundReceiptData.id) {
        console.error("Outbound Receipt ID is missing.");
        return;
      }

      const updatedData = {
        StaffID: OutboundReceiptData.StaffID, // Gửi trực tiếp ID
        CustomerID: OutboundReceiptData.CustomerID, // Gửi trực tiếp ID
      };

      console.log("Data to be updated:", updatedData);

      if (typeof updatedData !== "object" || Object.keys(updatedData).length === 0) {
        console.error("Updated data is invalid.");
        return;
      }

      // Sử dụng updateOutbound từ outboundApi để cập nhật
      await updateOutbound(OutboundReceiptData.id, updatedData); // Gọi API với ID và dữ liệu
      onSave(); // Sau khi cập nhật xong, gọi onSave để đóng modal hoặc refresh danh sách

    } catch (error) {
      console.error("Error saving outbound receipt:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-bold mb-4 text-black">Edit Outbound Receipt</h3>

        {/* Staff Name dropdown */}
        <div>
          <select
            value={OutboundReceiptData.StaffID || ""}
            onChange={(e) => handleChange("StaffID", e.target.value)}
            className="border border-black bg-white text-black px-4 py-2 w-full mb-2"
          >
            <option value="">{OutboundReceiptData.StaffName || "Select Staff"}</option>
            {staffs.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.Name}
              </option>
            ))}
          </select>
        </div>

        {/* Customer Name dropdown */}
        <div>
          <select
            value={OutboundReceiptData.CustomerID || ""}
            onChange={(e) => handleChange("CustomerID", e.target.value)}
            className="border border-black bg-white text-black px-4 py-2 w-full mb-2"
          >
            <option value="">{OutboundReceiptData.CustomerName || "Select Customer"}</option> {/* Hiển thị Customer Name hiện tại */}
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.Name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          <button onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOutboundReceiptModal;
