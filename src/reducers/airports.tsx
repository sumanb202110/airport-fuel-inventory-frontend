import { action } from "../actions";

const airportsReducer = (state = { data: null, report: null}, action: action) => {
    switch (action.type) {
        case 'GET_AIRPORTS':
            return {...state, data: action.payload};
        case 'SET_AIRPORTS':
            return {...state, data: action.payload};
        case 'GET_AIRPORTS_REPORT':
            return {...state, report: action.payload}
        default:
            return state;
    }
};

export default airportsReducer