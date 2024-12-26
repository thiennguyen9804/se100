import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../api/authApi";


export const useAuth = () => {
	// const queryClient = useQueryClient();
	
	const {mutate, data, } = useMutation({
		mutationFn: login,
		onError: error => alert(error.message),
	})


	return { mutate, data, }
}