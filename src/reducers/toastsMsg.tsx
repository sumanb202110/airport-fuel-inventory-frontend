import { action } from "../actions";

const toastsMsgReducer = (state = { msg: "", display: false, type: "SUCCESS" }, action: action) => {
    switch (action.type) {
        case 'TOASTS_MSG':
            return {...state, msg: action.payload.msg, display: action.payload.display, type: action.payload.type};
        default:
            return state;
    }
};

export default toastsMsgReducer