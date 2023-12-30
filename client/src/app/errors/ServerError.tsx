import { Container, Divider, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function ServerError() {
	//We can access the state we passed on the agent using the 'location' react hook in our components
	const { state } = useLocation();
	return (
		<Container component={Paper}>
			{state?.error ? (
				<>
					<Typography gutterBottom variant='h3' color='secondary'>{state.error.title}</Typography>
					<Divider />
					{/*In production we will not have access because we will not be showing the stack trace, so for that case we display a string */}
					<Typography gutterBottom variant='h5' color='body1'>{state.error.detail || 'Internal Server Error'}</Typography>

				</>
			) : (
				<Typography gutterBottom variant='h5'>Server Error</Typography>
			)}
		</Container>
	)
}