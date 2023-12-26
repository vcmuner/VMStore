import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";

//Single page app (no extra htmls)
//Instead of loading the App component in main.tsx, we load the RouterProvider
export const router = createBrowserRouter([
	{
		//Root of the app
		path: '/',
		element: <App />,
		//Each children will have its path and the react element to load
		children: [
			{ path: '/', element: <HomePage /> },
			{ path: 'catalog', element: <Catalog /> },
			{ path: 'catalog/:id', element: <ProductDetails /> },
			{ path: 'about', element: <AboutPage /> },
			{ path: 'contact', element: <ContactPage /> },
		]
	}
])