import { action } from "../actions";

const homeTabsReducer = (state = "AIRPORT", action: action) => {
    switch (action.type) {
        case 'HOME_SET_TAB':
            return state = action.payload.tabName;
        default:
            return state;
    }
};

export default homeTabsReducer