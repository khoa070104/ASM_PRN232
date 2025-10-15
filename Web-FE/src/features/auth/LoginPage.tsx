import { Alert, Box, Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { AuthApi } from "./api";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);
        try {
            const res = await AuthApi.login({ email, password });
            login(res.token, { id: res.userId, email, role: res.role });
            navigate('/');
        } catch (e: any) {
            setError(e.message ?? 'Đăng nhập thất bại');
        }
    };

    return (
        <Container sx={{ py: 3 }}>
            <Stack spacing={2} sx={{ maxWidth: 360 }}>
                <Typography variant="h5">Đăng nhập</Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField label="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button variant="contained" onClick={handleSubmit}>Đăng nhập</Button>
                <Box>
                    <Button onClick={() => navigate('/register')}>Chưa có tài khoản? Đăng ký</Button>
                </Box>
            </Stack>
        </Container>
    );
}


