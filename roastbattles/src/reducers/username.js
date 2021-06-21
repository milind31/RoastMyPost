const usernameReducer = (state = "", action) => {
    switch(action.type){
        case 'SET_USERNAME':
            return action.payload
        case 'USER_LOGGED_OUT':
            return ''
        default:
            return state
    }
}

export default usernameReducer;