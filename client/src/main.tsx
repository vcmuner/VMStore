import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import './app/layout/styles.css';
import { router } from './app/router/Routes.tsx';
import { store } from './app/store/configureStore.ts';

//const store = configureStore(); ---> not needed with Redux Toolkit, we use the store from our configureStore method in the Provider tag below

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);


root.render(
	//Removing context (StoreProvider) which is our React context, since we will be using 100% Redux for state management
	<React.StrictMode>
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	</React.StrictMode>,
)