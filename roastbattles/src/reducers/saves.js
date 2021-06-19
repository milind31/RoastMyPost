const initialState = {
    saves: [],
    fetchedSaves: false
}

const savesReducer = (state = initialState, action) => {
    switch(action.type){
        case 'SET_SAVES':
            return {
                saves: action.payload,
                fetchedSaves: true
            }
        case 'SAVE_POST':
            state.saves.push(action.payload)
            return {
                saves: state.saves,
                fetchedSaves: state.fetchedSaves
            }
        case 'UNSAVE_POST':
            let index = state.saves.findIndex(element => element.postOwner === action.payload);
            state.saves.splice(index, 1);
            return {
                saves: state.saves,
                fetchedSaves: state.fetchedSaves
            }
        case 'USER_LOGGED_OUT':
            return {
                saves: [],
                fetchedSaves: false
            }
        default:
            return state
    }
}

export default savesReducer;