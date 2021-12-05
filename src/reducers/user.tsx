const userReducer = (state = {email: window.localStorage.getItem("user_email")}, action: any) => {
    switch (action.type) {
        case 'USER_SET_DETAILS':
            window.localStorage.setItem("user_email", action.payload.user.email);
            return {...state, email: action.payload.user.email};
        default:
            return {...state};
    }
};

export default userReducer