import { Container, CircularProgress, Alert, Box } from "@mui/material";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { useDeleteProduct, useProducts } from "../hooks/useProducts";

export default function Home() {
	const { data, isLoading, isError } = useProducts();
	const del = useDeleteProduct();

	return (
		<>
			<Navbar />
			<Container sx={{ mt: 3 }}>
				{isLoading && <CircularProgress />}
				{isError && <Alert severity="error">Failed to load</Alert>}
				<Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }} gap={2}>
					{data?.map(p => (
						<Box key={p.id}>
							<ProductCard product={p} onDelete={(id) => del.mutate(id)} />
						</Box>
					))}
				</Box>
			</Container>
		</>
	);
}


