import { Container, Typography, CircularProgress, Alert, Stack, Button } from "@mui/material";
import Navbar from "../components/Navbar";
import { useParams, Link } from "react-router-dom";
import { useProduct } from "../hooks/useProducts";

export default function ProductDetail() {
	const { id } = useParams();
	const { data, isLoading, isError } = useProduct(id || "");

	return (
		<>
			<Navbar />
			<Container sx={{ mt: 3 }}>
				{isLoading && <CircularProgress />}
				{isError && <Alert severity="error">Failed to load</Alert>}
				{data && (
					<Stack spacing={2}>
						<Typography variant="h4">{data.name}</Typography>
						<Typography>{data.description}</Typography>
						<Typography variant="h6">${data.price.toFixed(2)}</Typography>
						{data.image && (<img src={data.image} alt={data.name} style={{ maxWidth: 400 }} />)}
						<Button variant="outlined" component={Link} to={`/edit/${data.id}`}>Edit</Button>
					</Stack>
				)}
			</Container>
		</>
	);
}


