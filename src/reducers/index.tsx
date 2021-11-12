import logReducer from './isLogin'
import userReducer from './user'
import { combineReducers } from 'redux'
import homeTabsReducer from './homeTabs'
import toastsMsgReducer from './toastsMsg'
import transactionsReducer from './transactions'
import airportsReducer from './airports'
import aircraftsReducer from './aircrafts'
import selectedTransactionReducer from './setSelectedTransaction'
import updateTransactionReducer from './setUpdateTransaction'
import deleteTransactionReducer from './setDeleteTransaction'

const allReducers = combineReducers({
    isLogin: logReducer,
    user: userReducer,
    homeTab: homeTabsReducer,
    toastsMsg: toastsMsgReducer,
    transactions: transactionsReducer,
    airports: airportsReducer,
    aircrafts: aircraftsReducer,
    selectedTransaction: selectedTransactionReducer,
    updateTransaction: updateTransactionReducer,
    deleteTransaction: deleteTransactionReducer
})

export default allReducers