import { db } from "../core/utils/firebase";
import {
  doc,
getDocs,
updateDoc,
deleteDoc,
collection,
} from "firebase/firestore";

export const getAllOutbound = async () => {
 try {
  const outboundReceiptCollection = collection(db, "OutboundReceipt");
  const staffCollection = collection(db, "Staff");
  const supplierCollection = collection(db, "Supplier");

  // Lấy dữ liệu từ các collection
  const outboundReceiptSnapshot = await getDocs(outboundReceiptCollection);
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

  // Xử lý dữ liệu OutboundReceipt
  const fetchedData = outboundReceiptSnapshot.docs.map((doc) => {
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

//Hàm thêm outbound mới
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
    console.log("Outbound receipt updated successfully!");
  } catch (error) {
    console.error("Error updating outbound receipt:", error);
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
