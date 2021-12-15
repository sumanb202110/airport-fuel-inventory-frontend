import { action } from "../actions";

const transactionsReducer = (state = { data: null, report: null}, action: action) => {
    switch (action.type) {
        case 'GET_TRANSACTIONS':
            return {...state, data: action.payload};
        case 'SET_TRANSACTIONS':
            return {...state, data: action.payload};
        case 'GET_TRANSACTIONS_REPORT':
            return {...state, report: action.payload}
        default:
            return state;
    }
};

export default transactionsReducer