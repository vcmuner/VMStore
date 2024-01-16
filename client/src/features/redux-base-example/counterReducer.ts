//These 2 consts are action TypeSpecimen. When we pass these types or dispatch then, then Redux is going to pass this to our counter reducer
//It's going to match the action with the action type
//Then it's going to do something and return a new state
//And because in our Redux Base page we're listening to the states with "useSelector", then it's also going to rerender this component and display the updated states
export const INCREMENT_COUNTER = "INCREMENT_COUNTER" //action
export const DECREMENT_COUNTER = "INCREMENT_COUNTER" //action
//When we use an action, what we do is we dispatch actions to the store. (React Redux hook called "Dispatch")

export interface CounterState {
	data: number;
	title: string;
}

const initialState: CounterState = {
	data: 42,
	title: "Redux Counter Reducer"
}

//Action creators are functions that return our action types
//These action creators (increment and decrement) are dispatching the actions to our Redux store, updating the data property and it's causing our component to rerender once that new state is available
export function increment(amount = 1) {
	return {
		type: INCREMENT_COUNTER,
		payload: amount
	}
}

export function decrement(amount = 1) {
	return {
		type: DECREMENT_COUNTER,
		payload: amount
	}
}

//We create a custom type for our action creators so we can set the type of the action in the counterReducer function
interface CounterAction {
	type: string,
	payload: number
}

export default function counterReducer(state = initialState, action: CounterAction) {
	switch (action.type) {
		case INCREMENT_COUNTER:
			//return state.data + 1 ----> NEVER DO THIS, THIS IS MUTATING A STATE
			//To avoid mutating states, we can use the spread operator
			return {
				//"...state" creates a new copy of our state
				...state,
				data: state.data + action.payload //The "state" here is the copy created using the spread operator
			} //This object is gonna return a new state which contains the updated property
		case DECREMENT_COUNTER:
			return {
				...state,
				data: state.data - action.payload
			}
		default:
			return state;
	}
	//We ALWAYS have to return state from the reducer functions
	//Even if we're not updating our state, we still need to return it because when the store is created it needs to initialize all of our reducers
	//So it's going to call these function and it needs to know what the initial state is or when we're using an action, we need to do something to update the state
}
