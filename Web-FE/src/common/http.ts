import axios from "axios";
import type { AxiosError, AxiosInstance } from "axios";
import { API_BASE_URL } from "./constants";

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

http.interceptors.response.use(
	(resp) => resp,
	(error: AxiosError<ApiErrorBody>) => {
		const status = error.response?.status;
		const data = error.response?.data;
		const code = data?.error ?? "INTERNAL_ERROR";
		const message = data?.message ?? "Unexpected error";
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


