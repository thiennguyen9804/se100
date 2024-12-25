import { LoginScreen } from './presentation/auth_screen'
import Sidebar from "./presentation/components/SideBar";
import GoodListScreen from './presentation/good-list-group-screen/GoodListScreen'

import { Routes, Route } from 'react-router';

function App() {
  return (
    // <Router>
    <div className='flex-col w-screen overflow-hidden'>
      <h1>Top bar under construction...</h1>
      <div className="flex">
        <Sidebar />
        <div className="w-full h-screen flex flex-col">
          <Routes>
            <Route path="/dashboard" element={<h1>Dashboard</h1>} />
            <Route path="/inbound" element={<h1>Inbound</h1>} />
            <Route path="/outbound" element={<h1>Outbound</h1>} />
            <Route path="/inventory" element={<h1>Inventory</h1>} />
            <Route path="/finance" element={<h1>Finance</h1>} />
            <Route path="/goods-list" element={<GoodListScreen />} />
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
