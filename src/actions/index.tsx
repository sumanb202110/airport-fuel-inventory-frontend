import axios from "axios"
import { Dispatch } from "react"
import { aircrafts } from "../components/aircraft/Aircraft"
import { airports } from "../components/airport/Airport"
import { transaction, transactions } from "../components/transaction/transaction"

export type action = {
    type: 'USER_LOGIN' | 'USER_LOGOUT' | 'HOME_SET_TAB' |
     'TOASTS_MSG' | 'GET_TRANSACTIONS' | 'GET_TRANSACTIONS_REPORT' | 'SET_TRANSACTIONS' |
      'GET_AIRPORTS' | 'SET_AIRPORTS' | 'GET_AIRPORTS_REPORT' |
      'GET_AIRCRAFTS' | 'SET_AIRCRAFTS' | 'SET_SELECTED_TRANSACTION' | 'SET_UPDATE_TRANSACTION_DATA'|
      'SET_UPDATE_TRANSACTION_FORM_HIDDEN' | 'SET_DELETE_TRANSACTION_DATA' | 
      'SET_DELETE_TRANSACTION_FORM_HIDDEN' |'SET_HOME_LINE_GRAPH_DATA'
      ,
    payload: {
        tabName: string,
        msg: string,
        display: boolean,
        selectedTransaction: transaction,
        status: boolean,
        updateTransactionData: transaction,
        deleteTransactionData: transaction,
        homeLineGraphData: Array<object>,
        type: 'SUCCESS' | 'ERROR'

    }
}


// Login action
export const login = () => {
    return {
        type: 'USER_LOGIN'
    }
}

// Logout action
export const logout = () => {
    return {
        type: 'USER_LOGOUT'
    }
}

// User action
export const setUserDetails = (email: string) => {
    return {
        type: 'USER_SET_DETAILS',
        payload: {
            user: {
                email: email
            }
        }
    }
}

// Home tab action
export const setHomeTab = (tabName: string) => {
    return {
        type: 'HOME_SET_TAB',
        payload: {
            tabName: tabName
        }
    }
}

// Toast message action
export const setToasts = (msg: string, display: boolean, type: string) => {
    return {
        type: 'TOASTS_MSG',
        payload: {
            msg: msg,
            display: display,
            type: type
        }
    }
}

export const getTransactions = (count: number, sortBy?: string, airportIds?: Array<string>,aircraftIds?: Array<string>,transactionTypes?: Array<string>) => async (dispatch: Dispatch<any>) => {
    try {
        // Axios auth config
        const authAxios = axios.create({
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem("token")}`
            }
        })
        const response = await authAxios.get<any>(
            `http://localhost:4000/api/v1/transactions?page=1&count=${count}&sort_by=${sortBy}${airportIds?.length!>0?`&airport_ids=${airportIds}`:``}${aircraftIds?.length!>0?`&aircraft_ids=${aircraftIds}`:``}${transactionTypes?.length!>0?`&transaction_types=${transactionTypes}`:``}`)
        dispatch(
            {
                type: 'GET_TRANSACTIONS',
                payload: response.data.data as transactions
            }
        )
    } catch (error: any) {
        console.log(error)
        dispatch(setToasts(error.response.data.msg, true, 'ERROR'))
    }
};

export const getTransactionsReport = ()=> async (dispatch: Dispatch<any>) => {
    try {
        // Axios auth config
        const authAxios = axios.create({
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem("token")}`
            }
        })
        const response = await authAxios.get<any>(
            `http://localhost:4000/api/v1/transactions/report`)
        dispatch(
            {
                type: 'GET_TRANSACTIONS_REPORT',
                payload: response.data 
            }
        )
    } catch (error: any) {
        console.log(error)
        dispatch(setToasts(error.response.data.msg, true, 'ERROR'))
    }
};

// Set transactions action
export const setTransactions = (transactions: transactions) => {
    return {
        type: 'SET_TRANSACTIONS',
        payload: transactions
    }
}

// Selected transaction action
export const setSelectedTransaction = (selectedTransaction: transaction) => {
    return {
        type: 'SET_SELECTED_TRANSACTION',
        payload: {
            selectedTransaction: selectedTransaction
        }
    }
}

// Update transaction action
export const setUpdateTransactionData = (updateTransactionData: transaction) => {
    return {
        type: 'SET_UPDATE_TRANSACTION_DATA',
        payload: {
            updateTransactionData: updateTransactionData
        }
    }
}

// Update transaction form hidden action
export const setUpdateTransactionFormHidden = (status: boolean) => {
    return {
        type: 'SET_UPDATE_TRANSACTION_FORM_HIDDEN',
        payload: {
            status: status
        }
    }
}

// Delete transaction action
export const setDeleteTransactionData = (deleteTransactionData: transaction) => {
    return {
        type: 'SET_DELETE_TRANSACTION_DATA',
        payload: {
            deleteTransactionData: deleteTransactionData
        }
    }
}

// Delete transaction form hidden action
export const setDeleteTransactionFormHidden = (status: boolean) => {
    return {
        type: 'SET_DELETE_TRANSACTION_FORM_HIDDEN',
        payload: {
            status:status
        }
    }
}


export const getAirports = () => async (dispatch: Dispatch<any>) => {
    try {
        // Axios auth config
        const authAxios = axios.create({
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem("token")}`
            }
        })
        const response = await authAxios.get<any>(`http://localhost:4000/api/v1/airports`)
        dispatch(
            {
                type: 'GET_AIRPORTS',
                payload: response.data.data as airports
            }
        )
    } catch (error: any) {
        console.log(error)
        dispatch(setToasts(error?.response?.data.msg, true, 'ERROR'))
    }
};

export const setAirports = (airports: airports) => async (dispatch: Dispatch<any>) => {
        dispatch(
            {
                type: 'SET_AIRPORTS',
                payload: airports
            }
        )
};

export const getAirportsReport = ()=> async (dispatch: Dispatch<any>) => {
    try {
        // Axios auth config
        const authAxios = axios.create({
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem("token")}`
            }
        })
        const response = await authAxios.get<any>(
            `http://localhost:4000/api/v1/airports/report`)
        dispatch(
            {
                type: 'GET_AIRPORTS_REPORT',
                payload: response.data 
            }
        )
    } catch (error: any) {
        console.log(error)
        dispatch(setToasts(error.response.data.msg, true, 'ERROR'))
    }
};

export const getAircrafts = () => async (dispatch: Dispatch<any>) => {
    try {
        // Axios auth config
        const authAxios = axios.create({
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem("token")}`
            }
        })
        const response = await authAxios.get<any>(`http://localhost:4000/api/v1/aircrafts`)
        dispatch(
            {
                type: 'GET_AIRCRAFTS',
                payload: response.data.data as aircrafts
            }
        )
    } catch (error: any) {
        console.log(error)
        dispatch(setToasts(error.response.data.msg, true, 'ERROR'))
    }
};


export const setAircrafts = (aircrafts: aircrafts) => async (dispatch: Dispatch<any>) => {
        dispatch(
            {
                type: 'SET_AIRCRAFTS',
                payload: aircrafts
            }
        )
};


// Home page line graph data
export const setHomeLineGraphData = (homeLineGraphData: Array<object>) => {
    return {
        type: 'SET_HOME_LINE_GRAPH_DATA',
        payload: {
            homeLineGraphData: homeLineGraphData
        }
    }
}



