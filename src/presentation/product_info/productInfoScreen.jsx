import React, { useState } from "react";
import { useInventory } from "../../hooks/useInventory";
import { Timestamp } from "firebase/firestore";
import {
  updateInventory,
  deleteInventory,
  addProductInfo,
} from "../../api/inventoryApi";
import EditModal from "./edit_modal";
import DeleteModal from "./delete_modal";
import { useQuery } from "@tanstack/react-query";
import AddModal from "./add_modal";

function convertTimestampToDate(timestamp) {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toLocaleString(); // Chuyển sang chuỗi hiển thị được
  }
  return timestamp; // Trả về nếu không phải là Timestamp
}

// Lưu chỉnh sửa
const saveEdit = async (updatedProduct, setEditProduct, refetch) => {
  if (!updatedProduct) return;

  // Thêm trường UpdateTime với giá trị thời gian hiện tại
  const updatedData = {
    ...updatedProduct,
    UpdateTime: Timestamp.now(), // Thời gian hiện tại
  };

  try {
    await updateInventory(updatedProduct.id, updatedData);
    setEditProduct(null);
    refetch();
    alert("Product updated successfully!");
  } catch (error) {
    alert("Failed to update product. Please try again.");
    console.error("Error updating product:", error);
  }
};

// Xác nhận xóa
const confirmDelete = async (deleteProductId, setDeleteProductId, refetch) => {
  if (!deleteProductId) return;
  try {
    await deleteInventory(deleteProductId);
    setDeleteProductId(null);
    refetch(); // Refresh dữ liệu
    alert("Product deleted successfully!");
  } catch (error) {
    alert("Failed to delete product. Please try again.");
    console.error("Error deleting product:", error);
  }
};

const handleAddNewClick = async (product, setAddProduct, refetch) => {
  try {
    product.Quantity = 0;
    product.CreateTime = Timestamp.now();
    product.UpdateTime = Timestamp.now();

    await addProductInfo(product);
    setAddProduct(null);
    refetch();
  } catch (error) {}
};

const ProductInfoScreen = ({ isSidebarOpen }) => {
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    enalble: false,
  });

  const { data: inventoryList, isLoading, refetch } = useInventory();
  const [searchTerm, setSearchTerm] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [addProduct, setAddProduct] = useState(null);

  // Lọc sản phẩm theo từ khóa tìm kiếm
  const filteredInventory = inventoryList?.filter((item) => {
    const searchLower = searchTerm.toLowerCase();

    // Kiểm tra từng thuộc tính của sản phẩm
    return (
      item.id?.toLowerCase().includes(searchLower) ||
      item.Name?.toLowerCase().includes(searchLower) ||
      item.ProductType?.toLowerCase().includes(searchLower) ||
      item.Quantity?.toString().includes(searchLower) ||
      item.Location?.toLowerCase().includes(searchLower) ||
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

  return (
    <div className="h-screen bg-white p-4 shadow-md overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        {/* Buttons */}

        <div className="space-x-2">
          <button
            onClick={() => setAddProduct(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            NEW
          </button>
          <button
            onClick={refetch} // Gọi refetch khi bấm Refresh
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
            onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật từ khóa tìm kiếm
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left text-black">
              <th className="border border-gray-300 px-4 py-2">Inventory ID</th>
              <th className="border border-gray-300 px-4 py-2">Product Name</th>
              <th className="border border-gray-300 px-4 py-2">Product Type</th>
              <th className="border border-gray-300 px-4 py-2">Unit</th>
              <th className="border border-gray-300 px-4 py-2">Supplier</th>
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
            ) : filteredInventory?.length > 0 ? (
              filteredInventory.map((item, index) => (
                <tr key={index} className="text-black">
                  <td className="border border-gray-300 px-4 py-2">
                    {item.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.Name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.ProductType}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.Unit}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.supplierName}
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
                  <td className="border-t border-gray-300 px-4 py-2 flex">
                    <button
                      onClick={() => setEditProduct(item)} // Hiện modal Edit
                      disabled={currentUser.Role !== "manager"} //disable if is not manager
                      title={
                        currentUser.Role !== "manager"
                          ? "You do not have permission to edit"
                          : ""
                      }
                      className={`px-2 py-1 ml-2 rounded ${
                        currentUser.Role === "manager"
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteProductId(item.id)} // Hiện modal Delete
                      disabled={currentUser.Role !== "manager"} //disable if is not manager
                      title={
                        currentUser.Role !== "manager"
                          ? "You do not have permission to edit"
                          : ""
                      }
                      className={`px-2 py-1 ml-2 rounded ${
                        currentUser.Role === "manager"
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Delete
                    </button>
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

      {/* Modals */}
      {editProduct && (
        <EditModal
          product={editProduct}
          onSave={(updatedProduct) =>
            saveEdit(updatedProduct, setEditProduct, refetch)
          }
          onCancel={() => setEditProduct(null)} // Đóng modal
        />
      )}
      {deleteProductId && (
        <DeleteModal
          onConfirm={() =>
            confirmDelete(deleteProductId, setDeleteProductId, refetch)
          }
          onCancel={() => setDeleteProductId(null)} // Đóng modal
        />
      )}
      {addProduct && (
        <AddModal
          product={addProduct}
          onSave={(addedProduct) =>
            handleAddNewClick(addedProduct, setAddProduct, refetch)
          }
          onCancel={() => setAddProduct(null)} // Đóng modal
        />
      )}
    </div>
  );
};

export default ProductInfoScreen;
