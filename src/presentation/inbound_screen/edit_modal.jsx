import React, { useState, useEffect } from "react";
import { db } from "../../core/utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { updateInbound } from "../../api/inboundApi";

const EditInboundReceiptModal = ({ inboundReceipt, onSave, onCancel }) => {
  const [inboundReceiptData, setInboundReceiptData] = useState(inboundReceipt);
  const [staffs, setStaffs] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    setInboundReceiptData(inboundReceipt);
  }, [inboundReceipt]);

  useEffect(() => {
    const fetchStaffsAndSuppliers = async () => {
      try {
        const staffCollection = collection(db, "Staff");
        const supplierCollection = collection(db, "Supplier");

        const staffSnapshot = await getDocs(staffCollection);
        const supplierSnapshot = await getDocs(supplierCollection);

        const staffList = staffSnapshot.docs.map((doc) => ({
          id: doc.id, // Sử dụng StaffID làm key
          Name: doc.data().Name,
        }));
        setStaffs(staffList);

        const supplierList = supplierSnapshot.docs.map((doc) => ({
          id: doc.data().id, // Sử dụng SupplierID làm key
          Name: doc.data().Name,
        }));
        setSuppliers(supplierList);
      } catch (error) {
        console.error("Error fetching staffs and suppliers:", error);
      }
    };

    fetchStaffsAndSuppliers();
  }, []);

  const handleChange = (field, value) => {
    if (value !== undefined && value !== null) {
      setInboundReceiptData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        StaffID: inboundReceiptData.StaffID, // Gửi trực tiếp ID
        SupplierID: inboundReceiptData.SupplierID, // Gửi trực tiếp ID
      };
  
      await updateInbound(inboundReceipt.id, updatedData); // Sử dụng API để cập nhật
      onSave({ ...inboundReceiptData });
    } catch (error) {
      console.error("Error updating inbound receipt:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-bold mb-4 text-black">Edit Inbound Receipt</h3>

        {/* Staff Name dropdown */}
        <div>
          <select
            value={inboundReceiptData.StaffID || ""}
            onChange={(e) => handleChange("StaffID", e.target.value)}
            className="border border-black bg-white text-black px-4 py-2 w-full mb-2"
          >
            <option value="">{inboundReceiptData.StaffName || "Select Staff"}</option> 
    {staffs.map((staff) => (
      <option key={staff.id} value={staff.id}>
        {staff.Name}
      </option>
            ))}
          </select>
        </div>

        {/* Supplier Name dropdown */}
        <div>
          <select
           value={inboundReceiptData.SupplierID || ""}
            onChange={(e) => handleChange("SupplierID", e.target.value)}
            className="border border-black bg-white text-black px-4 py-2 w-full mb-2"
          >
            <option value="">{inboundReceiptData.SupplierName || "Select Supplier"}</option> 
    {suppliers.map((supplier) => (
      <option key={supplier.id} value={supplier.id}>
        {supplier.Name}
        
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

export default EditInboundReceiptModal;
