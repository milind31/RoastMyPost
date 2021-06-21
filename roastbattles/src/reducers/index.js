import createdPostReducer from './created-post';
import loadingReducer from './loading';
import savesReducer from './saves';
import uidReducer from './uid';
import usernameReducer from './username';
import {combineReducers} from 'redux';

const combinedReducers = combineReducers({
    createdPost: createdPostReducer,
    loading: loadingReducer,
    saves: savesReducer,
    uid: uidReducer,
    username: usernameReducer,
})

export default combinedReducers;