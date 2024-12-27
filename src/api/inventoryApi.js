import { db } from "../core/utils/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export const getAllInventory = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "Inventory"));
    const fetchedData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
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
