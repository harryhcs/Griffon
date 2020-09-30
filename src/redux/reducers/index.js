// Imports: Dependencies
import {combineReducers} from 'redux';
// Imports: Reducers
import mapReducer from './mapReducer';
import chatReducer from "./chatReducer";

// Redux: Root Reducer
const rootReducer = combineReducers({
  mapReducer: mapReducer,
  chatReducer: chatReducer,
});
// Exports
export default rootReducer;
