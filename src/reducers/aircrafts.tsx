import { action } from "../actions";

const aircraftsReducer = (state = { data: null}, action: action) => {
    switch (action.type) {
        case 'GET_AIRCRAFTS':
            return {...state, data: action.payload};
        default:
            return state;
    }
};

export default aircraftsReducer