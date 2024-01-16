import { createSlice } from "@reduxjs/toolkit";

//Every piece of state that we create for a feature is going to be a slice of our overall redux states
export interface CounterState {
	data: number;
	title: string;
}

const initialState: CounterState = {
	data: 42,
	title: "Redux Counter Reducer with Redux Toolkit"
}

//Redux Toolkit's createSlice and createReducer APIs use Immer inside to allow us to write "mutating" update logic that becomes correct immutable updates
//https://immerjs.github.io/immer/
//https://redux.js.org/tutorials/fundamentals/part-8-modern-redux#immutable-updates-with-immer
export const counterSlice = createSlice({
	name: 'counter',
	initialState,
	reducers: {
		increment: (state, action) => {
			state.data += action.payload
		},
		decrement: (state, action) => {
			state.data -= action.payload
		}
	}
})
export const { increment, decrement } = counterSlice.actions;