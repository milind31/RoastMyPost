const uidReducer = (state = "", action) => {
    switch(action.type){
        case 'SET_UID':
            return action.payload
        case 'USER_LOGGED_OUT':
            return ''
        default:
            return state
    }
}

export default uidReducer;