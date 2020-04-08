const chartDataTransformer = (item) => ({
  date: new Date(parseInt(item.x, 10) * 1000),
  open: parseFloat(item.y[0]),
  high: parseFloat(item.y[1]),
  low: parseFloat(item.y[2]),
  close: parseFloat(item.y[3]),
  volume: 0,
  split: '',
  dividend: '',
  absoluteChange: '',
  percentChange: '',
});

export const transformChartData = (chartData) => {
  if (Array.isArray(chartData)) {
    return chartData.map(chartDataTransformer);
  } else {
    return chartDataTransformer(chartData);
  }
};

export default transformChartData;
