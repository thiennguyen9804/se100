import React, { useEffect, useState } from "react";
import { useStaff } from "../../hooks/useStaff";
import { mapToAddStaffData, mapToUpdateStaffData ,mapToStaffUI } from "../../core/utils/mappings/staffMappings";
import StaffManager from "./components/StaffManger";
import ToolBar from "./components/ToolBar";
import StaffInfoModal from "./components/StaffInfoModal";

const StaffScreen = ({ isSidebarOpen }) => {
	const [searchWord, setSearchWord] = useState("");
	const { data, isLoading, addStaffMutation, updateStaffMutation } = useStaff();
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
		// console.log("🚀 ~ handleSave ~ mappedData:", mappedData)
		// TODO: Thêm api call để lưu dữ liệu
		if(!currentStaff?.id) {
			const mappedData = mapToAddStaffData(updatedStaff)
			addStaffMutation(mappedData)
			console.log('add is called....');
			
		} else {
			const mappedData = mapToUpdateStaffData(updatedStaff)
			updateStaffMutation(mappedData)
			console.log('update is called....');
		}
	};

	const onEditClick = (row) => {
		// console.log("🚀 ~ onEditClick ~ row:", row)
		setCurrentStaff(row)
		setIsModalOpen(true)

		
	}

	const onAddClick = () => {
		setCurrentStaff({})
		setIsModalOpen(true)

	}

	return (
		<div style={{ display: "grid", height: "calc(100vh - 96px)", }}>
			<div style={{ overflowX: "auto", height: "100%" }}>
				{/* Thanh công cụ */}
				<ToolBar
					onAddClick={onAddClick}
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
					// formData={formData}
					// setFormData={setFormData}
					open={isModalOpen}
					handleClose={() => {
						setIsModalOpen(false)
						setCurrentStaff({})
					}}
					initialData={currentStaff}
					onSave={handleSave}
				/>
			</div>
		</div>
	);
};

export default StaffScreen;