import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { Product } from "../../app/models/product";
import { Link } from "react-router-dom";
import agent from "../../app/api/agent";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useStoreContext } from "../../app/context/StoreContext";
import { currencyFormat } from "../../app/utils/utils";

//To ensure type safety even when using "any", we specify in an interface what types the properties will be. If we forget to pass the properties specified here when using the component, typescript will show an error
//These properties will be required to pass down to our component
interface Props {
	product: Product;
	//if we had addProduct here:
	//addProduct: () => void;
	//no params passed to addProduct and it does not return anything
}

export default function ProductCard(props: Props) { //we could do this: export default function Catalog({products}: Props) to use only the properties we are interested in and avoid writing props when calling them "props.products" or "props.addProduct"
	const [loading, setLoading] = useState(false); //Since we are calling the API we add a loading indicator
	const { setBasket } = useStoreContext();
	function handleAddItem(productId: number) {
		setLoading(true);
		//Passing the quantity is optional because we gave it a default value
		agent.Basket.addItem(productId)
			.then(basket => setBasket(basket))
			.catch(error => console.log(error))
			.finally(() => setLoading(false));
	}

	return (
		<Card>
			<CardHeader
				avatar={
					<Avatar sx={{ bgcolor: 'secondary.main' }}>
						{props.product.name.charAt(0).toUpperCase()}
					</Avatar>
				}
				title={props.product.name}
				titleTypographyProps={{
					sx: { fontWeight: 'bold', color: 'primary.main' }
				}}
			/>
			<CardMedia
				sx={{ height: 140, backgroundSize: 'contain', bgcolor: 'primary.light' }}
				image={props.product.pictureUrl}
				title={props.product.name}
			/>
			<CardContent>
				<Typography gutterBottom color='secondary' variant="h5">
					{currencyFormat(props.product.price)}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{props.product.type}
				</Typography>
			</CardContent>
			<CardActions>
				<LoadingButton loading={loading} onClick={() => handleAddItem(props.product.id)} size="small">Add to cart</LoadingButton>
				{/*Link component from react router dom*/}
				{/*Back tics allow us to concatenate text and js code*/}
				<Button component={Link} to={`/catalog/${props.product.id}`} size="small">View</Button>
			</CardActions>
		</Card>
	)
}