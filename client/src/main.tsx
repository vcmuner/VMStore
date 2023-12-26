import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './app/layout/styles.css';
import { router } from './app/router/Router.tsx';


ReactDOM.createRoot(document.getElementById('root')!).render(
	//Instead of loading the App component in main.tsx, we load the RouterProvider
	<React.StrictMode>
	{/*<App /> */}
		<RouterProvider router={router} />
	</React.StrictMode>,
)