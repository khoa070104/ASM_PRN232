export type UserRegisterDto = {
    email: string;
    password: string;
    role: string; // "User" | "Admin"
};

export type UserLoginDto = {
	email: string;
	password: string;
};

export type AuthResponseDto = {
	token: string;
	email: string;
	role: string;
};

export type User = {
	email: string;
	role: string;
};
