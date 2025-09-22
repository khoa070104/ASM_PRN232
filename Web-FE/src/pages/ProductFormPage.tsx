import { Container, Typography, CircularProgress, Alert } from "@mui/material";
import Navbar from "../components/Navbar";
import ProductForm from "../components/ProductForm";
import { useCreateProduct, useProduct, useUpdateProduct } from "../hooks/useProducts";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductFormPage() {
	const navigate = useNavigate();
	const { id } = useParams();
	const isEdit = !!id;
	const { data, isLoading, isError } = useProduct(id || "");
	const createMut = useCreateProduct();
	const updateMut = useUpdateProduct(id || "");

	const handleSubmit = async (payload: any) => {
		try {
			if (isEdit) {
				await updateMut.mutateAsync(payload);
			} else {
				await createMut.mutateAsync(payload);
			}
			navigate("/");
		} catch {}
	};

	return (
		<>
			<Navbar />
			<Container sx={{ mt: 3 }}>
				<Typography variant="h5" sx={{ mb: 2 }}>{isEdit ? "Edit" : "Create"} Product</Typography>
				{isEdit && isLoading && <CircularProgress />}
				{isEdit && isError && <Alert severity="error">Failed to load</Alert>}
				<ProductForm defaultValues={isEdit ? data : undefined} onSubmit={handleSubmit} loading={createMut.isPending || updateMut.isPending} />
			</Container>
		</>
	);
}


