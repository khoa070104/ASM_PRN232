import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Stack, Typography, Avatar, TextField, InputAdornment, Badge, Card, CardActionArea, CardContent, CardMedia } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ProductsApi } from "./api";
import { useNavigate } from "react-router-dom";
import { MESSAGES } from "../../common/constants";
import { useAuth } from "../auth/AuthContext";
import type { ProductCreateDto, ProductReadDto, ProductUpdateDto } from "./types";
import ProductForm from "./ProductForm";
import { CartApi } from "../cart/api";

export default function ProductsPage() {
	const qc = useQueryClient();
    const navigate = useNavigate();
	const { isAdmin } = useAuth();
	const [toast, setToast] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });
	const [openCreate, setOpenCreate] = useState(false);
	const [editItem, setEditItem] = useState<ProductReadDto | null>(null);
    const [previewItem, setPreviewItem] = useState<ProductReadDto | null>(null);
    const [query, setQuery] = useState("");
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const pageSize = 5;
    const listQuery = useQuery({
        queryKey: ["products", page, query],
        queryFn: () => ProductsApi.list(page, pageSize, query),
    });

	// Fetch cart items to compute total quantity for badge
	const cartQuery = useQuery({
		queryKey: ["cart"],
		queryFn: () => CartApi.list(),
	});

	const createMut = useMutation({
		mutationFn: (dto: ProductCreateDto) => ProductsApi.create(dto),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["products"] });
			setToast({ open: true, message: "Tạo sản phẩm thành công", severity: "success" });
			setOpenCreate(false);
		},
		onError: (e: any) => setToast({ open: true, message: e.message ?? "Lỗi", severity: "error" }),
	});

	const updateMut = useMutation({
		mutationFn: (p: { id: string; dto: ProductUpdateDto }) => ProductsApi.update(p.id, p.dto),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["products"] });
			setToast({ open: true, message: "Cập nhật sản phẩm thành công", severity: "success" });
			setEditItem(null);
		},
		onError: (e: any) => setToast({ open: true, message: e.message ?? "Lỗi", severity: "error" }),
	});

	const deleteMut = useMutation({
		mutationFn: (id: string) => ProductsApi.remove(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["products"] });
			setToast({ open: true, message: "Xoá sản phẩm thành công", severity: "success" });
		},
		onError: (e: any) => setToast({ open: true, message: e.message ?? "Lỗi", severity: "error" }),
	});

    const items = useMemo<ProductReadDto[]>(() => (Array.isArray((listQuery.data as any)?.items) ? (listQuery.data as any).items : (Array.isArray(listQuery.data) ? (listQuery.data as any) : [])), [listQuery.data]);
    const total = useMemo<number>(() => (listQuery.data as any)?.total ?? items.length, [listQuery.data, items.length]);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

	const addToCartMut = useMutation({
		mutationFn: (productId: string) => CartApi.add({ productId, quantity: 1 }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["cart"] });
			setToast({ open: true, message: "Đã thêm vào giỏ", severity: "success" });
		},
		onError: (e: any) => setToast({ open: true, message: e.message ?? "Lỗi", severity: "error" }),
	});

	const cartCount = useMemo(() => {
		const items = Array.isArray(cartQuery.data) ? cartQuery.data : [];
		return items.reduce((sum, it) => sum + (it.quantity ?? 0), 0);
	}, [cartQuery.data]);

	return (
		<Container sx={{ py: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
				<Stack direction="row" spacing={2} alignItems="center">
					<Button onClick={() => navigate('/')}>Trở về</Button>
					<Typography variant="h5">Danh sách Đồ chơi</Typography>
				</Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    {isAdmin && (
                        <Button variant="contained" onClick={() => setOpenCreate(true)}>Thêm</Button>
                    )}
					<Badge color="error" badgeContent={cartCount} overlap="circular">
                    <Button onClick={() => navigate('/cart')}>Giỏ hàng</Button>
					</Badge>
					<Button onClick={() => navigate('/orders')}>Lịch sử đặt hàng</Button>
				</Stack>
			</Stack>

            <Alert severity="info" sx={{ mb: 2 }}>{MESSAGES.RENDER_FREE_TIER}</Alert>

			{listQuery.isError && (
				<Alert severity="error">{(listQuery.error as any)?.message ?? "Lỗi tải dữ liệu"}</Alert>
			)}

            <Stack direction="row" mb={1}>
                <TextField
                    size="small"
                    placeholder="Tìm theo tên..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ maxWidth: 320 }}
                />
            </Stack>

            <>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
                    gap: 2,
                }}>
                    {items
                        .filter((x) => x.name.toLowerCase().includes(query.toLowerCase()))
                        .map((p) => (
                            <Card key={p.id}>
                                <CardActionArea onClick={() => setPreviewItem(p)}>
                                    {p.image ? (
                                        <CardMedia component="img" height="160" image={p.image} alt={p.name} />
                                    ) : (
                                        <Box sx={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
                                            <Avatar variant="rounded" sx={{ width: 64, height: 64 }}>{p.name?.charAt(0) ?? "?"}</Avatar>
                                        </Box>
                                    )}
                                    <CardContent>
                                        <Typography variant="subtitle1" noWrap textAlign="center">{p.name}</Typography>
                                        <Typography variant="body2" color="text.secondary" textAlign="center">Giá: {p.price}</Typography>
                                        <Stack direction="row" spacing={1} mt={1} justifyContent="center">
                                            <Button size="small" variant="outlined" onClick={(e) => { e.stopPropagation(); addToCartMut.mutate(p.id); }}>THÊM VÀO GIỎ</Button>
                                            {isAdmin && (
                                                <Button size="small" onClick={(e) => { e.stopPropagation(); setEditItem(p); }}>SỬA</Button>
                                            )}
                                        </Stack>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        ))}
                </Box>
                <Stack direction="row" justifyContent="center" mt={2} spacing={1}>
                    <Button size="small" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Trang trước</Button>
                    <Typography variant="body2" sx={{ alignSelf: 'center' }}>{page}/{totalPages}</Typography>
                    <Button size="small" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Trang sau</Button>
                </Stack>
            </>

			<Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
				<DialogTitle>Create Product</DialogTitle>
				<DialogContent>
					<ProductForm
						mode="create"
						onCancel={() => setOpenCreate(false)}
						onSubmit={(dto) => createMut.mutate(dto as ProductCreateDto)}
					/>
				</DialogContent>
			</Dialog>

			<Dialog open={!!editItem} onClose={() => setEditItem(null)} maxWidth="sm" fullWidth>
				<DialogTitle>Edit Product</DialogTitle>
				<DialogContent>
					<ProductForm
						mode="edit"
						initial={editItem}
						onCancel={() => setEditItem(null)}
						onSubmit={(dto) => editItem && updateMut.mutate({ id: editItem.id, dto: dto as ProductUpdateDto })}
					/>
				</DialogContent>
			</Dialog>

			<Dialog open={!!previewItem} onClose={() => setPreviewItem(null)} maxWidth="sm" fullWidth>
				<DialogTitle>Product Detail</DialogTitle>
				<DialogContent>
                    {previewItem && (
                        <Stack spacing={2}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar variant="rounded" src={previewItem.image ?? undefined} alt={previewItem.name} sx={{ width: 96, height: 96 }}>
                                    {previewItem.name?.charAt(0) ?? "?"}
                                </Avatar>
                                <Stack>
                                    <Typography variant="h6">{previewItem.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">Price: {previewItem.price}</Typography>
                                </Stack>
                            </Stack>
                            <Box>
                                <Typography variant="subtitle2">Description</Typography>
                                <Typography variant="body1">{previewItem.description}</Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">Created: {previewItem.createdAtUtc}</Typography>
                            {previewItem.updatedAtUtc && (
                                <Typography variant="caption" color="text.secondary">Updated: {previewItem.updatedAtUtc}</Typography>
                            )}
                        </Stack>
                    )}
				</DialogContent>
			</Dialog>

            <Dialog open={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)} maxWidth="xs" fullWidth>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this product?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={() => { if (confirmDeleteId) { deleteMut.mutate(confirmDeleteId); setConfirmDeleteId(null); } }}>Delete</Button>
                </DialogActions>
            </Dialog>

			<Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast((t) => ({ ...t, open: false }))}>
				<Alert severity={toast.severity} onClose={() => setToast((t) => ({ ...t, open: false }))}>{toast.message}</Alert>
			</Snackbar>
		</Container>
	);
}


