import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../api/authApi";
import { useNavigate } from "react-router";
import { roles } from "../core/utils/constants";

export const useAuth = () => {
	// const queryClient = useQueryClient();
	const navigate = useNavigate();
	
	const {mutate, data, } = useMutation({
		mutationFn: login,
		onSuccess: (data) => {
			if(data.role === roles[0].value)
				navigate("/staff")
		},
		onError: error => alert(error.message),
	})


	return { mutate, data, }
}