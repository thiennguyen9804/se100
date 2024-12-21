import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


export const useAuth = () => {
	const queryClient = useQueryClient();
	
	const loginMutation = useMutation()
}