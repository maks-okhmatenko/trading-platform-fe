import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';

import { applyMiddleware, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { composeWithDevTools } from 'redux-devtools-extension';
import { InjectedStore, ApplicationRootState } from 'types';
import { History } from 'history';

import createReducer from './rootReducer';
import { wsSagas } from './rootSaga';

export default function configureStore(initialState: ApplicationRootState | {} = {}, history: History) {
  const reduxSagaMonitorOptions = {};
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const websocketMiddleware = createSagaMiddleware();
  const logger = createLogger({
    // @ts-ignore
    collapsed: (getState, action, logEntry) => !logEntry.error,
  });

  const middlewares = [
    routerMiddleware(history),
    logger, // TODO: need remove logger for prod env
    websocketMiddleware,
    sagaMiddleware,
  ];

  let enhancer = applyMiddleware(...middlewares);

  // If Redux Dev Tools and Saga Dev Tools Extensions are installed, enable them
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'production' && typeof window === 'object') {
    enhancer = composeWithDevTools(enhancer);
  }

  // NOTE: Uncomment the code below to restore support for Redux Saga
  // Dev Tools once it supports redux-saga version 1.x.x
  // if (window.__SAGA_MONITOR_EXTENSION__)
  //   reduxSagaMonitorOptions = {
  //     sagaMonitor: window.__SAGA_MONITOR_EXTENSION__,
  //   };


  // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state

  const store = createStore(
    createReducer(),
    initialState,
    enhancer,
  ) as InjectedStore;

  websocketMiddleware.run(wsSagas);

  // Extensions
  store.runSaga = sagaMiddleware.run;
  store.injectedReducers = {}; // Reducer registry
  store.injectedSagas = {}; // Saga registry

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      store.replaceReducer(createReducer(store.injectedReducers));
    });
  }

  return store;
}

