import React, { useState, useEffect } from "react";
import { db } from "../../core/utils/firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

const AddInboundReceiptModal = () => {
  const [staffs, setStaffs] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [inboundReceiptData, setInboundReceiptData] = useState({
    StaffID: "",
    SupplierID: "",
    ProductList: [],
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    location: "",
    quantity: 0,
    productType: "",
  });
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [statusMessage, setStatusMessage] = useState(""); // Thêm state để theo dõi trạng thái
  const [inboundReceipts, setInboundReceipts] = useState([]); // State để lưu danh sách inbound receipts

  // Fetch staffs and suppliers
  useEffect(() => {
    const fetchStaffsAndSuppliers = async () => {
      try {
        const staffSnapshot = await getDocs(collection(db, "Staff"));
        const supplierSnapshot = await getDocs(collection(db, "Supplier"));
        setStaffs(
          staffSnapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().Name }))
        );
        setSuppliers(
          supplierSnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().Name,
          }))
        );
      } catch (error) {
        console.error("Error fetching staffs and suppliers:", error);
      }
    };
    fetchStaffsAndSuppliers();
  }, []);

  // Fetch inbound receipts
  const fetchInboundReceipts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "InboundReceipt"));
      const receipts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInboundReceipts(receipts); // Cập nhật lại danh sách inbound receipts
    } catch (error) {
      console.error("Error fetching inbound receipts:", error);
    }
  };

  const handleAddProduct = () => {
    if (
      !newProduct.name ||
      !newProduct.location ||
      !newProduct.productType ||
      newProduct.quantity <= 0
    ) {
      alert("Please fill in all product fields.");
      return;
    }
    setInboundReceiptData((prevState) => ({
      ...prevState,
      ProductList: [...prevState.ProductList, newProduct],
    }));
    setNewProduct({ name: "", location: "", quantity: 0, productType: "" });
    setIsProductFormOpen(false);
  };

  const handleSave = async () => {
    try {
        const inventoryCollection = collection(db, "Inventory");
        const productListWithIds = []; // Danh sách để lưu thông tin id và quantity

        // Thêm từng sản phẩm vào Inventory và lưu id trả về từ Firestore
        for (const product of inboundReceiptData.ProductList) {
            const productDoc = await addDoc(inventoryCollection, {
                Name: product.name,
                Location: product.location,
                Quantity: product.quantity,
                ProductType: product.productType,
                CreateTime: serverTimestamp(),
                UpdateTime: serverTimestamp(),
            });
            productListWithIds.push({
                Product: productDoc.id, // Lấy id do Firestore tự sinh
                Quantity: product.quantity, // Lưu số lượng
            });
        }

        // Tạo inbound receipt với ProductList đã cập nhật id từ Inventory
        const newInboundReceipt = {
            ...inboundReceiptData,
            ProductList: productListWithIds, // Cập nhật ProductList với id và quantity
            CreateTime: serverTimestamp(),
            UpdateTime: serverTimestamp(),
        };

        // Lưu inbound receipt vào Firestore
        await addDoc(collection(db, "InboundReceipt"), newInboundReceipt);

        // Refetch dữ liệu sau khi thêm mới
        onSave();
        closeModal(); // Đóng modal
    } catch (error) {
        console.error("Error adding inbound receipt:", error);
    }
};


  const onSave = async () => {
    console.log("Data saved successfully, refetching inbound list...");
    // Thực hiện refetch danh sách inbound receipts
    await fetchInboundReceipts();
    console.log("Inbound list refetched successfully.");
  };

  const closeModal = () => {
    const isModified = inboundReceiptData.ProductList.length > 0;
    if (isModified) {
      const confirmExit = window.confirm(
        "Thông tin chưa được lưu, bạn muốn thoát chứ?"
      );
      if (confirmExit) {
        setIsModalOpen(false);
      }
    } else {
      setIsModalOpen(false);
    }
  };

  if (!isModalOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <h3 className="text-lg font-bold mb-4 text-black">Add New Inbound Receipt</h3>

        {/* Các phần tử nhập liệu */}
        <select
          value={inboundReceiptData.StaffID}
          onChange={(e) =>
            setInboundReceiptData({ ...inboundReceiptData, StaffID: e.target.value })
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
          value={inboundReceiptData.SupplierID}
          onChange={(e) =>
            setInboundReceiptData({ ...inboundReceiptData, SupplierID: e.target.value })
          }
          className="border border-black bg-white text-black px-4 py-2 w-full mb-2"
        >
          <option value="">Select Supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>

        {/* Các sản phẩm đã chọn */}
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
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Location</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Product Type</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {inboundReceiptData.ProductList.map((product, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{product.name}</td>
                  <td className="border px-4 py-2">{product.location}</td>
                  <td className="border px-4 py-2">{product.quantity}</td>
                  <td className="border px-4 py-2">{product.productType}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="text-red-500"
                      onClick={() => {
                        const updatedProductList = inboundReceiptData.ProductList.filter(
                          (_, idx) => idx !== index
                        );
                        setInboundReceiptData({
                          ...inboundReceiptData,
                          ProductList: updatedProductList,
                        });
                      }}
                    >
                      Delete
                    </button>
                    <button className="ml-2 text-blue-500">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isProductFormOpen && (
          <div className="mt-4">
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              placeholder="Product Name"
              className="border border-black w-full mb-2 p-2"
            />
            <input
              type="text"
              value={newProduct.location}
              onChange={(e) =>
                setNewProduct({ ...newProduct, location: e.target.value })
              }
              placeholder="Location"
              className="border border-black w-full mb-2 p-2"
            />
            <input
              type="number"
              value={newProduct.quantity}
              onChange={(e) =>
                setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })
              }
              placeholder="Quantity"
              className="border border-black w-full mb-2 p-2"
            />
            <input
              type="text"
              value={newProduct.productType}
              onChange={(e) =>
                setNewProduct({ ...newProduct, productType: e.target.value })
              }
              placeholder="Product Type"
              className="border border-black w-full mb-2 p-2"
            />
            <div className="mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 mr-2"
                onClick={handleAddProduct}
              >
                Add Product
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2"
                onClick={() => setIsProductFormOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

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

export default AddInboundReceiptModal;
