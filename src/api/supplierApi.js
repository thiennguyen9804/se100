import { db } from "../core/utils/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export const getAllSupplier = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "Supplier"));
    const fetchedData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return fetchedData;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Cập nhật dữ liệu

export const updateSupplier = async (supplierID, updatedData) => {
  const docRef = doc(db, "Supplier", supplierID);
  try {
    await updateDoc(docRef, updatedData);
    console.log("Data updated successfully!");
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
};

// Xóa dữ liệu
export const deleteSupplier = async (supplierID) => {
  try {
    await deleteDoc(doc(db, "Supplier", supplierID));
    console.log("Data deleted successfully!");
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
};
