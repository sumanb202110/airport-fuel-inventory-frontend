import { action } from "../actions";

const updateTransactionReducer = (state = {
    updateTransactionFormHidden: true,
    updateTransactionData: {
        transaction_id: "",
        transaction_type: "IN",
        airport_id: "",
        aircraft_id: "",
        quantity: 0
    }

}, action: action) => {
    switch (action.type) {
        case 'SET_UPDATE_TRANSACTION_DATA':
            return {...state, updateTransactionData: action.payload.updateTransactionData};
        case 'SET_UPDATE_TRANSACTION_FORM_HIDDEN':
            return {...state, updateTransactionFormHidden: action.payload.status}
        default:
            return state;
    }
};

export default updateTransactionReducer