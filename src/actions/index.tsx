import axios from "axios"
import { Dispatch } from "react"
import { aircrafts } from "../components/aircraft/Aircraft"
import { airports } from "../components/airport/Airport"
import { transaction, transactions } from "../components/transaction/transaction"

export type action = {
    type: 'USER_LOGIN' | 'USER_LOGOUT' | 'HOME_SET_TAB' | 'TOASTS_MSG' | 'GET_TRANSACTIONS' | 'GET_AIRPORTS' | 'GET_AIRCRAFTS' | 'SET_SELECTED_TRANSACTION',
    payload: {
        tabName: string,
        msg: string,
        display: boolean,
        selectedTransaction: transaction,
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

export const getTransactions = () => async (dispatch: Dispatch<any>) => {
    try {
        const response = await axios.get<transactions>(`http://localhost:4000/api/v1/transactions`, { withCredentials: true })
        dispatch(
            {
                type: 'GET_TRANSACTIONS',
                payload: response.data
            }
        )
    } catch (error: any) {
        console.log(error)
        dispatch(setToasts(error.response.data.msg, true, 'ERROR'))
    }
};


// Selected transaction action
export const setSelectedTransaction = (selectedTransaction: transaction) => {
    return {
        type: 'SET_SELECTED_TRANSACTION',
        payload: {
            selectedTransaction: selectedTransaction
        }
    }
}


export const getAirports = () => async (dispatch: Dispatch<any>) => {
    try {
        const response = await axios.get<airports>(`http://localhost:4000/api/v1/airports`, { withCredentials: true })
        dispatch(
            {
                type: 'GET_AIRPORTS',
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
        const response = await axios.get<aircrafts>(`http://localhost:4000/api/v1/aircrafts`, { withCredentials: true })
        dispatch(
            {
                type: 'GET_AIRCRAFTS',
                payload: response.data
            }
        )
    } catch (error: any) {
        console.log(error)
        dispatch(setToasts(error.response.data.msg, true, 'ERROR'))
    }
};
