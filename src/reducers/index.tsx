import logReducer from './isLogin'
import userReducer from './user'
import { combineReducers } from 'redux'
import homeTabsReducer from './homeTabs'

const allReducers = combineReducers({
    isLogin: logReducer,
    user: userReducer,
    homeTab: homeTabsReducer
})

export default allReducers