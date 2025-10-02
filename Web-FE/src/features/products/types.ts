export type ProductReadDto = {
	id: string;
	name: string;
	description: string;
	price: number;
	image: string | null;
	createdAtUtc: string;
	updatedAtUtc: string | null;
};

export type ProductCreateDto = {
	name: string;
	description: string;
	price: number;
	image: string | null;
};

export type ProductUpdateDto = ProductCreateDto;


