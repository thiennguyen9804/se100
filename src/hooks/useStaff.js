import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { getAllStaff, addStaff, updateStaff } from "../api/staffApi";

export const useStaff = () => {
	const queryClient = useQueryClient();

	const {
		data,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ['staff', 'all'],
		queryFn: getAllStaff,
	});

	const {
		mutate: addStaffMutation,
		isLoading: isAdding,
		isError: isAddError,
		error: addError,
	} = useMutation({
		mutationFn: addStaff,  // Hàm API để thêm nhân viên
		onSuccess: (data) => {
			// Sau khi thêm thành công, làm mới danh sách staff
			queryClient.invalidateQueries(['staff', 'all']);
			alert('User added successfully')
		},
		onError: (error) => {
			alert(error.message)
		}
	});

	const {
		mutate: updateStaffMutation,
		isLoading: isUpdating,
		isError: isUpdateError,
		error: updateError,
	} = useMutation({
		mutationFn: updateStaff,  // Hàm API để thêm nhân viên
		onSuccess: (data) => {
			queryClient.invalidateQueries(['staff', 'all']);
			alert('User updated successfully')
		},
		onError: (error) => {
			alert(error.message)
		}
	});


	return {
		data, isLoading, isError, error,
		addStaffMutation, isAdding, isAddError, addError,
		updateStaffMutation
	}
}

