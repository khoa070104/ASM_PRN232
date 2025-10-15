import { Alert, Avatar, Box, Button, Container, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ProductsApi } from "./api";
import { CartApi } from "../cart/api";

export default function ProductDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const q = useQuery({ queryKey: ["product", id], queryFn: () => ProductsApi.getById(id!), enabled: !!id });

    return (
        <Container sx={{ py: 3 }}>
            <Stack spacing={2}>
                <Button onClick={() => navigate('/asm')}>Trở về</Button>
                {q.isError && <Alert severity="error">Không tải được sản phẩm</Alert>}
                {q.data && (
                    <Stack direction="row" spacing={2}>
                        <Avatar variant="rounded" src={q.data.image ?? undefined} sx={{ width: 160, height: 160 }}>
                            {q.data.name?.charAt(0) ?? "?"}
                        </Avatar>
                        <Box>
                            <Typography variant="h5">{q.data.name}</Typography>
                            <Typography>Giá: {q.data.price}</Typography>
                            <Typography mt={1}>{q.data.description}</Typography>
                            <Button variant="contained" sx={{ mt: 2 }} onClick={() => CartApi.add({ productId: q.data.id, quantity: 1 })}>Thêm vào giỏ</Button>
                        </Box>
                    </Stack>
                )}
            </Stack>
        </Container>
    );
}


