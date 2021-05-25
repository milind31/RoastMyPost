const loadingReducer = (state = false, action) => {
    switch(action.type){
        case 'LOADING':
            return true
        default:
            return state
    }
}

export default loadingReducer;