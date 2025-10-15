import { Alert, Box, Button, Container, Stack, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { PaymentApi } from "./api";
import { UI_TEXTS } from "../../common/constants";

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const orderId = params.get("orderId") ?? "";

    useEffect(() => {
        if (orderId) {
            PaymentApi.success(orderId).catch(() => {/* ignore */});
        }
    }, [orderId]);

    return (
        <Container sx={{ py: 3 }}>
            <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button onClick={() => navigate('/asm')}>{UI_TEXTS.BACK}</Button>
                    <Typography variant="h5">Thanh toán thành công</Typography>
                </Stack>
                {orderId ? (
                    <Box>
                        <Typography>Mã đơn: {orderId}</Typography>
                        <Alert severity="success">Đơn hàng đã được thanh toán thành công!</Alert>
                    </Box>
                ) : (
                    <Alert severity="warning">Thiếu orderId</Alert>
                )}
                <Button variant="contained" onClick={() => navigate('/orders')}>Xem đơn hàng</Button>
            </Stack>
        </Container>
    );
}


