import { Alert, Box, Button, Container, Stack, Typography, Table, TableBody, TableCell, TableHead, TableRow, Divider } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MESSAGES, UI_TEXTS } from "../../common/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import { OrdersApi, PaymentApi, type Order } from "./api";
import { useAuth } from "../auth/AuthContext";
import { CartApi, type CartItem } from "../cart/api";

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    // Giỏ hàng trước khi tạo đơn
    const listCartQuery = useQuery({
        queryKey: ["cart"],
        queryFn: () => CartApi.list(),
        enabled: isAuthenticated,
    });
    const cartItems: CartItem[] = Array.isArray(listCartQuery.data) ? listCartQuery.data : [];
    const cartTotal = cartItems.reduce((sum, it) => sum + it.subtotal, 0);

    const createMut = useMutation({
        mutationFn: () => OrdersApi.create(),
        onSuccess: async (res) => {
            const od = await OrdersApi.getById(res.orderId);
            setOrder(od);
        }
    });
    const payAllMut = useMutation({
        mutationFn: async () => {
            const createdId = order?.id ?? (await OrdersApi.create()).orderId;
            const s = await PaymentApi.createStripeSession(createdId);
            return s.url;
        },
        onSuccess: (url) => {
            window.location.href = url;
        }
    });
    // removed mock flow

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
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button onClick={() => navigate('/asm')}>{UI_TEXTS.BACK}</Button>
                    <Typography variant="h5">Checkout</Typography>
                </Stack>
                {order && (
                    <Box>
                        <Typography variant="h6">{UI_TEXTS.ORDER_INFO}</Typography>
                        <Typography>{UI_TEXTS.ORDER_ID}: {order.id}</Typography>
                        <Typography>{UI_TEXTS.TOTAL_AMOUNT}: {order.totalAmount}</Typography>
                        <Typography>{UI_TEXTS.STATUS}: {order.status}</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1">{UI_TEXTS.ORDER_DETAILS}</Typography>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>{UI_TEXTS.COL_PRODUCT}</TableCell>
                                    <TableCell>{UI_TEXTS.COL_QTY}</TableCell>
                                    <TableCell>{UI_TEXTS.COL_UNIT_PRICE}</TableCell>
                                    <TableCell>{UI_TEXTS.COL_SUBTOTAL}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {order.details.map((d, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{d.productName}</TableCell>
                                        <TableCell>{d.quantity}</TableCell>
                                        <TableCell>{d.unitPrice}</TableCell>
                                        <TableCell>{d.subtotal}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                )}
                {!order && (
                    <Box>
                        <Typography variant="h6">{UI_TEXTS.ORDER_DETAILS}</Typography>
                        {listCartQuery.isError && <Alert severity="error">{MESSAGES.CART_LOAD_ERROR}</Alert>}
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>{UI_TEXTS.COL_PRODUCT}</TableCell>
                                    <TableCell>{UI_TEXTS.COL_QTY}</TableCell>
                                    <TableCell>{UI_TEXTS.COL_UNIT_PRICE}</TableCell>
                                    <TableCell>{UI_TEXTS.COL_SUBTOTAL}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cartItems.length ? (
                                    cartItems.map((d) => (
                                        <TableRow key={d.id}>
                                            <TableCell>{d.productName}</TableCell>
                                            <TableCell>{d.quantity}</TableCell>
                                            <TableCell>{d.unitPrice}</TableCell>
                                            <TableCell>{d.subtotal}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4}>Giỏ hàng trống</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <Stack direction="row" justifyContent="flex-end" mt={1}>
                            <Typography fontWeight={600}>{UI_TEXTS.TOTAL_AMOUNT}: {cartTotal}</Typography>
                        </Stack>
                    </Box>
                )}
                {createMut.isError && <Alert severity="error">Đặt hàng thất bại</Alert>}
                <Button variant="contained" onClick={() => payAllMut.mutate()} disabled={payAllMut.isPending || (!order && cartItems.length === 0)}>
                    {payAllMut.isPending ? "Đang thanh toán..." : "Thanh toán"}
                </Button>
                {payAllMut.isError && <Alert severity="error">{(payAllMut.error as any)?.message ?? "Thanh toán thất bại"}</Alert>}
                <Button
                    variant="text"
                    onClick={async () => {
                        if (order) {
                            try { await PaymentApi.fail(order.id); } catch {}
                        }
                        navigate('/cart');
                    }}
                >
                    Hủy thanh toán, quay lại giỏ hàng
                </Button>
            </Stack>
        </Container>
    );
}


