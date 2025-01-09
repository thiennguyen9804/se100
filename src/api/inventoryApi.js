import { db } from "../core/utils/firebase";
import {
  collection,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";

export const getAllInventory = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "Inventory"));
    const fetchedData = await Promise.all(
      querySnapshot.docs.map(async (document) => {
        const inventoryData = { id: document.id, ...document.data() };
        if (inventoryData.Supplier) {
          try {
            // Lấy thông tin từ collection Suppliers
            const supplierDoc = await getDoc(
              doc(db, "Supplier", inventoryData.Supplier)
            );
            if (supplierDoc.exists()) {
              inventoryData.supplierName = supplierDoc.data().Name; // Gắn tên supplier
            } else {
              console.warn(
                `Supplier with ID ${inventoryData.Supplier} not found.`
              );
              inventoryData.supplierName = "Unknown Supplier";
            }
          } catch (supplierError) {
            console.error("Error fetching supplier data:", supplierError);
            inventoryData.supplierName = "Error fetching supplier";
          }
        }
        return inventoryData;
      })
    );
    return fetchedData;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Cập nhật sản phẩm
export const updateInventory = async (productId, updatedData) => {
  try {
    await updateDoc(doc(db, "Inventory", productId), updatedData);
    console.log("Product updated successfully!");
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Xóa sản phẩm
export const deleteInventory = async (productId) => {
  try {
    await deleteDoc(doc(db, "Inventory", productId));
    console.log("Product deleted successfully!");
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const getSupplierByID = async (id) => {
  try {
    const receiptRef = doc(db, "InboundReceipt", receiptId);
    const docSnap = await getDoc(doc);
  } catch (error) {}
}; //if need

export const addProductInfo = async (product) => {
  try {
    const ref = collection(db, "Inventory");
    await addDoc(ref, product);
  } catch (error) {}
};
