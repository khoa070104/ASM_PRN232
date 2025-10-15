import { Alert, Button, Container, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { UI_TEXTS } from "../../common/constants";
import { useQuery } from "@tanstack/react-query";
import { OrdersApi, type Order } from "./api";
import { useAuth } from "../auth/AuthContext";

export default function OrderHistoryPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [page, setPage] = React.useState(1);
    const pageSize = 10;
    const listQuery = useQuery({
        queryKey: ["orders", "me", page],
        queryFn: () => OrdersApi.myOrders(page, pageSize),
        enabled: isAuthenticated,
    });

    if (!isAuthenticated) {
        return (
            <Container sx={{ py: 3 }}>
                <Alert severity="info">Hãy đăng nhập để xem lịch sử đơn hàng</Alert>
            </Container>
        );
    }

    const items: Order[] = listQuery.data?.items ?? [];
    const total: number = listQuery.data?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <Container sx={{ py: 3 }}>
            <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button onClick={() => navigate('/asm')}>{UI_TEXTS.BACK}</Button>
                    <Typography variant="h5">Đơn hàng của tôi</Typography>
                </Stack>
                {listQuery.isError && <Alert severity="error">Không tải được danh sách</Alert>}
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã đơn</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Tổng tiền</TableCell>
                            <TableCell>Ngày tạo</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.length ? (
                            items.map((o) => (
                                <TableRow key={o.id}>
                                    <TableCell>{o.id}</TableCell>
                                    <TableCell>{o.status}</TableCell>
                                    <TableCell>{o.totalAmount}</TableCell>
                                    <TableCell>{new Date(o.createdAtUtc).toLocaleString()}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4}>Chưa có đơn hàng</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <Stack direction="row" justifyContent="center" mt={2} spacing={1}>
                    <Button size="small" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Trang trước</Button>
                    <Typography variant="body2" sx={{ alignSelf: 'center' }}>{page}/{totalPages}</Typography>
                    <Button size="small" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Trang sau</Button>
                </Stack>
            </Stack>
        </Container>
    );
}


