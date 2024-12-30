import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute = ({ element }) => {
	// const { data } = useAuth();
	// if (!data || !data?.isLoggedIn) {
	// 	return <Navigate to="/login" />;
	// }

	return element
};

export default ProtectedRoute;
