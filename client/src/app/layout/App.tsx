import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Catalog from '../../features/catalog/Catalog';
import Header from './Header';
import './styles.css';
import { useState } from 'react';

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
			<CssBaseline /> {/*Removes padding and margins added by the browser making the header reach the edges of the page*/}
			<Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
			{/*Putting Catalog in a React Container so it is not at the edge of the page*/}
			<Container>
				<Catalog />
			</Container>
		</ThemeProvider>
	);
}

export default App