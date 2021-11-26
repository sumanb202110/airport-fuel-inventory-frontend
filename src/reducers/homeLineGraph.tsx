import { action } from "../actions";

const homeLineGraphDataReducer = (state ={lineData: null}, action: action) => {
    switch (action.type) {
        case 'SET_HOME_LINE_GRAPH_DATA':
            return {...state, lineData:action.payload.homeLineGraphData};
        default:
            return state;
    }
};

export default homeLineGraphDataReducer