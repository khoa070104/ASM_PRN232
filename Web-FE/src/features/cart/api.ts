import { ROUTES } from "../../common/constants";
import { del, get, post, put } from "../../common/http";

export type CartItem = {
    id: string;
    productId: string;
    productName: string;
    productImage?: string | null;
    unitPrice: number;
    quantity: number;
    subtotal: number;
};

export type CartAddRequest = { productId: string; quantity: number };
export type CartUpdateRequest = { quantity: number };

export const CartApi = {
    list: () => get<CartItem[]>(`${ROUTES.cart}`),
    add: (dto: CartAddRequest) => post<CartAddRequest, CartItem[]>(`${ROUTES.cart}/add`, dto),
    update: (itemId: string, dto: CartUpdateRequest) => put<CartUpdateRequest, CartItem[]>(`${ROUTES.cart}/${itemId}`, dto),
    remove: (itemId: string) => del(`${ROUTES.cart}/${itemId}`),
};


