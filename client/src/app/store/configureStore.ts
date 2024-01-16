
import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "../../features/redux-base-example/counterSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { basketSlice } from "../../features/basket/basketSlice";
import { catalogSlice } from "../../features/catalog/catalogSlice";

//With base Redux:
//export function configureStore () {
//	return createStore(counterReducer);
//}

//With Redux Toolkit:
export const store = configureStore({
	reducer: {
		counter: counterSlice.reducer,
		basket: basketSlice.reducer,
		catalog: catalogSlice.reducer
	}
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

//Custom Hooks
//Instead of using "useDispatch" from react-redux, we use our custom hook (which is already typed to AppDispatch and is of typeof store.dispatch)
export const useAppDispatch = () => useDispatch<AppDispatch>();
//Instead of using "useSelector" we will use "useAppSelector"
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;