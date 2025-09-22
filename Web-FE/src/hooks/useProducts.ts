import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../api/products";
import type { ProductCreate, ProductUpdate } from "../api/products";

export function useProducts() {
	return useQuery({ queryKey: ["products"], queryFn: getProducts });
}

export function useProduct(id: string) {
	return useQuery({ queryKey: ["products", id], queryFn: () => getProduct(id), enabled: !!id });
}

export function useCreateProduct() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (p: ProductCreate) => createProduct(p),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
	});
}

export function useUpdateProduct(id: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (p: ProductUpdate) => updateProduct(id, p),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["products"] });
			qc.invalidateQueries({ queryKey: ["products", id] });
		},
	});
}

export function useDeleteProduct() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => deleteProduct(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
	});
}


