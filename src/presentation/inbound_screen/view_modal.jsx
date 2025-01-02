import React, {useState, useEffect} from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../core/utils/firebase";

const ViewInboundModal = ({ inboundId, closeModal }) => {
  const [inboundReceipt, setInboundReceipt] = useState(null);
  const [staffName, setStaffName] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inboundRef = doc(db, "InboundReceipt", inboundId);
        const inboundSnap = await getDoc(inboundRef);

        if (inboundSnap.exists()) {
          const inboundData = inboundSnap.data();
          setInboundReceipt(inboundData);

          // Fetch Staff Name
          const staffRef = doc(db, "Staff", inboundData.StaffID);
          const staffSnap = await getDoc(staffRef);
          if (staffSnap.exists()) {
            setStaffName(staffSnap.data().Name);
          }

          // Fetch Supplier Name
          const supplierRef = doc(db, "Supplier", inboundData.SupplierID);
          const supplierSnap = await getDoc(supplierRef);
          if (supplierSnap.exists()) {
            setSupplierName(supplierSnap.data().Name);
          }

          // Fetch Products related to this InboundReceipt
      const productList = [];
      for (const product of inboundData.ProductList) {
        const productID = product.Product;
        
        // Kiểm tra xem ProductID có hợp lệ hay không
        if (!productID) {
          console.warn("Invalid ProductID:", productID);
          continue;  // Nếu ProductID không hợp lệ thì bỏ qua sản phẩm này
        }

        // Fetch Product Name from Inventory based on ProductID
        const productRef = doc(db, "Inventory", productID);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          productList.push({
            name: productSnap.data().Name,  // Get the product name from Inventory
            quantity: product.Quantity,
          });
        } else {
          console.warn(`Product with ID ${productID} not found in Inventory`);
        }
      }
      setProducts(productList);
        }
      } catch (error) {
        console.error("Error fetching inbound receipt data:", error);
      }
    };

    fetchData();
  }, [inboundId]);

  if (!inboundReceipt) {
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <p>Loading...</p>
          <button
            onClick={closeModal}
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
        <h2 className="text-lg font-bold mb-4 text-black">Inbound Receipt Details</h2>
        <div>
          <p>Staff Name: {staffName}</p>
          <p>Supplier Name: {supplierName}</p>
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
            Create Time: {inboundReceipt.CreateTime?.toDate().toLocaleString() || "N/A"}
          </p>
          <p>
            Update Time: {inboundReceipt.UpdateTime?.toDate().toLocaleString() || "N/A"}
          </p>
        </div>
        <button
          onClick={closeModal}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewInboundModal;