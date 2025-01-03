import React, { useState, useEffect } from "react";
import { db } from "../../core/utils/firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

const AddModal = ({setModalState, refetchMethod}) => {
  const [supplierData, setSupplierData] = useState({
    Name: "",
    Contact:"",
    Location: "",
  });

  const handleAdd = (field, value) => {
    setSupplierData((prev) => ({
      ...prev,
      [field] : value,
    }));
  }


  const handleSave = async () => {
    try {
        // Tạo mới supplier
        const newSupplier = {
            ...supplierData,
            CreateTime: serverTimestamp(),
            UpdateTime: serverTimestamp(),
        };

        // Lưu thông tin supplier vào Firestore
        await addDoc(collection(db, "Supplier"), newSupplier);

        // Refetch dữ liệu sau khi thêm mới
        onSave();
        closeModal();
    } catch (error) {
        console.error("Error adding new data", error);
    }
};


  const onSave = async () => {
    console.log("Data saved successfully, refetching supplier list...");
    await refetchMethod();
    console.log("Supplier list refetched successfully.");
  };

  const closeModal = () => {
    setModalState(false)
  }



  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <h3 className="text-lg font-bold mb-4 text-black">Add New Supplier</h3>
        <input
          type="text"
          placeholder="Supplier Name"
          value={supplierData.Name || ""}
          onChange={(e) => handleAdd("Name", e.target.value)}
          className="border border-black bg-white text-black px-4 py-2 w-full mb-2"
        />

        <input
          type="text"
          placeholder="Contact"
          value={supplierData.Contact || ""}
          onChange={(e) => handleAdd("Contact", e.target.value)}
          className="border border-black bg-white text-black px-4 py-2 w-full mb-2"
        />

        <input
          type="text"
          placeholder="Location"
          value={supplierData.Location || ""}
          onChange={(e) => handleAdd("Location", e.target.value)}
          className="border border-black bg-white text-black px-4 py-2 w-full mb-2"
        />

        <div className="mt-4 flex justify-end">
          <button
            onClick={closeModal}
            className="bg-red-500 text-white px-4 py-2 mr-2"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddModal;
