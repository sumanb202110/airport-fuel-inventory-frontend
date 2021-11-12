import { action } from "../actions";

const selectedTransactionReducer = (state = {}, action: action) => {
    switch (action.type) {
        case 'SET_SELECTED_TRANSACTION':
            return state = action.payload.selectedTransaction;
        default:
            return state;
    }
};

export default selectedTransactionReducer