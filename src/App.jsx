import './App.css'
import {LoginScreen} from './presentation/auth_screen'
import Sidebar from "./presentation/components/SideBar";
// import Topbar from "./components/Topbar";
// import Content from "./components/Content";
import { Routes, Route } from 'react-router';

function App() {
  return (
    // <Router>
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <Sidebar />
        <div className="flex flex-col flex-1">
          {/* <Topbar /> */}
          <div className="p-6">
            <Routes>
              <Route path="/dashboard" element={<h1>Dashboard</h1>} />
              {/* <Route path="/inbound" element={<Content />} /> */}
              <Route path="/outbound" element={<h1>Outbound</h1>} />
              <Route path="/inventory" element={<h1>Inventory</h1>} />
              <Route path="/finance" element={<h1>Finance</h1>} />
              {/* Add more routes here */}
              <Route path="/" element={<h1>Welcome to GreaterWMS</h1>} />
            </Routes>
          </div>
        </div>
      </div>
    // </Router>
  );
}

export default App
