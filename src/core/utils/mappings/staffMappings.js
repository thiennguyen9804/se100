// Nhận dữ liệu từ firebase, map to dữ liệu hiển thị trong bảng
export const mapToStaffUI = (input) => {
	return {
		...input,
		contact: input["Contact"],
		location: input["Location"],
		mail: input["Mail"],
		name: input["Name"],
		pass: input["Pass"],
		role: input["Role"],
	};
};

