import React, { useEffect, useState } from "react";
import { getAllSupplier } from "../../api/supplierApi";

const EditModal = ({ product, onSave, onCancel }) => {
  const [productData, setProductData] = useState(product);
  const [suppliers, setSuppliers] = useState([]);

  const handleChange = (field, value) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    (async () => {
      const supplierData = await getAllSupplier();
      setSuppliers(supplierData);
    })();
  }, []);

  const isValid = () => {
    return (
      productData.Name &&
      productData.ProductType &&
      productData.Unit &&
      productData.Supplier
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-bold mb-4 text-black">Edit Product</h3>
        <input
          type="text"
          placeholder="Product Name"
          value={productData.Name || ""}
          onChange={(e) => handleChange("Name", e.target.value)}
          className="border border-black bg-white text-black px-4 py-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Product Type"
          value={productData.ProductType || ""}
          onChange={(e) => handleChange("ProductType", e.target.value)}
          className="border border-black bg-white text-black px-4 py-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Unit"
          value={productData.Unit || ""}
          onChange={(e) => handleChange("Unit", e.target.value)}
          className="border border-black bg-white text-black px-4 py-2 w-full mb-2"
        />
        <select
          value={productData.Supplier || ""}
          onChange={(e) => {
            handleChange("Supplier", e.target.value);
          }}
          className="border border-black bg-white text-black px-4 py-2 w-full mb-2"
        >
          <option value="" disabled>
            Select Supplier
          </option>
          {suppliers &&
            suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.Name}
              </option>
            ))}
        </select>

        <div className="flex justify-end space-x-2">
          <button onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={() => onSave(productData)}
            className={`${
              isValid() ? "bg-blue-500" : "bg-gray-400 cursor-not-allowed"
            } text-white px-4 py-2 rounded`}
            disabled={!isValid()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
