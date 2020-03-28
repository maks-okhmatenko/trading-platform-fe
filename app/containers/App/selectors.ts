import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';

const selectGlobal = (state: ApplicationRootState) => {
  return state.app;
};

const selectRoute = (state: ApplicationRootState) => {
  return state.router;
};

const makeSelectLoading = () =>
  createSelector(selectGlobal, globalState => globalState.loading);

const makeSelectTickers = () =>
  createSelector(selectGlobal, globalState => globalState.tickers);

const makeSelectError = () =>
  createSelector(selectGlobal, globalState => globalState.error);

const makeSelectLocation = () =>
  createSelector(selectRoute, routeState => routeState.location);

const makeSelectChartLoading = () =>
  createSelector(selectGlobal, globalState => globalState.chartLoading);

const makeSelectTickersIo = () =>
  createSelector(selectGlobal, globalState => globalState.tickersIo);

const makeSelectChartTimeFrame = () =>
  createSelector(selectGlobal, globalState => globalState.chartTimeFrame);

const makeSelectActiveSymbolChart = () =>
  createSelector(selectGlobal, globalState => globalState.activeSymbolChart);


export {
  selectGlobal,
  makeSelectLoading,
  makeSelectTickers,
  makeSelectError,
  makeSelectLocation,
  makeSelectChartLoading,
  makeSelectTickersIo,
  makeSelectChartTimeFrame,
  makeSelectActiveSymbolChart,
};
