import { ROUTES } from "../../common/constants";
import { del, get, post, put } from "../../common/http";
import type { ProductCreateDto, ProductReadDto, ProductUpdateDto } from "./types";

export const ProductsApi = {
	list: () => get<ProductReadDto[]>(ROUTES.products),
	getById: (id: string) => get<ProductReadDto>(`${ROUTES.products}/${id}`),
	create: (dto: ProductCreateDto) => post<ProductCreateDto, ProductReadDto>(ROUTES.products, dto),
	update: (id: string, dto: ProductUpdateDto) => put<ProductUpdateDto, ProductReadDto>(`${ROUTES.products}/${id}`, dto),
	remove: (id: string) => del(`${ROUTES.products}/${id}`),
};


