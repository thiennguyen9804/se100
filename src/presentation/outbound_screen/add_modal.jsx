import React, { useState, useEffect } from "react";
import { db } from "../../core/utils/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const AddOutboundReceiptModal = () => {
  const [staffs, setStaffs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [outboundReceiptData, setOutboundReceiptData] = useState({
    StaffID: "",
    CustomerID: "",
    ProductList: [],
  });
  const [newProduct, setNewProduct] = useState({
    productId: "",
    quantity: 0,
  });
  const [productStock, setProductStock] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);

  // Fetch staffs, customers, and inventory
  useEffect(() => {
    const fetchData = async () => {
      try {
        const staffSnapshot = await getDocs(collection(db, "Staff"));
        const customerSnapshot = await getDocs(collection(db, "Customer"));
        const inventorySnapshot = await getDocs(collection(db, "Inventory"));

        setStaffs(
          staffSnapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().Name }))
        );
        setCustomers(
          customerSnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().Name,
          }))
        );
        setInventory(
          inventorySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Update product stock on product selection
  useEffect(() => {
    const selectedProduct = inventory.find((item) => item.id === newProduct.productId);
    setProductStock(selectedProduct ? selectedProduct.quantity : 0);
  }, [newProduct.productId, inventory]);

  const handleAddProduct = () => {
    if (!newProduct.productId || newProduct.quantity <= 0) {
      alert("Please fill in all product fields.");
      return;
    }

    if (newProduct.quantity > productStock) {
      setErrorMessage("Không được nhập quá số lượng hiện có");
      return;
    }

    setOutboundReceiptData((prevState) => ({
      ...prevState,
      ProductList: [...prevState.ProductList, newProduct],
    }));
    setNewProduct({ productId: "", quantity: 0 });
    setErrorMessage("");
    setIsProductFormOpen(false);
  };

  const handleSave = async () => {
    try {
      for (const product of outboundReceiptData.ProductList) {
        const productRef = doc(db, "Inventory", product.Product);
        const selectedProduct = inventory.find((item) => item.id === product.Product);

        if (selectedProduct) {
          const remainingQuantity = selectedProduct.quantity - product.Quantity;

          if (remainingQuantity > 0) {
            await updateDoc(productRef, { Quantity: remainingQuantity });
          } else if (remainingQuantity === 0) {
            await deleteDoc(productRef);
          }
        }
      }

      const newOutboundReceipt = {
        ...outboundReceiptData,
        CreateTime: serverTimestamp(),
        UpdateTime: serverTimestamp(),
      };

      await addDoc(collection(db, "OutboundReceipt"), newOutboundReceipt);
      console.log("Outbound receipt saved successfully.");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving outbound receipt:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!isModalOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <h3 className="text-lg font-bold mb-4 text-black">Add New Outbound Receipt</h3>

        <select
          value={outboundReceiptData.StaffID}
          onChange={(e) =>
            setOutboundReceiptData({ ...outboundReceiptData, StaffID: e.target.value })
          }
          className="border border-black bg-white text-black px-4 py-2 w-full mb-2"
        >
          <option value="">Select Staff</option>
          {staffs.map((staff) => (
            <option key={staff.id} value={staff.id}>
              {staff.name}
            </option>
          ))}
        </select>

        <select
          value={outboundReceiptData.CustomerID}
          onChange={(e) =>
            setOutboundReceiptData({ ...outboundReceiptData, CustomerID: e.target.value })
          }
          className="border border-black bg-white text-black px-4 py-2 w-full mb-2"
        >
          <option value="">Select Customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>

        <div>
          <button
            className="bg-green-500 text-white rounded-full p-2 mb-4"
            onClick={() => setIsProductFormOpen(true)}
          >
            +
          </button>
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Product</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {outboundReceiptData.ProductList.map((product, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{product.productId}</td>
                  <td className="border px-4 py-2">{product.quantity}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="text-red-500"
                      onClick={() => {
                        const updatedProductList = outboundReceiptData.ProductList.filter(
                          (_, idx) => idx !== index
                        );
                        setOutboundReceiptData({
                          ...outboundReceiptData,
                          ProductList: updatedProductList,
                        });
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isProductFormOpen && (
          <div className="mt-4">
            <select
              value={newProduct.productId}
              onChange={(e) =>
                setNewProduct({ ...newProduct, productId: e.target.value })
              }
              className="border border-black w-full mb-2 p-2"
            >
              <option value="">Select Product</option>
              {inventory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={newProduct.quantity}
              onChange={(e) =>
                setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })
              }
              placeholder="Quantity"
              className="border border-black w-full mb-2 p-2"
            />

            <label className="block text-sm text-gray-500 mb-2">
              Available Quantity: {productStock}
            </label>

            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}

            <button
              onClick={handleAddProduct}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={newProduct.quantity > productStock}
            >
              OK
            </button>
          </div>
        )}

        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={closeModal} className="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOutboundReceiptModal;
