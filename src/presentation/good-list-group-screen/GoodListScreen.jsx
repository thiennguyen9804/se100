import React, { useState } from "react";
import TopNavigationBar from "./components/TopNavigationBar";

import { Routes, Route } from "react-router";
import GoodsListManager from "./components/GoodsListManager";

const GoodListScreen = () => {
  const tabs = [
    { name: "GOODS LIST", path: "/goods-manager" },
    // { name: "UNIT", path: "/unit-manager" },
    // { name: "CLASS", path: "/class-manager" },
    // { name: "COLOR", path: "/color-manager" },
    // { name: "BRAND", path: "/brand-manager" },
    // { name: "SHAPE", path: "/shape-manager" },
    // { name: "SPECS", path: "/specs-manager" },
    // { name: "ORIGIN", path: "/origin-manager" }
  ];
  
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    console.log(`Active Tab: ${tab}`); // Xử lý thêm logic khi đổi tab nếu cần
  };

  
  return (
    <div className="flex flex-col h-screen">
      {/* Topbar navigation */}
      {/* <TopNavigationBar tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} /> */}

      {/* Table Section */}
      <GoodsListManager/>
    </div>
  );
};

export default GoodListScreen;
