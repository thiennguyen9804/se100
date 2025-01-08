import { getAllInventory } from "../../api/inventoryApi";
import { Timestamp } from "firebase/firestore";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import InboundBarChart from "./components/inbound_statistical";
import InboundBarChartByQuarter from "./components/inbound_statistical_by_quarter";

function convertTimestampToDate(timestamp) {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toLocaleString(); // Chuyển sang chuỗi hiển thị được
  }
  return timestamp; // Trả về nếu không phải là Timestamp
}

function Export() {
  getAllInventory().then((inventoryData) => {
    // Format lại timestamp
    const formattedData = inventoryData.map((item) => ({
      ...item,
      CreateTime: convertTimestampToDate(item.CreateTime) || "N/A",
      UpdateTime: convertTimestampToDate(item.UpdateTime) || "N/A",
    }));

    // Xử lý dữ liệu từ PromiseResult
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();

    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

    // Xuất file Excel
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Lưu tệp với file-saver
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "InventoryData.xlsx");
  });
}
const StatisticalScreen = () => {
  return (
    <div className="h-screen bg-white p-4 shadow-md flex flex-col overflow-x-auto">
      <button
        onClick={Export}
        className="bg-blue-500 text-white px-4 py-2 w-full max-w-xs rounded"
      >
        Export Inventory Excel File
      </button>
      <div style={{ marginTop: '50px' }}>
        <InboundBarChart />
        <InboundBarChartByQuarter />
      </div>

    </div>
  );
};

export default StatisticalScreen;
