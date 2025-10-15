import { Avatar, Button, Stack, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import dayjs from "dayjs";
import type { ProductReadDto } from "./types";

type Props = {
    items: ProductReadDto[];
    onPreview: (item: ProductReadDto) => void;
    onEdit: (item: ProductReadDto) => void;
    onDelete: (id: string) => void;
	canEdit?: boolean;
	canDelete?: boolean;
	onAddToCart?: (id: string) => void;
};

export default function ProductsTable({ items, onPreview, onEdit, onDelete, canEdit = true, canDelete = true, onAddToCart }: Props) {
	return (
		<Table sx={{
			'& td, & th': { fontSize: '1.3rem', py: 2 },
			'& th': { fontWeight: 600 }
		}}>
			<TableHead>
				<TableRow>
					<TableCell>Hình ảnh</TableCell>
					<TableCell>Tên</TableCell>
					<TableCell>Giá</TableCell>
					<TableCell>Ngày tạo</TableCell>
					<TableCell>Ngày cập nhật</TableCell>
					<TableCell>Hành động</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{items.length > 0 ? (
					items.map((item) => (
						<TableRow key={item.id} hover>
							<TableCell>
								<Stack direction="row" alignItems="center" spacing={1}>
									<Avatar variant="rounded" src={item.image ?? undefined} alt={item.name} sx={{ width: 48, height: 48 }}>
										{item.name?.charAt(0) ?? "?"}
									</Avatar>
								</Stack>
							</TableCell>
							<TableCell>{item.name}</TableCell>
							<TableCell>{item.price}</TableCell>
							<TableCell>{dayjs(item.createdAtUtc).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
							<TableCell>{item.updatedAtUtc ? dayjs(item.updatedAtUtc).format('YYYY-MM-DD HH:mm:ss') : '-'}</TableCell>
                            <TableCell>
							<Button onClick={() => onPreview(item)} sx={{ mr: 1, '&:hover': { color: 'primary.main' }}}>XEM</Button>
							{onAddToCart && (
							<Button variant="outlined" onClick={() => onAddToCart(item.id)} sx={{ mr: 1 }}>THÊM VÀO GIỎ</Button>
							)}
								{canEdit && (
								<Button onClick={() => onEdit(item)} sx={{ mr: 1, '&:hover': { color: 'info.main' }}}>SỬA</Button>
								)}
								{canDelete && (
								<Button color="error" onClick={() => onDelete(item.id)} sx={{ '&:hover': { color: 'error.dark' }}}>XOÁ</Button>
								)}
                            </TableCell>
						</TableRow>
					))
				) : (
					<TableRow>
						<TableCell colSpan={6}>Không có dữ liệu</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}


