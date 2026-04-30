// Redux store configuration
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './reducers/authReducer';
import projectReducer from './reducers/projectReducer';
import loanReducer from './reducers/loanReducer';
import notificationReducer from './reducers/notificationReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  projects: projectReducer,
  loans: loanReducer,
  notifications: notificationReducer
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;
