import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { Product } from "../../app/models/product";
import { RootState } from "../../app/store/configureStore";

//From the adapter we get a method to create our initial state
const productsAdapter = createEntityAdapter<Product>(); //Stores a Product type

//Creating async thunk to get the list of products. Returns the product array
//Type params for createAsyncThunk<p1,p2,p3>:
//p1: What the function returns
//p2: Argument types
export const fetchProductsAsync = createAsyncThunk<Product[]>(
	//Name
	'catalog/fetchProductsAsync',
	async (_, thunkAPI) => {
		try {
			return await agent.Catalog.list();
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
			return await agent.Catalog.details(productId)
		} catch (error: any) {
			//console.log(error); //We are catching inside the async inner function but not in the createAsyncThunk
			return thunkAPI.rejectWithValue({ error: error.data }) //With this our whole function will be rejected if for example, the id does not exist
		}
	}
)

export const catalogSlice = createSlice({
	name: 'catalog',
	//Will return initial state for our products
	initialState: productsAdapter.getInitialState({
		productsLoaded: false,
		status: 'idle'
	}),
	reducers: {},
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
	})
})

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);