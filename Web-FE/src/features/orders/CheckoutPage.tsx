import { Alert, Box, Button, Container, Stack, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { OrdersApi } from "./api";
import { useAuth } from "../auth/AuthContext";

export default function CheckoutPage() {
    const { isAuthenticated } = useAuth();
    const createMut = useMutation({
        mutationFn: () => OrdersApi.create(),
    });

    if (!isAuthenticated) {
        return (
            <Container sx={{ py: 3 }}>
                <Alert severity="info">Hãy đăng nhập để checkout</Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h5">Checkout</Typography>
                {createMut.isSuccess && (
                    <Box>
                        <Typography>Tạo đơn thành công. Mã đơn: {createMut.data.orderId}</Typography>
                        <Typography>Tổng tiền: {createMut.data.totalAmount}</Typography>
                    </Box>
                )}
                {createMut.isError && <Alert severity="error">Đặt hàng thất bại</Alert>}
                <Button variant="contained" onClick={() => createMut.mutate()} disabled={createMut.isPending}>
                    {createMut.isPending ? "Đang đặt hàng..." : "Place Order"}
                </Button>
            </Stack>
        </Container>
    );
}


