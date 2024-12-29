// Nhận dữ liệu từ firebase, map to dữ liệu hiển thị trong bảng
export const mapToStaffUI = (input) => {
	return {
		id: input["id"],
		contact: input["Contact"],
		location: input["Location"],
		mail: input["Mail"],
		name: input["Name"],
		pass: input["Pass"],
		role: input["Role"],
	};
};


// Nhận dữ liệu từ UI, map to dữ liệu để add vô firestore
export const mapToAddStaffData = (input) => {
	return {
		Contact: input.contact,
		Location: input.location,
		Mail: input.mail,
		Name: input.name,
		Pass: input.pass,
		Role: input.role,
	};
};

// Nhận dữ liệu từ UI, map to dữ liệu để update vô firestore
export const mapToUpdateStaffData = (input) => {
	return {
		id: input.id,
		Contact: input.contact,
		Location: input.location,
		Mail: input.mail,
		Name: input.name,
		Pass: input.pass,
		Role: input.role,
	};
};
