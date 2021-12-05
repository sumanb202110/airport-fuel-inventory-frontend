import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { applyMiddleware, compose, createStore} from 'redux'
import allReducers from './reducers'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk';
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync';
import { tokenCheck } from './tokenCheck';

const config = {
    // TOGGLE_TODO will not be triggered in other tabs
    blacklist: ['TOGGLE_TODO'],
};

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares = [thunk, createStateSyncMiddleware(config), tokenCheck()];
const store = createStore(allReducers, composeEnhancers(applyMiddleware(...middlewares)))

initMessageListener(store);
// const store = createStore(
//   allReducers,
//   {},
//   (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
//   (window as any).__REDUX_DEVTOOLS_EXTENSION__()
// );

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
