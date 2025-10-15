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
	userId?: string; // BE trả về UserId; đánh dấu optional để tương thích
};

export type User = {
	id?: string;
	email: string;
	role: string;
};
