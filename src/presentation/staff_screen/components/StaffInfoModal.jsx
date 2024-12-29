import React, { useState, useEffect } from "react";
import { roles } from "../../../core/utils/constants";
import {
	Modal,
	Box,
	TextField,
	Button,
	Typography,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
} from "@mui/material";

const StaffInfoModal = ({ 
	open, handleClose, 
	initialData, onSave,
	// formData, setFormData
}) => {
	const [formData, setFormData] = useState({});
	// console.log("🚀 ~ formData:", formData)
	// console.log("🚀 ~ initialData:", initialData)

	useEffect(() => {
		setFormData(initialData || {});
	}, [initialData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		// console.log("🚀 ~ handleChange ~ name, value:", name, value)
		
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};


	const handleSubmit = () => {
		onSave(formData);
		handleClose();
		setFormData({})
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="edit-modal-title"
			aria-describedby="edit-modal-description"
		>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: 400,
					bgcolor: "background.paper",
					boxShadow: 24,
					p: 4,
					borderRadius: 2,
				}}
			>
				{/* <Typography id="edit-modal-title" color="black" variant="h6" component="h2">
					{initialData ? "Edit Staff" : "Add New Staff"}
				</Typography> */}
				<Box component="form" sx={{ mt: 2 }}>
					<TextField
						fullWidth
						margin="normal"
						label="Contact"
						name="contact"
						value={formData.contact || ""}
						onChange={handleChange}
					/>
					<TextField
						fullWidth
						margin="normal"
						label="Location"
						name="location"
						value={formData.location || ""}
						onChange={handleChange}
					/>
					<TextField
						fullWidth
						margin="normal"
						label="Mail"
						name="mail"
						value={formData.mail || ""}
						onChange={handleChange}
					/>
					<TextField
						fullWidth
						margin="normal"
						label="Name"
						name="name"
						value={formData.name || ""}
						onChange={handleChange}
					/>
					<TextField
						fullWidth
						margin="normal"
						label="Password"
						name="pass"
						value={formData.pass || ""}
						onChange={handleChange}
					/>
					{/* <TextField
						fullWidth
						margin="normal"
						label="Role"
						name="role"
						value={formData.role || ""}
						onChange={handleChange}
					/> */}

					<FormControl fullWidth margin="normal">
						<InputLabel id="role-label">Role</InputLabel>
						<Select
							labelId="role-label"
							name="role"
							value={formData.role || ""}
							onChange={handleChange}
							label="Role"
						>
							{roles.map((role, index) => (
								<MenuItem key={index} value={role.value}>
									{role.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
						<Button onClick={handleClose} color="error" sx={{ mr: 2 }}>
							Cancel
						</Button>
						<Button onClick={handleSubmit} variant="contained" color="primary">
							Save
						</Button>
					</Box>
				</Box>
			</Box>
		</Modal>
	);
};

export default StaffInfoModal;
