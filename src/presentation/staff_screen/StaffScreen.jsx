import React, { useEffect, useState } from "react";
import {
	Button,
	TextField,
	IconButton,
} from "@mui/material";

import { useStaff } from "../../hooks/useStaff";
import { mapToStaffUI } from "../../core/utils/mappings/staffMappings";
import StaffManager from "./components/StaffManger";
import ToolBar from "./components/ToolBar";
import StaffInfoModal from "./components/StaffInfoModal";

const StaffScreen = ({ isSidebarOpen }) => {
	const [searchWord, setSearchWord] = useState("");
	const { data, isLoading } = useStaff();
	const [filteredData, setFilteredData] = useState([])
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentStaff, setCurrentStaff] = useState(null); // Dữ liệu hiện tại để chỉnh sửa

	useEffect(() => {
		if (data) {
			const filteredValue = data.filter((item) =>
				Object.values(item).some((value) =>
					value.toString().toLowerCase().includes(searchWord.toLowerCase())
				)).map(mapToStaffUI)

			setFilteredData(filteredValue)
		}
	}, [data])


	const handleSave = (updatedStaff) => {
		// TODO: Thêm API call để lưu dữ liệu
		console.log("Saved data:", updatedStaff);
	};

	const onEditClick = () => setIsModalOpen(true)

	return (
		<div style={{ display: "grid", height: "calc(100vh - 96px)", }}>
			<div style={{ overflowX: "auto", height: "100%" }}>
				{/* Thanh công cụ */}
				<ToolBar 
					searchWord={searchWord} 
					setSearchWord={setSearchWord}
				/>

				{/* Bảng dữ liệu */}
				<StaffManager 
					filteredData={filteredData} 
					isLoading={isLoading} 
					onEditClick={onEditClick}
				/>

				<StaffInfoModal
					open={isModalOpen}
					handleClose={() => setIsModalOpen(false)}
					initialData={currentStaff}
					onSave={handleSave}
				/>
			</div>
		</div>
	);
};

export default StaffScreen;