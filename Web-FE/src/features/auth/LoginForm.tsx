import { useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { AuthApi } from "./api";
import { useAuth } from "./AuthContext";
import type { UserLoginDto } from "./types";

type Props = {
	onSuccess?: () => void;
	onSwitchToRegister?: () => void;
};

export default function LoginForm({ onSuccess, onSwitchToRegister }: Props) {
	const { login } = useAuth();
	const [form, setForm] = useState<UserLoginDto>({ email: "", password: "" });

	const loginMut = useMutation({
		mutationFn: (dto: UserLoginDto) => AuthApi.login(dto),
		onSuccess: (data) => {
			login(data.token, { email: data.email, role: data.role });
			onSuccess?.();
		},
		onError: (error: any) => {
			console.error("Login failed:", error);
			alert(error.message || "Đăng nhập thất bại");
		},
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		loginMut.mutate(form);
	};

	return (
		<Box component="form" onSubmit={handleSubmit}>
			<Stack spacing={2}>
				<Typography variant="h6">Đăng nhập</Typography>
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
				/>
				<Button
					type="submit"
					variant="contained"
					disabled={loginMut.isPending}
					fullWidth
				>
					{loginMut.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
				</Button>
				{onSwitchToRegister && (
					<Button onClick={onSwitchToRegister} variant="text" fullWidth>
						Chưa có tài khoản? Đăng ký
					</Button>
				)}
			</Stack>
		</Box>
	);
}
