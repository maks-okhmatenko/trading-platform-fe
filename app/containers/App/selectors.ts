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

const makeSelectChartData = () =>
  createSelector(selectGlobal, globalState => globalState.chartTimeFrame);

const makeSelectAdditionalChartDataLength = () =>
  createSelector(selectGlobal, globalState => globalState.additionalChartDataLength);

const makeSelectActiveSymbolChart = () =>
  createSelector(selectGlobal, globalState => globalState.activeSymbolChart);

const makeSelectActiveTimeFrame = () =>
  createSelector(selectGlobal, globalState => globalState.activeTimeFrame);


export {
  selectGlobal,
  makeSelectLoading,
  makeSelectTickers,
  makeSelectError,
  makeSelectLocation,
  makeSelectChartLoading,
  makeSelectChartData,
  makeSelectAdditionalChartDataLength,
  makeSelectActiveSymbolChart,
  makeSelectActiveTimeFrame,
};
