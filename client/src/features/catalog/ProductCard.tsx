import { LoadingButton } from "@mui/lab";
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Product } from "../../app/models/product";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { currencyFormat } from "../../app/utils/utils";
import { addBasketItemAsync } from "../basket/basketSlice";

//To ensure type safety even when using "any", we specify in an interface what types the properties will be. If we forget to pass the properties specified here when using the component, typescript will show an error
//These properties will be required to pass down to our component
interface Props {
	product: Product;
	//if we had addProduct here:
	//addProduct: () => void;
	//no params passed to addProduct and it does not return anything
}

export default function ProductCard({ product }: Props) { //we could do this: export default function Catalog({products}: Props) to use only the properties we are interested in and avoid writing props when calling them "props.products" or "props.addProduct"
	const { status } = useAppSelector(state => state.basket);
	const dispatch = useAppDispatch();

	return (
		<Card>
			<CardHeader
				avatar={
					<Avatar sx={{ bgcolor: 'secondary.main' }}>
						{product.name.charAt(0).toUpperCase()}
					</Avatar>
				}
				title={product.name}
				titleTypographyProps={{
					sx: { fontWeight: 'bold', color: 'primary.main' }
				}}
			/>
			<CardMedia
				sx={{ height: 140, backgroundSize: 'contain', bgcolor: 'primary.light' }}
				image={product.pictureUrl}
				title={product.name}
			/>
			<CardContent>
				<Typography gutterBottom color='secondary' variant="h5">
					{currencyFormat(product.price)}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{product.type}
				</Typography>
			</CardContent>
			<CardActions>
				{/*'pendingAddItem' + product.id is used so loading indicators work individually for the product we clicked*/}
				<LoadingButton loading={status.includes('pendingAddItem' + product.id)} onClick={() => dispatch(addBasketItemAsync({ productId: product.id }))} size="small">Add to cart</LoadingButton>
				{/*Link component from react router dom*/}
				{/*Back tics allow us to concatenate text and js code*/}
				<Button component={Link} to={`/catalog/${product.id}`} size="small">View</Button>
			</CardActions>
		</Card>
	)
}