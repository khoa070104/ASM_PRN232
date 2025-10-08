import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Box, Button, Container, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { CartApi, type CartItem } from "./api";
import { useAuth } from "../auth/AuthContext";

export default function CartPage() {
    const qc = useQueryClient();
    const { isAuthenticated } = useAuth();
    const [quantities, setQuantities] = useState<Record<string, number>>({});

    const listQuery = useQuery({
        queryKey: ["cart"],
        queryFn: () => CartApi.list(),
        enabled: isAuthenticated,
    });

    const updateMut = useMutation({
        mutationFn: (p: { id: string; qty: number }) => CartApi.update(p.id, { quantity: p.qty }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
    });

    const deleteMut = useMutation({
        mutationFn: (id: string) => CartApi.remove(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
    });

    const items = useMemo<CartItem[]>(() => (Array.isArray(listQuery.data) ? listQuery.data : []), [listQuery.data]);
    const total = items.reduce((sum, it) => sum + it.subtotal, 0);

    if (!isAuthenticated) {
        return (
            <Container sx={{ py: 3 }}>
                <Alert severity="info">Hãy đăng nhập để xem giỏ hàng</Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Giỏ hàng</Typography>
                <Typography>Tổng tiền: {total}</Typography>
            </Stack>

            {listQuery.isError && <Alert severity="error">Không tải được giỏ hàng</Alert>}

            <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1, overflow: "hidden" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tên</TableCell>
                            <TableCell>Giá</TableCell>
                            <TableCell>Số lượng</TableCell>
                            <TableCell>Tạm tính</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.length ? (
                            items.map((it) => (
                                <TableRow key={it.id}>
                                    <TableCell>{it.productName}</TableCell>
                                    <TableCell>{it.unitPrice}</TableCell>
                                    <TableCell>
                                        <TextField
                                            size="small"
                                            type="number"
                                            value={quantities[it.id] ?? it.quantity}
                                            onChange={(e) => setQuantities((prev) => ({ ...prev, [it.id]: Number(e.target.value) }))}
                                            sx={{ width: 100 }}
                                        />
                                    </TableCell>
                                    <TableCell>{it.subtotal}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => updateMut.mutate({ id: it.id, qty: quantities[it.id] ?? it.quantity })} sx={{ mr: 1 }}>Cập nhật</Button>
                                        <Button color="error" onClick={() => deleteMut.mutate(it.id)}>Xoá</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5}>Giỏ hàng trống</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Box>
        </Container>
    );
}


