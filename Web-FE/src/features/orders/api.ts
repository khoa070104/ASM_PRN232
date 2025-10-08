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

export const OrdersApi = {
    create: () => post<undefined, OrderCreateResponse>(`${ROUTES.orders}`, undefined as any),
    myOrders: () => get<Order[]>(`${ROUTES.orders}/me`),
    getById: (id: string) => get<Order>(`${ROUTES.orders}/${id}`),
};


