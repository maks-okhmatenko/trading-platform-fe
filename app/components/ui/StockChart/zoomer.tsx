import { candlesLoad } from 'containers/App/constants';
import { interpolateNumber } from 'd3-interpolate';
import { last } from 'react-stockcharts/lib/utils';

const zoom = (node, direction) => {
  const { xScale, plotData, xAccessor } = node.state;
  const { xAxisZoom } = node;
  const cx = xScale(xAccessor(last(plotData)));
  const zoomMultiplier = 1.25;

  const c = direction > 0 ? 1 * zoomMultiplier : 1 / zoomMultiplier;

  const [start, end] = xScale.domain();
  const [newStart, newEnd] =
    direction === 0
      ? [0, Math.ceil(candlesLoad) + 3]
      : xScale.range()
        .map(x => cx + (x - cx) * c)
        .map(xScale.invert);

  const left = interpolateNumber(start, newStart);
  const right = interpolateNumber(end, newEnd);

  const steps = [1].map(i => {
    return [left(i), right(i)];
  });
  node.interval = setInterval(() => {
    xAxisZoom(steps.shift());
    if (steps.length === 0) {
      clearInterval(node.interval);
      delete node.interval;
    }
  }, 10);
};

const chartZoomControllerBuilder = chartNode => {
  if (chartNode && chartNode.state) {
    const node = chartNode.state.node;
    return {
      in: () => {
        if (!node.interval) {
          zoom(node, -1);
        }
      },
      out: () => {
        if (!node.interval) {
          zoom(node, 1);
        }
      },
      reset: () => {
        if (!node.interval) {
          zoom(node, 0);
        }
      },
    };
  }
  return {};
};

export default chartZoomControllerBuilder;
