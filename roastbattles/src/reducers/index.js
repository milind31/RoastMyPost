import createdPostReducer from './created-post';
import loadingReducer from './loading';
import {combineReducers} from 'redux';

const combinedReducers = combineReducers({
    createdPost: createdPostReducer,
    loading: loadingReducer
})

export default combinedReducers;