export type action = {
    type: 'USER_LOGIN' | 'USER_LOGOUT' | 'HOME_SET_TAB' | 'TOASTS_MSG',
    payload: {
        tabName: string ,
        msg: string,
        display: boolean,
        type: 'SUCCESS' | 'ERROR'

    }
}

export const login = () => {
    return {
        type: 'USER_LOGIN'
    }
}

export const logout = () => {
    return {
        type: 'USER_LOGOUT'
    }
}

export const setHomeTab = (tabName: string) => {
    return {
        type: 'HOME_SET_TAB',
        payload: {
            tabName: tabName
        }
    }
}
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