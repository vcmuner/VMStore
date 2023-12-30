import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default function ProductDetails() {
	const { id } = useParams<{ id: string }>();
	//When we first load our component, we are not going to have a product, we need to go and get it from our API
	//And because we're going to our API, we'll add a loading state and set loading to true when we initialize this component
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);

	//useEffect will run when the component mounts and ALSO when the dependency we specified changes (in this case, when the 'id' changes)
	useEffect(() => {
		//Replacing 'axios.get(`http://localhost:5000/api/Products/${id}`)' with agent
		//the code after the && will be executed after we have something in the 'id' variable
		//If not, we get the following error: Argument of type 'string | undefined' is not assignable to parameter of type 'string'
		id && agent.Catalog.details(parseInt(id))
			.then(response => setProduct(response)) //We do not need response.data (already managed in the agent)
			.catch(error => console.log(error)) //error gives us te full Axios response for the error (error.response in the agent)
			.finally(() => setLoading(false)); //Turn off the loading once we receive the data
	}, [id])

	if (loading) return <LoadingComponent message = 'Loading Product...'/>
	if (!product) return <NotFound />

	return (
		<Grid container spacing={6}>
			<Grid item xs={6}>
				<img src={product.pictureUrl} alt={product.name} style={{ width: '100%' }} />
			</Grid>
			<Grid item xs={6}>
				<Typography variant="h3">{product.name}</Typography>
				<Divider sx={{ mb: 2 }} />
				<Typography variant="h4" color='secondary'>${(product.price / 100).toFixed(2)}</Typography>
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
			</Grid>
		</Grid>
	)
} 