import { ROUTES } from "../../common/constants";
import { get, post } from "../../common/http";

export type OrderDetail = {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
};

export type Order = {
    id: string;
    userId: string;
    totalAmount: number;
    status: string;
    createdAtUtc: string;
    details: OrderDetail[];
};

export type OrderCreateResponse = { orderId: string; totalAmount: number };

export type PagedOrders = { items: Order[]; total: number; page: number; pageSize: number };

export const OrdersApi = {
    create: () => post<undefined, OrderCreateResponse>(`${ROUTES.orders}`, undefined as any),
    myOrders: async (page = 1, pageSize = 10): Promise<PagedOrders> => {
        const res = await get<any>(`${ROUTES.orders}/me?page=${page}&pageSize=${pageSize}`);
        // Nếu BE trả về mảng thuần
        if (Array.isArray(res)) {
            return { items: res as Order[], total: (res as Order[]).length, page, pageSize };
        }
        // Nếu BE trả về PascalCase
        if (res && res.Items && res.Total !== undefined) {
            return { items: res.Items as Order[], total: res.Total as number, page: res.Page ?? page, pageSize: res.PageSize ?? pageSize };
        }
        // Mặc định assume camelCase
        return { items: (res.items ?? []) as Order[], total: (res.total ?? 0) as number, page: res.page ?? page, pageSize: res.pageSize ?? pageSize };
    },
    getById: (id: string) => get<Order>(`${ROUTES.orders}/${id}`),
};

// Payment API (giả lập)
export type PaymentCreateResponse = { paymentUrl: string; code: string };
export const PaymentApi = {
    create: (orderId: string) => post<{ orderId: string }, PaymentCreateResponse>(`${ROUTES.payment}/create`, { orderId }),
    success: (orderId: string) => post<{ orderId: string }, void>(`${ROUTES.payment}/success`, { orderId }),
    createStripeSession: (orderId: string) => post<{ orderId: string }, { url: string }>(`${ROUTES.payment}/stripe/create-session`, { orderId }),
    fail: (orderId: string) => post<{ orderId: string }, void>(`${ROUTES.payment}/fail`, { orderId }),
};


