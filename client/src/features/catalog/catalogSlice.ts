import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { Product, productParams } from "../../app/models/product";
import { RootState } from "../../app/store/configureStore";
import { MetaData } from "../../app/models/pagination";

interface CatalogState {
	productsLoaded: boolean;
	filtersLoaded: boolean;
	status: string;
	types: string[];
	productParams: productParams;
	metaData: MetaData | null;
}
//From the adapter we get a method to create our initial state
const productsAdapter = createEntityAdapter<Product>(); //Stores a Product type

function getAxiosParams(productParams: productParams) {
	const params = new URLSearchParams();
	//Param names have to match with the API
	params.append('pageNumber', productParams.pageNumber.toString());
	params.append('pageSize', productParams.pageSize.toString());
	params.append('orderBy', productParams.orderBy);
	if (productParams.searchTerm) params.append('searchTerm', productParams.searchTerm);
	if (productParams.types.length > 0) params.append('types', productParams.types.toString());
	return params;
}

//Creating async thunk to get the list of products. Returns the product array
//Type params for createAsyncThunk<p1,p2,p3>:
//p1: What the function returns
//p2: Argument types
export const fetchProductsAsync = createAsyncThunk<Product[], void, { state: RootState }>(
	//Name
	'catalog/fetchProductsAsync',
	async (_, thunkAPI) => {
		const params = getAxiosParams(thunkAPI.getState().catalog.productParams);
		try {
			const response = await agent.Catalog.list(params);
			//Setting metadata in our state
			thunkAPI.dispatch(setMetaData(response.metaData));
			return response.items;
			//@typescript-eslint/no-explicit-any rule disabled in .eslintrc.cjs
			//We couuld also create a type for the error specify the properties that we're getting back in our error object from the API
		} catch (error: any) {
			return thunkAPI.rejectWithValue({ error: error.data })
		}
	}
)

export const fetchProductAsync = createAsyncThunk<Product, number>(
	//Name
	'catalog/fetchProductAsync',
	async (productId, thunkAPI) => {
		try {
			const product = await agent.Catalog.details(productId);
			return product;
		} catch (error: any) {
			//console.log(error); //We are catching inside the async inner function but not in the createAsyncThunk
			return thunkAPI.rejectWithValue({ error: error.data }) //With this our whole function will be rejected if for example, the id does not exist
		}
	}
)

export const fetchFilters = createAsyncThunk(
	'catalog/fetchFilters',
	async (_, thunkAPI) => {
		try {
			return agent.Catalog.fetchFilters();
		} catch (error: any) {
			return thunkAPI.rejectWithValue({ error: error.data })
		}
	}
)

function initParams() {
	return {
		//Default values matching the API
		pageNumber: 1,
		pageSize: 6,
		orderBy: 'name',
		types: []
	}
}

export const catalogSlice = createSlice({
	name: 'catalog',
	//Will return initial state for our products
	initialState: productsAdapter.getInitialState<CatalogState>({
		productsLoaded: false,
		filtersLoaded: false,
		status: 'idle',
		types: [],
		productParams: initParams(),
		metaData: null
	}),

	reducers: {
		setProductParams: (state, action) => {
			//Setting productsLoaded to false because we want to be able to trigger our use effect method which is listening for the productsLoaded state
			//If productsLoaded changes, useEffect will run again
			//And because our products will not be loaded or that value will be false, then it will go and dispatch and get the next batch of products
			//So we'll using our state to trigger a request to our API and get the next products
			state.productsLoaded = false;
			//Using spead operator because we want to append new values to our existing productParams
			state.productParams = { ...state.productParams, ...action.payload, pageNumber: 1 } //Defaulting to page number 1 everytime we set params. See "setPageNumber" comment below
		},
		//When using filters inclusing search, we want to reset the page number (bug where when there were 2 results, it was asking for page 3)
		//Only situation when we will not reset page number is while browsing through pages using the pagination
		setPageNumber: (state, action) => {
			state.productsLoaded = false;
			state.productParams = { ...state.productParams, ...action.payload }
		},
		setMetaData: (state, action) => {
			state.metaData = action.payload
		},
		resetProductParams: (state) => {
			state.productParams = initParams();
		}
	},
	//Adding extra reducers so we can do something with the products when we get them back
	extraReducers: (builder => {
		builder.addCase(fetchProductsAsync.pending, (state) => {
			state.status = 'pendingFetchProducts';
		});
		builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
			productsAdapter.setAll(state, action.payload);
			state.status = 'idle';
			state.productsLoaded = true;
		});
		builder.addCase(fetchProductsAsync.rejected, (state, action) => {
			console.log(action.payload);
			state.status = 'idle';
		});
		builder.addCase(fetchProductAsync.pending, (state) => {
			state.status = 'pendingFetchProduct';
		});
		builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
			productsAdapter.upsertOne(state, action.payload);
			state.status = 'idle';
		});
		builder.addCase(fetchProductAsync.rejected, (state, action) => {
			console.log(action);
			state.status = 'idle';
		});
		builder.addCase(fetchFilters.pending, (state) => {
			state.status = 'pendingFetchFilters';
		});
		builder.addCase(fetchFilters.fulfilled, (state, action) => {
			state.types = action.payload.types;
			state.status = 'idle';
			state.filtersLoaded = true;
		});
		builder.addCase(fetchFilters.rejected, (state, action) => {
			console.log(action);
			state.status = 'idle';
		});
	})
})

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);
export const { setProductParams, resetProductParams, setMetaData, setPageNumber } = catalogSlice.actions;