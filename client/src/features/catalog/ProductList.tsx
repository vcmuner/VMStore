import { Grid } from "@mui/material";
import { Product } from "../../app/models/product";
import ProductCard from "./ProductCard";

interface Props {
	products: Product[];
}

export default function ProductList({ products }: Props) {
	return (
		//spacing is the amount of space between each item in the grid -- 1=8px
		<Grid container spacing={4} sx={{ my: 4 }}>
			{products.map(product => (
				//All items inside a list must have an ID
				<Grid item xs={3} key={product.id}>
					<ProductCard product={product} />
				</Grid>
			))}
		</Grid>
	)
}