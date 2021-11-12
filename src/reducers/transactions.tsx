import { action } from "../actions";

const transactionsReducer = (state = { data: null}, action: action) => {
    switch (action.type) {
        case 'GET_TRANSACTIONS':
            return {...state, data: action.payload};
        default:
            return state;
    }
};

export default transactionsReducer