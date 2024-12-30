import React from 'react'

const AdminScreen = () => {
	return (
		<Routes>
			<Route path="/staff" element={<ProtectedRoute element={<StaffScreen />} />} />
		</Routes>
	)
}

export default AdminScreen
