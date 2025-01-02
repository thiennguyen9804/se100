import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../api/authApi";
import { useNavigate } from "react-router";
import { roles } from "../core/utils/constants";
import { useState } from "react";

export const useAuth = () => {
	const queryClient = useQueryClient();

	const [userData, setUserData] = useState(null);
	const navigate = useNavigate();

	const { mutate } = useMutation({
		mutationFn: login,
		onSuccess: (data) => {
			setUserData(data)
			queryClient.setQueryData(["currentUser"], data)
			if(data.Role === roles[0].value) {
				navigate("/staff")
			} else if(data.Role === roles[1].value || data.Role === roles[2].value) {
				navigate('/warehouse')
			}
		},
		onError: error => alert(error.message),
	})

	// console.log("🚀 ~ useAuth ~ data:", data)

	return { mutate, userData, }
}