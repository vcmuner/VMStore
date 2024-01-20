import { Grid, Paper } from "@mui/material";
import { useEffect } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";
import { fetchFilters, fetchProductsAsync, productSelectors, setPageNumber, setProductParams } from "./catalogSlice";
import AppPagination from "../../app/components/AppPagination";
import CheckboxButtons from "../../app/components/CheckboxButtons";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";

const sortOptions = [
	{ value: 'name', label: 'Alphabetical' },
	{ value: 'priceDesc', label: 'Price - High to Low' },
	{ value: 'price', label: 'Price - Low to High' },
]

export default function Catalog() {
	const products = useAppSelector(productSelectors.selectAll); //This will give us a list or our products when we load then using our async function
	const { productsLoaded, filtersLoaded, types, productParams, metaData } = useAppSelector(state => state.catalog);
	const dispatch = useAppDispatch();

	//The are two parameters that we pass on to this; the callback function and any dependencies that we have.
	//When we use an empty array as a dependency, that means this is only ever going to be called once.
	//If we forget to add this dependency, then this use effect is going to run every time our component renders
	//We load our component, but then any time our state changes our component re renders and shows the updated state.
	//If inside our use effects we have a method that changes the state (like the one below) and causes a rerender, then our use effect is going to be called again, and we end up with an endless loop of going to get data from our API
	//We prevent that from happening by adding a dependency, and when we add an empty array of dependencies, then this method can only be called once when the component mounts and it's never called again
	useEffect(() => {
		if (!productsLoaded) dispatch(fetchProductsAsync());
		//if (!filtersLoaded) dispatch(fetchFilters());
		//API for loading products is being called twice (useEffect executes twice), first because of the productsLoaded dependency, but then again for the filterLoaded dependency
	}, [productsLoaded, dispatch]) //[productsLoaded, filtersLoaded, dispatch]): Created 2 useEffect, one for productsLoaded and another one for filtersLoaded to above what is commented above

	useEffect(() => {
		if (!filtersLoaded) dispatch(fetchFilters());
	}, [filtersLoaded, dispatch])

	// If we go to another component in our app, we were loading every time a full list of products from the API, even if we got them before
	//That's the problem with storing things in local state: you lose them as soon as the component is destroyed
	//But we don't lose our redux state when we stay within our app, even after loading a different component

	if (!filtersLoaded) return <LoadingComponent message='Loading Products...' />

	return (
		//Fragment allows us to have one parent html tag (JSX expressions must have ONE parent element, we must return ONE element from our React component) without being displayed in the final HTML (a div would show)
		//Instead of writing the Fragment tag we could use empty brackets <> </> and the import will not be required
		<Grid container columnSpacing={4} sx={{ mt: 3 }}>
			<Grid item xs={3}>
				<Paper sx={{ mb: 2 }}>
					<ProductSearch />
				</Paper>
				<Paper sx={{ p: 2, mb: 2 }}>
					<RadioButtonGroup
						selectedValue={productParams.orderBy}
						options={sortOptions}
						onChange={(e) => dispatch(setProductParams({ orderBy: e.target.value }))}
					/>
				</Paper>
				<Paper sx={{ p: 2 }}>
					<CheckboxButtons
						items={types}
						checked={productParams.types}
						onChange={(items: string[]) => dispatch(setProductParams({ types: items }))}
					/>
				</Paper>
			</Grid>
			<Grid item xs={9}>
				<ProductList products={products} />
			</Grid>
			<Grid item xs={3} />
			<Grid item xs={9} sx={{ mt: 2, mb: 1 }}>
				{/*Checking if we have metaData (not null or undefined). We only load the AppPagination component if we have metadata*/}
				{metaData &&
					<AppPagination
						metaData={metaData}
						//Using "setPageNumber" from catalog slice because this is the only case where we do not want to reset the page number to 1
						onPageChange={(page: number) => dispatch(setPageNumber({ pageNumber: page }))}
					/>}
			</Grid>
		</Grid>
	)

}