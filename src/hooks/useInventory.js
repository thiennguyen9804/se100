import { useQuery } from "@tanstack/react-query";
import { getAllInventory } from "../api/inventoryApi";

export const useInventory = () => {
  const {
    data, // Đặt alias cho data là goods
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["inventory"],
    queryFn: getAllInventory,
    staleTime: 5 * 60 * 1000, // Giữ dữ liệu trong 5 phút trước khi gọi lại API
    cacheTime: 10 * 60 * 1000, // Lưu cache trong 10 phút
    retry: 2, // Retry tối đa 2 lần nếu API thất bại
  });

  return {
    data, // Dữ liệu hàng hóa
    isLoading, // Trạng thái đang tải
    isError, // Trạng thái lỗi
    error, // Thông tin lỗi (nếu có)
    refetch, // Hàm để làm mới dữ liệu
  };
};
