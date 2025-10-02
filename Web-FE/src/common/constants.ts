export const API_BASE_URL = "http://localhost:5034" as const; // gọi trực tiếp BE

export const ROUTES = {
	products: "/api/Products",
} as const;

export const ERROR_CODES = {
	INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export const MESSAGES = {
	REQUIRED: "Trường bắt buộc",
	CREATE_SUCCESS: "Tạo sản phẩm thành công",
	UPDATE_SUCCESS: "Cập nhật sản phẩm thành công",
	DELETE_SUCCESS: "Xoá sản phẩm thành công",
} as const;


