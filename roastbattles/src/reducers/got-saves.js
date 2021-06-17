const gotSavesReducer = (state = false, action) => {
    switch(action.type){
        case 'GOT_SAVES':
            return true
        default:
            return state
    }
}

export default gotSavesReducer;