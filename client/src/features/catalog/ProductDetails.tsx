import { LoadingButton } from "@mui/lab";
import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import agent from "../../app/api/agent";
import { useStoreContext } from "../../app/context/StoreContext";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Product } from "../../app/models/product";
import { currencyFormat } from "../../app/utils/utils";

export default function ProductDetails() {
	const { basket, setBasket, removeItem } = useStoreContext();
	const { id } = useParams<{ id: string }>();
	//When we first load our component, we are not going to have a product, we need to go and get it from our API
	//And because we're going to our API, we'll add a loading state and set loading to true when we initialize this component
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [quantity, setQuantity] = useState(0);
	const [updatingCart, setUpdatingCart] = useState(false);
	//Checking if the item is already in the basket
	const item = basket?.items.find(i => i.productId === product?.id);

	//useEffect will run when the component mounts and ALSO when the dependency we specified changes (in this case, when the 'id' changes)
	useEffect(() => {
		//If item is not null or undefined (if it exists in out basket)
		if (item) setQuantity(item.quantity);
		//Replacing 'axios.get(`http://localhost:5000/api/Products/${id}`)' with agent
		//the code after the && will be executed after we have something in the 'id' variable
		//If not, we get the following error: Argument of type 'string | undefined' is not assignable to parameter of type 'string'
		id && agent.Catalog.details(parseInt(id))
			.then(response => setProduct(response)) //We do not need response.data (already managed in the agent)
			.catch(error => console.log(error)) //error gives us te full Axios response for the error (error.response in the agent)
			.finally(() => setLoading(false)); //Turn off the loading once we receive the data
	}, [id, item])

	function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
		if (parseInt(event.currentTarget.value) >= 0) {
			setQuantity(parseInt(event.currentTarget.value))
		}
	}

	function handleUpdateCart() {
		//We do this to make sure the product exists and not get linting errors since we can avoid using "product?.id!"
		if (!product) return;
		setUpdatingCart(true);
		//If - the product is not in the cart OR if it exists but the quantity we are selecting is bigger than the one in the cart
		//Else - the product is in the cart and the quantity we are selecting is smaller than the one in the cart
		if (!item || quantity > item.quantity) {
			const updatedQuantity = item ? quantity - item.quantity : quantity;
			agent.Basket.addItem(product.id, updatedQuantity) //Calling the API
				.then(basket => setBasket(basket)) //Calling the StoreProvider
				.catch(error => console.log(error))
				.finally(() => setUpdatingCart(false));
		} else {
			const updatedQuantity = item.quantity - quantity;
			agent.Basket.removeItem(product.id, updatedQuantity) //Calling the API
				.then(() => removeItem(product.id, updatedQuantity)) //Calling the StoreProvider
				.catch(error => console.log(error))
				.finally(() => setUpdatingCart(false));
		}
	}

	if (loading) return <LoadingComponent message='Loading Product...' />
	if (!product) return <NotFound />

	return (
		<Grid container spacing={6}>
			<Grid item xs={6}>
				<img src={product.pictureUrl} alt={product.name} style={{ width: '100%' }} />
			</Grid>
			<Grid item xs={6}>
				<Typography variant="h3">{product.name}</Typography>
				<Divider sx={{ mb: 2 }} />
				<Typography variant="h4" color='secondary'>{currencyFormat(product.price)}</Typography>
				<TableContainer>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>{product.name}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Description</TableCell>
								<TableCell>{product.description}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Type</TableCell>
								<TableCell>{product.type}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Quantity in stock</TableCell>
								<TableCell>{product.quantityInStock}</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
				<Grid container spacing={2}>
					<Grid item xs={6}>
						<TextField onChange={handleInputChange} variant="outlined" type="number" label="In Cart:" fullWidth value={quantity} />
					</Grid>
					<Grid xs={6}>
						<LoadingButton disabled={item?.quantity === quantity || !item && quantity === 0} loading={updatingCart} onClick={handleUpdateCart} sx={{ height: '55px' }} color='primary' size='large' variant='contained' fullWidth >
							{item ? "Update Quantity" : "Add to Cart"}
						</LoadingButton>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	)
} 