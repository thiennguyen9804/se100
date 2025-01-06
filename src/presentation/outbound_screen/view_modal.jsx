import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../core/utils/firebase";

const ViewOutboundModal = ({ outboundId, onCancel }) => {
  const [OutboundReceipt, setOutboundReceipt] = useState(null);
  const [staffName, setStaffName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const outboundRef = doc(db, "OutboundReceipt", outboundId);
        const outboundSnap = await getDoc(outboundRef);

        if (outboundSnap.exists()) {
          const outboundData = outboundSnap.data();
          setOutboundReceipt(outboundData);

          // Fetch Staff Name
          const staffRef = doc(db, "Staff", outboundData.StaffID);
          const staffSnap = await getDoc(staffRef);
          if (staffSnap.exists()) {
            setStaffName(staffSnap.data().Name);
          }

          // Fetch Customer Name
          const customerRef = doc(db, "Customer", outboundData.CustomerID);
          const customerSnap = await getDoc(customerRef);
          if (customerSnap.exists()) {
            setCustomerName(customerSnap.data().Name);
          }

          // Fetch Products
          const productList = [];
          for (const product of outboundData.ProductList || []) {
            const productRef = doc(db, "Inventory", product.ProductID);
            const productSnap = await getDoc(productRef);
            if (productSnap.exists()) {
              productList.push({
                name: productSnap.data().Name,
                quantity: product.Quantity,
              });
            }
          }
          setProducts(productList);
        }
      } catch (error) {
        console.error("Error fetching outbound receipt data:", error);
      }
    };

    if (outboundId) fetchData();
  }, [outboundId]);

  if (!OutboundReceipt) {
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <p>Loading...</p>
          <button
            onClick={onCancel}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4 text-black">
          Outbound Receipt Details
        </h2>
        <div>
          <p>Staff Name: {staffName}</p>
          <p>Customer Name: {customerName}</p>
        </div>
        <h3 className="font-semibold text-black mt-4">Product List</h3>
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Product Name</th>
              <th className="border px-4 py-2">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{product.name || "N/A"}</td>
                <td className="border px-4 py-2">{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <p>
            Create Time:{" "}
            {OutboundReceipt.CreateTime?.toDate().toLocaleString() || "N/A"}
          </p>
          <p>
            Update Time:{" "}
            {OutboundReceipt.UpdateTime?.toDate().toLocaleString() || "N/A"}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewOutboundModal;
