import { useEffect, useMemo, useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import type { ProductCreateDto, ProductReadDto, ProductUpdateDto } from "./types";

type Props = {
	mode: "create" | "edit";
	initial?: ProductReadDto | null;
	onCancel: () => void;
	onSubmit: (payload: ProductCreateDto | ProductUpdateDto) => void;
};

export default function ProductForm({ mode, initial, onCancel, onSubmit }: Props) {
	const initialState: ProductCreateDto = useMemo(() => ({
		name: initial?.name ?? "",
		description: initial?.description ?? "",
		price: initial?.price ?? 0,
		image: initial?.image ?? null,
	}), [initial]);

	const [form, setForm] = useState<ProductCreateDto>(initialState);

	useEffect(() => {
		setForm(initialState);
	}, [initialState]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: name === "price" ? Number(value) : value,
		}));
	};

	return (
		<Box component="form" onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
			<Stack spacing={2}>
				<TextField size="small" label="Name" name="name" value={form.name} onChange={handleChange} required />
				<TextField size="small" label="Description" name="description" value={form.description} onChange={handleChange} />
				<TextField size="small" label="Price" name="price" type="number" value={form.price} onChange={handleChange} inputProps={{ step: 0.01 }} />
				<TextField size="small" label="Image URL" name="image" value={form.image ?? ""} onChange={handleChange} />
				<Stack direction="row" spacing={1}>
					<Button type="submit" variant="contained">{mode === "create" ? "Create" : "Update"}</Button>
					<Button onClick={onCancel}>Cancel</Button>
				</Stack>
			</Stack>
		</Box>
	);
}


