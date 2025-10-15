import { useState } from "react";
import { Box, Button, Stack, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { AuthApi } from "./api";
import { useAuth } from "./AuthContext";
import type { UserRegisterDto } from "./types";

type Props = {
	onSuccess?: () => void;
	onSwitchToLogin?: () => void;
};

export default function RegisterForm({ onSuccess, onSwitchToLogin }: Props) {
	const { login } = useAuth();
    const [form, setForm] = useState<UserRegisterDto>({ email: "", password: "", role: "User" });

    const registerMut = useMutation({
        mutationFn: (dto: UserRegisterDto) => AuthApi.register(dto),
        onSuccess: (data) => {
            login(data.token, { email: data.email, role: data.role });
            onSuccess?.();
        },
        onError: (error: any) => {
            console.error("Register failed:", error);
            alert(error.message || "Đăng ký thất bại");
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

    const handleRoleChange = (e: any) => {
        const value = e.target.value as string;
        setForm((prev) => ({ ...prev, role: value }));
    };

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		registerMut.mutate(form);
	};

	return (
		<Box component="form" onSubmit={handleSubmit}>
			<Stack spacing={2}>
				<Typography variant="h6">Đăng ký</Typography>
				<TextField
					size="small"
					label="Email"
					name="email"
					type="email"
					value={form.email}
					onChange={handleChange}
					required
					fullWidth
				/>
				<TextField
					size="small"
					label="Mật khẩu"
					name="password"
					type="password"
					value={form.password}
					onChange={handleChange}
					required
					fullWidth
					helperText="Mật khẩu phải có ít nhất 6 ký tự"
				/>
                <FormControl size="small" fullWidth>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                        labelId="role-label"
                        label="Role"
                        name="role"
                        value={form.role}
                        onChange={handleRoleChange}
                    >
                        <MenuItem value="User">User</MenuItem>
                        <MenuItem value="Admin">Admin</MenuItem>
                    </Select>
                </FormControl>
				<Button
					type="submit"
					variant="contained"
					disabled={registerMut.isPending}
					fullWidth
				>
					{registerMut.isPending ? "Đang đăng ký..." : "Đăng ký"}
				</Button>
				{onSwitchToLogin && (
					<Button onClick={onSwitchToLogin} variant="text" fullWidth>
						Đã có tài khoản? Đăng nhập
					</Button>
				)}
			</Stack>
		</Box>
	);
}
