import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { StoreProvider } from './app/context/StoreContext.tsx';
import './app/layout/styles.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/Routes.tsx';


ReactDOM.createRoot(document.getElementById('root')!).render(
	//Instead of loading the App component in main.tsx, we load the RouterProvider
	//Wrapping the RouterProvider (which mounts the APP) inside the StoreProvider
	//To get access to the contents and the state inside the store provider anywhere in our application
	//By using the store context hook (useStoreContext()) created in the StoreContext class
	<React.StrictMode>
		{/*<App /> */}
		<StoreProvider>
			<RouterProvider router={router} />
		</StoreProvider>
	</React.StrictMode>,
)