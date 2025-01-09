import { useState } from "react";
import { getAllInventory } from "../../api/inventoryApi";
import { Timestamp } from "firebase/firestore";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import InboundBarChart from "./components/inbound_statistical";
import InboundBarChartByQuarter from "./components/inbound_statistical_by_quarter";
import OutboundBarChart from "./components/outbound_statistical"; // Import OutboundBarChart
import OutboundBarChartByQuarter from "./components/outbound_statistical_by_quarter";

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
  const [chartType, setChartType] = useState("inbound"); // Mặc định hiển thị InboundBarChart
  const [outboundChartType, setOutboundChartType] = useState("outbound")
  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  const handleOutboundChartTypeChange = (event) => {
    setOutboundChartType(event.target.value);
  };

  return (
    <div className="h-screen bg-white p-4 shadow-md flex flex-col overflow-x-auto">
      <div className="flex items-center"> {/* Sử dụng flexbox để sắp xếp các button */}
        <button
          onClick={Export}
          className="bg-blue-500 text-white px-4 py-2 w-full max-w-xs rounded mr-2" // Thêm margin-right
        >
          Export Inventory Excel File
        </button>
        <div className="flex-grow"></div> {/* Thêm div với flex-grow */}
        <select
          value={chartType}
          onChange={handleChartTypeChange}
          className="border border-gray-400 px-4 py-2 rounded"
        >
          <option value="inbound">Inbound</option>
          <option value="inbound_quarter">Inbound By Quarter</option>
        </select>
      </div>
      <div style={{ marginTop: "50px" }}>
        {chartType === "inbound" ? <InboundBarChart /> : <InboundBarChartByQuarter />} {/* Hiển thị chart tương ứng */}
      </div>
      <div className="flex items-center"> {/* Sử dụng flexbox để sắp xếp các button */}
        
        <div className="flex-grow"></div> {/* Thêm div với flex-grow */}
        <select
          value={outboundChartType}
          onChange={handleOutboundChartTypeChange}
          className="border border-gray-400 px-4 py-2 rounded"
        >
          <option value="outbound">Outbound</option>
          <option value="outbound_quarter">Outbound By Quarter</option>
        </select>
      </div>
      <div style={{ marginTop: "50px" }}>
        {outboundChartType === "outbound" ? <OutboundBarChart /> : <OutboundBarChartByQuarter />} {/* Hiển thị chart tương ứng */}
      </div>
    </div>
  );
};

export default StatisticalScreen;