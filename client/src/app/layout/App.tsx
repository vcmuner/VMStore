import { useEffect, useState } from 'react'
import './index.css'
import { Product } from '../models/product';

function App() {
	const [products, setProducts] = useState<Product[]>([]);

	{/*The are two parameters that we pass on to this; the callback function and any dependencies that we have.
	When we use an empty array as a dependency, that means this is only ever going to be called once.
	If we forget to add this dependency, then this use effect is going to run every time our component renders*/}
	{/*We load our component, but then any time our state changes our component re renders and shows the updated state.
	If inside our use effects we have a method that changes the state (like the one below) and causes a rerender, then our use effect is going to be called again, and we end up with an endless loop of going to get data from our API*/}
	{/*We prevent that from happening by adding a dependency, and when we add an empty array of dependencies, then this method can only be called once when the component mounts and it's never called again*/}
	useEffect(() =>{
		fetch('http://localhost:5000/api/products')
		.then(response => response.json())
		.then(data => setProducts(data))
	}, [])

	function addProduct(){
		{/*The spread operator is taking our two items in this array and we're spreading them across.
		So we have product 1 and product 2 to spread across into a new array that we're creating and assigning to
		our products here. So then we have product 1, product 2, and then we're adding product 3*/}
		//setProduct([...products, {name: 'product3', price: 300.00}])
		setProducts(prevState => [...prevState,
		{
			id: prevState.length + 101,
			name: 'product' + (prevState.length +1), 
			price: (prevState.length * 100) + 100,
			description: "Some description",
			pictureUrl: "http://picsum.photos/200"
		}])
	}
	return (
	<div>
		<h1>NightCraft</h1>
		<ul>
			{products.map((product) => (
				<li key={product.id}>{product.name} - {product.price}</li>
			))}
		</ul>
		{/*What we don't want to do is add parentheses and execute or try to execute this method here, because
		otherwise this method would be executing as soon as our component loads, because parentheses means
		that we're going to then execute that function*/}
		<button onClick={addProduct}>Add Product</button>
	</div>
	)
}

export default App