import { Button, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { ProductCreate } from "../api/products";

const schema: yup.ObjectSchema<ProductCreate> = yup.object({
	name: yup.string().required().max(200),
	description: yup.string().required().max(2000),
	price: yup.number().required().moreThan(0),
	image: yup.string().url().nullable().optional(),
}) as yup.ObjectSchema<ProductCreate>;

type Props = {
	defaultValues?: Partial<ProductCreate>;
	onSubmit: (data: ProductCreate) => void;
	loading?: boolean;
};

export default function ProductForm({ defaultValues, onSubmit, loading }: Props) {
    const { register, handleSubmit, formState: { errors } } = useForm<ProductCreate>({
        defaultValues: defaultValues as any,
        resolver: yupResolver(schema) as any,
    });

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={2}>
				<TextField label="Name" {...register("name")} error={!!errors.name} helperText={errors.name?.message} />
				<TextField label="Description" multiline rows={3} {...register("description")} error={!!errors.description} helperText={errors.description?.message} />
				<TextField label="Price" type="number" inputProps={{ step: "0.01" }} {...register("price", { valueAsNumber: true })} error={!!errors.price} helperText={errors.price?.message} />
				<TextField label="Image URL" {...register("image")} error={!!errors.image} helperText={errors.image?.message} />
				<Button type="submit" variant="contained" disabled={loading}>Submit</Button>
			</Stack>
		</form>
	);
}


