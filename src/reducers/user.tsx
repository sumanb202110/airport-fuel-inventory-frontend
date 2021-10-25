const userReducer = (state = {}, action: any) => {
    switch (action.type) {
        case 'USER_SET_DETAILS':
            return state;
        default:
            return state;
    }
};

export default userReducer