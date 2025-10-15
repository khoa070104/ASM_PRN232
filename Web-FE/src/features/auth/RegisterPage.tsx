import { Alert, Box, Button, Container, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthApi } from "./api";
import type { UserRegisterDto } from "./types";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<string>("User");
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmError, setConfirmError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        setError(null);
        setSuccess(false);
        // Validate
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!emailRegex.test(email)) {
            setEmailError("Email không hợp lệ");
            return;
        } else setEmailError(null);

        // 8-64, có chữ thường, CHỮ HOA, số, kí tự đặc biệt
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/]).{8,64}$/;
        if (!passwordRegex.test(password)) {
            setPasswordError("Mật khẩu 8-64 ký tự, gồm hoa, thường, số, ký tự đặc biệt");
            return;
        } else setPasswordError(null);

        if (confirmPassword !== password) {
            setConfirmError("Xác nhận mật khẩu không khớp");
            return;
        } else setConfirmError(null);

        try {
            const dto: UserRegisterDto = { email, password, role };
            await AuthApi.register(dto);
            setSuccess(true);
        } catch (e: any) {
            setError(e.message ?? 'Đăng ký thất bại');
        }
    };

    return (
        <Container sx={{ py: 3 }}>
            <Stack spacing={2} sx={{ maxWidth: 360 }}>
                <Typography variant="h5">Đăng ký</Typography>
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">Đăng ký thành công, vui lòng đăng nhập</Alert>}
                <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} error={!!emailError} helperText={emailError ?? ""} />
                <TextField label="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={!!passwordError} helperText={passwordError ?? ""} />
                <TextField label="Xác nhận mật khẩu" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={!!confirmError} helperText={confirmError ?? ""} />
                <TextField select label="Role" value={role} onChange={(e) => setRole(e.target.value)}>
                    <MenuItem value="User">User</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                </TextField>
                <Button variant="contained" onClick={handleSubmit}>Đăng ký</Button>
                <Box>
                    <Button onClick={() => navigate('/login')}>Đã có tài khoản? Đăng nhập</Button>
                </Box>
            </Stack>
        </Container>
    );
}


