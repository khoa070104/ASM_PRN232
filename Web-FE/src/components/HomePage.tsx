import { Box, Container, List, ListItemButton, ListItemText, Typography, Button, Stack, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../features/auth/AuthContext";
import LoginForm from "../features/auth/LoginForm";
import RegisterForm from "../features/auth/RegisterForm";

export default function HomePage() {
	const navigate = useNavigate();
	const { user, logout, isAuthenticated, isAdmin } = useAuth();
	const [openLogin, setOpenLogin] = useState(false);
	const [openRegister, setOpenRegister] = useState(false);

	const handleAuthSuccess = () => {
		setOpenLogin(false);
		setOpenRegister(false);
	};


	return (
		<Container sx={{ py: 4 }}>
			<Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
				<Typography variant="h4">Assignment PRN232 - KhoaNA</Typography>
				<Stack direction="row" spacing={1}>
					{isAuthenticated ? (
						<>
							<Typography variant="body2" sx={{ alignSelf: "center" }}>
								Xin chào, {user?.email} ({user?.role})
							</Typography>
							<Button onClick={logout} variant="outlined" size="small">
								Đăng xuất
							</Button>
						</>
					) : (
						<>
							<Button onClick={() => setOpenLogin(true)} variant="outlined" size="small">
								Đăng nhập
							</Button>
							<Button onClick={() => setOpenRegister(true)} variant="contained" size="small">
								Đăng ký
							</Button>
						</>
					)}
				</Stack>
			</Stack>

			<Typography variant="h6" sx={{ mb: 1 }}>List Assignment:</Typography>
			<Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
				<List>
					<ListItemButton onClick={() => navigate('/asm01')}>
						<ListItemText 
							primary="ASM01" 
							secondary={isAdmin ? "CRUD Products (Admin only)" : "CRUD Products (Read only)"} 
						/>
					</ListItemButton>
                            <ListItemButton onClick={() => navigate('/cart')}>
                                <ListItemText primary="Cart" secondary="Xem giỏ hàng" />
                            </ListItemButton>
                            <ListItemButton onClick={() => navigate('/checkout')}>
                                <ListItemText primary="Checkout" secondary="Đặt hàng" />
                            </ListItemButton>
                            <ListItemButton onClick={() => navigate('/orders')}>
                                <ListItemText primary="Orders" secondary="Lịch sử đơn" />
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

			<Dialog open={openLogin} onClose={() => setOpenLogin(false)} maxWidth="sm" fullWidth>
				<DialogTitle>Đăng nhập</DialogTitle>
				<DialogContent>
					<LoginForm 
						onSuccess={handleAuthSuccess}
						onSwitchToRegister={() => { setOpenLogin(false); setOpenRegister(true); }}
					/>
				</DialogContent>
			</Dialog>

			<Dialog open={openRegister} onClose={() => setOpenRegister(false)} maxWidth="sm" fullWidth>
				<DialogTitle>Đăng ký</DialogTitle>
				<DialogContent>
					<RegisterForm 
						onSuccess={handleAuthSuccess}
						onSwitchToLogin={() => { setOpenRegister(false); setOpenLogin(true); }}
					/>
				</DialogContent>
			</Dialog>
		</Container>
	);
}


