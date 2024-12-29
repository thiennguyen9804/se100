import React from 'react'
import {
	Button,
	TextField,
	IconButton,
} from "@mui/material";

const ToolBar = ({
	searchWord,
	setSearchWord,
	onAddClick,
}) => {
	return (
		<div className="flex justify-between items-center mb-4 h-20">
			<div>
				<Button variant="contained" color="primary" onClick={onAddClick}>
					+ NEW
				</Button>
				<Button variant="outlined" color="primary" className="ml-2">
					REFRESH
				</Button>
			</div>
			<TextField
				label="Search Word"
				variant="outlined"
				size="small"
				value={searchWord}
				onChange={(e) => setSearchWord(e.target.value)}
				sx={{
					backgroundColor: "white", // Đặt màu nền trắng
				}}
				InputProps={{
					endAdornment: <IconButton>{/* thêm icon search ở đây */}</IconButton>,
				}}
			/>


		</div>
	)
}

export default ToolBar
