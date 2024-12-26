import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../api/authApi";


export const useAuth = () => {
	// const queryClient = useQueryClient();
	
	const loginMutation = useMutation({
		mutationFn: login,
		onSuccess: ((data) => {
			console.log('success:', data)
		}),
		onError: ((error) => {
			// console.log('error:', error.message);
			alert(error.message)
		})
	})


	return { loginMutation }
}