export interface Product {
	id: number;
	name: string;
	description: string;
	price: number;
	pictureUrl: string;
	//? determines those fields are optional
	type?: string;
	quantityInStock?: number;
}

export interface productParams {
	orderBy: string;
	searchTerm?: string;
	types: string[];
	pageNumber: number;
	pageSize: number;
}