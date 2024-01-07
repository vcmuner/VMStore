import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Basket } from "../models/basket";

//When we use our store context, we're going to be able to get access to what we're specifying inside here
interface StoreContextValue {
	basket: Basket | null;
	setBasket: (basket: Basket) => void;
	//We're not going to add a method to add an item because we're going to get our basket back from the API whenever we do such a thing
	//And we can simply just use that basket and use this set basket method when we're adding an item
	//But when we remove an item, we know that we do not get anything back apart from a 200 status okay response back from our API
	//So we do need to handle the logic for removing an item inside our client
	removeItem: (productId: number, quantity: number) => void;
}

//We give it our store context value as the type, but we also need to give it a default value
//Inside its type parameter we'll use our store context value type or undefined and we'll give it a default value of undefined
export const StoreContext = createContext<StoreContextValue | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useStoreContext() {
	const context = useContext(StoreContext);
	if (context == undefined) {
		throw Error('Oops - It seems that we are not inside the provider')
	}
	return context;
}

//Not creating our own interface for this provider, instead, using a type from React: PropsWithChildren
//and we're going to say props with children
//The Props are going to be children of the StoreProvider
//We're passing "children"" as a property to our store provider and using a react type (PropsWithChildren) to identify what this object is
export function StoreProvider({ children }: PropsWithChildren<unknown>) {
	const [basket, setBasket] = useState<Basket | null>(null);

	function removeItem(productId: number, quantity: number) {
		if (!basket) return;

		//The spread operator creates a new copy of the array and stores it inside the "items" variable
		//When setting states inside a component, it is not advisable to mutate states so we create a new copy of that state and then replace the existing state
		const items = [...basket.items]
		const itemIndex = items.findIndex(i => i.productId === productId);
		if (itemIndex >= 0) {
			items[itemIndex].quantity -= quantity;
			//Splice is mutating state but for the copy of the array we created above
			if (items[itemIndex].quantity <= 0) items.splice(itemIndex, 1);
			setBasket(prevState => {
				//Replacing the items of the previous state
				return { ...prevState!, items }
			})
		}
	}
	return (
		//Value is what we are providing from out interface
		<StoreContext.Provider value={{ basket, setBasket, removeItem }}>
			{children}
		</StoreContext.Provider>
	)
}