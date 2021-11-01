export type action = {
    type: 'USER_LOGIN' | 'USER_LOGOUT' | 'HOME_SET_TAB' | 'TOASTS_MSG',
    payload: {
        tabName: string ,
        msg: string,
        display: boolean,
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