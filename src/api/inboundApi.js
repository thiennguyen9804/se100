import { db } from "../core/utils/firebase";
import {
  doc,
getDocs,
updateDoc,
deleteDoc,
collection,
} from "firebase/firestore";

export const getAllInbound = async () => {
 try {
  const inboundReceiptCollection = collection(db, "InboundReceipt");
  const staffCollection = collection(db, "Staff");
  const supplierCollection = collection(db, "Supplier");

  // Lấy dữ liệu từ các collection
  const inboundReceiptSnapshot = await getDocs(inboundReceiptCollection);
  const staffSnapshot = await getDocs(staffCollection);
  const supplierSnapshot = await getDocs(supplierCollection);

  // Chuyển đổi dữ liệu Staff và Supplier thành dạng key-value
  const staffs = {};
  staffSnapshot.forEach((doc) => {
    staffs[doc.data().id] = doc.data().Name;
  });

  const suppliers = {};
  supplierSnapshot.forEach((doc) => {
    suppliers[doc.data().id] = doc.data().Name;
  });

  // Xử lý dữ liệu InboundReceipt
  const fetchedData = inboundReceiptSnapshot.docs.map((doc) => {
  const data = doc.data();
  return {
  id: doc.id,
  ...data,
  StaffName: staffs[data.id] || "N/A", // Lấy StaffName
  SupplierName: suppliers[data.SupplierID] || "N/A", // Lấy SupplierName
    };
  });

  return fetchedData;
} catch (error) {
  console.error("Error fetching data:", error);
  }
};

//Hàm thêm inbound mới
export const addNewInbound = async (newInboundData) => {
  try {
    const inboundReceiptRef = collection(db, "InboundReceipt");
    const docRef = await addDoc(inboundReceiptRef, newInboundData);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id; // Trả về ID của tài liệu vừa thêm
  } catch (error) {
    console.error("Error adding inbound receipt: ", error);
    throw new Error("Error adding inbound receipt");
  }
};

// Hàm cập nhật thông tin InboundReceipt
export const updateInbound = async (receiptId, updatedData) => {
  try {
    const allowedUpdates = ["StaffID", "SupplierID"]; // Các trường được phép cập nhật là ID thay vì tên
    const updates = Object.keys(updatedData)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updatedData[key];
        return obj;
      }, {});

    // Nếu không có trường hợp hợp lệ để cập nhật
    if (Object.keys(updates).length === 0) {
      throw new Error("No valid fields to update.");
    }

    // Cập nhật dữ liệu vào Firestore
    const receiptRef = doc(db, "InboundReceipt", receiptId);
    await updateDoc(receiptRef, updates);
    console.log("Inbound receipt updated successfully!");
  } catch (error) {
    console.error("Error updating inbound receipt:", error);
    throw error;
  }
};

// Xóa inbound
export const deleteInbound = async (inboundId) => {
  try {
    await deleteDoc(doc(db, "InboundReceipt", inboundId));
    console.log("Inbound deleted successfully!");
  } catch (error) {
    console.error("Error deleting inbound:", error);
    throw error;
  }
};
