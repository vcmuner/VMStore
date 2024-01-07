import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import agent from "../../app/api/agent";
import { useStoreContext } from "../../app/context/StoreContext";
import BasketSummary from "./BasketSummary";
import { currencyFormat } from "../../app/utils/utils";
import { Link } from "react-router-dom";

export default function BasketPage() {
	/* const [loading, setLoading] = useState(true); //We use a loading because we are retrieving from the API
	const [basket, setBasket] = useState<Basket | null>(null) //It is gonna be a Basket or null and we set an initial value of null

	//To load the basket when the basket page component load. Empty array dependency since the useEffect in this case has to be called only once (when the component mounts)
	useEffect(() => {
		agent.Basket.get()
			.then(basket => setBasket(basket))
			.catch(error => console.log(error))
			.finally(() => setLoading(false))
	}, [])
	if (loading) return <LoadingComponent message='Loading basket...' /> */

	//Do not need the commented code above anymore because this is either taking place in the app initialization or we can get it from the store context

	const { basket, setBasket, removeItem } = useStoreContext();
	//const [loading, setLoading] = useState(false);
	//Replacing loading so each button has an individual loading indicator (otherwise all of them will show the loading indicator when only one is clicked)
	const [status, setStatus] = useState({
		loading: false,
		name: ''
	});

	if (!basket) return <Typography variant='h3'>Your basket is empty</Typography>

	function handleAddItem(productId: number, name: string) {
		setStatus({ loading: true, name });
		agent.Basket.addItem(productId)
			.then(basket => setBasket(basket))
			.catch(error => console.log(error))
			.finally(() => setStatus({ loading: false, name: '' }))
	}

	//We pass quantity as a param because this function will be used in the remove icon (minus icon) and in the delete icon (trash bin icon)
	function handleRemoveItem(productId: number, quantity: number, name: string) {
		setStatus({ loading: true, name });
		agent.Basket.removeItem(productId, quantity)
			.then(() => removeItem(productId, quantity))
			.catch(error => console.log(error))
			.finally(() => setStatus({ loading: false, name: '' }))
	}

	return (
		<>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }}>
					<TableHead>
						<TableRow>
							<TableCell>Product</TableCell>
							<TableCell align="right">Price</TableCell>
							<TableCell align="center">Quantity</TableCell>
							<TableCell align="right">Subtotal</TableCell>
							<TableCell align="right"></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{basket.items.map(item => (
							<TableRow
								key={item.productId}
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
							>
								<TableCell component="th" scope="row">
									<Box display='flex' alignItems='center'>
										<img src={item.pictureUrl} alt={item.name} style={{ height: 50, marginRight: 20 }} />
										<span>{item.name}</span>
									</Box>
								</TableCell>
								<TableCell align="right">{currencyFormat(item.price)}</TableCell>
								<TableCell align="center">
									{/*Matching "name" in function and status so each loading is triggered independently*/}
									<LoadingButton loading={status.loading && status.name === 'remove' + item.productId} onClick={() => (handleRemoveItem(item.productId, 1, 'remove' + item.productId))} color="error">
										<Remove />
									</LoadingButton>
									{item.quantity}
									<LoadingButton loading={status.loading && status.name === 'add' + item.productId} onClick={() => (handleAddItem(item.productId, 'add' + item.productId))} color="secondary">
										<Add />
									</LoadingButton>
								</TableCell>
								<TableCell align="right">{currencyFormat((item.price * item.quantity))}</TableCell>
								<TableCell align="right">
									<LoadingButton loading={status.loading && status.name === 'delete' + item.productId} onClick={() => (handleRemoveItem(item.productId, item.quantity, 'delete' + item.productId))} color="error">
										<Delete />
									</LoadingButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Grid container>
				<Grid item xs={6} />
				<Grid item xs={6}>
					<BasketSummary />
					<Button component={Link} to={'/checkout'} variant="contained" size="large" fullWidth>
						Checkout
					</Button>
				</Grid>
			</Grid>
		</>
	)
}