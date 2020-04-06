import React from 'react';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { ChartCanvas, Chart } from 'react-stockcharts';
import { CandlestickSeries } from 'react-stockcharts/lib/series';
import { XAxis, YAxis } from 'react-stockcharts/lib/axes';
import { HoverTooltip } from 'react-stockcharts/lib/tooltip';
import { discontinuousTimeScaleProviderBuilder } from 'react-stockcharts/lib/scale';
import chartWrapper from './ChartControlWrapper';
import { first } from 'react-stockcharts/lib/utils';
import {
  EdgeIndicator,
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
} from 'react-stockcharts/lib/coordinates';
import styles from './Chart.scss';
import { candlesShow } from 'containers/App/constants';

const colors = {
  red: '#DF2323',
  green: '#29C359',
  text: 'white',
  chartStroke: 'white',
};
const dateFormat = timeFormat('%Y/%m/%d %H:%M:%S');
const numberFormat = format('.4f');

function tooltipContent() {
  return ({ currentItem, xAccessor }) => {
    return {
      x: dateFormat(xAccessor(currentItem)),
      y: [
        {
          label: 'open',
          value: currentItem.open && numberFormat(currentItem.open),
        },
        {
          label: 'high',
          value: currentItem.high && numberFormat(currentItem.high),
        },
        {
          label: 'low',
          value: currentItem.low && numberFormat(currentItem.low),
        },
        {
          label: 'close',
          value: currentItem.close && numberFormat(currentItem.close),
        },
      ].filter(line => line.value),
    };
  };
}

class CandleStickStockScaleChart extends React.Component<any, any> {
  public render() {
    const {
      type,
      width,
      height,
      initialData,
      loadMoreHandler,
      leftShift = 0,
    } = this.props;

    const xScaleProvider = discontinuousTimeScaleProviderBuilder().initialIndex(
      Math.ceil(leftShift),
    );

    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
      initialData,
    );

    const end = xAccessor(first(data));
    const start = end + candlesShow;

    const xExtents = [start, end];
    // const xExtents = [leftShift, leftShift + candlesShow];

    const margin = { left: 10, right: 70, top: 0, bottom: 50 };
    const gridHeight = height - margin.top - margin.bottom;
    const gridWidth = width - margin.left - margin.right;

    const showGrid = true;
    const yGrid = showGrid ? { innerTickSize: -1 * gridWidth } : {};
    const xGrid = showGrid ? { innerTickSize: -1 * gridHeight } : {};

    return (
      <ChartCanvas
        width={width}
        height={height}
        ratio={1}
        margin={margin}
        type={type}
        seriesName="MSFT"
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
        xExtents={xExtents}
        onLoadMore={loadMoreHandler}
      >
        <Chart id={1} yExtents={d => [d.high, d.low]}>
          <XAxis
            axisAt="bottom"
            orient="bottom"
            ticks={5}
            tickStroke="#FFF7"
            stroke="#FFF7"
            {...xGrid}
          />
          <YAxis
            axisAt="right"
            orient="right"
            ticks={7}
            fill={colors.text}
            tickStroke="#FFF7"
            stroke="#FFF7"
            tickFormat={numberFormat}
            {...yGrid}
          />

          <EdgeIndicator
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={d => d.close}
            fill={d => (d.close > d.open ? colors.green : colors.red)}
            lineStroke={d => (d.close > d.open ? colors.green : colors.red)}
            textFill="black"
            displayFormat={numberFormat}
          />

          <MouseCoordinateX
            at="bottom"
            orient="bottom"
            displayFormat={dateFormat}
          />
          <MouseCoordinateY
            at="left"
            orient="left"
            displayFormat={numberFormat}
          />
          <CrossHairCursor stroke={colors.chartStroke} />

          <CandlestickSeries
            displayFormat={format('.4f')}
            stroke={d => (d.close > d.open ? colors.green : colors.red)}
            wickStroke={d => (d.close > d.open ? colors.green : colors.red)}
            fill={d => (d.close > d.open ? colors.green : colors.red)}
            opacity={1}
          />

          <HoverTooltip
            classNames={styles.tooltip}
            yAccessor={d => d.date}
            tooltipContent={tooltipContent()}
            fontSize={15}
          />
        </Chart>
      </ChartCanvas>
    );
  }
}

export default chartWrapper(CandleStickStockScaleChart);
