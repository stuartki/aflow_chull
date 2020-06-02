import { combineReducers } from 'redux';

import { periodicTable } from './periodicTableReducer';
import { hulls } from './hullsReducers';

export default combineReducers({
  periodicTable,
  hulls,
});
