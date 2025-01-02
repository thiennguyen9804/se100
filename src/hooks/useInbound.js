import { useQuery } from "@tanstack/react-query";
import { getAllInbound } from "../api/inboundApi"; // Import hàm getAllInbound
import { addDoc } from "firebase/firestore";

export const useInbound = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["inbound"],
    queryFn: getAllInbound, // Sử dụng hàm getAllInbound
    staleTime: 5 * 60 * 1000, 
    cacheTime: 10 * 60 * 1000,
    retry: 2, 
  });

  return {
    data,
    isLoading,
    isError, 
    error, 
    refetch,
  };
};
