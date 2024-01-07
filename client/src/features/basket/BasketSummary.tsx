import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { useStoreContext } from "../../app/context/StoreContext";
import { currencyFormat } from "../../app/utils/utils";

export default function BasketSummary() {
	const { basket } = useStoreContext();
	//Params: accumulator, item of the array currently being iterated
	const subtotal = basket?.items.reduce((sum, item) => sum + (item.quantity * item.price), 0) ?? 0; //?? 0; -> if what we return is null or undefied, return 0
	const deliveryFee = subtotal > 10000 ? 0 : 500;

	return (
		<>
			<TableContainer component={Paper} variant={'outlined'}>
				<Table>
					<TableBody>
						<TableRow>
							<TableCell colSpan={2}>Subtotal</TableCell>
							<TableCell align="right">{currencyFormat(subtotal)}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell colSpan={2}>Delivery fee*</TableCell>
							<TableCell align="right">{currencyFormat(deliveryFee)}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell colSpan={2}>Total</TableCell>
							<TableCell align="right">{currencyFormat(subtotal + deliveryFee)}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<span style={{ fontStyle: 'italic' }}>*Orders over $100 qualify for free delivery</span>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		</>
	)
}