import { combineReducers } from 'redux';
import itemReducer from './itemReducer';
//if you had auth reducer you would put it here

export default combineReducers({
item: itemReducer
//and here
});