import axios, { AxiosError } from "axios";

export type UploadResult = {
	asset_id: string;
	public_id: string;
	secure_url: string;
};

export async function uploadImageToCloudinary(
	file: File,
	options?: { folder?: string; onProgress?: (percent: number) => void }
): Promise<UploadResult> {
	const cloudName = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string) || "";
	const uploadPreset = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string) || "";
	const defaultFolder = (import.meta.env.VITE_CLOUDINARY_FOLDER as string) || "";

	if (!cloudName || !uploadPreset) {
		throw new Error("Thiếu cấu hình Cloudinary (VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET)");
	}

	const form = new FormData();
	form.append("file", file);
	form.append("upload_preset", uploadPreset);
	const folder = options?.folder ?? defaultFolder;
	if (folder) form.append("folder", folder);

	const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
	try {
		const res = await axios.post<UploadResult>(url, form, {
			onUploadProgress: (evt) => {
				if (!options?.onProgress || !evt.total) return;
				const percent = Math.round((evt.loaded * 100) / evt.total);
				options.onProgress(percent);
			},
		});
		return res.data as UploadResult;
	} catch (err) {
		const ax = err as AxiosError<any>;
		const msg = ax.response?.data?.error?.message || ax.message || "Upload failed";
		throw new Error(msg);
	}
}


