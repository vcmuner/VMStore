
//Names should match exactly what we have inside the response "pagination" header in our network request
export interface MetaData {
	currentPage: number;
	totalPages: number;
	pageSize: number;
	totalCount: number;
}

//Using generics so we can use it for anything and not only for Products in the future
export class PaginatedResponse<T> {
	items: T;
	metaData: MetaData;

	constructor(items: T, metaData: MetaData) {
		this.items = items;
		this.metaData = metaData;
	}
}