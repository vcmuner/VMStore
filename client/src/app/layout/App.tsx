
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { setBasket } from '../../features/basket/basketSlice';
import agent from '../api/agent';
import { useAppDispatch } from '../store/configureStore';
import { getCookie } from '../utils/utils';
import Header from './Header';
import LoadingComponent from './LoadingComponent';
import './styles.css';

function App() {
	//const { setBasket } = useStoreContext(); ---- Replacing with Redux
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const buyerId = getCookie('buyerId');
		if (buyerId) {
			agent.Basket.get()
				//.then(basket => setBasket(basket)) ---- Replacing with Redux
				.then(basket => dispatch(setBasket(basket)))
				.catch(error => console.log(error))
				.finally(() => setLoading(false))
		} else {
			setLoading(false); //If we do not have anything in the basket we do not need to load anything (otherwise will never turn off loading when initializing the app with an empty basket/no buyerId)
		}
	}, [dispatch]) //When replacing with Redux, dependency is no longer setBasket, it is dispatch

	const [darkMode, setDarkMode] = useState(false);
	const paletteType = darkMode ? 'dark' : 'light';
	const theme = createTheme({
		palette: {
			mode: paletteType,
			background: {
				default: paletteType === 'light' ? '#eaeaea' : '#121212'
			}
		}
	})

	function handleThemeChange() {
		setDarkMode(!darkMode)
	}

	if (loading) return <LoadingComponent message="Initializing app..." />

	return (
		<ThemeProvider theme={theme}>
			<ToastContainer position='bottom-right' hideProgressBar theme='colored' limit={4} />
			<CssBaseline /> {/*Removes padding and margins added by the browser making the header reach the edges of the page*/}
			<Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
			{/*Putting Catalog in a React Container so it is not at the edge of the page*/}
			<Container>
				{/*<Catalog /> Since we are now using a router, we swap for Outlet (from react router dom), which will be replaced with the component we decided to load as the root url (HomePage in this case)*/}
				<Outlet />
			</Container>
		</ThemeProvider>
	);
}

export default App