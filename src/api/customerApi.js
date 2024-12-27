import { db } from "../core/utils/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export const getAllCustomer = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "Customer"));
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
export const updateCustomer = async (customerID, updatedData) => {
  try {
    await updateDoc(doc(db, "Customer", customerID), updatedData);
    console.log("Data updated successfully!");
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
};

// Xóa dữ liệu
export const deleteCustomer = async (customerID) => {
  try {
    await deleteDoc(doc(db, "Customer", customerID));
    console.log("Data deleted successfully!");
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
};
