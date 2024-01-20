import { TextField, debounce } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setProductParams } from "./catalogSlice";
import { useState } from "react";

export default function ProductSearch() {
	const { productParams } = useAppSelector(state => state.catalog);
	const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);
	const dispatch = useAppDispatch();

	//We don't want it to immediately go out to the API as soon as the user starts typing
	//So we need to have some local states inside here to store the value of what's inside the component
	//And we also need a debounce function that's then going to call the set product params
	//So it only updates after a certain number of inputs or a certain delay has occurred

	//debouncedSearch will wait for a period of time, take the value inside the input field and then use that to dispatch our action to the store
	const debouncedSearch = debounce((event: any) => {
		dispatch(setProductParams({ searchTerm: event.target.value }))
	}, 1000)

	return (
		<TextField label='Search Products'
			variant='outlined'
			fullWidth
			//Setting a default value '' in case the searchTerm is null or undefined
			value={searchTerm || ''}
			onChange={(event: any) => {
				setSearchTerm(event.target.value);
				debouncedSearch(event);
			}}
		/>
	)
}