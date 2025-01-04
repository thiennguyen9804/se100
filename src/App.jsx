import Sidebar from "./presentation/components/SideBar";
import Topbar from "./presentation/components/TopBar";
import { useState } from "react";
import { Routes, Route } from "react-router";
import StaffScreen from "./presentation/staff_screen/StaffScreen";
import SupplierScreen from "./presentation/supplier_screen/SupplierScreen";
import InventoryScreen from "./presentation/inventory_screen/inventory";
import CustomerScreen from "./presentation/customer_screen/CustomerScreen";
import ProtectedRoute from "./core/presentation/ProtectedRoute";
import InboundReceiptScreen from "./presentation/inbound_screen/inbound";
import OutboundReceiptScreen from "./presentation/outbound_screen/outbound";
import { LoginScreen } from "./presentation/auth_screen";
import StatisticalScreen from "./presentation/statistical_screen/StatisticalScreen";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Khai báo state

  return (
    // <Router>
    <div className="fixed inset-0 flex flex-col bg-black">
      {" "}
      {/* Thay đổi className */}
      <Topbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      {/* Sử dụng Topbar component */}
      <div className="flex flex-1 overflow-hidden">
        {" "}
        {/* Thêm flex-1 và overflow-hidden */}
        <Sidebar isSidebarOpen={isSidebarOpen} /> {/* Truyền state */}
        <div className="flex flex-col flex-1">
          {/* <Topbar /> */}
          <div className="p-6 overflow-y-auto">
            {" "}
            {/* Thêm overflow-y-auto */}
            {
              <Routes>
                <Route path="/" element={<LoginScreen />} />
                <Route path="/warehouse/" element={<InboundReceiptScreen />} />
                <Route
                  path="/warehouse/outbound"
                  element={<OutboundReceiptScreen />}
                />
                <Route
                  path="/warehouse/inventory"
                  element={<InventoryScreen />}
                />
                <Route path="/staff" element={<StaffScreen />} />
                <Route
                  path="/warehouse/supplier"
                  element={<SupplierScreen />}
                />
                <Route
                  path="/warehouse/customer"
                  element={<CustomerScreen />}
                />
                <Route
                  path="/warehouse/statistical"
                  element={<StatisticalScreen />}
                />
              </Routes>
            }
            {/* <StaffScreen /> */}
          </div>
        </div>
      </div>
    </div>
    // </Router>
  );
}

export default App;
