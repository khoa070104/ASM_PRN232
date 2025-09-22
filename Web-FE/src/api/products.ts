import { api } from "./client";

export type Product = {
	id: string;
	name: string;
	description: string;
	price: number;
	image?: string | null;
	createdAtUtc: string;
	updatedAtUtc?: string | null;
};

export type ProductCreate = {
	name: string;
	description: string;
	price: number;
	image?: string | null;
};

export type ProductUpdate = ProductCreate;

export async function getProducts() {
	const { data } = await api.get<Product[]>("/api/products");
	return data;
}

export async function getProduct(id: string) {
	const { data } = await api.get<Product>(`/api/products/${id}`);
	return data;
}

export async function createProduct(payload: ProductCreate) {
	const { data } = await api.post<Product>("/api/products", payload);
	return data;
}

export async function updateProduct(id: string, payload: ProductUpdate) {
	const { data } = await api.put<Product>(`/api/products/${id}`, payload);
	return data;
}

export async function deleteProduct(id: string) {
	await api.delete(`/api/products/${id}`);
}


