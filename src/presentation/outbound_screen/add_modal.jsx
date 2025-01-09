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

const AddOutboundReceiptModal = ({onAddNew}) => {
  const [staffs, setStaffs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [editingProductIndex, setEditingProductIndex] = useState(null); // Thêm state mới
  const [outboundReceiptData, setOutboundReceiptData] = useState({
    StaffID: "",
    CustomerID: "",
    ProductList: [],
  });
  const [newProduct, setNewProduct] = useState({
    ProductID: "",
    Quantity: 0,
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
            name: doc.data().Name,
            Quantity: doc.data().Quantity,
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
    const selectedProduct = inventory.find(item => item.id === newProduct.ProductID);
    setProductStock(selectedProduct ? selectedProduct.Quantity : 0);
  }, [newProduct.ProductID, inventory]);

  const handleAddProduct = () => {
    if (!newProduct.ProductID || newProduct.Quantity <= 0) {
      alert("Please fill in all product fields.");
      return;
    }

    if (newProduct.Quantity > productStock) {
      alert("Không được nhập quá số lượng hiện có");
      return;
    }

    if (editingProductIndex !== null) {  // Trường hợp chỉnh sửa
      setOutboundReceiptData(prevState => {
        const updatedProductList = [...prevState.ProductList];
        updatedProductList[editingProductIndex] = { 
          ProductID: newProduct.ProductID, 
          Quantity: newProduct.Quantity 
        };
        return { ...prevState, ProductList: updatedProductList };
      });
      setEditingProductIndex(null); // Reset editingProductIndex
    } else { // Trường hợp thêm mới
      setOutboundReceiptData(prevState => ({
        ...prevState,
        ProductList: [
          ...prevState.ProductList,
          { ProductID: newProduct.ProductID, Quantity: newProduct.Quantity },
        ],
      }));
    }

    setNewProduct({ ProductID: "", Quantity: 0 });
    setErrorMessage("");
    setIsProductFormOpen(false);
  };

  const handleEditProduct = (index, product) => {
    setNewProduct({ ProductID: product.ProductID, Quantity: product.Quantity });
    setProductStock(inventory.find(item => item.id === product.ProductID)?.Quantity || 0);
    setIsProductFormOpen(true);
    setEditingProductIndex(index); // Lưu index của sản phẩm đang chỉnh sửa
  };

  const handleSave = async () => {
    try {
      const updatedInventory = [...inventory];
      for (const product of outboundReceiptData.ProductList) {
        const productIndex = updatedInventory.findIndex(
          (item) => item.id === product.ProductID
        );

        if (productIndex !== -1) {
          const selectedProduct = updatedInventory[productIndex];
          const remainingQuantity = selectedProduct.Quantity - product.Quantity;
            // Cập nhật số lượng kho nếu remainingQuantity = 0
        if (remainingQuantity === 0) {
          updatedInventory[productIndex].Quantity = 0;
          await updateDoc(doc(db, "Inventory", product.ProductID), {
            Quantity: 0,
          });
        } else {
          updatedInventory[productIndex].Quantity = remainingQuantity;
          await updateDoc(doc(db, "Inventory", product.ProductID), {
            Quantity: remainingQuantity,
          });
        }
      }
    }

      // Cập nhật state inventory sau khi đã xử lý xong
      setInventory(updatedInventory);

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

  // Lọc danh sách sản phẩm, loại bỏ những sản phẩm đã được chọn
  const availableInventory = inventory.filter(
    (item) => item.Quantity > 0 && !outboundReceiptData.ProductList.some(
      (product) => product.ProductID === item.id
    )
  );

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <h3 className="text-lg font-bold mb-4 text-black">
          Add New Outbound Receipt
        </h3>

        <select
          value={outboundReceiptData.StaffID}
          onChange={(e) =>
            setOutboundReceiptData({
              ...outboundReceiptData,
              StaffID: e.target.value,
            })
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
            setOutboundReceiptData({
              ...outboundReceiptData,
              CustomerID: e.target.value,
            })
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
                  <td className="border px-4 py-2">
                    {inventory.find((item) => item.id === product.ProductID)?.name ??""}
                  </td>
                  <td className="border px-4 py-2">{product.Quantity}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="text-blue-500 mr-2"      
                        onClick={() => handleEditProduct(index, product)}
                    >
                      Edit
                    </button>
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
              value={newProduct.ProductID}
              onChange={(e) => {
                setNewProduct({ ...newProduct, ProductID: e.target.value });
                // Cập nhật productStock ngay khi chọn sản phẩm
                const selectedProduct = inventory.find(
                  (item) => item.id === e.target.value
                );
                setProductStock(selectedProduct ? selectedProduct.Quantity : 0);
              }}
              className="border border-black w-full mb-2 p-2"
            >
              <option value="">Select Product</option>
              {availableInventory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>

            <input
              type="text"
              value={newProduct.Quantity}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  Quantity: parseInt(e.target.value, 10) || 0, // Xử lý trường hợp nhập không phải số
                })
              }
              placeholder="Quantity"
              className="border border-black w-full mb-2 p-2"
            />

            <label className="block text-sm text-gray-500 mb-2">
              Available Quantity: {productStock}
            </label>

            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

          <div className="flex justify-start space-x-2">
            <button
              onClick={() => {
                setNewProduct({ ProductID: "", Quantity: 0 });
                setErrorMessage("");
                setIsProductFormOpen(false);
              }}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleAddProduct}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={
                newProduct.Quantity > productStock || newProduct.Quantity <= 0
              }
            >
              OK
            </button>
          </div>
          </div>
        )}

        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={closeModal} className="bg-gray-300 px-4 py-2 rounded">
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

export default AddOutboundReceiptModal;