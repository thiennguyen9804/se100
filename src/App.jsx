import { LoginScreen } from './presentation/auth_screen'
import Sidebar from "./presentation/components/SideBar";
// import Content from "./components/Content";
import Topbar from "./presentation/components/TopBar"; // Import Topbar
import Inbound from "./presentation/inbound_screen/inbound"; // Import component Inbound
import { useState } from "react"; 
import { Routes, Route } from 'react-router';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Khai báo state

  return (
    // <Router>
    <div className="fixed inset-0 flex flex-col bg-black"> {/* Thay đổi className */}
      <Topbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      {/* Sử dụng Topbar component */}
      <div className="flex flex-1 overflow-hidden"> {/* Thêm flex-1 và overflow-hidden */}
        <Sidebar isSidebarOpen={isSidebarOpen} /> {/* Truyền state */}
        <div className="flex flex-col flex-1">
          {/* <Topbar /> */}
          <div className="p-6 overflow-y-auto"> {/* Thêm overflow-y-auto */}
            <Routes>
              <Route path="/dashboard" element={<h1>Dashboard</h1>} />
              <Route path="/inbound" element={<Inbound />} />
              <Route path="/outbound" element={<h1>Outbound</h1>} />
              <Route path="/inventory" element={<h1>Inventory</h1>} />
              <Route path="/warehouse" element={<h1>Warehouse</h1>} />
              <Route path="/base-info" element={<h1>Base Info</h1>} />
              <Route path="/goods-list" element={<h1>Goods List</h1>} />
              <Route path="/staff" element={<h1>Staff</h1>} />
              <Route path="/driver" element={<h1>Driver</h1>} />
              <Route
                path="/download-center"
                element={<h1>Download Center</h1>}
              />

              <Route path="/" element={<h1>Welcome to GreaterWMS</h1>} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
    // </Router>
  );
}

export default App
