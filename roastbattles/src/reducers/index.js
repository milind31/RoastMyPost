import createdPostReducer from './created-post';
import loadingReducer from './loading';
import savesReducer from './saves';
import {combineReducers} from 'redux';

const combinedReducers = combineReducers({
    createdPost: createdPostReducer,
    loading: loadingReducer,
    saves: savesReducer,
})

export default combinedReducers;