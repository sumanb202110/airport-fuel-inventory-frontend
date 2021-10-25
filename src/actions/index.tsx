export type action = {
    type: 'USER_LOGIN' | 'USER_LOGOUT' | 'HOME_SET_TAB',
    payload: {
        tabName: string
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