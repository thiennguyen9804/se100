import { db } from "../core/utils/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export const getAllOutbound = async () => {
  try {
    const outboundReceiptCollection = collection(db, "OutboundReceipt");
    const staffCollection = collection(db, "Staff");
    const customerCollection = collection(db, "Customer");

    const [
      outboundReceiptSnapshot,
      staffSnapshot,
      customerSnapshot,
    ] = await Promise.all([
      getDocs(outboundReceiptCollection),
      getDocs(staffCollection),
      getDocs(customerCollection),
    ]);

    const staffs = {};
    staffSnapshot.forEach((doc) => {
      staffs[doc.id] = doc.data().Name; // Sử dụng StaffID làm key
    });

    const customers = {};
    customerSnapshot.forEach((doc) => {
      customers[doc.id] = doc.data().Name; // Sử dụng CustomerID làm key
    });

    const fetchedData = outboundReceiptSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        StaffName: staffs[data.StaffID] || "N/A",
        CustomerName: customers[data.CustomerID] || "N/A",
      };
    });

    return fetchedData;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Hàm thêm outbound mới
export const addNewOutbound = async (newOutboundData) => {
  try {
    const outboundReceiptRef = collection(db, "OutboundReceipt");
    const docRef = await addDoc(outboundReceiptRef, newOutboundData);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id; // Trả về ID của tài liệu vừa thêm
  } catch (error) {
    console.error("Error adding outbound receipt: ", error);
    throw new Error("Error adding outbound receipt");
  }
};

// Hàm cập nhật thông tin OutboundReceipt
export const updateOutbound = async (receiptId, updatedData) => {
  try {
    if (!receiptId || typeof receiptId !== "string") {
      throw new Error("Invalid receipt ID.");
    }
    if (!updatedData || typeof updatedData !== "object" || Object.keys(updatedData).length === 0) {
      console.error("Invalid updated data:", updatedData);
      throw new Error("Invalid updated data.");
    }

    const receiptRef = doc(db, "OutboundReceipt", receiptId);
    console.log("Updating document with data:", updatedData);

    // Chỉ cập nhật StaffID và CustomerID
    await updateDoc(receiptRef, {
      StaffID: updatedData.StaffID,
      CustomerID: updatedData.CustomerID,
    });

    console.log("Document updated successfully.");
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

// Xóa outbound
export const deleteOutbound = async (outboundId) => {
  try {
    await deleteDoc(doc(db, "OutboundReceipt", outboundId));
    console.log("Outbound deleted successfully!");
  } catch (error) {
    console.error("Error deleting outbound:", error);
    throw error;
  }
};

