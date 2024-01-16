import { LoadingButton } from "@mui/lab";
import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { currencyFormat } from "../../app/utils/utils";
import { addBasketItemAsync, removeBasketItemAsync } from "../basket/basketSlice";
import { fetchProductAsync, productSelectors } from "./catalogSlice";

export default function ProductDetails() {
	const { basket, status } = useAppSelector(state => state.basket);
	const dispatch = useAppDispatch();
	const { id } = useParams<{ id: string }>();
	const product = useAppSelector(state => productSelectors.selectById(state, parseInt(id!)));
	const { status: productStatus } = useAppSelector(state => state.catalog);
	const [quantity, setQuantity] = useState(0);
	//Checking if the item is already in the basket
	const item = basket?.items.find(i => i.productId === product?.id);

	//useEffect will run when the component mounts and ALSO when the dependency we specified changes (in this case, when the 'id' changes)
	useEffect(() => {
		//If item is not null or undefined (if it exists in out basket)
		if (item) setQuantity(item.quantity);
		if (!product && id) dispatch(fetchProductAsync(parseInt(id)));
	}, [id, item, dispatch, product])

	function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
		if (parseInt(event.currentTarget.value) >= 0) {
			setQuantity(parseInt(event.currentTarget.value))
		}
	}

	function handleUpdateCart() {
		//We do this to make sure the product exists and not get linting errors since we can avoid using "product?.id!"
		if (!product) return;
		//If - the product is not in the cart OR if it exists but the quantity we are selecting is bigger than the one in the cart
		//Else - the product is in the cart and the quantity we are selecting is smaller than the one in the cart
		if (!item || quantity > item.quantity) {
			const updatedQuantity = item ? quantity - item.quantity : quantity;
			dispatch(addBasketItemAsync({ productId: product.id, quantity: updatedQuantity }))
		} else {
			const updatedQuantity = item.quantity - quantity;
			dispatch(removeBasketItemAsync({ productId: product.id, quantity: updatedQuantity }))
		}
	}

	if (productStatus.includes('pending')) return <LoadingComponent message='Loading Product...' />
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
				<Divider />
				<Grid container spacing={2}>
					<Grid item xs={6}>
						<TextField onChange={handleInputChange} variant="outlined" type="number" label="In Cart:" fullWidth value={quantity} />
					</Grid>
					<Grid item xs={6}>
						<LoadingButton disabled={item?.quantity === quantity || !item && quantity === 0} loading={status.includes('pending')} onClick={handleUpdateCart} sx={{ height: '55px' }} color='primary' size='large' variant='contained' fullWidth >
							{item ? "Update Quantity" : "Add to Cart"}
						</LoadingButton>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	)
} 