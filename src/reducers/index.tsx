import logReducer from './isLogin'
import userReducer from './user'
import { combineReducers } from 'redux'
import homeTabsReducer from './homeTabs'
import toastsMsgReducer from './toastsMsg'

const allReducers = combineReducers({
    isLogin: logReducer,
    user: userReducer,
    homeTab: homeTabsReducer,
    toastsMsg: toastsMsgReducer
})

export default allReducers