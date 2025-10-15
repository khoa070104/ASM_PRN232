import { useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Box, Button, Container, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UI_TEXTS } from "../../common/constants";
import { CartApi, type CartItem } from "./api";
import { useAuth } from "../auth/AuthContext";

export default function CartPage() {
    const navigate = useNavigate();
    const qc = useQueryClient();
    const { isAuthenticated } = useAuth();
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const debounceTimers = useRef<Record<string, any>>({});

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
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button onClick={() => navigate('/asm')}>{UI_TEXTS.BACK}</Button>
                    <Typography variant="h5">Giỏ hàng</Typography>
                </Stack>
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
                                            inputProps={{ min: 1 }}
                                            onChange={(e) => {
                                                const raw = Number(e.target.value);
                                                const next = Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 1;
                                                setQuantities((prev) => ({ ...prev, [it.id]: next }));
                                                if (debounceTimers.current[it.id]) {
                                                    clearTimeout(debounceTimers.current[it.id]);
                                                }
                                                debounceTimers.current[it.id] = setTimeout(() => {
                                                    updateMut.mutate({ id: it.id, qty: next });
                                                }, 400);
                                            }}
                                            sx={{ width: 100 }}
                                        />
                                    </TableCell>
                                    <TableCell>{it.subtotal}</TableCell>
                                    <TableCell>
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

            <Stack direction="row" justifyContent="flex-end" mt={2}>
                <Button variant="contained" onClick={() => navigate('/checkout')} disabled={!items.length}>
                    {UI_TEXTS.CHECKOUT}
                </Button>
            </Stack>
        </Container>
    );
}


