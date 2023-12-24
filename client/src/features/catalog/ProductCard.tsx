import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { Product } from "../../app/models/product";

//To ensure type safety even when using "any", we specify in an interface what types the properties will be. If we forget to pass the properties specified here when using the component, typescript will show an error
//These properties will be required to pass down to our component
interface Props {
	product: Product;
//if we had addProduct here:
//addProduct: () => void;
//no params passed to addProduct and it does not return anything
}

export default function ProductCard(props: Props) { //we could do this: export default function Catalog({products}: Props) to use only the properties we are interested in and avoid writing props when calling them "props.products" or "props.addProduct"
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
					${(props.product.price / 100).toFixed(2)}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{props.product.type}
				</Typography>
			</CardContent>
			<CardActions>
				<Button size="small">Add to cart</Button>
				<Button size="small">View</Button>
			</CardActions>
		</Card>
	)
}