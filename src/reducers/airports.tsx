import { action } from "../actions";

const airportsReducer = (state = { data: null}, action: action) => {
    switch (action.type) {
        case 'GET_AIRPORTS':
            return {...state, data: action.payload};
        default:
            return state;
    }
};

export default airportsReducer