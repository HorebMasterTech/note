import { combineReducers } from 'redux';

import auth from './authReducer';
import alert from './alertReducer';
import note from './noteReducer';

export default combineReducers({
    auth,
    alert,
    note
  })