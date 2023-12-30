import { Fragment, useEffect, useState } from "react";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default function Catalog() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	//The are two parameters that we pass on to this; the callback function and any dependencies that we have.
	//When we use an empty array as a dependency, that means this is only ever going to be called once.
	//If we forget to add this dependency, then this use effect is going to run every time our component renders
	//We load our component, but then any time our state changes our component re renders and shows the updated state.
	//If inside our use effects we have a method that changes the state (like the one below) and causes a rerender, then our use effect is going to be called again, and we end up with an endless loop of going to get data from our API
	//We prevent that from happening by adding a dependency, and when we add an empty array of dependencies, then this method can only be called once when the component mounts and it's never called again
	useEffect(() => {
		//fetch('http://localhost:5000/api/products')
		//	.then(response => response.json())
		//	.then(data => setProducts(data))
		//Replacing with axios agent:
		agent.Catalog.list().then(products => setProducts(products))
			.catch(error => console.log(error)) //error gives us te full Axios response for the error (error.response in the agent)
			.finally(() => setLoading(false)); //Turn off the loading once we receive the data
	}, [])

	if (loading) return <LoadingComponent message = 'Loading Products...' />
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