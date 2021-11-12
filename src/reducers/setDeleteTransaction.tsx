import { action } from "../actions";

const deleteTransactionReducer = (state = {
    deleteTransactionFormHidden: true,
    deleteTransactionData: {
        transaction_id: "",
        transaction_type: "IN",
        airport_id: "",
        aircraft_id: "",
        quantity: 0
    }

}, action: action) => {
    switch (action.type) {
        case 'SET_DELETE_TRANSACTION_DATA':
            return {...state, deleteTransactionData: action.payload.deleteTransactionData};
        case 'SET_DELETE_TRANSACTION_FORM_HIDDEN':
            return {...state, deleteTransactionFormHidden: action.payload.status}
        default:
            return state;
    }
};

export default deleteTransactionReducer