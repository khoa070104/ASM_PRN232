import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Stack, Typography, Avatar, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ProductsApi } from "./api";
import { useNavigate } from "react-router-dom";
import type { ProductCreateDto, ProductReadDto, ProductUpdateDto } from "./types";
import ProductsTable from "./ProductsTable";
import ProductForm from "./ProductForm";

export default function ProductsPage() {
	const qc = useQueryClient();
    const navigate = useNavigate();
	const [toast, setToast] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });
	const [openCreate, setOpenCreate] = useState(false);
	const [editItem, setEditItem] = useState<ProductReadDto | null>(null);
    const [previewItem, setPreviewItem] = useState<ProductReadDto | null>(null);
    const [query, setQuery] = useState("");
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

	const listQuery = useQuery({
		queryKey: ["products"],
		queryFn: () => ProductsApi.list(),
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

	const items = useMemo<ProductReadDto[]>(() => (Array.isArray(listQuery.data) ? listQuery.data : []), [listQuery.data]);

	return (
		<Container sx={{ py: 3 }}>
			<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
				<Stack direction="row" spacing={2} alignItems="center">
					<Button onClick={() => navigate('/')}>Back</Button>
					<Typography variant="h5">Products</Typography>
				</Stack>
				<Button variant="contained" onClick={() => setOpenCreate(true)}>Add</Button>
			</Stack>

			{listQuery.isError && (
				<Alert severity="error">{(listQuery.error as any)?.message ?? "Lỗi tải dữ liệu"}</Alert>
			)}

            <Stack direction="row" mb={1}>
                <TextField
                    size="small"
                    placeholder="Search by name..."
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

            <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1, overflow: "hidden" }}>
                <ProductsTable
                    items={items.filter((x) => x.name.toLowerCase().includes(query.toLowerCase()))}
					onPreview={(it) => setPreviewItem(it)}
					onEdit={(it) => setEditItem(it)}
                    onDelete={(id) => setConfirmDeleteId(id)}
				/>
			</Box>

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


