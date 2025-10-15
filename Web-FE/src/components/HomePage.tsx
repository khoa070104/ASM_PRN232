import { Box, Container, List, ListItemButton, ListItemText, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

export default function HomePage() {
	const navigate = useNavigate();
    const { isAuthenticated, isAdmin } = useAuth();

	return (
		<Container sx={{ py: 4 }}>
            {/* Header global đã hiển thị; bỏ header cục bộ */}

			<Typography variant="h6" sx={{ mb: 1 }}>List Assignment:</Typography>
			<Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
				<List>
					<ListItemButton onClick={() => navigate('/asm')}>
						<ListItemText 
							primary="Shop Bán Đồ Chơi" 
							secondary={isAdmin ? "Quản lí sản phẩm" : "Danh mục sản phẩm và giỏ hàng"} 
						/>
					</ListItemButton>
				</List>
			</Box>

            {!isAuthenticated && (
                <Box sx={{ mt: 2, p: 2, bgcolor: "info.light", borderRadius: 1 }}>
                    <Typography variant="body2" color="info.contrastText">
                        💡 Đăng nhập để có thể tạo, sửa, xóa sản phẩm. Chỉ Admin mới có quyền CRUD đầy đủ.
                    </Typography>
                </Box>
            )}
		</Container>
	);
}


