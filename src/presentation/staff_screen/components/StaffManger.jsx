import React, { useEffect } from 'react'
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	TextField,
	IconButton,
	Tooltip,
} from "@mui/material";
import { Edit, Delete, Visibility, Print } from "@mui/icons-material";

const StaffManager = ({
	isLoading,
	filteredData,
	onEditClick
}) => {
	useEffect(() => {
		console.log("🚀 ~ filteredData:", filteredData)
	}, [filteredData])
	return (
		<>
			<TableContainer component={Paper} style={{ height: "calc(100% - 48px)" }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>Contact</TableCell>
							<TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>Location</TableCell>
							<TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>Mail</TableCell>
							<TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>Name</TableCell>
							<TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>Password</TableCell>
							<TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>Role</TableCell>
							<TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>Action</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{isLoading &&
							<TableRow>
								<TableCell colSpan={7} style={{ textAlign: "center" }}>Loading...</TableCell>
							</TableRow>
						}

						{(!isLoading && filteredData.length === 0) &&
							<TableRow>
								<TableCell colSpan={7} style={{ textAlign: "center" }}>No Data!</TableCell>
							</TableRow>
						}

						{(!isLoading && filteredData) && filteredData.map((row, index) => (
							<TableRow key={index}>
								<TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>{row.contact}</TableCell>
								<TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>{row.location}</TableCell>
								<TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>{row.mail}</TableCell>
								<TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>{row.name}</TableCell>
								<TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>{row.pass}</TableCell>
								<TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>{row.role}</TableCell>
								<TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>
									<div className="flex">
										<Tooltip title="View">
											<IconButton>
												<Visibility />
											</IconButton>
										</Tooltip>
										<Tooltip title="Edit">
											<IconButton onClick={() =>
												onEditClick()
											}>
												<Edit />
											</IconButton>
										</Tooltip>
										<Tooltip title="Delete">
											<IconButton>
												<Delete />
											</IconButton>
										</Tooltip>
									</div>
								</TableCell>
							</TableRow>
						))}


					</TableBody>
				</Table>
			</TableContainer>

			{/* {filteredData.length === 0 && <div className="text-center mt-4">NO MORE DATA</div>} */}
		</>
	)
}

export default StaffManager
