import { Container, Stack, Typography, Button } from "@mui/material";
import ProductsPage from "./ProductsPage";
import { useNavigate } from "react-router-dom";

export default function ProductManagementPage() {
    const navigate = useNavigate();
    return (
        <Container sx={{ py: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Button onClick={() => navigate('/')}>Trở về</Button>
                <Typography variant="h5">Quản lý sản phẩm</Typography>
            </Stack>
            <ProductsPage />
        </Container>
    );
}


