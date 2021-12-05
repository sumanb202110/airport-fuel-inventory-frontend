const logReducer = (state = window.localStorage.getItem("isLogin") as string === 'true'? true : false || false, action: any) => {
    switch (action.type) {
        case 'USER_LOGIN':
            return state = true;
        case 'USER_LOGOUT':
            return state = false;
        default:
            return state;
    }
};

export default logReducer