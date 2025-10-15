import { Box, Container, Link, Stack, Typography } from "@mui/material";
import { useAuth } from "../features/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { UI_ROUTES } from "../common/constants";

export default function Header() {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Container sx={{ py: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack>
                        <Typography variant="h5" sx={{ lineHeight: 1 }}>Assignment PRN232 - KhoaNA</Typography>
                        {isAuthenticated && (
                            <Typography variant="body2" color="text.secondary">Xin chào, {user?.email} ({user?.role})</Typography>
                        )}
                    </Stack>
                    {isAuthenticated ? (
                        <Link component="button" onClick={logout} sx={{ color: 'error.main', textTransform: 'uppercase', fontWeight: 600 }}>
                            Đăng xuất
                        </Link>
                    ) : (
                        <Stack direction="row" spacing={2}>
                            <Link component="button" onClick={() => navigate(UI_ROUTES.login)} sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                                Login
                            </Link>
                            <Link component="button" onClick={() => navigate(UI_ROUTES.register)} sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                                Register
                            </Link>
                        </Stack>
                    )}
                </Stack>
            </Container>
        </Box>
    );
}


