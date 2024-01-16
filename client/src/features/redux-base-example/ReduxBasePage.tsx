import { Button, ButtonGroup, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { decrement, increment } from "./counterSlice";

export default function ReduxBasePage() {
	//const dispatch = useDispatch(); //No Toolkit
	const dispatch = useAppDispatch() //With Toolkit (custom hook)

	// const { data, title } = useSelector((state: CounterState) => state) 
	//The "state" above from where we get the data and title is the root state, we get a console warning about unnecesary re-renders
	//We can do this instead:
	//const data = useSelector((state: CounterState) => state.data) //No Toolkit
	//const title = useSelector((state: CounterState) => state.title) //No Toolkit

	const { data, title } = useAppSelector(state => state.counter); //With Toolkit (custom hook)

	return (
		<>
			<Typography variant="h2">{title}</Typography>
			<Typography variant="h5">The data is: {data}</Typography>
			<ButtonGroup>
				<Button onClick={() => dispatch(decrement(1))} variant='contained' color='error'>Drecrement</Button>
				<Button onClick={() => dispatch(increment(1))} variant='contained' color='primary'>Increment</Button>
				<Button onClick={() => dispatch(increment(5))} variant='contained' color='secondary'>Increment by 5</Button>
			</ButtonGroup>
		</>
	)
}