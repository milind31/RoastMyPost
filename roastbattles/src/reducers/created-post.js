const createdPostReducer = (state = false, action) => {
    switch(action.type){
        case 'USER_CREATED_POST':
            return true
        case 'USER_LOGGED_OUT':
            return false
        default:
            return state
    }
}

export default createdPostReducer;