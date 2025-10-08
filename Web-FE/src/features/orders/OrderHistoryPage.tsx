import { Alert, Container, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { OrdersApi, type Order } from "./api";
import { useAuth } from "../auth/AuthContext";

export default function OrderHistoryPage() {
    const { isAuthenticated } = useAuth();
    const listQuery = useQuery({
        queryKey: ["orders", "me"],
        queryFn: () => OrdersApi.myOrders(),
        enabled: isAuthenticated,
    });

    if (!isAuthenticated) {
        return (
            <Container sx={{ py: 3 }}>
                <Alert severity="info">Hãy đăng nhập để xem lịch sử đơn hàng</Alert>
            </Container>
        );
    }

    const items: Order[] = Array.isArray(listQuery.data) ? listQuery.data : [];

    return (
        <Container sx={{ py: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h5">Đơn hàng của tôi</Typography>
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
            </Stack>
        </Container>
    );
}


