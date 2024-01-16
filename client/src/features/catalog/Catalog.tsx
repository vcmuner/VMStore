import { Fragment, useEffect } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import ProductList from "./ProductList";
import { fetchProductsAsync, productSelectors } from "./catalogSlice";

export default function Catalog() {
	const products = useAppSelector(productSelectors.selectAll); //This will give us a list or our products when we load then using our async function
	const { productsLoaded, status } = useAppSelector(state => state.catalog);
	const dispatch = useAppDispatch();

	//The are two parameters that we pass on to this; the callback function and any dependencies that we have.
	//When we use an empty array as a dependency, that means this is only ever going to be called once.
	//If we forget to add this dependency, then this use effect is going to run every time our component renders
	//We load our component, but then any time our state changes our component re renders and shows the updated state.
	//If inside our use effects we have a method that changes the state (like the one below) and causes a rerender, then our use effect is going to be called again, and we end up with an endless loop of going to get data from our API
	//We prevent that from happening by adding a dependency, and when we add an empty array of dependencies, then this method can only be called once when the component mounts and it's never called again
	useEffect(() => {
		if (!productsLoaded) dispatch(fetchProductsAsync());
	}, [productsLoaded, dispatch])

	// If we go to another component in our app, we were loading every time a full list of products from the API, even if we got them before
	//That's the problem with storing things in local state: you lose them as soon as the component is destroyed
	//But we don't lose our redux state when we stay within our app, even after loading a different component

	if (status.includes('pending')) return <LoadingComponent message='Loading Products...' />
	return (
		//Fragment allows us to have one parent html tag (JSX expressions must have ONE parent element, we must return ONE element from our React component) without being displayed in the final HTML (a div would show)
		//Instead of writing the Fragment tag we could use empty brackets <> </> and the import will not be required
		<Fragment>
			{/*Passing the products from the useState to the React component*/}
			<ProductList products={products} />
			{/*If we had "<Button variant='contained' onClick={addProduct}>Add Product</Button>" What we don't want to do is add parentheses and execute or try to execute this method here, because
			otherwise this method would be executing as soon as our component loads, because parentheses means
			that we're going to then execute that function*/}
		</Fragment>
	)

}