import { AppBar, Toolbar, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

export default function Navbar() {
    const navigate = useNavigate();
    const { isAuthenticated, isAdmin, logout } = useAuth();

    return (
        <AppBar position="static" color="default" elevation={0}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>PRN232</Typography>
                <Stack direction="row" spacing={1}>
                    <Button onClick={() => navigate('/cart')}>Cart</Button>
                    <Button onClick={() => navigate('/checkout')}>Checkout</Button>
                    <Button onClick={() => navigate('/orders')}>Orders</Button>
                    {isAdmin && <Button onClick={() => navigate('/admin/products')}>Admin</Button>}
                    {isAuthenticated ? (
                        <Button onClick={logout}>Logout</Button>
                    ) : (
                        <>
                            <Button onClick={() => navigate('/login')}>Login</Button>
                            <Button onClick={() => navigate('/register')}>Register</Button>
                        </>
                    )}
                </Stack>
            </Toolbar>
        </AppBar>
    );
}


