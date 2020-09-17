// Imports: Dependencies
import {combineReducers} from 'redux';
// Imports: Reducers
import mapReducer from './mapReducer';

// Redux: Root Reducer
const rootReducer = combineReducers({
  mapReducer: mapReducer,
});
// Exports
export default rootReducer;
