import axios from "axios";
import type { AxiosError, AxiosInstance } from "axios";
import { API_BASE_URL } from "./constants";
import { UI_ROUTES } from "./constants";

export type ApiErrorBody = {
	error: string;
	message: string;
};

export class ApiError extends Error {
	public readonly code: string;
	public readonly status?: number;

	constructor(code: string, message: string, status?: number) {
		super(message);
		this.code = code;
		this.status = status;
	}
}

const http: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	headers: { "Content-Type": "application/json", Accept: "application/json" },
});

// Add JWT token to requests
http.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("auth_token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

http.interceptors.response.use(
	(resp) => resp,
	(error: AxiosError<ApiErrorBody | string[]>) => {
		const status = error.response?.status;
		const data = error.response?.data as any;
		let code = (data && (data as ApiErrorBody).error) ?? "INTERNAL_ERROR";
		let message = (data && (data as ApiErrorBody).message) ?? "Unexpected error";

		// FluentValidation ở BE trả về mảng string khi 400
		if (status === 400 && Array.isArray(data)) {
			code = "VALIDATION_ERROR";
			message = data.join("; ");
		}

		if (status === 401) {
			localStorage.removeItem("auth_token");
			localStorage.removeItem("auth_user");
			if (typeof window !== "undefined" && !window.location.pathname.startsWith(UI_ROUTES.login)) {
				const redirectUrl = UI_ROUTES.login + `?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
				window.location.replace(redirectUrl);
			}
		}
		return Promise.reject(new ApiError(code, message, status));
	}
);

export const get = async <T>(url: string, signal?: AbortSignal): Promise<T> => {
	const res = await http.get<T>(url, { signal });
	return res.data;
};

export const post = async <TReq, TRes>(url: string, body: TReq, signal?: AbortSignal): Promise<TRes> => {
	const res = await http.post<TRes>(url, body, { signal });
	return res.data;
};

export const put = async <TReq, TRes>(url: string, body: TReq, signal?: AbortSignal): Promise<TRes> => {
	const res = await http.put<TRes>(url, body, { signal });
	return res.data;
};

export const del = async (url: string, signal?: AbortSignal): Promise<void> => {
	await http.delete(url, { signal });
};


