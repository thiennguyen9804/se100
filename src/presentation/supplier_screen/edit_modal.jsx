import React, { useState } from "react";

const EditModal = ({ product, onSave, onCancel }) => {
  const [productData, setSupplierData] = useState(product);

  const handleChange = (field, value) => {
    setSupplierData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-bold mb-4 text-black">Edit Supplier Info</h3>

        <input
          type="text"
          placeholder="Supplier Name"
          value={productData.Name || ""}
          onChange={(e) => handleChange("Name", e.target.value)}
          className="border border-black bg-white text-black px-4 py-2 w-full mb-2"
        />

        <input
          type="text"
          placeholder="Contact"
          value={productData.Contact || ""}
          onChange={(e) => handleChange("Contact", e.target.value)}
          className="border border-black bg-white text-black px-4 py-2 w-full mb-2"
        />

        <input
          type="text"
          placeholder="Location"
          value={productData.Location || ""}
          onChange={(e) => handleChange("Location", e.target.value)}
          className="border border-black bg-white text-black px-4 py-2 w-full mb-2"
        />
        
        <div className="flex justify-end space-x-2">
          <button onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={() => onSave(productData)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
