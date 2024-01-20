import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from "react";

interface Props {
	items: string[];
	checked?: string[];
	onChange: (items: string[]) => void;
}

export default function CheckboxButtons({ items, checked, onChange }: Props) {
	const [checkedItems, setCheckedItems] = useState(checked || []);

	function handleChecked(value: string) {
		const currentIndex = checkedItems.findIndex(item => item === value);
		//Array to add new checked items
		let newChecked: string[] = [];
		//If index is -1, it means current item is not in the array and we need to add it (spread operator allows us to append to current checkedItems)
		if (currentIndex === -1) newChecked = [...checkedItems, value];
		//If the item exists on checkedItems, it means we need to remove it
		//This will give us a list of checked items minus the one that has been unchecked
		else newChecked = checkedItems.filter(i => i !== value);
		setCheckedItems(newChecked);
		//Updates out state in Redux
		onChange(newChecked);
	}

	return (
		<FormGroup>
			{items.map(item => (
				<FormControlLabel
					key={item}
					control={<Checkbox
						checked={checkedItems.indexOf(item) !== -1} /*Checking if the item is already checked*/
						onClick={() => handleChecked(item)}
					/>}
					label={item} />
			))}
		</FormGroup>
	)
}