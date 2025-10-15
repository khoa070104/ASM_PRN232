import { ROUTES } from "../../common/constants";
import { del, get, post, put } from "../../common/http";
import type { ProductCreateDto, ProductReadDto, ProductUpdateDto } from "./types";

export type PagedResult<T> = { items: T[]; total: number; page: number; pageSize: number };

export const ProductsApi = {
    list: (page = 1, pageSize = 5, q?: string) => get<PagedResult<ProductReadDto>>(`${ROUTES.products}?page=${page}&pageSize=${pageSize}${q ? `&q=${encodeURIComponent(q)}` : ''}`),
	getById: (id: string) => get<ProductReadDto>(`${ROUTES.products}/${id}`),
	create: (dto: ProductCreateDto) => post<ProductCreateDto, ProductReadDto>(ROUTES.products, dto),
	update: (id: string, dto: ProductUpdateDto) => put<ProductUpdateDto, ProductReadDto>(`${ROUTES.products}/${id}`, dto),
	remove: (id: string) => del(`${ROUTES.products}/${id}`),
};


