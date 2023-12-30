import { Backdrop, Box, CircularProgress, Typography } from "@mui/material"

// interface Props {
// 	//Message is optional so we do not have to provide it to the component when using it
// 	message?: string;
// }
//Since message is optional to provide, we set a default message which can be overriden by the property in case we pass it
//And since we are assigning a default value, 'Props' is never used
export default function LoadingComponent({ message = 'Loading...' }) {
	return (
		//Backdrop component prevents the user from clicking while the app is loading something
		<Backdrop open={true} invisible={true}>
			<Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
				<CircularProgress size={100} color='secondary' />
				<Typography variant='h4' sx={{ justifyContent: 'center', position: 'fixed', top: '60%' }}>{message}</Typography>
			</Box>
		</Backdrop>

	);
}