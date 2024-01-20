import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { PaginatedResponse } from '../models/pagination';

//The way to deal with asyncghronous code in JS is yo use Promises
//When promise is resolved we return 'resolve', and we wait for 1000 miliseconds for it to resolve
const sleep = () => new Promise(resolve => setTimeout(resolve, 500))

axios.defaults.baseURL = 'http://localhost:5000/api/';
axios.defaults.withCredentials = true; //Similar to what was done in Program.cs on the API to allow to pass the cookie (browser can now receive and set the cookie)

const responseBody = (response: AxiosResponse) => response.data;
//The function above is the same as this one below:
//function responseBody(response: AxiosResponse) {
//	return response.data;
//}

axios.interceptors.response.use(async response => {
	await sleep();
	//"pagination has to be in lowercase even if the header name in the browser is not. Axios only works with lowercase properties inside our response"
	const pagination = response.headers['pagination'];
	if (pagination) {
		//Overriding what is inside response.data
		response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
		return response;
	}
	return response
}, (error: AxiosError) => {
	const { data, status } = error.response as AxiosResponse;
	switch (status) {
		case 400:
			//For Validation Errors (also 400 status code)
			if (data.errors) {
				const modelStateErrors: string[] = [];
				//Each one of the errors inside the errors object has a key
				for (const key in data.errors) {
					//Extra safety
					if (data.errors[key]) {
						//Push the errors into the array
						modelStateErrors.push(data.errors[key]);
					}
				}
				throw modelStateErrors.flat(); //We flatten the array so all we get back are the error values
			}
			//If the above code is not executed, then it was not a validation error and we trigger the toast. If it is, throwing the errors will stop execution and toast will no be displayed
			toast.error(data.title);
			break;
		case 401:
			toast.error(data.title);
			break;
		case 404:
			router.navigate('/not-found');
			break;
		case 500:
			//Besides the 'DO NOT USE' warning, 'navigate' is the only way to access a react component outside of a react context
			//We can access the state using the 'location' react hook in our components
			router.navigate('/server-error', { state: { error: data } });
			break;
		default:
			break;
	}
	return Promise.reject(error.response);
})

const requests = {
	get: (url: string, params?: URLSearchParams) => axios.get(url, { params }).then(responseBody),
	//body: {} means body is of type Object
	post: (url: string, body: object) => axios.post(url, body).then(responseBody),
	put: (url: string, body: object) => axios.put(url, body).then(responseBody),
	delete: (url: string) => axios.delete(url).then(responseBody),
}

//Receives no parameters and returns the list of products
const Catalog = {
	//Receives no parameters and returns the list of products
	list: (params: URLSearchParams) => requests.get('products', params),
	//Receives the 'id' which is of type 'number' and returns the matching product
	details: (id: number) => requests.get(`products/${id}`),
	fetchFilters: () => requests.get('products/filters')
}

const TestErrors = {
	get400Error: () => requests.get('buggy/bad-request'),
	get401Error: () => requests.get('buggy/unauthorized'),
	get404Error: () => requests.get('buggy/not-found'),
	get500Error: () => requests.get('buggy/server-error'),
	getValidationError: () => requests.get('buggy/validation-error'),
}

const Basket = {
	get: () => requests.get('basket'),
	//Param names should match the param names of the POST method in the basket controller 
	addItem: (productId: number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, Object), //We pass an empty object because it requires another param for the body
	removeItem: (productId: number, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
}

const agent = {
	Catalog,
	TestErrors,
	Basket,
}

export default agent;
