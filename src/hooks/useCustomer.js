import { useQuery } from "@tanstack/react-query";
import { getAllCustomer } from "../api/customerApi";

export const useCustomer = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["customer"],
    queryFn: getAllCustomer,
    staleTime: 5 * 60 * 1000, // Giữ dữ liệu trong 5 phút trước khi gọi lại API
    cacheTime: 10 * 60 * 1000, // Lưu cache trong 10 phút
    retry: 2, // Retry tối đa 2 lần nếu API thất bại
  });

  return {
    data,
    isLoading,
    isError, 
    error, 
    refetch,
  };
};
