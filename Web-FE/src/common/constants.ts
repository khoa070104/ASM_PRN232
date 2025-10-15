export const API_BASE_URL =
	(import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:5034";
export const ROUTES = {
	products: "/api/Products",
	auth: "/api/Auth",
    cart: "/api/Cart",
    orders: "/api/Orders",
    payment: "/api/Payment",
} as const;

export const ERROR_CODES = {
	INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export const MESSAGES = {
	REQUIRED: "Trường bắt buộc",
	CREATE_SUCCESS: "Tạo sản phẩm thành công",
	UPDATE_SUCCESS: "Cập nhật sản phẩm thành công",
	DELETE_SUCCESS: "Xoá sản phẩm thành công",
	RENDER_FREE_TIER: "Vì đang deploy free tier trên Render, nên BackEnd có thể sẽ trả request chậm nhất là sau 50s cho request đầu tiên. Mong thầy thông cảm!",
    CART_LOAD_ERROR: "Không tải được giỏ hàng",
    CART_EMPTY: "Giỏ hàng trống",
} as const;


export const UI_TEXTS = {
    BACK: "Trở về",
    CHECKOUT: "Checkout",
    ORDER_INFO: "Thông tin đơn hàng",
    ORDER_ID: "Mã đơn",
    TOTAL_AMOUNT: "Tổng tiền",
    STATUS: "Trạng thái",
    ORDER_DETAILS: "Chi tiết sản phẩm",
    COL_PRODUCT: "Sản phẩm",
    COL_QTY: "SL",
    COL_UNIT_PRICE: "Đơn giá",
    COL_SUBTOTAL: "Tạm tính",
    PAYMENT_TITLE: "Thanh toán",
    SELECT_BANK: "Chọn ngân hàng",
    QR_GUIDE: "Quét QR bằng app ngân hàng để thanh toán",
    PAID_BUTTON: "Đã thanh toán",
} as const;

export const UI_ROUTES = {
	login: "/login",
	register: "/register",
} as const;

export const BANKS = [
    { code: "VCB", name: "Vietcombank" },
    { code: "TCB", name: "Techcombank" },
    { code: "ACB", name: "ACB" },
    { code: "VTB", name: "VietinBank" },
    { code: "BIDV", name: "BIDV" },
    { code: "MB", name: "MB Bank" },
];


