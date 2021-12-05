import { action } from "../actions";

const toastsMsgReducer = (state = { msg: window.localStorage.getItem("TOASTS_MSG"),
 display: window.localStorage.getItem("TOASTS_DISPLAY") === "TRUE" ? true : false,
  type: window.localStorage.getItem("TOASTS_TYPE") }, action: action) => {
    switch (action.type) {
        case 'TOASTS_MSG':
            window.localStorage.setItem("TOASTS_MSG", action.payload.msg);
            window.localStorage.setItem("TOASTS_DISPLAY", action.payload.display === true ? "TRUE": "FALSE");
            window.localStorage.setItem("TOASTS_TYPE", action.payload.type);
            return {...state, msg: action.payload.msg, display: action.payload.display, type: action.payload.type};
        default:
            return state;
    }
};

export default toastsMsgReducer