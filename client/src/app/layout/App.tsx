
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import './styles.css';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function App() {
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
	return (
		<ThemeProvider theme={theme}>
			<ToastContainer position='bottom-right' hideProgressBar theme='colored' limit={4}/>
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