import { ROUTES } from "../../common/constants";
import { post } from "../../common/http";
import type { UserRegisterDto, UserLoginDto, AuthResponseDto } from "./types";

export const AuthApi = {
	register: (dto: UserRegisterDto) => post<UserRegisterDto, AuthResponseDto>(`${ROUTES.auth}/register`, dto),
	login: (dto: UserLoginDto) => post<UserLoginDto, AuthResponseDto>(`${ROUTES.auth}/login`, dto),
};
