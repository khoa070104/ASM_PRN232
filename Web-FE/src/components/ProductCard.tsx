import { Card, CardContent, CardMedia, Typography, CardActions, Button } from "@mui/material";
import { Link } from "react-router-dom";
import type { Product } from "../api/products";

type Props = {
	product: Product;
	onDelete: (id: string) => void;
};

export default function ProductCard({ product, onDelete }: Props) {
	return (
		<Card>
			{product.image && (
				<CardMedia component="img" height="160" image={product.image} alt={product.name} />
			)}
			<CardContent>
				<Typography variant="h6">{product.name}</Typography>
				<Typography variant="body2" color="text.secondary">{product.description}</Typography>
				<Typography variant="subtitle1" sx={{ mt: 1 }}>${product.price.toFixed(2)}</Typography>
			</CardContent>
			<CardActions>
				<Button size="small" component={Link} to={`/products/${product.id}`}>View</Button>
				<Button size="small" component={Link} to={`/edit/${product.id}`}>Edit</Button>
				<Button size="small" color="error" onClick={() => onDelete(product.id)}>Delete</Button>
			</CardActions>
		</Card>
	);
}


