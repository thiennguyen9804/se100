import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getAllStaff } from "../api/staffApi";

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


	return {data, isLoading, isError, error}
}

